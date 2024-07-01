import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {setUser} from '../../store/slices/userSlice.js';
import Alert from 'react-bootstrap/Alert';
import AuthForm from './Form.js';

function LoginForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(null);

  const handleChange= (event) => {
    const { name, value } = event.target;
    setValues({
        ...values,
        [name]: value,
    });
  };

  async function fetchLogin() {
    
    const response = await fetch('http://localhost:8000/auth/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password
      })
    });

    
    const rawData = await response.json();
    if (!response.ok) {
      setError(rawData.message)
      return(rawData)
    }
    else{
      return(rawData)
    }
  }

  const handleLogin = () => {

    fetchLogin()
      .then((user) => {
        console.log(user);
        dispatch(setUser({
          fullName: user.fullName,
          username: user.username,
          token: user.token,
        }))
        navigate('/');
      })
      .catch(console.error)
}


  return (
    <>
      <AuthForm type='login' values={values} handleChange={handleChange} handleClick={handleLogin}/>
      {error !== null && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Произошла ошибка при подключении</Alert.Heading>
              <p>{error}</p>
            </Alert>
      )}
    </>
  );
}

export default LoginForm;