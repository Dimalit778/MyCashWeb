import React from "react";

const IconButton = ({
  onClick,
  icon,
  color = "white",
  bgColor = "transparent",
  border = "1px solid white",
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "btn-sm p-1",
    md: "btn-md p-2",
    lg: "btn-lg p-1",
  };

  const buttonClasses = `
    btn 
    ${sizeClasses[size]} 
    ${className}
  `.trim();

  const buttonStyle = {
    color: color,
    backgroundColor: bgColor,

    border: border,
    borderColor: color,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  };

  return (
    <button type="button" onClick={onClick} style={buttonStyle} className={buttonClasses} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
