export function DiamondButton({
  label,
  onClick,
  variant = "white",
  className = "",
}) {
  const finalClassName = `diamond-btn ${variant} ${className}`.trim();
  console.log('DiamondButton Debug:', {
    label,
    variant,
    className,
    finalClassName
  });
  
  return (
    <button type="button" onClick={onClick} className={finalClassName}>
      <span>{label}</span>
    </button>
  );
}

