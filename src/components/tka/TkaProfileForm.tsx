"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PILIHAN_SUBJECTS } from "@/data/tka/catalog";
import { SPI_CLASSES, classesForTrack, matchSpiClass } from "@/data/spi-classes";
import { tkaFetchInit } from "@/lib/tka/client";
import { writeCachedMe } from "@/lib/tka/profileCache";
import { fileToAvatarDataUrl, normalizeAvatarDataUrl } from "@/lib/tka/avatar";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { suggestTrack, type TkaTrack } from "@/lib/tka/grade";
import { useTkaMe } from "@/components/tka/TkaGate";
import { ProfileAvatarMark } from "@/components/tka/ProfileAvatarMark";

type Mode = "setup" | "edit";

export function TkaProfileForm({ mode }: { mode: Mode }) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const photoInput = useRef<HTMLInputElement>(null);
  const { me, reload } = useTkaMe();
  const existing = me.profile;
  const [displayName, setDisplayName] = useState(existing?.displayName ?? "");
  const [age, setAge] = useState(existing?.age ? String(existing.age) : "17");
  const [track, setTrack] = useState<TkaTrack>(existing?.tkaTrack ?? "12");
  const [kelas, setKelas] = useState(() => {
    const id = existing?.kelas ?? "";
    return SPI_CLASSES.some((c) => c.id === id) ? id : "";
  });
  const [pilihan, setPilihan] = useState<string[]>(existing?.pilihanIds ?? []);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(
    existing?.avatarDataUrl ?? null,
  );
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const suggested = useMemo(() => suggestTrack(Number(age) || 17), [age]);
  const classOptions = useMemo(
    () => (mode === "edit" ? SPI_CLASSES : classesForTrack(track)),
    [mode, track],
  );

  function onTrackChange(next: TkaTrack) {
    setTrack(next);
    if (!classesForTrack(next).some((c) => c.id === kelas)) {
      setKelas("");
    }
    if (next !== "12") setPilihan([]);
  }

  function onKelasChange(id: string) {
    setKelas(id);
    const spi = matchSpiClass(id);
    if (!spi) return;
    setTrack(spi.tkaTrack);
    if (spi.tkaTrack !== "12") setPilihan([]);
  }

  function toggle(id: string) {
    setPilihan((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 2) return [cur[1], id];
      return [...cur, id];
    });
  }

  async function onPhotoFile(file: File | undefined) {
    if (!file) return;
    setError(false);
    try {
      const data = await fileToAvatarDataUrl(file);
      const ok = normalizeAvatarDataUrl(data);
      if (!ok) {
        setError(true);
        return;
      }
      setAvatarDataUrl(ok);
    } catch {
      setError(true);
    }
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
          avatarDataUrl,
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
    router.replace(mode === "edit" ? "/" : "/tka");
    await reload();
  }

  const photoFields = (
    <div className="profile-photo">
      <div className="profile-photo-preview">
        <ProfileAvatarMark src={avatarDataUrl} label={displayName || me.email} />
      </div>
      <div className="profile-photo-actions">
        <p className="field-label" id="tka-photo-label">
          {t("tka.profile.photo")}
        </p>
        <p className="tka-hint-line">{t("tka.profile.photoHint")}</p>
        <div className="profile-photo-buttons">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => photoInput.current?.click()}
          >
            {t("tka.profile.photoChange")}
          </button>
          {avatarDataUrl ? (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setAvatarDataUrl(null)}
            >
              {t("tka.profile.photoRemove")}
            </button>
          ) : null}
        </div>
        <input
          id="tka-photo"
          ref={photoInput}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-labelledby="tka-photo-label"
          onChange={(e) => {
            void onPhotoFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );

  const nameField = (
    <>
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
    </>
  );

  const kelasField = (
    <>
      <label className="field-label" htmlFor="tka-kelas">
        {t("tka.onboard.kelas")}
      </label>
      <select
        id="tka-kelas"
        className="field-input"
        value={kelas}
        onChange={(e) => onKelasChange(e.target.value)}
        required
      >
        <option value="">{t("tka.onboard.kelasPick")}</option>
        {classOptions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
    </>
  );

  const pilihanField =
    track === "12" ? (
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
    ) : null;

  const ageTrackFields = (
    <>
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
          if (mode === "setup") {
            onTrackChange(suggestTrack(Number(e.target.value) || 17));
          }
        }}
      />
      {mode === "setup" ? (
        <p className="tka-hint-line">{t("tka.onboard.suggested", { n: suggested })}</p>
      ) : null}

      {mode === "setup" ? (
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
      ) : null}
    </>
  );

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
      <h1>{t(mode === "edit" ? "tka.profile.title" : "tka.onboard.title")}</h1>
      {mode === "edit" ? <p className="lede">{t("tka.profile.lede")}</p> : null}
      <form className="tka-form tka-onboard" onSubmit={save}>
        {photoFields}
        {mode === "edit" ? (
          <>
            {nameField}
            {kelasField}
            {pilihanField}
            {ageTrackFields}
          </>
        ) : (
          <>
            {ageTrackFields}
            {nameField}
            {kelasField}
            {pilihanField}
          </>
        )}

        {error ? <p className="field-error">{t("tka.onboard.error")}</p> : null}
        <button className="btn-primary" type="submit" disabled={busy}>
          {t(mode === "edit" ? "tka.profile.save" : "tka.onboard.save")}
        </button>
      </form>
    </div>
  );
}
