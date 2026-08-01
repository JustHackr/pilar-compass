import type { CalculatorInput } from "@/types";
import type { Locale } from "@/lib/i18n/dictionaries";
import { translate } from "@/lib/i18n/dictionaries";

export function buildRoadmap(
  input: CalculatorInput,
  averageScore: number,
  matchPercent: number,
  locale: Locale = "en",
): string[] {
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
  const steps: string[] = [];

  if (averageScore < 80) {
    const weak = [...input.subjects]
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map((s) => s.name || "core subjects");
    steps.push(t("road.low", { subjects: weak.join(locale === "id" ? " dan " : " and ") }));
  } else if (averageScore < 90) {
    steps.push(t("road.mid"));
  } else {
    steps.push(t("road.high"));
  }

  const missingTests =
    input.region === "abroad" && !(input.toefl || input.sat || input.ielts);
  if (missingTests) {
    steps.push(t("road.missingTests"));
  } else if (input.ielts != null && input.ielts > 0 && input.ielts < 6.5) {
    steps.push(t("road.ielts"));
  } else if (input.toefl != null && input.toefl > 0 && input.toefl < 90) {
    steps.push(t("road.toefl"));
  } else if (input.sat != null && input.sat > 0 && input.sat < 1300) {
    steps.push(t("road.sat"));
  }

  if (
    input.affordability === "need_scholarship" ||
    input.affordability === "low_budget"
  ) {
    steps.push(
      t(input.region === "abroad" ? "road.scholarship.abroad" : "road.scholarship.id"),
    );
  }

  if (input.age <= 15) {
    steps.push(t("road.young"));
  } else if (input.age >= 17) {
    steps.push(t("road.old", { university: input.university }));
  } else {
    steps.push(t("road.midAge"));
  }

  if (input.intendedMajor?.trim()) {
    steps.push(
      t("road.major", {
        major: input.intendedMajor.trim(),
        university: input.university,
      }),
    );
  } else {
    steps.push(t("road.noMajor"));
  }

  if (matchPercent < 55) {
    steps.push(t("road.parallel"));
  }

  return steps.slice(0, 6);
}
