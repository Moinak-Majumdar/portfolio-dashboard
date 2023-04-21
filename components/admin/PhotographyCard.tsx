import { useState } from 'react'
import axios from "axios";
import Image from 'next/legacy/image'
import { MdAutoDelete } from 'react-icons/md'
import PopupError from '../tools/PopupError';

interface props {
  data: { url: string, _id: string, __v: number }, resetImgDb: any
}

const PhotographyCard = ({ data, resetImgDb }:props) => {

  type TError = string|null
  const [Error, setError] = useState<TError>(null)

  async function deletePhotography() {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DELETE_PHOTOGRAPHY_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`,{url: data.url}, {headers: { 'Content-Type': 'application/json' }})
      if(response['status'].toString() === '200') {
        setError('Photography delete from db but not from storage')
        resetImgDb()
      }
    } catch (error) {
      setError('Check Console')
      console.log(error)
    }
  }

  if(Error) {
    return (
      <PopupError errors={Error} setErrors={setError}/>
    )
  }

  return (
    <section className='w-fit h-fit relative flex p-1 border border-slate-800 rounded-sm'>
      <Image src={data.url} height='360' width='265' alt='image.png' className='rounded-sm'/>
      <button onClick={deletePhotography} className='absolute top-4 right-2 text-4xl text-pink-600'>
        <MdAutoDelete />
      </button>
    </section>
  )
}

export default PhotographyCard