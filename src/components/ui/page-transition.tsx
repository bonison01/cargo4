
import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: [0.61, 1, 0.88, 1] } }
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
