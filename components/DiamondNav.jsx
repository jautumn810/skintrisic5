'use client'

export function DiamondButton({
  label,
  onClick,
  variant = "white",
  className = "",
}) {
  return (
    <button type="button" onClick={onClick} className={`diamond-btn ${variant} ${className}`.trim()}>
      <span>{label}</span>
    </button>
  );
}

