import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode
}

function PageTransition({ children }:Props) {
  const router = useRouter();

  const variants = {
    hidden: {
      opacity: 0,
      x: 50,
    }, 
    visible: {
      opacity:1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: -50,
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.section
        key={router.route}
        variants={variants}
        initial='hidden'
        animate='visible'
        exit='exit'
        transition={{
          duration : 0.75 
        }}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  );
}

export default PageTransition;