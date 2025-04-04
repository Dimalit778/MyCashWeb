import React from "react";
import styles from "./button.module.css";

const MyButton = ({
  dataCy,
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
  const buttonStyle = {
    backgroundColor: bgColor,
    color,
    border: border ? `1px solid ${border}` : "none",
  };

  const sizeClass = {
    none: styles.none,
    sm: styles.small,
    md: styles.medium,
    lg: styles.large,
  }[size];

  return (
    <button
      data-cy={dataCy}
      className={`${styles.customButton} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={buttonStyle}
      {...props}
    >
      <div className={`${styles.buttonContent} ${isLoading ? styles.loading : ""}`}>{children}</div>
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <div className={styles.loaderSpinner}></div>
        </div>
      )}
    </button>
  );
};

export default MyButton;
