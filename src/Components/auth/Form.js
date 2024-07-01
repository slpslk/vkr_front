import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AuthForm({type, values, handleChange, handleClick}) {

  return (
    <>
        <Form style={{width: '25%', display: 'flex', flexDirection: 'column'}}>
          { type == 'register' &&
            <Form.Group className="mb-3" controlId="userfullname">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                required
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
              />
              {/* <Form.Control.Feedback type="invalid">
              Введите корректное имя!
            </Form.Control.Feedback> */}
            </Form.Group>
          }
  
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              required
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
            {/* <Form.Control.Feedback type="invalid">
              Введите корректное имя!
            </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group className="mb-3" controlId="pswd">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {/* <Form.Control.Feedback type="invalid">
              Введите корректное имя!
            </Form.Control.Feedback> */}
          </Form.Group>
          <Button style={{margin: '20px 0'}} variant="primary" onClick={handleClick}>
            {type == 'login'? 'Войти' : 'Зарегистрироваться'}
          </Button>          
        </Form>
    </>
  );
}

export default AuthForm;