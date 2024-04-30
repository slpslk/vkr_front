import React,{ useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function SettingsPage() {

  const [userAPI, setUserAPI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [apiIsSaved, setApiIsSaved] = useState(false);

  async function fetchUserAPI() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/user/tokenAPI', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api: userAPI
      }),
    });

    const rawData = await response.json();
    console.log(rawData)

    setIsLoading(false);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setUserAPI(value);
  };
  

  const handleSubmit = (event) => { 
    setValidated(true)
    if(userAPI !== null)
    {
      setApiIsSaved(true)
      fetchUserAPI()
    }
  }

  return (
    <>
      <section>
        <Form noValidate validated={validated} >
          <h4>Rightech IOT Cloud</h4>
          <p>Чтобы использовать платформу укажите свой API токен ниже</p>
          <Row className="align-items-center">
              <Col>
              <Form.Control
                disabled={apiIsSaved}
                required
                type="text"
                name="name"
                value={apiIsSaved ? "API Токен" : userAPI}
                onChange={handleChange}
                placeholder="API Токен"
                autoFocus
              />
              </Col >
            <Col xs="auto"><Button disabled={apiIsSaved} onClick={handleSubmit}>Сохранить</Button></Col>
          </Row>
        </Form>
      </section>
    </>
  );
}

export default SettingsPage;