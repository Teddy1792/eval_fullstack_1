export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
}) {
  return (
    <select value={value} onChange={onChange} className={className}>
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((opt, index) => {
        if (typeof opt === "string" || typeof opt === "number") {
          return (
            <option key={opt} value={opt}>
              {opt}
            </option>
          );
        }
        const key = opt.value ?? index;
        return (
          <option key={key} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}
