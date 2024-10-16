const IconButton = ({ onClick, label, color, bgColor }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ color: color, backgroundColor: bgColor }}
      className="btn btn-lg rounded-circle p-3 shadow-sm text-white"
    >
      {label}
    </button>
  );
};

export default IconButton;
