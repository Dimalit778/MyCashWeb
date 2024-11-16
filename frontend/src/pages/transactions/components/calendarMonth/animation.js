export const monthItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const overlayVariants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(0 50% 100% 50%)",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0% 0%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
    },
  },
};
