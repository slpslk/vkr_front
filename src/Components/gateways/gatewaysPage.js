import React,{ useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import ModalGateway from './modalMakeGateway.js';
import GatewayCard from './gatewayCard.js';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../hooks/use-auth.js';

//TODO: открывание окна создания шлюза заново
//TODO: передавать isempty в карточки, чтобы отслеживать пустой массив....

function GatewaysPage() {

  const {token} = useAuth();
  
  const [gateways, setGateways] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gatewaysIsEmpty, setGatewaysIsEmpty] = useState(true);
  const [gatewaysIsChanged, setIsChanged] = useState(false);

  async function fetchGateways() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/gateways', {
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      }
    });

    const rawData = await response.json();
    setGateways(JSON.parse(rawData))

    setIsLoading(false);
  }

  const deleteGateway = (id) => {
    setGateways(gateways.filter(gateway => gateway.id !== id))
  }

  useEffect(() => { 
    if (gateways === null || gateways.length == 0) {
      setGatewaysIsEmpty(true);
    }
    else {
      setGatewaysIsEmpty(false);
    }
    console.log(gateways)
  }, [gateways]);

  async function getGateways() {
    await fetchGateways();
  }

  useEffect(() => { 
    getGateways();
    console.log(gateways)
  }, [gatewaysIsChanged]);



  return (
    <>
      {isLoading && (
        <div className='centeredMain'>
          <Spinner variant="primary" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {!isLoading && gatewaysIsEmpty && (
        <div className="empty">
          Вы не создали ни одного шлюза
          <ModalGateway
            mode={gatewaysIsEmpty}
            change={gatewaysIsChanged}
            saved={setIsChanged}
          />
        </div>
      )}
      {!isLoading && !gatewaysIsEmpty && (
        <>
          <Row>
            {gateways.map((curr) => (
              <Col className="mb-3">
                <GatewayCard
                  gateway={curr}
                  deleted={deleteGateway}
                  change={gatewaysIsChanged}
                  saved={setIsChanged}
                />
              </Col>
            ))}
          </Row>

          <ModalGateway
            mode={gatewaysIsEmpty}
            change={gatewaysIsChanged}
            saved={setIsChanged}
          />
        </>
      )}
    </>
  );
}

export default GatewaysPage;