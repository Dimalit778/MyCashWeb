const IconButton = ({ onClick, label }) => {
  return (
    <button onClick={onClick}>
      {/* <FaBeer /> */}
      {label}
    </button>
  );
};

export default IconButton;
