import React,{ useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAuth } from '../../hooks/use-auth';

function SettingsPersonal() {

  const {token} = useAuth();
  
  const [userBroker, setUserBroker] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [brokerExists, setBrokerExists] = useState(false);
  const [brokerWorking, setBrokerWorking] = useState(false);

  const handleChange= (event) => {
    const { value } = event.target;
    setUserBroker({
        ...userBroker,
        'password': value,
    });
  };

  async function addUserBroker() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/user/broker', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        psswd: userBroker.password
      }),
    });

    const rawData = await response.json();
    setUserBroker(rawData);
    setBrokerExists(true);
    setBrokerWorking(true);

    setIsLoading(false);
  }

  async function getUserBroker() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/user/broker', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
    });

    const rawData = await response.json();
    console.log(rawData)

    if(response.ok) {
      setBrokerExists(true)
      setUserBroker(rawData)
    }
    else {
      setBrokerExists(false)
    }

    setIsLoading(false);
  }

  async function controlUserBroker() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/user/broker/control', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        control: !brokerWorking
      }),
    });

    const rawData = await response.json();
    console.log(rawData)

    if(response.ok ) {
      brokerWorking ? setBrokerWorking(false) : setBrokerWorking(true)
    }

    setIsLoading(false);
  }

  const handleTurn = () => {
    controlUserBroker()
  }
  
  const handleCreate = () => { 
    addUserBroker();
  }


  useEffect (() => {
    getUserBroker()
  }, [])

  return (
    <>
      <section>
        <h4>Персональный брокер</h4>
        {!isLoading && !brokerExists &&
          <p>Вы можете создать и использовать личный брокер. Задайте пароль для авторизации устройств.</p>
        }
        {!isLoading && brokerExists &&
          <p>Вы уже создали брокер. Запустите его!</p>
        }

        <Form noValidate>
          {isLoading && (
            <div className="centeredMain">
              <Spinner variant="primary" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {!isLoading && brokerExists && (
            <Row className="align-items-center">
              <Col sm={4}>
                <ListGroup>
                  <ListGroup.Item>Username: {userBroker.username}</ListGroup.Item>
                  <ListGroup.Item>Password: {userBroker.password}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col>
                <Button variant={brokerWorking? 'outline-danger' : 'success'} onClick={handleTurn}>{brokerWorking ? 'Отключить' : 'Запустить'}</Button>
              </Col>
            </Row>
          )}
          {!isLoading && !brokerExists && (
            <Row className="align-items-center">
              <Col xs="4">
                <Form.Control
                  required
                  type="text"
                  name="password"
                  value={userBroker.password}
                  onChange={handleChange}
                  placeholder="Пароль для подключения к брокеру"
                  autoFocus
                />
              </Col>
              <Col xs="auto">
                <Button onClick={handleCreate}>Создать</Button>
              </Col>
            </Row>
          )}
        </Form>
      </section>
    </>
  );
}

export default SettingsPersonal;