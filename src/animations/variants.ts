export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn'  } },
};

export const listContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const listItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.22, ease: 'easeOut' } },
};

export const toastVariants = {
  initial: { opacity: 0, x: 60,  scale: 0.9 },
  animate: { opacity: 1, x: 0,   scale: 1,   transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
  exit:    { opacity: 0, x: 60,  scale: 0.85, transition: { duration: 0.16 } },
};

export const fabVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.15 } },
  tap:   { scale: 0.95 },
};
