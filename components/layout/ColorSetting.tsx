import { motion } from "framer-motion";

const themes = [
  { themeName: 'Teal', themeColor: '#2dd4bf' },
  { themeName: 'Cyan', themeColor: '#22d3ee' },
  { themeName: 'Yellow', themeColor: '#eab308' },
  { themeName: 'Green', themeColor: '#22c55e' },
  { themeName: 'Sky', themeColor: '#0ea5e9' },
  { themeName: 'Pink', themeColor: '#ec4899' },
  { themeName: 'Orange', themeColor: '#f97316' },
  { themeName: 'Red', themeColor: '#ef4444' },
  { themeName: 'Purple', themeColor: '#a855f7' },
  { themeName: 'Blue', themeColor: '#3b82f6' },
  { themeName: 'Indigo', themeColor: '#6366f1' },
  { themeName: 'Slate', themeColor: '#64748b' },
]

const ColorSetting = ({ setTheme, variants }) => {

  function changeTheme(Color, Name) {
    const temp = JSON.parse(localStorage.getItem('theme'))
    const { KitMode } = temp
    setTheme({ name: Name, val: Color })
    localStorage.setItem('theme', JSON.stringify({ name: Name, val: Color, KitMode }))
    const selection = document.getElementById('selection');
    const style = document.createElement('style');
    style.setAttribute('id', 'selection')
    style.textContent = `::selection { background-color: ${Color}; color: black;}`
    document.head.replaceChild(style, selection)
  }

  function randomCol() {
    const temp = JSON.parse(localStorage.getItem('theme'))
    const { KitMode } = temp;
    const hex = `#${Math.random().toString(16).slice(2, 8).padEnd(6, 8)}`;
    setTheme({ name: hex, val: hex })
    localStorage.setItem('theme', JSON.stringify({ name: hex, val: hex, KitMode }))
    const selection = document.getElementById('selection');
    const style = document.createElement('style');
    style.setAttribute('id', 'selection')
    style.textContent = `::selection { background-color: ${hex}; color: black;}`
    document.head.replaceChild(style, selection)
  }

  return (
    <div className="w-full flex flex-col">
      <div className='w-fit grid grid-cols-4 md:grid-cols-6 mt-4 gap-3 mx-auto'>
        {themes.map((curr, index) => {
          return (
            <motion.div
              key={index}
              variants={variants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}>
              <button onClick={() => changeTheme(curr.themeColor, curr.themeName)} className='h-8 w-14 cursor-pointer rounded-tl-3xl rounded-br-3xl' style={{ boxShadow: `0px 0px 15px ${curr.themeColor}`, backgroundColor: `${curr.themeColor}` }} />
            </motion.div>
          )
        })}
      </div>
      <motion.button onClick={randomCol} variants={variants} className='flex max-w-sm mt-8 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-xl lg:text-2xl font-bold shadow-md rounded-tl-3xl rounded-br-3xl mx-auto py-2 px-4'>
        <h2>Random Color</h2>
      </motion.button>
    </div>
  )
}

export default ColorSetting