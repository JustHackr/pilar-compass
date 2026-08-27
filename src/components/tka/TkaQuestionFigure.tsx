export function TkaQuestionFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="tka-figure">
      <img src={src} alt={alt} />
    </figure>
  );
}
