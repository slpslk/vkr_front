import React,{ useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
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
  const [deviceError, setDeviceError] = useState(null);

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
  }, [devices]);


  React.useEffect(() => { 
    fetchDevices()   
  }, [devicesIsChanged]);



  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && devicesIsEmpty && (
        <div className="empty">
          Вы не создали ни одного устройства
          <ModalDevice mode={devicesIsEmpty} method={setCreatingParams} />
          <ModalDevicesSwitch
            reset={setCreatingParams}
            name={creatingParams.name}
            type={creatingParams.type}
            change={devicesIsChanged}
            saved={setIsChanged}
          />
        </div>
      )}

      {!isLoading && !devicesIsEmpty && (
        <>
          <Row>
            {devices.map((curr) => (
              <Col className="mb-3">
                <DeviceCard device={curr} error={setDeviceError} />
              </Col>
            ))}
          </Row>

          {deviceError !== null &&
            <Alert style={{position: 'absolute', right: "20px", bottom: "0px"}} variant="danger" onClose={() => setDeviceError(null)} dismissible>
              <Alert.Heading>Произошла ошибка при подключении</Alert.Heading>
                <p>
                  {deviceError}
                </p>
            </Alert>
          }
          <ModalDevice mode={devicesIsEmpty} method={setCreatingParams} />
          <ModalDevicesSwitch
            reset={setCreatingParams}
            name={creatingParams.name}
            type={creatingParams.type}
            change={devicesIsChanged}
            saved={setIsChanged}
          />
        </>
      )}
    </>
  );
}

export default DevicePage;