import { describe, expect, it } from "vitest";
import { ACCOUNT_HEADER } from "@/lib/tka/account";
import { claimedEmailFrom, requireAccountEmail } from "./session";

function req(email: string) {
  return new Request("http://localhost/api/tka/me", {
    headers: { [ACCOUNT_HEADER]: email },
  });
}

describe("tka account email", () => {
  it("uses the school email from the gate as the account", async () => {
    expect(claimedEmailFrom(req(" Justin.Rizki@Pilar.sch.id "))).toBe(
      "justin.rizki@pilar.sch.id",
    );
    expect(await requireAccountEmail(req("justin.rizki@pilar.sch.id"))).toBe(
      "justin.rizki@pilar.sch.id",
    );
  });

  it("rejects anything that is not @pilar.sch.id", async () => {
    expect(await requireAccountEmail(req("ada@gmail.com"))).toBeNull();
    expect(await requireAccountEmail(req(""))).toBeNull();
  });
});
