import React from "react";
import styles from "./icon.module.css";

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
    sm: styles.btnSm,
    md: styles.btnMd,
    lg: styles.btnLg,
  };

  const buttonClasses = `
    ${styles.btn} 
    ${sizeClasses[size]} 
    ${className}
  `.trim();

  const buttonStyle = {
    color: color,
    backgroundColor: bgColor,
    border: border,
    borderColor: color,
  };

  return (
    <button type="button" onClick={onClick} style={buttonStyle} className={buttonClasses} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
