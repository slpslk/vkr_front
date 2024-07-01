import {Navigate} from "react-router-dom";
import {useAuth} from '../hooks/use-auth.js'


const Home = () => {

  const {isAuth, fullName} = useAuth();

  return isAuth ? (
    <Navigate to="/devices" />
  ):(
    <Navigate to="/login" />
  );
}

export default Home;