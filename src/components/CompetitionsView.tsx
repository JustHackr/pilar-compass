"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Competition, CompetitionField, CompetitionScope } from "@/types";
import {
  daysUntilDeadline,
  filterAndSortCompetitions,
  isRegistrationOpen,
} from "@/lib/competitions";
import { getCompetitionLinks } from "@/lib/links";
import type { CompetitionLinkKind } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleContext";

const FIELD_KEYS = [
  "all",
  "stem",
  "humanities",
  "business",
  "arts",
  "language",
  "multidisciplinary",
] as const;

const SCOPE_KEYS = ["all", "indonesia", "international"] as const;

function linkIcon(kind: CompetitionLinkKind): string {
  switch (kind) {
    case "instagram":
      return "IG";
    case "facebook":
      return "FB";
    case "youtube":
      return "YT";
    case "register":
      return "→";
    case "post":
      return "★";
    case "info":
      return "i";
    default:
      return "↗";
  }
}

export function CompetitionsView() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [field, setField] = useState<CompetitionField | "all">("all");
  const [scope, setScope] = useState<CompetitionScope | "all">("all");
  const [openOnly, setOpenOnly] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/competitions", { cache: "no-store" });
      if (!res.ok) throw new Error("competitions");
      const data = (await res.json()) as {
        competitions?: Competition[];
        live?: boolean;
      };
      setCompetitions(data.competitions ?? []);
      setStale(data.live === false);
      setNow(new Date());
    } catch {
      setStale(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCount = useMemo(
    () => competitions.filter((c) => isRegistrationOpen(c, now)).length,
    [competitions, now],
  );

  const list = useMemo(
    () =>
      filterAndSortCompetitions(
        competitions,
        { query, field, scope, openOnly },
        now,
      ),
    [competitions, query, field, scope, openOnly, now],
  );

  const urgentCount = useMemo(
    () =>
      list.filter((c) => {
        const open = isRegistrationOpen(c, now);
        const days = daysUntilDeadline(c, now);
        return open && days <= 7;
      }).length,
    [list, now],
  );

  function clearFilters() {
    setQuery("");
    setField("all");
    setScope("all");
    setOpenOnly(true);
  }

  function deadlineLabel(days: number, open: boolean): string {
    if (!open) return t("comps.closed");
    if (days === 0) return t("comps.closesToday");
    if (days === 1) return t("comps.oneDay");
    if (days <= 7) return t("comps.daysLeft", { days });
    return t("comps.daysShort", { days });
  }

  function levelLabel(level: Competition["level"]): string {
    if (level === "both") return t("comps.level.both");
    if (level === "junior") return t("comps.level.junior");
    return t("comps.level.senior");
  }

  function descriptionFor(c: Competition): string {
    const key = `comp.${c.id}`;
    const translated = t(key);
    return translated === key ? c.description : translated;
  }

  return (
    <div className="page-wrap">
      <header className="page-hero">
        <div className="page-hero-row">
          <div>
            <p className="eyebrow">{t("comps.eyebrow")}</p>
            <h1>{t("comps.title")}</h1>
            <p className="lede">{t("comps.lede")}</p>
            <p className="result-count">{t("comps.source")}</p>
            {stale ? <p className="tka-hint-line">{t("comps.loadError")}</p> : null}
          </div>
          <div className="stat-pills" aria-live="polite">
            <span className="stat-pill">
              <strong>{openCount}</strong> {t("comps.openNow")}
            </span>
            <span className="stat-pill">
              <strong>{urgentCount}</strong> {t("comps.due7")}
            </span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="field-input"
          placeholder={t("comps.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t("comps.search")}
        />
        <select
          className="field-input"
          value={field}
          onChange={(e) => setField(e.target.value as CompetitionField | "all")}
          aria-label={t("comps.field")}
        >
          {FIELD_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`field.${k}`)}
            </option>
          ))}
        </select>
        <select
          className="field-input"
          value={scope}
          onChange={(e) => setScope(e.target.value as CompetitionScope | "all")}
          aria-label={t("comps.scope")}
        >
          {SCOPE_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`scope.${k}`)}
            </option>
          ))}
        </select>
        <label className="check-row">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
          />
          {t("comps.openOnly")}
        </label>
        <button type="button" className="btn-secondary" onClick={() => void load()}>
          {t("comps.refresh")}
        </button>
      </div>

      <p className="result-count">
        {loading
          ? t("comps.loading")
          : t("comps.showing", {
              count: list.length,
              when: now.toLocaleString(),
            })}
      </p>

      {loading ? null : list.length === 0 ? (
        <div className="empty-state">
          <h2>{t("comps.empty.title")}</h2>
          <p>{t("comps.empty.body")}</p>
          <button type="button" className="btn-secondary" onClick={clearFilters}>
            {t("comps.reset")}
          </button>
        </div>
      ) : (
        <ul className="comp-list">
          {list.map((c, i) => {
            const open = isRegistrationOpen(c, now);
            const days = daysUntilDeadline(c, now);
            const urgent = open && days <= 7;
            return (
              <li
                key={c.id}
                className="comp-item animate-rise"
                style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
              >
                <div className="comp-top">
                  <h2>{c.name}</h2>
                  <span
                    className={
                      !open ? "pill closed" : urgent ? "pill urgent" : "pill open"
                    }
                  >
                    {deadlineLabel(days, open)}
                  </span>
                </div>
                <div className="comp-meta">
                  <span>{t(`scope.${c.scope}`)}</span>
                  <span>{t(`field.${c.field}`)}</span>
                  <span>{levelLabel(c.level)}</span>
                  <span>{t("comps.deadline", { date: c.registrationDeadline })}</span>
                </div>
                <p>{descriptionFor(c)}</p>
                <div className="comp-actions">
                  {getCompetitionLinks(c).map((link) => (
                    <a
                      key={`${c.id}-${link.url}-${link.label}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`comp-link-btn kind-${link.kind}`}
                    >
                      {linkIcon(link.kind)} {link.label}
                    </a>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
