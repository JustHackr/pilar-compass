import { describe, expect, it } from "vitest";
import {
  enqueueRedemption,
  nextOutcomeAfterCheck,
  pickLessonItems,
} from "./lessonEngine";
import type { TkaQuestion } from "./scoring";

function q(id: string, skillId: string): TkaQuestion {
  return {
    id,
    skillId,
    type: "pg",
    stem: id,
    choices: ["A", "B", "C", "D", "E"],
    key: 0,
    hint: "h",
    explanation: "e",
  };
}

describe("lessonEngine", () => {
  it("only uses questions from the target skill", () => {
    const bank = [
      q("a", "spl"),
      q("b", "spl"),
      q("c", "trig"),
      q("d", "trig"),
      q("e", "stat"),
      q("f", "stat"),
      q("g", "stat"),
    ];
    const picked = pickLessonItems("spl", bank, () => 0);
    expect(picked.map((x) => x.id).sort()).toEqual(["a", "b"]);
    expect(picked.every((x) => x.skillId === "spl")).toBe(true);
  });

  it("does not put redemption as the next card when other items remain", () => {
    const next = enqueueRedemption(["b", "c", "d"], "a");
    expect(next[0]).not.toBe("a");
    expect(next).toContain("a");
  });

  it("first miss enqueues without revealing", () => {
    expect(nextOutcomeAfterCheck(false, 0)).toEqual({
      enqueue: true,
      reveal: false,
    });
  });

  it("second miss reveals with no XP outcome besides revealed", () => {
    expect(nextOutcomeAfterCheck(false, 1)).toEqual({
      outcome: "revealed",
      enqueue: false,
      reveal: true,
    });
  });

  it("first-try correct vs redemption correct", () => {
    expect(nextOutcomeAfterCheck(true, 0).outcome).toBe("first_try");
    expect(nextOutcomeAfterCheck(true, 1).outcome).toBe("redemption");
  });
});
