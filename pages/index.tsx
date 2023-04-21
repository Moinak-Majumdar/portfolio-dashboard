import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../src/Firebase';
import Loading from '../components/admin/Loading';
import Err from '../components/admin/Err';
import Login from '../components/admin/Login';

interface props {
  darkMode : boolean,
  theme : {
    name : string,
    val: string
  }
}
const landing = ({ darkMode, theme }:props) => {

  const [user, loading, error] = useAuthState(auth);
  const router = useRouter()

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
    router.push('/admin')
  }
  return(
    <>
      <Login darkMode={darkMode} theme={theme} />
    </>
  )
}
export default landing