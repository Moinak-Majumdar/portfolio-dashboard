import { useAuthState } from 'react-firebase-hooks/auth';
import axios from "axios";
import Image from 'next/legacy/image'
import Head from 'next/head'
import { useState, FormEvent } from 'react'
import { FaRegWindowClose } from 'react-icons/fa';
import { BsFillImageFill } from 'react-icons/bs';
import { MdAddTask } from 'react-icons/md'
import PhotographyCard from '../../components/admin/PhotographyCard'
import DashboardNavbar from '../../components/admin/DashboardNavbar';
import Textarea from '../../components/tools/Textarea';
import { auth } from '../../src/Firebase';
import Login from '../../components/admin/Login';
import Loading from '../../components/admin/Loading';
import Err from '../../components/admin/Err';
import PopupError from '../../components/tools/PopupError'

interface props { darkMode: boolean, theme: { name?: string, val: string }, photography: { url: string, _id: string, __v: number }[] }

const Photography = ({ darkMode, theme, photography }: props) => {

    const [uploadBox, setUploadBox] = useState(false)
    const [disable, setDisable] = useState(false)
    type strOrNull = string | null
    const [Error, setError] = useState<strOrNull>(null)
    const [input, setInput] = useState({ url: '' })
    const [ImgDb, setImgDb] = useState(photography)

    const [user, loading, error] = useAuthState(auth);

    async function handelSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setDisable(true)
        setError('')

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ADD_PHOTOGRAPHY_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { url: input.url }, { headers: { 'Content-Type': 'application/json' } })
            const data = response.data;
            if (response['status'].toString() === '201') {
                setError(data.success)
            }
        } catch (err) {
            console.log(err)
        }
        resetImgDb()
        setInput({ url: '' })
        setDisable(false)
        setUploadBox(false)
    }

    async function resetImgDb() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_GET_ALL_PHOTOGRAPHY_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { headers: { 'Content-Type': 'application/json' } })
            if (response['status'].toString() === '200') {
                setImgDb(response.data)
            }

        } catch (error) {
            console.log(error)
        }
      
    }

    if (Error) {
        return (
            <PopupError errors={Error} setErrors={setError} />
        )
    }
    if (loading) {
        return (
            <Loading darkMode={darkMode} />
        )
    }
    if (error) {
        return (
            <Err darkMode={darkMode} error={error} />
        )
    }

    if (user) {
        return (
            <>
                <Head>
                    <title>My photography</title>
                </Head>
                <DashboardNavbar />
                {!uploadBox && <section className={`myContainer py-[4rem] ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    <button className='fixed text-xs md:text-base top-2 md:top-14 left-12 md:left-2 flex justify-center items-center p-2 mb-4 z-40 rounded-lg bg-green-300 text-gray-900' onClick={() => setUploadBox(!uploadBox)}>
                        <BsFillImageFill style={{ fontSize: '30px', cursor: 'pointer' }} />
                        <span className='ml-2 cursor-pointer'>Upload image</span>
                    </button>
                    <div className='mt-4 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
                        {ImgDb.map((curr, i) => {
                            return (
                                <PhotographyCard key={i} data={curr} resetImgDb={resetImgDb} />
                            )
                        })}
                    </div>
                </section>}
                {uploadBox && <section className={`min-h-screen min-w-full flex justify-center items-center bg-opacity-80 ${darkMode ? 'bg-gray-400' : 'text-gray-800'}`}>
                    <form onSubmit={handelSubmit} className='relative flex flex-col p-8 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 rounded-2xl shadow-black shadow-2xl mx-4'>
                        <FaRegWindowClose className='absolute top-0 right-1 text-pink-600 text-2xl m-1 cursor-pointer' onClick={() => setUploadBox(!uploadBox)} />
                        <div className='flex items-center gap-4 w-full mb-4'>
                            <Image src={input.url} height='112' width='160' alt='dummy' className='rounded-md' />
                            <Textarea autoComplete='off' theme={theme} required={true}
                                darkMode={darkMode} disable={disable} placeholder='Photography Image Url.' name='url'
                                value={input.url}
                                onChange={(e: Event & { target: HTMLTextAreaElement }) => setInput({ ...input, url: e.target.value })}
                            />
                        </div>
                        <button type='submit' className="px-5 py-2.5 relative rounded group font-medium text-white text-lg inline-block">
                            <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                            <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                            <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out rounded shadow-2xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-xl from-purple-600 to-blue-500"></span>
                            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                            <div className="relative flex items-center">
                                <MdAddTask />
                                <span className='ml-2'>Add Photography</span>
                            </div>
                        </button>
                    </form>
                </section >}
            </>
        )
    }
    return (
        <>
            <Login darkMode={darkMode} theme={theme} />
        </>
    )
}

export async function getServerSideProps() {

    const response = await axios.get(`${process.env.NEXT_PUBLIC_GET_ALL_PHOTOGRAPHY_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { headers: { 'Content-Type': 'application/json' } })
    const photography = [...response.data]

    return { props: { photography: photography } }
}

export default Photography