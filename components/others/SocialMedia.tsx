import { motion } from "framer-motion"
import { FaFacebookSquare, FaGithub, FaWhatsapp, FaLinkedin, FaPhoneAlt } from 'react-icons/fa'
import { MdMarkEmailUnread } from 'react-icons/md'

const links = [
  { url: 'https://github.com/Moinak-Majumdar', icon: <FaGithub />, toolTip: 'GitHub', color: '#181717' },
  { url: 'https://www.linkedin.com/in/moinak-majumdar-b7a85b238/', icon: <FaLinkedin />, toolTip: 'Linkedin', color: '#0A66C2' },
  { url: 'mailto:moinak2030@gmail.com', icon: <MdMarkEmailUnread />, toolTip: 'Email', color: '#bb001b' },
  { url: 'https://www.facebook.com/moinak.majumdar.9', icon: <FaFacebookSquare />, toolTip: 'Facebook', color: '#1877F2' },
  { url: 'https://api.whatsapp.com/send?phone=+919804139678&text=I%20like%20your%20work', icon: <FaWhatsapp />, toolTip: 'Whatsapp', color: '#25D366' },
  { url: 'tel:+919804139678', icon: <FaPhoneAlt />, toolTip: 'Phone', color: '#6236FF' },
]

const SocialMedia = ({classList,}) => {
  return (
    <div className={classList}>
      {links.map((curr, index) => {
        return (
          <motion.a className="text-gray-500" whileHover={{ scale: 1.15, color: curr.color}} whileTap={{ scale: 0.8 }} key={`${curr.toolTip}_${index}`} href={curr.url} target='_blank'>
            <span title={curr.toolTip} className='text-3xl cursor-pointer'>{curr.icon}</span>
          </motion.a>
        )
      })}
    </div>
  )
}

export default SocialMedia