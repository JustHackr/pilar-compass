import { figureForQuestion, passageForQuestion } from "@/data/tka/bank";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { TkaQuestion } from "@/lib/tka/scoring";
import { TkaQuestionFigure } from "@/components/tka/TkaQuestionFigure";

export function TkaStimulus({ question }: { question: TkaQuestion }) {
  const { t } = useLocale();
  const passage = passageForQuestion(question);
  const figure = figureForQuestion(question);
  const paragraphs = passage?.body.split("\n\n") ?? [];

  return (
    <>
      {passage ? (
        <article className="tka-passage">
          <p className="tka-passage-label">{t("tka.passage")}</p>
          <h2 className="tka-passage-title">{passage.title}</h2>
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {passage.note ? <p className="tka-passage-note">{passage.note}</p> : null}
        </article>
      ) : null}
      {figure ? <TkaQuestionFigure src={figure} alt={t("tka.figure")} /> : null}
      <p className="tka-stem">{question.stem}</p>
    </>
  );
}
