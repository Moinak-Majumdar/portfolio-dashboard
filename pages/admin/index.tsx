import { useAuthState } from 'react-firebase-hooks/auth';
import axios from "axios";
import Head from 'next/head'
import DashboardNavbar from '../../components/admin/DashboardNavbar'
import DocCard from '../../components/admin/DocCard';
import { auth } from '../../src/Firebase';
import Login from '../../components/admin/Login';
import Loading from '../../components/admin/Loading';
import Err from '../../components/admin/Err';

const landing = ({ darkMode, theme, projects }) => {

  const [user, loading, error] = useAuthState(auth);
  
  if(loading) {
    return(
      <Loading darkMode={darkMode}/>
    )
  }
  if(error) {
    return(
      <Err darkMode={darkMode} error={error}/>
    )
  }
  if(user) {
    return (
      <>
        <Head>
          <title>My babies 😈😈😈</title>
        </Head>
        <DashboardNavbar />
        <section className={`myContainer py-[4rem] ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          <div className='md:p-2 mt-8 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 '>
            {projects.map((curr, i) => {
              return (
                <DocCard key={i} data={curr} darkMode={darkMode} />
              )
            })}
          </div>
        </section>
      </>
    )
  }
  return(
    <>
      <Login darkMode={darkMode} theme={theme}/>
    </>
  )
}

export async function getServerSideProps() {

  let data = []
  const option = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_GET_ALL_DOC_API,
    params: {
      apiKey: process.env.NEXT_PUBLIC_DB_KEY,
    },
    headers: { 'Content-Type': 'application/json' },
  };
  
  await axios.request(option).then((response) => {
    data = response.data
  }).catch((error) => {
    console.error(error);
  });

  return { props: { projects: data } }
}

export default landing