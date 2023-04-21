import React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'

interface props {
  darkMode: boolean,
  data: { _id: string, name: string, type: string, status: string, role: string, intro: string, liveUrl: string, gitRepo: string, slug: string, description: string, img: string[], tools: string[], toolsLogo: string[]}
}
const DocCard = ({ data, darkMode }:props) => {
  return (
    <Link href={`admin/${data.name}`} className='flex flex-col w-72 rounded-lg overflow-hidden h-fit relative cursor-pointer' >
      <div className={`absolute top-2 left-2 py-1 px-2 z-10 rounded-full ${data.type === 'work'? 'bg-blue-500' : 'bg-pink-500' }`}>
        {data.type}
      </div>
      <div className={`absolute top-2 right-2 py-1 px-2 z-10 rounded-full ${data.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}>
        {data.status}
      </div>
      <Image src={data.img[0]} width='288' height='220' className='transition transform-gpu duration-700 ease-in-out hover:scale-105' alt='image.png' />
      <h1 className={` p-2 font-comicNeue font-bold text-xl ${darkMode ? 'text-gray-300 bg-slate-800' : 'text-gray-800 bg-slate-200'}`}>{data.name}</h1>
    </Link>
  )
}

export default DocCard