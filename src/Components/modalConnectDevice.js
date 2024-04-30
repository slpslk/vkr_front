import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

function ModalConnectDevice({gatewayID, change, saved}) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] =  useState(true);
  const [validated, setValidated] = useState(false);
  const [devices, setDevices] = useState(null);
  const [error, setError] = useState(null);
  const [device, setDevice] = useState(
    {
      id: '',
      distance: 0
    }
  );


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

  async function fetchConnect() {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/gateways/${gatewayID}/add`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceID: device.id,
        distance: device.distance
      })
    });

    const rawData = await response.json();

    if (response.ok) {
      console.log(rawData);
      setError(null);
      setIsLoading(false);
      return true;
    }
    else {
      setError(rawData.error)
      setIsLoading(false);
      return false;
    }
  }

  const handleSave = () => {
      saved(!change);
      handleClose();
  };

  async function connectDevice() {   
    if(device.id !== '' && device.distance != 0)
    {
      if(await fetchConnect()) {
        handleSave();
      }
    }
  }


  const handleChange= (event) => {
    const { name, value } = event.target;
    setDevice({
        ...device,
        [name]: value,
    });
  };

  const handleSubmit = () => {
    setValidated(true);
    connectDevice();   
  };

  useEffect(() => { 
    if (devices === null) {
      setIsEmpty(true);
    }
    else {
      setIsEmpty(false);
    }
    console.log(devices)
  }, [devices]);


  useEffect(() => { 
    fetchDevices()   
  }, []);


  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Подключить устройство
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Подключение устройства</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEmpty && (
            <p>
              Вы не создали ни одного устройства. Перейдите на страницу
              устройств, чтобы создать новое.
            </p>
          )}
          {!isEmpty && (
            <Form noValidate validated={validated}>
              <Form.Group className="mb-3" controlId="connec">
                <Form.Label>Выберите устройство</Form.Label>
                <Form.Select
                  required
                  name="id"
                  value={device.id}
                  onChange={handleChange}
                >
                  <option value=""> - </option>

                  {devices.map((device) => (
                    <option value={device.id}>
                      {device.name} <p>Protocol: {device.physicalProtocol}</p>
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
              <Form.Label>Расстояние до устройства</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="метры"
                  name="distance"
                  value={device.distance}
                  onChange={handleChange}
                  min="1"
                />
                <Form.Control.Feedback type="invalid">
                  Укажите расстояние!
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          )}
          {error !== null && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
            <Alert.Heading>Произошла ошибка при подключении</Alert.Heading>
              <p>
                {error}
              </p>
          </Alert>
          )}
          
        </Modal.Body>
        {!isEmpty && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Подключить
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default ModalConnectDevice;