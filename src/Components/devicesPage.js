import React,{ useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ModalDevice from "../Components/modalMakeDevice.js";
import ModalDevicesSwitch from './modalDevicesSwitch.js';
import DeviceCard from './deviceCard.js';

//TODO: открывание окна создания устройства заново

function DevicePage() {

  const [creatingParams, setCreatingParams] = useState({
    name: "",
    type: "",
  });

  const [devices, setDevices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [devicesIsEmpty, setDevicesIsEmpty] = useState(true);
  const [devicesIsChanged, setIsChanged] = useState(false);

  async function fetchDevices() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/devices', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const rawData = await response.json();
    setDevices(JSON.parse(rawData))

    setIsLoading(false);
  }

  React.useEffect(() => { 
    if (devices === null) {
      setDevicesIsEmpty(true);
    }
    else {
      setDevicesIsEmpty(false);
    }
    console.log(devices)
  }, [devices]);


  // React.useEffect(() => { 
  //   fetchDevices()   
  // }, [devicesIsChanged]);



  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && devicesIsEmpty &&
        <div className="empty">
          Вы не создали ни одного устройства
          <ModalDevice method={setCreatingParams} />
          <ModalDevicesSwitch name={creatingParams.name} type={creatingParams.type} saved={setIsChanged}/>
        </div>
      }

      {!isLoading && !devicesIsEmpty &&
        <>
          <Row>
            <Col><DeviceCard device={devices[0]}/></Col>

          </Row>

        </>

      }

    </>
  );
}

export default DevicePage;