export function CustomButton({ onClick, children }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {children}
    </button>
  );
}
