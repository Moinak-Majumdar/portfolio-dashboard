import Image from 'next/legacy/image'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react'
import { FaClipboardCheck, FaCheckDouble, FaTrashAlt } from 'react-icons/fa'
import PopupError from "../tools/PopupError";
import { useFunction } from "@/context/FunctionContext";

interface props {
  data : { url: string, imgName: string, projectName: string, _id: string, __v: number}, 
  reDownloadImages: any
}

const CloudImgCard = ({ data, reDownloadImages }:props) => {

  const [copied, setCopied] = useState(false)
  type IError = string|null
  const [Error, setError] = useState<IError>(null)
  const { deleteCloudImg } = useFunction()

  async function deleteImage() {
    const ack = prompt("Confirm project Name to delete : " + data.imgName)

    if (ack === data.projectName) {
      const args = {projectName: data.projectName, imgName: data.imgName, url: data.url, setError, reDownloadImages}
      deleteCloudImg(args)
    } else {
      setError("Project Name Mismatched ⛔⛔⛔")
    }
  }

  if(Error) {
    return (
      <PopupError errors={Error} setErrors={setError}/>
    )
  }


  return (
    <section className='w-fit h-fit relative flex flex-col rounded-lg p-2 overflow-hidden bg-gradient-to-br from-pink-300 via-cyan-300 to-teal-400 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-500 text-gray-800'>
      <h1 className='font-roboto text-sm'>{`Project Name: ${data.projectName}`}</h1>
      <Image src={data.url} height={200} width={256} alt='image.png' />
      <h1 className='font-roboto text-sm'>{data.imgName}</h1>
      <CopyToClipboard text={data.url}>
        <button onClick={() => setCopied(!copied)} className='flex mt-2 p-2 justify-center items-center bg-orange-300 hover:bg-orange-400 rounded-lg'>
          <span className='mr-3 text-lg'>{copied ? 'Link Copied' : 'Copy Link to clipboard'}</span>
          {copied ? <FaCheckDouble className='text-2xl my-auto cursor-pointer' /> : <FaClipboardCheck className='text-3xl my-auto cursor-pointer' />}
        </button>
      </CopyToClipboard>
      <button onClick={deleteImage} className='absolute top-10 right-4 bg-red-400 rounded-full p-2 text-lg cursor-pointer'>
        <FaTrashAlt />
      </button>
    </section>
  )
}

export default CloudImgCard