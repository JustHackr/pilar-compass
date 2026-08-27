export const AVATAR_MAX_CHARS = 80_000;
export const AVATAR_SIZE_PX = 256;

const AVATAR_RE = /^data:image\/(jpeg|webp);base64,[A-Za-z0-9+/]+=*$/;

/** Valid photo, `null` to clear, or `undefined` if the payload is unsafe. */
export function normalizeAvatarDataUrl(value: unknown): string | null | undefined {
  if (value == null) return null;
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (!raw) return null;
  if (raw.length > AVATAR_MAX_CHARS) return undefined;
  if (!AVATAR_RE.test(raw)) return undefined;
  return raw;
}

export function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const type = file.type.toLowerCase();
    if (!type.startsWith("image/") || type.includes("svg")) {
      reject(new Error("type"));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE_PX;
      canvas.height = AVATAR_SIZE_PX;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      const min = Math.min(img.naturalWidth, img.naturalHeight) || 1;
      const sx = (img.naturalWidth - min) / 2;
      const sy = (img.naturalHeight - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, AVATAR_SIZE_PX, AVATAR_SIZE_PX);
      for (const q of [0.82, 0.7, 0.55, 0.4]) {
        const data = canvas.toDataURL("image/jpeg", q);
        if (data.length <= AVATAR_MAX_CHARS) {
          resolve(data);
          return;
        }
      }
      reject(new Error("size"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load"));
    };
    img.src = url;
  });
}
