import React from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./animation.module.css";

const LandingAnimation = () => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      left: "0%",
      transition: { duration: 5 },
    });
  }, [controls]);

  return (
    <motion.div className={`${styles.animatedButton} start_btn mx-auto`}>
      <motion.div
        className={styles.highlight}
        initial={{ left: "-100%", width: "100%" }}
        animate={controls}
        whileHover={{ width: "100%" }}
      />
      <span className={styles.buttonText}>Start Your Financial Journey</span>
    </motion.div>
  );
};

export default LandingAnimation;
