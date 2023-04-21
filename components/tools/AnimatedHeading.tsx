import { Variants, motion } from "framer-motion"

const outerVariants: Variants = {
    initial: {
    },
    animate: {
        transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    },
}
const innerVariants: Variants = {
    initial: {
        opacity: 0,
        x: 80,
        transition: {
            damping: 10,
            stiffness: 50
        }
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            damping: 10,
            stiffness: 50,
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 2
        }
    }
}

interface props {
    theme: {name?: string, val: string}, title: string, classList: string
}

const AnimatedHeading = ({ theme, title, classList }: props) => {

    const words = title.split("");
    return (
        <motion.span className={classList}
            variants={outerVariants} initial='initial' animate='animate'
        >
            {words.map((curr: string, i:number) => {
                return (
                    <motion.span key={`${i}_words`}
                        variants={innerVariants}
                        style={{ color: theme.val }}
                    >
                        {curr}
                    </motion.span>
                )
            })}
        </motion.span>
    )
}

export default AnimatedHeading