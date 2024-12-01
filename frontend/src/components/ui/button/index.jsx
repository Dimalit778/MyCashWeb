import React from "react";
import styles from "./button.module.css";

const MyButton = ({
  children,
  isLoading,
  disabled,
  onClick,
  bgColor,
  color,
  border,
  size = "md",

  className = "",
  ...props
}) => {
  const sizes = {
    sm: {
      padding: "4px 8px",
      fontSize: "12px",
      minWidth: "50px",
    },
    md: {
      padding: "8px 16px",
      fontSize: "14px",
      minWidth: "60px",
    },
    lg: {
      padding: "12px 24px",
      fontSize: "16px",
      minWidth: "70px",
    },
  };
  const buttonStyle = {
    backgroundColor: bgColor,
    color: color,
    border: "1px solid " + border,
    ...sizes[size],
  };
  return (
    <button
      className={`${styles.customButton}  ${styles[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={buttonStyle}
      {...props}
    >
      <span className={`${styles.buttonContent} ${isLoading ? styles.loading : ""}`}>{children}</span>
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <div className={styles.loaderSpinner}></div>
        </div>
      )}
    </button>
  );
};

export default MyButton;
