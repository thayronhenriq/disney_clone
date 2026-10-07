import { AVATARS } from "./profiles.jsx";

export default function Avatar({ index = 0, size = 125, children, ...rest }) {
  const a = AVATARS[index] ?? AVATARS[0];
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.5, background: `linear-gradient(135deg, ${a.bg[0]}, ${a.bg[1]})` }}
      {...rest}
    >
      <span>{a.emoji}</span>
      {children}
    </div>
  );
}
