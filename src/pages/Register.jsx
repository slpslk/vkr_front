import {Link} from "react-router-dom";
import RegisterForm from "../Components/auth/registerForm.js";

const Register = () => {

  return (
    <>
      <div className="authPage">
        <h1>Регистрация</h1>
        <RegisterForm />
        <p>
          Уже есть аккаунт? <Link to="/login">Вход</Link>
        </p>
      </div>
    </>
  );
}

export default Register;