import { createContext, useContext, ReactNode } from "react";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/src/Firebase";

interface Idata { name: string, type: string, status: string, role: string, intro: string, liveUrl: string, gitRepo: string, description: string, img: string[], tools: string[], toolsLogo: string[], cover: string }

// hl4 add doc  
async function addDoc(data: Idata, setError: any, setDisable: any) {
  await axios.post(`${process.env.NEXT_PUBLIC_ADD_DOC_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { ...data }, { headers: { 'Content-Type': 'application/json' } }).then((response) => {
    const status = response.status;
    const data = response.data;
    if (status.toString() === '200') {
      setError(data.success)
      setTimeout(() => {
        window.location.replace('/admin')
      },3000)
    }
  }).catch((error) => {
    setError('Check Console')
    console.log(error)
  }).finally(() => {
    setDisable(false)
  })
}
// hl3 update doc 
async function updateDoc(data: Idata, setError: any, setDisable: any) {
  await axios.post(`${process.env.NEXT_PUBLIC_UPDATE_DOC_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { ...data }, { headers: { 'Content-Type': 'application/json' } }).then((response) => {
    const status = response.status;
    const data = response.data;
    if (status.toString() === '200') {
      setError(data.success)
    }
  }).catch((error) => {
    const status = error.response.status;
    const data = error.response.data;
    console.log(status, data)
  }).finally(() => {
    setDisable(false)
    setTimeout(() => {
      window.location.replace('/admin')
    },3000)
  })
}
// hl5 delete doc
async function deleteDoc(ans: string, setError: any) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DELETE_DOC_API}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { name: ans }, { headers: { 'Content-Type': 'application/json' } })
    const data = response.data
    if (response['status'].toString() === '200') {
      setError(data.success)
      window.location.replace('/admin')
    }
  } catch (err) {
    setError('Check Console')
    console.log(err)
  }
}
// hl1 upload file in storage 
interface manageDbArgs { url: string, fileName: string, projectName: string, setMsg: any, setError: any, setDisable: any, reDownloadImages: any }
async function manageDb(args: manageDbArgs) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_ADD_CLOUD_IMG}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, { url: args.url, imgName: args.fileName, projectName: args.projectName }, { headers: { 'Content-Type': 'application/json' } })
        const data = response.data;
        if (response['status'].toString() === '201') {
            args.setError(data.success)
        }
    } catch (err) {
        console.log(err)
    }
    args.setMsg('Upload Successful ❤️')
    args.reDownloadImages()
    args.setDisable(false)
}
function cloudStorage (projectName: string, file: File, setMsg: any, setDisable: any, setAnsLink: any, setError: any,reDownloadImages: any) {
  const fileName = `${projectName}_${file.name}`
  const storageRef = ref(storage, `${projectName}/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', (snapshot) => {
      switch (snapshot.state) {
          case 'paused':
              setMsg('Upload is paused 😠💢');
              break;
          case 'running':
              setMsg('Upload is running 🚴🚴');
              break;
          default:
              break;
      }
  }, (err) => {
      setMsg(false)
      alert(err);
      setDisable(false)
  }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAnsLink(downloadURL)
          manageDb({ url: downloadURL, fileName, projectName, setMsg, setError, setDisable,  reDownloadImages })
      })
  })
}

//hl5 delete from db and cloud 
interface deleteCloudImgArgs { projectName: string, imgName: string, url:string, reDownloadImages: any, setError: any}
async function deleteCloudImg (args: deleteCloudImgArgs) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DELETE_CLOUD_IMG}?apiKey=${process.env.NEXT_PUBLIC_DB_KEY}`, {url: args.url}, {headers: { 'Content-Type': 'application/json' }})
    const d = response.data;
    if(response['status'].toString() === '200') {
      const desertRef = ref(storage, `${args.projectName}/${args.imgName}`);
      deleteObject(desertRef).then(async () => {
        args.setError(d.success)
        await args.reDownloadImages()
      }).catch((error) => {
        alert("Failed to delete from storage 😠😠😠")
        console.log(error)
      });
    }
  } catch (error) {
    args.setError('Check Console')
    console.log(error)
  } 
}

const defaultCtx = { addDoc, updateDoc, deleteDoc, cloudStorage, deleteCloudImg }
const FunctionContext = createContext(defaultCtx)

export function useFunction() {
  return useContext(FunctionContext);
}

export function FunctionProvider({ children }: { children: ReactNode }) {
  const value = { addDoc, updateDoc, deleteDoc, cloudStorage, deleteCloudImg }
  return (
    <FunctionContext.Provider value={value}>
      {children}
    </FunctionContext.Provider>
  )
}