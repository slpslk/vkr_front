import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import ModalConnectDevice from './modalConnectDevice.js';


function ModalGatewayDevices({gatewayID}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [gatewayDevices, setGatewayDevices] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  
  async function fetchGatewayDevices() {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/gateways/${gatewayID}/devices`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const rawData = await response.json();
    // console.log(rawData)
    setGatewayDevices(JSON.parse(rawData))

    setIsLoading(false);
  }

  const handleClick = () => {
    setShowConnect(true);
    handleClose()
  };

  useEffect(() => { 
    if (gatewayDevices.length === 0) {
      setIsEmpty(true);
    }
    else {
      setIsEmpty(false);
    }
    // console.log(gatewayDevices)
  }, [gatewayDevices]);

  useEffect(() => { 
    fetchGatewayDevices()
  }, [isChanged]);

  return (
    <>
      <Button
        style={{ borderColor: "black" }}
        variant="light"
        onClick={handleShow}
      >
        +
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Подключенные устройства</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Form.Group>
              {isEmpty && (
                <Stack gap={2} className="col-md-5 mx-auto">
                  <Form.Label>Нет подключенных устройств</Form.Label>
                  <ModalConnectDevice gatewayID={gatewayID} saved={setIsChanged}/>
                </Stack>
              )}
              {!isEmpty && (
                <ListGroup style={{ overflow: "auto", height: "200px" }}>
                  {gatewayDevices.map((device) => (
                    <ListGroup.Item>
                      {device.name}
                      <Badge style={{}} bg="primary">
                        {device.physicalProtocol}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>

            {/* <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Выберите устройство для подключения</Form.Label>
              <Form.Select required name="type">
                <option value="">Первое устройство</option>
                <option value="ethernet">Второе устройство</option>
                <option value="wifi">Третье устройство</option>
                <option value="ble">Четвертое устройство</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Выберите тип!
              </Form.Control.Feedback>
            </Form.Group> */}
          </Form>
        </Modal.Body>
        {!isEmpty && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default ModalGatewayDevices;