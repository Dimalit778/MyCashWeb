import React from "react";
import styles from "./button.module.css";

const MyButton = ({ children, isLoading, disabled, onClick, bgColor, color, className = "", ...props }) => {
  const buttonStyle = {
    backgroundColor: bgColor,
    color: color,
  };

  return (
    <button
      className={`${styles["custom-button"]} ${className}`} // Change this
      disabled={disabled || isLoading}
      onClick={onClick}
      style={buttonStyle}
      {...props}
    >
      <span className={`${styles["button-content"]} ${isLoading ? styles.loading : ""}`}>{children}</span>
      {isLoading && (
        <div className={styles["spinner-wrapper"]}>
          <div className={styles["loader-spinner"]}></div>
        </div>
      )}
    </button>
  );
};

export default MyButton;
