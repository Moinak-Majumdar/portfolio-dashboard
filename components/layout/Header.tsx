import Link from "next/link";
import { useRouter } from "next/router";
import SideNavBar from './SideNavBar'
import AnimatedHeading from "../tools/AnimatedHeading";

const link = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Portfolio',
    url: 'https://moinak05.vercel.app/'
  }
]

const Header = ({ theme, setTheme, darkMode, setDarkMode }) => {

  const router = useRouter()
  return (
    <>
      <header className='absolute inset-0 h-fit py-3 min-w-full px-4 md:px-10 lg:px-16 xl:px-36 2xl:px-44 flex flex-wrap items-center justify-between z-40'>
        <AnimatedHeading title='moinak05' theme={theme} classList="hidden md:inline-block xl:text-4xl text-3xl font-comicNeue" />
        <nav className={`flex items-center lg:text-xl text-base gap-4 lg:gap-6 xl:gap-8  ${darkMode ? 'text-gray-200' : 'text-black'}`}>
          {link.map((curr, index) => {
            return (
              <Link href={curr.url} key={index} className={`hidden font-ubuntu capitalize md:inline-block ${router.pathname === curr.url ? "font-ubuntu underline underline-offset-8 cursor-pointer" : ""}`}>
                {curr.name}
              </Link>
            )
          })}
          <Link href='mailto:moinak2030@gmail.com' className='hidden md:inline-block font-roboto font-semibold tracking-wider text-base lg:text-xl cursor-pointer' style={{ color: `${theme.val}` }}>
            moinak2030@gmail.com
          </Link>
        </nav>
      </header>
      <SideNavBar theme={theme} setTheme={setTheme} darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  )
}

export default Header