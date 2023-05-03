import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from "axios";
import Image from 'next/legacy/image'
import Head from 'next/head'
import { useState, FormEvent } from 'react'
import { MdUpdate, MdRestoreFromTrash } from 'react-icons/md'
import DashboardNavbar from '../../components/admin/DashboardNavbar';
import Input from '../../components/tools/Input'
import Textarea from '../../components/tools/Textarea'
import Button from '../../components/tools/Button';
import { auth } from '../../src/Firebase';
import Err from '../../components/admin/Err';
import Loading from '../../components/admin/Loading';
import PopupError from '../../components/tools/PopupError'
import Login from '../../components/admin/Login'
import { GetServerSidePropsContext } from 'next';
import { useFunction } from '@/context/FunctionContext';

interface props {
  darkMode: boolean, theme: { name?: string, val: string },
  DATA: { _id: string, name: string, type: string, status: string, role: string, intro: string, liveUrl: string, gitRepo: string, slug: string, description: string, img: { url: string }[], tools: { name: string }[], toolsLogo: string[], cover: string }
}


const Doc = ({ DATA, darkMode, theme }: props) => {

  const { updateDoc, deleteDoc } = useFunction();
  const [disable, setDisable] = useState(false)
  type TError = null | string
  const [Error, setError] = useState<TError>(null)
  const [data, setData] = useState({ id: DATA._id, name: DATA.name, type: DATA.type, status: DATA.status, role: DATA.role, intro: DATA.intro, liveUrl: DATA.liveUrl, gitRepo: DATA.gitRepo, description: DATA.description, img: DATA.img, tools: DATA.tools, toolsLogo: DATA.toolsLogo, cover: DATA.cover })
  const [imgFields, setImgFields] = useState(data.img)
  const [toolsFields, setToolsFields] = useState(data.tools)
  const router = useRouter()

  const [user, loading, error] = useAuthState(auth);

  function handleChange(index: number, value: string, option: string) {
    if (option === 'img') {
      let temp = [...imgFields];
      temp[index]['url'] = value;
      setImgFields(temp);
    }
    if (option === 'tools') {
      let temp = [...toolsFields];
      temp[index]['name'] = value;
      setToolsFields(temp);
    }
  }
  function addFiled(option: string) {
    if (option === 'img') {
      let newField = { url: '' }
      setImgFields([...imgFields, newField])
    }
    if (option === 'tools') {
      let newField = { name: '' }
      setToolsFields([...toolsFields, newField])
    }
  }
  function removeField(index: number, option: string) {
    if (option === 'img') {
      let temp = [...imgFields];
      temp.splice(index, 1)
      setImgFields(temp)
    }
    if (option === 'tools') {
      let temp = [...toolsFields];
      temp.splice(index, 1)
      setToolsFields(temp)
    }
  }

  async function handelSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDisable(true)
    setError('')

    let imgArr: string[] = []
    imgFields.forEach((curr) => { imgArr.push(curr.url) })

    let toolsArr: string[] = [];
    toolsFields.forEach((curr) => { toolsArr.push(curr.name) })

    let toolsLogoArr: string[] = []
    toolsArr.forEach((curr) => { toolsLogoArr.push(`${curr}.svg`) })

    if (toolsArr.length < 1) {
      setDisable(false)
      return setError('Project was made without anything?? 🤦🤦🤦')
    }

    if (imgArr.length < 1) {
      setDisable(false)
      return setError('At least one image is required.')
    }

    const propData = {
      id: data.id, name: data.name, type: data.type, status: data.status, role: data.role, intro: data.intro, liveUrl: data.liveUrl, gitRepo: data.gitRepo, slug: data.name, description: data.description, img: imgArr, tools: toolsArr, toolsLogo: toolsLogoArr, cover: data.status
    }

    updateDoc(propData, setError, setDisable)
  }

  async function handelDelete() {
    const ans = prompt("Confirm project name to delete.")
    if (ans === data.name) {
      deleteDoc(ans, setError)
    } else {
      setError('Check Project Name Carefully.')
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
          <title>About Project</title>
        </Head>
        <DashboardNavbar />
        <section className={`myContainer py-[4rem] ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          <Button onClick={handelDelete} theme={theme} className='max-w-[12rem] lg:max-w-[20rem] mt-4 ml-0 mr-auto lg:mr-0 lg:ml-auto'>
            Delete Project
          </Button>
          <form onSubmit={handelSubmit} className='md:p-2 mt-8 mx-auto grid grid-cols-4 2xl:grid-cols-8 gap-4'>
            {/* name */}
            <div className='col-span-4 2xl:col-span-2'>
              <label className='text-sm md:text-base font-bold' htmlFor='project-name'>Project Name **</label>
              <Input id='project-name' autoComplete='project-name' theme={theme} onChange={(e: Event & { target: HTMLInputElement }) => setData({ ...data, name: e.target.value })} value={data.name} required={true} type="text" darkMode={darkMode} disable={disable} />
              <h3 className='text-sm text-pink-600'>Be Careful: Can not be updated after submit.</h3>
            </div>
            {/* project / work */}
            <div className='col-span-4 2xl:col-span-2 flex flex-col'>
              <label className='text-sm md:text-base font-bold'>Type **</label>
              <div className='flex mt-2 gap-6'>
                <span>
                  <input id='client-work' checked={data.type === 'work'} value='work' onChange={(e) => setData({ ...data, type: 'work' })} name='type' required={true} type="radio" disabled={disable} />
                  <label className='text-sm font-bold md:text-base ml-2 cursor-pointer' htmlFor='client-work' style={{ color: theme.val }}>Client Work</label>
                </span>
                <span>
                  <input id='personal-project' checked={data.type === 'project'} value='project' onChange={(e) => setData({ ...data, type: 'project' })} name='type' required={true} type="radio" disabled={disable} />
                  <label className='text-sm font-bold md:text-base ml-2 cursor-pointer' htmlFor='personal-project' style={{ color: theme.val }}>Personal Project</label>
                </span>
              </div>
            </div>
            {/* current status */}
            <div className='col-span-4 2xl:col-span-2 flex flex-col'>
              <label className='text-sm md:text-base font-bold'>Current Status **</label>
              <div className='flex mt-2 gap-6'>
                <span>
                  <input id='status-done' checked={data.status === 'completed'} value='completed' onChange={(e) => setData({ ...data, status: 'completed' })} name='status' required={true} type="radio" disabled={disable} />
                  <label className='text-sm font-bold md:text-base ml-2 cursor-pointer' htmlFor='status-done' style={{ color: theme.val }}>Completed</label>
                </span>
                <span>
                  <input id='status-running' checked={data.status === 'under development'} value='under development' onChange={(e) => setData({ ...data, status: 'under development' })} name='status' required={true} type="radio" disabled={disable} />
                  <label className='text-sm font-bold md:text-base ml-2 cursor-pointer' htmlFor='status-running' style={{ color: theme.val }}>Under Development</label>
                </span>
              </div>
            </div>
            {/* live url */}
            <div className='col-span-4 2xl:col-span-2'>
              <label className='text-sm md:text-base font-bold' htmlFor='Live-url'>Live project Url</label>
              <Input id='Live-url' autoComplete='Live-url' theme={theme} onChange={(e: Event & { target: HTMLInputElement }) => setData({ ...data, liveUrl: e.target.value })} value={data.liveUrl} required={true} type="text" darkMode={darkMode} disable={disable} placeholder='Deployment url' />
            </div>
            {/* git repo */}
            <div className='col-span-4'>
              <label className='text-sm md:text-base font-bold' htmlFor='git-repositories'>Project Repositories</label>
              <Input id='git-repositories' autoComplete='git-repositories' theme={theme} onChange={(e: Event & { target: HTMLInputElement }) => setData({ ...data, gitRepo: e.target.value })} value={data.gitRepo} required={true} type="text" darkMode={darkMode} disable={disable} placeholder='Git repositories link' />
            </div>
            {/* role */}
            <div className='col-span-4'>
              <label className='text-sm md:text-base font-bold' htmlFor='project-role'>Project Role</label>
              <Input id='project-role' autoComplete='project-role' onChange={(e: Event & { target: HTMLInputElement }) => setData({ ...data, role: e.target.value })} value={data.role} required={true} type="text" theme={theme} darkMode={darkMode} disable={disable} placeholder='Eg: design and development.' />
            </div>
            {/* introduction */}
            <div className='col-span-full'>
              <label className='text-sm md:text-base font-bold' htmlFor='project-intro'>Project Introduction</label>
              <Input id='project-intro' autoComplete='project-intro' onChange={(e: Event & { target: HTMLInputElement }) => setData({ ...data, intro: e.target.value })} value={data.intro} required={true} type="text" theme={theme} darkMode={darkMode} disable={disable} placeholder='Small Introduction' />
            </div>
            {/* description */}
            <div className='col-span-full'>
              <label className='text-sm md:text-base font-bold' htmlFor='project-description'>Project Description</label>
              <Textarea id='project-description' autoComplete='project-description' onChange={(e: Event & { target: HTMLInputElement }) => setData({ ...data, description: e.target.value })} value={data.description} required={true} theme={theme} darkMode={darkMode} disable={disable} placeholder='Note: Use <br/> tag to add new line at final representation view.' />
            </div>
            {/* cover img */}
            <div className='col-span-4 flex flex-col w-full'>
              <label className='text-sm md:text-base font-bold' htmlFor='project-description'>Project cover image</label>
              <div className='flex mt-2'>
                <Image src={data.cover} height='100' width='150' alt='dummy' className='rounded-md' />
                <div className='flex flex-col w-full ml-1'>
                  <Textarea autoComplete='off' theme={theme} required={true}
                    darkMode={darkMode} disable={disable} placeholder='Project Cover Image Url.' name='url'
                    value={data.cover}
                    onChange={(e: Event & { target: HTMLTextAreaElement }) => setData({ ...data, cover: e.target.value })}
                  />
                </div>
                <span onClick={() => setData({ ...data, cover: '' })} className={`ml-2 mt-auto text-3xl text-red-600 hover:text-pink-400 ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <MdRestoreFromTrash />
                </span>
              </div>
            </div>
            <div className='col-span-full flex'>
              <h1 className='text-indigo-500'>Used language/framework/tools. Minimum one is required. (ps: add them all, it nos showcase time.) Another one ?</h1>
              <span className='ml-1 text-pink-600 hover:text-cyan-400 hover:underline cursor-pointer' onClick={() => addFiled('tools')}>Click Here</span>
            </div>
            {/* tools */}
            {toolsFields.map((curr, index) => {
              return (
                <div key={index} className='col-span-2 md:col-span-1  flex w-full'>
                  <Input autoComplete='language/framework' theme={theme} required={true} type="text"
                    darkMode={darkMode} disable={disable} placeholder='I used? 🤔' name='name'
                    value={curr.name}
                    onChange={(e: Event & { target: HTMLInputElement }) => handleChange(index, e.target.value, 'tools')}
                  />
                  <span onClick={() => removeField(index, 'tools')} className={`ml-2 mt-auto text-3xl text-red-600 hover:text-pink-400 ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <MdRestoreFromTrash />
                  </span>
                </div>
              )
            })}
            {/* screen  shots */}
            <div className='col-span-full flex'>
              <h1 className='text-indigo-500'>Project Images/screenshot. Minimum one is required. Another one ?</h1>
              <span className='ml-1 text-pink-600 hover:text-cyan-400 hover:underline cursor-pointer' onClick={() => addFiled('img')}>Click Here</span>
            </div>
            {imgFields.map((input, index) => {
              return (
                <div key={index} className='col-span-4 flex w-full'>
                  <Image src={input.url} height='100' width='150' alt='dummy' className='rounded-md' />
                  <div className='flex flex-col w-full ml-1'>
                    <Textarea autoComplete='off' theme={theme} required={true}
                      darkMode={darkMode} disable={disable} placeholder='Project Image Url.' name='url'
                      value={input.url}
                      onChange={(e: Event & { target: HTMLTextAreaElement }) => handleChange(index, e.target.value, 'img')}
                    />
                  </div>
                  <span onClick={() => removeField(index, 'img')} className={`ml-2 mt-auto text-3xl text-red-600 hover:text-pink-400 ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <MdRestoreFromTrash />
                  </span>
                </div>
              )
            })}
            <div className='col-span-full flex justify-center items-center'>
              <button type='submit' className="px-5 py-2.5 relative rounded group font-medium text-white text-lg inline-block">
                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out rounded shadow-2xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-xl from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                <div className="relative flex items-center">
                  <MdUpdate />
                  <span className='ml-2'>Update Project</span>
                </div>
              </button>
            </div>
          </form>
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

export async function getServerSideProps(context: GetServerSidePropsContext<{ providerId: string }>) {

  const { Doc } = context.query;

  type Tem = { [key: string]: string }
  let temp: Tem[] = []
  let temp2: Tem[] = []
  type Tres = { _id: string, name: string, type: string, status: string, role: string, intro: string, liveUrl: string, gitRepo: string, slug: string, description: string, img: Tem[], tools: Tem[], toolsLogo: string[], cover: string }
  let result: Tres

  const response = await axios.post(`${process.env.NEXT_PUBLIC_GET_DOC_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { name: Doc }, { headers: { 'Content-Type': 'application/json' } })
  const serverData = response.data
  serverData['img'].forEach((curr: string) => {
    let newField = { 'url': curr }
    temp.push(newField)
  })
  serverData['tools'].forEach((curr: string) => {
    let newField = { 'name': curr }
    temp2.push(newField)
  })
  result = { _id: serverData['_id'], name: serverData.name, type: serverData.type, status: serverData.status, role: serverData.role, intro: serverData.intro, liveUrl: serverData.liveUrl, gitRepo: serverData.gitRepo, slug: serverData.slug, description: serverData.description, img: temp, tools: temp2, toolsLogo: serverData.toolsLogo, cover: serverData.cover }

  return { props: { DATA: result } }
}

export default Doc