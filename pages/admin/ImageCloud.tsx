import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Head from 'next/head'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { FaRegWindowClose, FaClipboardCheck, FaFileUpload } from 'react-icons/fa'
import { BsFillImageFill } from 'react-icons/bs'
import { auth } from '../../src/Firebase';
import DashboardNavbar from '../../components/admin/DashboardNavbar'
import Button from '../../components/tools/Button'
import Input from '../../components/tools/Input'
import CloudImgCard from '../../components/admin/CloudImgCard'
import Login from '../../components/admin/Login';
import Loading from '../../components/admin/Loading';
import Err from '../../components/admin/Err';
import PopupError from '../../components/tools/PopupError';
import { useFunction } from '@/context/FunctionContext';


type individualImg = { _id: string, url: string, projectName: string, imgName: string, __v: number }
type imgCollection = { [key: string]: individualImg[] }
type Tdb = [string[], imgCollection]

interface props { darkMode: boolean, theme: { name?: string, val: string }, DATA: Tdb }

const ImageCloud = ({ darkMode, theme, DATA }: props) => {

    const { cloudStorage } = useFunction();
    type strOrNull = string | null
    const [uploadBox, setUploadBox] = useState(false)
    const [ansLink, setAnsLink] = useState<strOrNull>(null)
    const [copied, setCopied] = useState(false)
    const [Error, setError] = useState<strOrNull>('Please select project first.')
    const [projectName, setProjectName] = useState('')
    type fileOrNull = File | null
    const [file, setFile] = useState<fileOrNull>(null)
    const [msg, setMsg] = useState<strOrNull | boolean>(null)
    const [disable, setDisable] = useState(false)
    const [DB, setDB] = useState(DATA)
    type TCurrentDb = individualImg[] | null
    const [CurrentDb, setCurrentDb] = useState<TCurrentDb>(null)

    const [user, loading, error] = useAuthState(auth);

    function dbSet(e: ChangeEvent<HTMLSelectElement>|string) {
        const dbName = (typeof e === 'string') ?  e : e.target.value;
        if (dbName !== 'select project') {
            setCurrentDb(null)
            setCurrentDb(DB[1][dbName]) // 0 is name of all project, 1 is all project img data
            setError(null)
        } else {
            setError('Please select project first.')
            setCurrentDb(null)
        }
    }
    useEffect(() => {
      dbSet(projectName)
    }, [DB])
    
    async function reDownloadImages() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_GET_ALL_CLOUD_IMG}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { headers: { 'Content-Type': 'application/json' } })
            const data: Tdb = response.data
            setDB(data)
        } catch (error) {
            console.log(error)
        }
    }

    function getFileFromUser(e: ChangeEvent) {
        const target = e.target as HTMLInputElement
        const local_file: File = (target.files as FileList)[0]
        setFile(local_file)
    }

    function handelSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMsg('')
        setDisable(true)
        if (file !== null) {
            cloudStorage(projectName, file, setMsg, setDisable, setAnsLink, setError, reDownloadImages)
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
                    <title>Image Cloud ☁️☁️☁️☁️</title>
                </Head>
                <DashboardNavbar />
                <section className='myContainer py-[4rem] text-gray-800'>
                    <button className='fixed top-2 md:top-14 left-12 md:left-2 flex justify-center items-center p-2 mb-4 z-40 rounded-lg bg-green-300' onClick={() => setUploadBox(!uploadBox)}>
                        <BsFillImageFill style={{ fontSize: '30px', cursor: 'pointer' }} />
                        <span className='text-xs md:text-base ml-2 cursor-pointer'>Upload image</span>
                    </button>
                    {CurrentDb && <div className='mt-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                        {CurrentDb.map((curr, index) => {
                            return (
                                <CloudImgCard key={`${curr.projectName}-_-${index}`}
                                    data={curr}
                                    reDownloadImages={reDownloadImages}
                                />
                            )
                        })}
                    </div>}
                    <div className='fixed top-4 md:top-28 left-44 md:left-2 z-40'>
                        <select className="block w-full px-3 py-1.5 text-sm md:text-base cursor-pointer text-gray-700 border border-orange-400 rounded transition ease-in-out focus:bg-white bg-orange-200 focus:border-orange-600 outline-none" aria-label="select project" onChange={dbSet}>
                            <option value='select project'>Select Project</option>
                            {DB[0].map((curr: string, index: number) => {
                                return (
                                    <option key={index} value={curr}>{curr}</option>
                                )
                            })}
                        </select>
                    </div>
                </section>
                {/* sliding upload box */}
                <section className={`fixed top-40 right-0 p-2 w-full md:w-80 overflow-hidden h-fit transition-transform transform z-30 pb-4 rounded-lg ${darkMode ? "bg-slate-800 text-gray-300" : 'bg-slate-300 text-gray-800'} ${uploadBox ? 'translate-x-0' : 'translate-x-full'}`}>
                    <FaRegWindowClose className='absolute top-0 right-2 text-2xl m-1 cursor-pointer' onClick={() => setUploadBox(!uploadBox)} />
                    {msg && <div className='mx-4 px-4 py-2 rounded-lg mt-6'>{msg}</div>}
                    <form onSubmit={handelSubmit} className='p-4 flex flex-col'>
                        <div className='flex flex-col'>
                            <label htmlFor='project-name'>Project Name</label>
                            <Input id='project-name' autoComplete='project-name' theme={theme} onChange={(e: Event & { target: HTMLInputElement }) => setProjectName(e.target.value)} value={projectName} required={true} type="text" darkMode={darkMode} disable={disable} />
                            <label htmlFor='file' className='mt-2'>Select File</label>
                            <input type='file' accept="image/*" id='file' onChange={getFileFromUser} disabled={disable} required />
                        </div>
                        <Button type='submit' theme={theme} className='mt-4' disable={disable}>
                            <div className='flex justify-center items-center'>
                                <FaFileUpload />
                                <span className='ml-2'>Upload</span>
                            </div>
                        </Button>
                    </form>
                    {ansLink && <div className='mx-4 flex flex-col'>
                        <h1 style={{ fontSize: '12px' }}>{ansLink}</h1>
                        <CopyToClipboard text={ansLink}>
                            <button onClick={() => setCopied(!copied)} className='flex mt-2 p-2 justify-center items-center bg-violet-500 hover:bg-violet-600 ease-in-out rounded-lg'>
                                <span className='mr-3 text-xl'>{copied ? 'Link Copied' : 'Copy to clipboard'}</span>
                                <FaClipboardCheck className='text-3xl my-auto cursor-pointer' />
                            </button>
                        </CopyToClipboard>
                    </div>}
                </section>
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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_GET_ALL_CLOUD_IMG}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { headers: { 'Content-Type': 'application/json' } })
    const data = response.data

    return { props: { DATA: data } }
}

export default ImageCloud