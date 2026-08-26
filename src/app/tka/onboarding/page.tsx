"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PILIHAN_SUBJECTS } from "@/data/tka/catalog";
import { classesForTrack } from "@/data/spi-classes";
import { tkaFetchInit } from "@/lib/tka/client";
import { writeCachedMe } from "@/lib/tka/profileCache";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { suggestTrack, type TkaTrack } from "@/lib/tka/grade";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function TkaOnboardingPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { me, reload } = useTkaMe();
  const existing = me.profile;
  const [displayName, setDisplayName] = useState(existing?.displayName ?? "");
  const [age, setAge] = useState(existing?.age ? String(existing.age) : "17");
  const [track, setTrack] = useState<TkaTrack>(existing?.tkaTrack ?? "12");
  const [kelas, setKelas] = useState(() => {
    const id = existing?.kelas ?? "";
    const track0 = existing?.tkaTrack ?? "12";
    return classesForTrack(track0).some((c) => c.id === id) ? id : "";
  });
  const [pilihan, setPilihan] = useState<string[]>(existing?.pilihanIds ?? []);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const suggested = useMemo(() => suggestTrack(Number(age) || 17), [age]);
  const classOptions = useMemo(() => classesForTrack(track), [track]);

  function onTrackChange(next: TkaTrack) {
    setTrack(next);
    if (!classesForTrack(next).some((c) => c.id === kelas)) {
      setKelas("");
    }
  }

  function toggle(id: string) {
    setPilihan((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 2) return [cur[1], id];
      return [...cur, id];
    });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch(
      "/api/tka/onboarding",
      tkaFetchInit({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          age: Number(age),
          tkaTrack: track,
          kelas,
          pilihanIds: track === "12" ? pilihan : [],
        }),
      }),
    );
    setBusy(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    const payload = (await res.json()) as { profile?: typeof existing };
    if (payload.profile) {
      writeCachedMe({ ...me, profile: payload.profile });
    }
    router.replace("/tka");
    await reload();
  }

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
      <h1>{t("tka.onboard.title")}</h1>
      <form className="tka-form tka-onboard" onSubmit={save}>
        <label className="field-label" htmlFor="tka-age">
          {t("tka.onboard.age")}
        </label>
        <input
          id="tka-age"
          className="field-input"
          type="number"
          min={8}
          max={22}
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            onTrackChange(suggestTrack(Number(e.target.value) || 17));
          }}
        />
        <p className="tka-hint-line">
          {t("tka.onboard.suggested", { n: suggested })}
        </p>

        <fieldset className="tka-fieldset">
          <legend className="field-label">{t("tka.onboard.track")}</legend>
          {(["6", "9", "12"] as const).map((g) => (
            <label key={g} className="tka-check">
              <input
                type="radio"
                name="track"
                checked={track === g}
                onChange={() => onTrackChange(g)}
              />
              {t("tka.grade", { n: g })}
            </label>
          ))}
        </fieldset>

        <label className="field-label" htmlFor="tka-name">
          {t("tka.onboard.name")}
        </label>
        <input
          id="tka-name"
          className="field-input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <label className="field-label" htmlFor="tka-kelas">
          {t("tka.onboard.kelas")}
        </label>
        <select
          id="tka-kelas"
          className="field-input"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          required
        >
          <option value="">{t("tka.onboard.kelasPick")}</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {track === "12" ? (
          <fieldset className="tka-fieldset">
            <legend className="field-label">{t("tka.onboard.pilihan")}</legend>
            <div className="tka-pilihan-grid">
              {PILIHAN_SUBJECTS.map((s) => (
                <label key={s.id} className="tka-check">
                  <input
                    type="checkbox"
                    checked={pilihan.includes(s.id)}
                    onChange={() => toggle(s.id)}
                  />
                  {locale === "id" ? s.labelId : s.labelEn}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {error ? <p className="field-error">{t("tka.onboard.error")}</p> : null}
        <button className="btn-primary" type="submit" disabled={busy}>
          {t("tka.onboard.save")}
        </button>
      </form>
    </div>
  );
}
