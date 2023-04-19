import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaRegHandPeace, FaAngleDoubleLeft } from 'react-icons/fa'
import { BsFlower1 } from 'react-icons/bs'
import { useState } from 'react'
import { CgMenuRight } from 'react-icons/cg'
import { HiAcademicCap } from 'react-icons/hi2';
import CustomizeModal from './CustomizeModal'
import NavStyle from '../../styles/Navbar.module.css'


const divVariants = {
    open: {
        width: '300px',
        height: '100vh',
        x: '0px'
    },
    closed: {
        width: '300px',
        height: '100vh',
        x: '500px',
        transition: { delay: .8 }
    }
}
const ulVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.5 }
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};
const liVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000 }
        }
    },
    closed: {
        y: -40,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};

const Links = [
    { name: 'Portfolio', link: 'https://moinak05.vercel.app/', icon: <FaRegHandPeace /> },
    { name: 'Projects / Work', link: 'https://moinak05.vercel.app/Projects/', icon: <HiAcademicCap /> },
    { name: 'Blossoms', link: 'https://moinak05.vercel.app/Blossoms/', icon: <BsFlower1 /> },
]


const SideNavBar = ({ darkMode, setDarkMode, theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeLink, setActiveLink] = useState(null)

    
    function handelDialog() {
        setIsDialogOpen(false)
    }

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className={`fixed top-0 right-4 w-fit mt-2 z-50 rounded-full cursor-pointer text-2xl p-[9px] ${darkMode ? 'bg-blue-300' : 'bg-pink-300'}`} area-label='sideNavBar' title='sideNavbar'>
                <CgMenuRight className={darkMode ? 'text-black' : 'text-pink-800'} />
            </button>
            {/* hl3 side navbar */}
            <motion.div
                initial='closed'
                animate={isOpen ? 'open' : 'closed'}
                className={`z-40 fixed top-0 right-0 min-h-full flex ${isOpen ? "w-full" : 'max-w-0'}`}
            >
                <div onClick={() => setIsOpen(!isOpen)} className='bg-transparent min-w-full min-h-full'></div>
                <motion.div
                    variants={divVariants}
                    style={darkMode ? { background: 'linear-gradient(#2C5364,#203A43,#0F2027)', boxShadow: '0px 0px 30px #6b7280' } : { background: 'linear-gradient(#D7DDE8,#BBD2C5)', boxShadow: '0px 0px 30px #374151' }}
                    className={`absolute top-0 right-0 bottom-0 rounded-l-2xl overflow-hidden ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
                >
                    {Links && <section className='w-full min-h-full px-4 flex items-center'>
                        <motion.div variants={ulVariants} animate={isOpen ? 'open' : 'closed'} className='min-w-full flex flex-col h-fit'>
                            <motion.h1 variants={liVariants} className='text-3xl lg:text-4xl mt-4 mb-4 lg:mb-12  ml-4'>
                                <span className='font-ubuntu'>useful</span>
                                <span className='font-ubuntu font-bold ml-2' style={{ color: theme.val }}>Links</span>
                            </motion.h1>
                            {Links.map((curr, index) => {
                                return (
                                    <motion.div key={index} variants={liVariants} whileTap={{ scale: 0.88 }}>
                                        <Link href={curr.link}>
                                            <button onClick={() => setActiveLink(curr.name)} className='text-2xl ml-4 mb-3 font-ubuntu flex items-center'>
                                                {curr.icon}
                                                <span className='font-ubuntu ml-3 text-xl'>{curr.name}</span>
                                                <FaAngleDoubleLeft className={activeLink === curr.name ? 'ml-4 text-2xl' : 'hidden'} style={{ color: theme.val }} />
                                            </button>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                            <motion.div variants={liVariants} className='mt-4 ml-4'>
                                <h2>
                                    <span className='capitalize text-xl font-comicNeue'>Color Theme :</span>
                                    <span className='ml-2 capitalize text-xl font-comicNeue font-bold'>{darkMode ? 'Dark' : 'Lite'}</span>
                                </h2>
                                <h2 className='mt-2'>
                                    <span className='capitalize text-xl font-comicNeue'>Color Scheme :</span>
                                    <span className='ml-2 text-xl font-comicNeue' style={{ color: theme.val }}>{theme.name}</span>
                                </h2>
                            </motion.div>
                            <motion.div variants={liVariants} className='mt-8 flex flex-col items-center'>
                                <button  onClick={() => {
                                    setIsDialogOpen(true)
                                    setIsOpen(false)
                                }} type='button' className={NavStyle.button}>Customize</button>
                            </motion.div>
                        </motion.div>
                    </section>}
                </motion.div>
            </motion.div>
            {isDialogOpen && <CustomizeModal visible={isDialogOpen} isClose={handelDialog} theme={theme} darkMode={darkMode} setTheme={setTheme} setDarkMode={setDarkMode} />}
        </>
    )
}

export default SideNavBar