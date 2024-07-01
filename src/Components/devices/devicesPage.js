import React,{ useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import ModalDevice from "./modalMakeDevice.js";
import ModalDevicesSwitch from './modalDevicesSwitch.js';
import DeviceCard from './deviceCard.js';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../hooks/use-auth.js';

//TODO: открывание окна создания устройства заново

function DevicePage() {
  const {token} = useAuth();

  const [creatingParams, setCreatingParams] = useState({
    name: "",
    type: "",
  });

  const [devices, setDevices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [devicesIsEmpty, setDevicesIsEmpty] = useState(true);
  const [devicesIsChanged, setIsChanged] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const [creatingError, setCreatingError] = useState(null);

  async function fetchDevices() {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/api/devices', {
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      }
    });

    const rawData = await response.json();
    setDevices(JSON.parse(rawData))

    setIsLoading(false);
  }

  const deleteDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id))
  }

  useEffect(() => { 
    if (devices === null || devices.length == 0) {
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
      {isLoading && (
        <div className="centeredMain">
          <Spinner variant="primary" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
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
            error={setCreatingError}
          />
        </div>
      )}

      {!isLoading && !devicesIsEmpty && (
        <>
          <Row>
            {devices.map((curr) => (
              <Col className="mb-3">
                <DeviceCard
                  device={curr}
                  error={setDeviceError}
                  change={devicesIsChanged}
                  saved={setIsChanged}
                  deleted={deleteDevice}
                />
              </Col>
            ))}
          </Row>

          {deviceError !== null && (
            <Alert
              style={{ position: "absolute", right: "20px", bottom: "0px" }}
              variant="danger"
              onClose={() => setDeviceError(null)}
              dismissible
            >
              <Alert.Heading>Произошла ошибка при подключении</Alert.Heading>
              <p>{deviceError}</p>
            </Alert>
          )}
          <ModalDevice mode={devicesIsEmpty} method={setCreatingParams} />
          <ModalDevicesSwitch
            reset={setCreatingParams}
            name={creatingParams.name}
            type={creatingParams.type}
            change={devicesIsChanged}
            saved={setIsChanged}
            error={setCreatingError}
          />
        </>
      )}
          {creatingError !== null && (
            <Alert
              style={{ position: "absolute", right: "20px", bottom: "0px" }}
              variant="danger"
              onClose={() => setCreatingError(null)}
              dismissible
            >
              <Alert.Heading>Произошла ошибка при создании</Alert.Heading>
              <p>{creatingError}</p>
            </Alert>
          )}
    </>
  );
}

export default DevicePage;