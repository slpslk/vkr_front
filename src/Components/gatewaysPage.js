import React,{ useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ModalGateway from './modalMakeGateway.js';
import GatewayCard from './gatewayCard.js';

//TODO: открывание окна создания устройства заново

function GatewaysPage() {

  const [gateways, setGateways] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gatewaysIsEmpty, setGatewaysIsEmpty] = useState(true);
  const [gatewaysIsChanged, setIsChanged] = useState(false);

  async function fetchGateways() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/gateways', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const rawData = await response.json();
    setGateways(JSON.parse(rawData))

    setIsLoading(false);
  }

  React.useEffect(() => { 
    if (gateways === null) {
      setGatewaysIsEmpty(true);
    }
    else {
      setGatewaysIsEmpty(false);
    }
    console.log(gateways)
  }, [gateways]);


  React.useEffect(() => { 
    fetchGateways()   
  }, [gatewaysIsChanged]);



  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && gatewaysIsEmpty && (
        <div className="empty">
          Вы не создали ни одного шлюза
          <ModalGateway saved={setIsChanged} />
        </div>
      )}
      {!isLoading && !gatewaysIsEmpty && (
        <>
          <Row>
            <Col>
              <GatewayCard gateway={gateways[0]}/>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default GatewaysPage;