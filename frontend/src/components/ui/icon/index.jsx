import React, { useState } from "react";
import styles from "./icon.module.css";

const IconButton = ({
  onClick,
  icon,
  color = "white",
  bgColor = "transparent",
  hoverBgColor, // Add new prop for hover background
  border = "none",
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: {
      width: "24px",
      height: "24px",
      fontSize: "0.875rem",
    },
    md: {
      width: "32px",
      height: "32px",
      fontSize: "1rem",
    },
    lg: {
      width: "40px",
      height: "40px",
      fontSize: "1.25rem",
    },
  };

  // Use state to handle hover
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    color,
    backgroundColor: isHovered ? hoverBgColor : bgColor,
    border,
    ...sizeClasses[size],
    ...props.style,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.iconButton} ${className}`}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {icon}
    </button>
  );
};
export default IconButton;
