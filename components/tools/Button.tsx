import { useState } from 'react'
import { motion } from "framer-motion";

const Button = ({children, theme, type, onClick, className, disable}) => {

  const [Hover, setHover] = useState(false)

  return (
    <>
      {theme && <motion.div
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.9}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`w-full flex justify-center  ${className}`}
      >
        <button 
          type={type} onClick={onClick} 
          onMouseEnter={() => {setHover(true)}}
          onMouseLeave={() => {setHover(false)}}
          className={`noSelection text-white flex justify-center items-center w-11/12 border-0 py-2 px-8 focus:outline-none text-lg shadow-lg transition-all duration-500 rounded-full ${disable? 'cursor-not-allowed':'cursor-pointer'}`} 
          style={Hover?{boxShadow: `4px 2px 20px ${theme.val}`, backgroundColor: `${theme.val}`}:{backgroundColor: `${theme.val}`}}
          disabled={disable}
        >
          {children}
        </button>
      </motion.div>}
    </>
  )
}

export default Button