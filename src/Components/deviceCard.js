import React,{ useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ModalSettings from './modalSettings.js';

function DeviceCard({device}) {

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [deviceIsWorking, setDeviceIsWorking] = useState(false);

  async function turnOnDevice() {
    setIsLoading(true);

    const response = await fetch(`http://localhost:8000/api/devices/temperature/${device.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          control: !deviceIsWorking
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    
    setIsLoading(false);
  }


  const handleTurn = (event) => {
    setDeviceIsWorking(!deviceIsWorking)
    turnOnDevice()
  };


  return (
    <Card style={{ width: '18rem' }}>

      <Card.Body>
        <Card.Title style={{ display: 'flex', justifyContent: 'space-between' }}> {device.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Офлайн</Card.Subtitle>
        <Card.Text>
          
        </Card.Text>
        <div style={{  display: 'flex', alignItems: 'flex-end' }}>
          <ModalSettings />
          <Button 
            className="ms-2"
            variant={deviceIsWorking ? "danger" : "success"}
            onClick={handleTurn}
          >
            {!deviceIsWorking && 'Включить'}
            {deviceIsWorking && 'Отключить'}
          </Button>
        </div>
        {console.log(device)}
      </Card.Body>
    </Card>
  );
}

export default DeviceCard;