export function ProfileAvatarMark({
  src,
  label,
}: {
  src: string | null | undefined;
  label: string;
}) {
  const initial = (label.trim()[0] || "?").toUpperCase();
  if (src) {
    return <img className="profile-avatar-img" src={src} alt="" />;
  }
  return (
    <span className="profile-avatar-fallback" aria-hidden="true">
      {initial}
    </span>
  );
}
