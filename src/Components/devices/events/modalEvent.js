import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useAuth } from '../../../hooks/use-auth';

function ModalEvents(props) {
  const {token} = useAuth();
  const [show, setShow] = useState(false);
  const eventableTypes = ['noise'];
  
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [devices, setDevices] = useState(null);
  const [isEmpty, setIsEmpty] =  useState(true);

  async function fetchDevices() {

    const response = await fetch('http://localhost:8000/api/devices', {
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      }
    });

    const rawData = await response.json();
    const rawDevices = JSON.parse(rawData)
    console.log(rawDevices)
    if(rawDevices != null){
    const eventableDevices = rawDevices.filter((device) => 
      eventableTypes.includes(device.type)
    )

    console.log(eventableDevices)
    setDevices(eventableDevices)
  }

  }

  async function fetchEvent(device) {

    const response = await fetch(`http://localhost:8000/api/devices/${device.id}/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        eventType: device.type,
      }),
    });

    const rawData = await response.json();
    console.log(rawData)

  }

  const makeEvent = async (device) => {
    await fetchEvent(device);
  }

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
      <Button variant="primary" onClick={handleShow}>
        События
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Новое событие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Form.Group>
              {!isEmpty && (
                <ListGroup style={{ overflow: "auto", height: "200px" }}>
                  {devices.map((device) => (
                    <ListGroup.Item>
                      <Row className="align-items-center">
                        <Col sm="3">
                          {device.name}
                          <Badge className="ms-3" bg="primary">
                            {device.type}
                          </Badge>
                        </Col>
                        <Col>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {makeEvent(device)}}
                          >
                            Сгенерировать событие
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalEvents;