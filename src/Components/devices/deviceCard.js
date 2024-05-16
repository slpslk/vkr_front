import React,{ useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ModalSettings from './sensors/modalSettings.js';
import CardSubtitle from 'react-bootstrap/esm/CardSubtitle.js';

function DeviceCard({device, error, change, saved, deleted}) {

  const notations = {
    temperature: "°",
    humidity: "%",
    lighting: "лк"
  }


  const [isLoading, setIsLoading] = useState(false);
  const [deviceKind, setDeviceKind] = useState(() => {
    if (device.type == 'temperature' || device.type == 'humidity' || device.type == 'gas' || device.type == 'lighting' ) {
      return 'sensor'
    }
    else if (device.type == 'lamp'){
      return 'controlled'
    }
  });
  const [controlledStatus, setControlledStatus] = useState(false);
  const [deviceIsWorking, setDeviceIsWorking] = useState(false);
  const [currentValue, setCurrentValue] = useState();
  const intervalID = useRef(0)
  
  async function turnOnDevice() {
    setIsLoading(true);

    const response = await fetch(`http://localhost:8000/api/devices/${device.id}`, {
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
    if(response.ok){
      if(deviceIsWorking) {
        setControlledStatus(false);
      }
      setDeviceIsWorking(!deviceIsWorking)
      setIsLoading(false);
    }
    else {
      error(data.error)
      setIsLoading(false);
    }
  }

  async function fetchReconnect() {
    setIsLoading(true);

    setTimeout (async () => {
      const response = await fetch(`http://localhost:8000/api/devices/${device.id}/reconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },  
      }
    );

    const data = await response.json();

    if(response.ok){
      setDeviceIsWorking(true)
      setIsLoading(false);
    }
    else {
      error(data.error)
      setIsLoading(false);
    }
    }, 5000) 
  }

  async function fetchControlledTurning() {

    const response = await fetch(`http://localhost:8000/api/devices/${device.id}/turn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: !controlledStatus
        }),
      }
    );

    const data = await response.json();
    if(response.ok){
      setControlledStatus(!controlledStatus)
    }
    else {
      error(data.error)
    }
  }
  
  async function fetchCurrentValue(refreshingFetch) {
    const response = await fetch(`http://localhost:8000/api/devices/${device.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    
      });
      const data = await response.json();
      console.log("timer fetch")
      console.log(deviceIsWorking)
      console.log(data.online)
      console.log(refreshingFetch)
      if(deviceIsWorking && !data.online && refreshingFetch == null){
        setDeviceIsWorking(false)
        error("Устройство вышло из строя (наработка на отказ). Восстанавливаем работу устройства ")
        if(device.reconnectingOption){
          await fetchReconnect()
        }
      }
      else {
        setCurrentValue(data.currentData);
      }
  }

  const refreshValue = async () => {
    if(deviceIsWorking) {
      await fetchCurrentValue(true)
    }
    else {
      setCurrentValue(null);      
    }
    
  };


  useEffect(()=> {

    refreshValue();

    if (deviceIsWorking && intervalID.current == 0) {
      console.log("создали интервал")
      intervalID.current = setInterval(async () => {
        console.log("интервал сработал")
        await fetchCurrentValue(currentValue)
      }, device.sendingPeriod);
      console.log(intervalID.current)
    }
    // else {
    //   console.log("стоп интервал else")
    //   clearInterval(intervalID.current);
    //   intervalID.current = 0;
    // }
    
    return () => {
      console.log("стоп интервал return")
      clearInterval(intervalID.current);
      console.log(intervalID.current)
      intervalID.current = 0;
      console.log(intervalID.current)
    }

  },[deviceIsWorking])

  const handleTurn = async () => {
    await turnOnDevice()
  };

  const handlePower = async () => {
    await fetchControlledTurning()
  }


  return (
    <Card style={{ width: '18rem' }}>
      {isLoading && <div>Loading...</div>}
      {!isLoading && 
      <Card.Body >
        <div className="mb-2" style={{  display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Card.Title> {device.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{device.type}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              {deviceIsWorking ? "Онлайн" :"Офлайн"}
            </Card.Subtitle>
          </div>
          {deviceIsWorking && deviceKind == "sensor" &&
            <div className="deviceValue">
              {currentValue}{notations[device.type]}
            </div>
          }
          {deviceKind == "controlled" && 
            <Button 
              disabled={!deviceIsWorking}
              className="rounded-circle powerButton" 
              variant={controlledStatus ? "outline-danger" : "outline-success"}
              onClick={handlePower}
            >
              <i class=" fa fa-power-off"></i>
            </Button>
          }
        </div>
          
        <div style={{  display: 'flex', justifyContent: 'flex-end' }}>
          <ModalSettings device={device} change={change} saved={saved} deleted={deleted}/>
          <Button 
            className="ms-2"
            variant={deviceIsWorking ? "danger" : "success"}
            onClick={handleTurn}
          >
            {!deviceIsWorking && 'Включить'}
            {deviceIsWorking && 'Отключить'}
          </Button>
        </div>
      </Card.Body>
      }
    </Card>
  );
}


export default DeviceCard;