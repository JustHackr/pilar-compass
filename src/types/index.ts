export type CompetitionScope = "indonesia" | "international";
export type CompetitionField =
  | "stem"
  | "humanities"
  | "business"
  | "arts"
  | "language"
  | "multidisciplinary";
export type CompetitionLevel = "junior" | "senior" | "both";

export type CompetitionLinkKind =
  | "website"
  | "register"
  | "post"
  | "instagram"
  | "facebook"
  | "youtube"
  | "info";

export type CompetitionLink = {
  label: string;
  url: string;
  kind: CompetitionLinkKind;
};

export type Competition = {
  id: string;
  name: string;
  scope: CompetitionScope;
  field: CompetitionField;
  level: CompetitionLevel;
  registrationDeadline: string;
  eventStart?: string;
  description: string;
  /** @deprecated prefer links[] — kept as primary website fallback */
  url?: string;
  links?: CompetitionLink[];
  tags?: string[];
};

export type Affordability =
  | "can_afford"
  | "middle_class"
  | "need_scholarship"
  | "low_budget";

export type SubjectScore = { name: string; score: number };

export type CalculatorInput = {
  subjects: SubjectScore[];
  university: string;
  country: string;
  region: "indonesia" | "abroad";
  toefl?: number;
  sat?: number;
  ielts?: number;
  affordability: Affordability;
  age: number;
  intendedMajor?: string;
  competitionAwards?: number;
};

export type ScoreBreakdown = {
  academics: number;
  tests: number;
  financeFit: number;
  timeline: number;
  extras: number;
};

export type ScoreResult = {
  averageScore: number;
  matchPercent: number;
  breakdown: ScoreBreakdown;
  weights: Record<keyof ScoreBreakdown, number>;
  roadmap: string[];
};

export type UniversityOption = {
  name: string;
  country: string;
  region: "indonesia" | "abroad";
};
