import React,{ useState, useEffect, version } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import ModalSettings from './modalSettings.js';
import ModalGatewaySettings from './modalGatewaySettings.js';

function GatewayCard({gateway, deleted, change, saved}) {

  const [isLoading, setIsLoading] = useState(false);


  async function deleteGateway() {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/gateways`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gatewayID: gateway.id
      })
    });

      const rawData = await response.json();
      console.log(rawData);

      setIsLoading(false);
  }

  const handleDelete = async () => {
    await deleteGateway();
    deleted(gateway.id)
  };

  return (
    <Card style={{ width: '18rem' }}>

      <Card.Body>
        <Card.Title style={{ display: 'flex', justifyContent: 'space-between' }}>
          {gateway.name} 
          <ModalGatewaySettings gateway={gateway} change={change} saved={saved}/>
          </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{gateway.type}</Card.Subtitle>
        <Card.Text>
          {gateway.type != 'ethernet' &&
            <div>Поддерживаемые версии: {gateway.versions.join(', ')}</div>
          }
        </Card.Text>
        <div style={{  display: 'flex', alignItems: 'flex-end' }}>
          <Button 
            className="ms-2"
            variant="danger"
            onClick={handleDelete}
          >
            Удалить
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default GatewayCard;