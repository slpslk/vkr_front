import React,{ useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../hooks/use-auth';

function SettingsRightech() {

  const {token} = useAuth();
  const [userAPI, setUserAPI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [apiIsSaved, setApiIsSaved] = useState(false);

  async function addUserAPI() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/user/tokenAPI', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        api: userAPI
      }),
    });

    const rawData = await response.json();
    console.log(rawData)

    setIsLoading(false);
  }

  async function getUserAPI() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/user/tokenAPI', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
    });

    const rawData = await response.json();
    console.log(rawData)

    if(response.ok) {
      setApiIsSaved(true)
    }
    else {
      setApiIsSaved(false)
    }

    setIsLoading(false);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setUserAPI(value);
  };
  

  const handleSubmit = () => { 
    setValidated(true)
    if(userAPI !== null)
    {
      setApiIsSaved(true)
      addUserAPI()
    }
  }


  useEffect (() => {
    getUserAPI()
  }, [])

  return (
    <>
      <section style={{marginBottom: '30px'}}>
        <h4>Rightech IOT Cloud</h4>
        <p>Чтобы использовать платформу укажите свой API токен ниже</p>

        <Form noValidate validated={validated}>
          {isLoading && (
            <div className='centeredMain'> 
              <Spinner variant="primary" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {!isLoading && apiIsSaved && (
            <Button onClick={() => setApiIsSaved(false)}>Изменить</Button>
          )}
          {!isLoading && !apiIsSaved && (
            <Row className="align-items-center">
              <Col xs="4">
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={apiIsSaved ? "API Токен" : userAPI}
                  onChange={handleChange}
                  placeholder="API Токен"
                  autoFocus
                />
              </Col>
              <Col xs="auto">
                <Button onClick={handleSubmit}>Сохранить</Button>
              </Col>
            </Row>
          )}
        </Form>
      </section>
    </>
  );
}

export default SettingsRightech;