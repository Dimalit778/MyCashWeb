import React from "react";
import { motion, useAnimation } from "framer-motion";
import styled from "styled-components";

const AnimatedButton = styled(motion.div)`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1.5rem;
  border-radius: 4rem;
  width: fit-content;
  padding: 15px 20px;
  color: white;
  position: relative;
  overflow: hidden;

  span {
    position: relative;
    z-index: 2;
    transition: color 0.3s ease;
    color: black;
    font-family: var(--oswald-font);
    font-weight: bold;
    letter-spacing: 0.06rem;
  }

  .highlight {
    position: absolute;
    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    height: 100%;
    top: 0;
    border-radius: 4rem;
    z-index: 1;
  }

  &:hover span {
    color: black;
  }
`;

const WelcomeAnimation = () => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({ left: "0%", transition: { duration: 5 } });
  }, [controls]);

  return (
    <AnimatedButton className="start_btn mx-auto">
      <motion.div
        className="highlight"
        initial={{ left: "-100%", width: "100%" }}
        animate={controls}
        whileHover={{ width: "100%" }}
      />
      <span>Start Your Financial Journey</span>
    </AnimatedButton>
  );
};

export default WelcomeAnimation;
