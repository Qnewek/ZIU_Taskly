import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';
import { ReactNode } from 'react';

export function PageWrapper({ children, pageKey }: { children: ReactNode; pageKey: string }) {
  return (
    <motion.div key={pageKey} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
