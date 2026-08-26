import type { TkaTrack } from "@/lib/tka/grade";

export type SpiClass = {
  id: string;
  grade: number;
  city: string;
  label: string;
  tkaTrack: TkaTrack;
};

export const SPI_CLASSES: SpiClass[] = [
  { id: "4-BOSTON", grade: 4, city: "Boston", label: "Grade 4 Boston", tkaTrack: "6" },
  { id: "4-SYDNEY", grade: 4, city: "Sydney", label: "Grade 4 Sydney", tkaTrack: "6" },
  { id: "5-BERLIN", grade: 5, city: "Berlin", label: "Grade 5 Berlin", tkaTrack: "6" },
  { id: "5-BRUSSELS", grade: 5, city: "Brussels", label: "Grade 5 Brussels", tkaTrack: "6" },
  { id: "6-LEIDEN", grade: 6, city: "Leiden", label: "Grade 6 Leiden", tkaTrack: "6" },
  { id: "7-ISTANBUL", grade: 7, city: "Istanbul", label: "Grade 7 Istanbul", tkaTrack: "9" },
  { id: "8-HELSINKI", grade: 8, city: "Helsinki", label: "Grade 8 Helsinki", tkaTrack: "9" },
  { id: "9-MANCHESTER", grade: 9, city: "Manchester", label: "Grade 9 Manchester", tkaTrack: "9" },
  { id: "10-ARIZONA", grade: 10, city: "Arizona", label: "Grade 10 Arizona", tkaTrack: "12" },
  { id: "10-ADELAIDE", grade: 10, city: "Adelaide", label: "Grade 10 Adelaide", tkaTrack: "12" },
  { id: "11-ORLANDO", grade: 11, city: "Orlando", label: "Grade 11 Orlando", tkaTrack: "12" },
  { id: "11-OXFORD", grade: 11, city: "Oxford", label: "Grade 11 Oxford", tkaTrack: "12" },
  { id: "12-RIO-DE-JANEIRO", grade: 12, city: "Rio De Janeiro", label: "Grade 12 Rio De Janeiro", tkaTrack: "12" },
  { id: "12-ROTTERDAM", grade: 12, city: "Rotterdam", label: "Grade 12 Rotterdam", tkaTrack: "12" },
];

export const ADMIN_EMAIL = "admin@pilar.sch.id";

export function isAdminEmail(email: string | null | undefined): boolean {
  return (email ?? "").toLowerCase().trim() === ADMIN_EMAIL;
}

export function classesForTrack(track: TkaTrack): SpiClass[] {
  return SPI_CLASSES.filter((c) => c.tkaTrack === track);
}

export function matchSpiClass(kelas: string): SpiClass | undefined {
  const key = kelas.trim().toUpperCase().replace(/\s+/g, "-");
  return (
    SPI_CLASSES.find((c) => c.id === key) ??
    SPI_CLASSES.find((c) => key.includes(c.city.toUpperCase().replace(/\s+/g, "-")))
  );
}
