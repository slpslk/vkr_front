import {Link} from "react-router-dom";
import LoginForm from "../Components/auth/loginForm.js";

const Login = () => {

  return (
    <>
      <div className="authPage">
        <h1>Вход</h1>
        <LoginForm />
        <p>
          Нет акаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>
      </div>
    </>
  );
}

export default Login;