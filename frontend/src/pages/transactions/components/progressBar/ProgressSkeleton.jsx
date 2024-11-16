import { motion } from "framer-motion";
const ProgressSkeleton = () => (
  <div className="progress-skeleton">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="skeleton-item"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <div className="skeleton-header" />
        <div className="skeleton-bar" />
      </motion.div>
    ))}
  </div>
);

export default ProgressSkeleton;
