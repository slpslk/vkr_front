import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {setUser} from '../../store/slices/userSlice.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AuthForm from './Form.js';



function RegisterForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fullName: '',
    username: '',
    password: ''
  });

  const handleChange= (event) => {
    const { name, value } = event.target;
    setValues({
        ...values,
        [name]: value,
    });
  };

  async function fetchRegister() {
    
    const response = await fetch('http://localhost:8000/auth/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: values.fullName,
        username: values.username,
        password: values.password
      })
    });

    const rawData = await response.json();
    return(rawData)
  }

  const handleRegister = () => {

    fetchRegister()
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
      <AuthForm type='register' values={values} handleChange={handleChange} handleClick={handleRegister}/>
    </>
  );
}

export default RegisterForm;