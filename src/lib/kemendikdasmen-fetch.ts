import https from "node:https";
import type { IncomingMessage } from "node:http";
import type { TLSSocket } from "node:tls";

export const PUSPRESNAS_HOST = "pusatprestasinasional.kemendikdasmen.go.id";

type Name = string | string[] | undefined;

type PeerCert = {
  subject?: { CN?: Name };
  issuer?: { O?: Name; CN?: Name };
  subjectaltname?: string;
};

function flattenName(value: Name): string {
  return Array.isArray(value) ? value.join(" ") : value ?? "";
}

/**
 * Kemendikdasmen omits the DigiCert intermediate in TLS, so Node cannot
 * verify the chain. We still pin host + DigiCert + ministry names.
 */
export function assertPuspresnasPeer(hostname: string, cert: PeerCert): void {
  if (hostname !== PUSPRESNAS_HOST) {
    throw new Error(`Unexpected host ${hostname}`);
  }
  const names = `${flattenName(cert.subject?.CN)} ${cert.subjectaltname ?? ""}`.toLowerCase();
  if (!names.includes("kemendikdasmen.go.id")) {
    throw new Error("Unexpected certificate subject");
  }
  const issuer = `${flattenName(cert.issuer?.O)} ${flattenName(cert.issuer?.CN)}`;
  if (!/DigiCert/i.test(issuer)) {
    throw new Error("Unexpected certificate issuer");
  }
}

export function fetchPuspresnasHtml(url: string, userAgent: string): Promise<string> {
  const target = new URL(url);
  if (target.protocol !== "https:" || target.hostname !== PUSPRESNAS_HOST) {
    throw new Error(`Blocked fetch host ${target.hostname}`);
  }

  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        headers: { "User-Agent": userAgent, Accept: "text/html" },
        servername: target.hostname,
        rejectUnauthorized: false,
      },
      (res: IncomingMessage) => {
        try {
          const sock = res.socket as TLSSocket;
          assertPuspresnasPeer(target.hostname, sock.getPeerCertificate());
        } catch (err) {
          req.destroy();
          reject(err);
          return;
        }
        if (!res.statusCode || res.statusCode >= 400) {
          res.resume();
          reject(new Error(`Puspresnas ${res.statusCode ?? 0}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", reject);
      },
    );
    req.setTimeout(25000, () => {
      req.destroy(new Error("Puspresnas timed out"));
    });
    req.on("error", reject);
  });
}
