
import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { 
    opacity: 0,
    y: 8
  },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.61, 1, 0.88, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 8,
    transition: { 
      duration: 0.3, 
      ease: [0.61, 1, 0.88, 1] 
    }
  }
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
