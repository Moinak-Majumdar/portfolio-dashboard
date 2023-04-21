import { useState } from "react"

interface props {
  placeholder?: string, value: string, onChange: any, type: string, id?: string, darkMode: boolean, theme: { name?: string, val: string}, autoComplete: string, required: boolean, disable?: boolean|string, name?: string
}

const Input = ({placeholder, value, onChange, type, id, darkMode, theme, autoComplete, required, disable, name}:props) => {

  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <>
      {theme && <input
          id={id} placeholder={placeholder} value={value} type={type} name={name}
          onChange={onChange} required={required} autoComplete={autoComplete}
          className={`w-full rounded border text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${darkMode ? 'border-gray-700 text-gray-100 bg-gray-800' : 'border-gray-300 text-gray-700 bg-white'} ${disable ? 'cursor-not-allowed': ''}`}
          onFocus={() => {setIsFocused(true)}}
          onBlur={() => {setIsFocused(false)}}
          style={isFocused? {boxShadow: `0px 0px 5px ${theme.val}`, borderWidth : "1px", borderColor : `${theme.val}`} : {margin : 0}}
        />
      }
    </>
  )
}

export default Input