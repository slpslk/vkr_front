import React,{ useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import ModalSettings from './modalSettings.js';
import ModalGatewayDevices from './modalGatewayDevices.js';

function GatewayCard({gateway}) {

  const handleAdding = (event) => {

  };

  return (
    <Card style={{ width: '18rem' }}>

      <Card.Body>
        <Card.Title style={{ display: 'flex', justifyContent: 'space-between' }}>
          {gateway.name} 
          <ModalGatewayDevices gatewayID={gateway.id}/>
          </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{gateway.type}</Card.Subtitle>
        <Card.Text>
          <div>Поддерживаемые версии: {gateway.versions}</div>
        </Card.Text>
        <div style={{  display: 'flex', alignItems: 'flex-end' }}>
          <Button 
            className="ms-2"
            variant="danger"
          >
            Удалить
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default GatewayCard;