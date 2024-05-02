import { useState, useEffect, version } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ModalConnectDevice from './modalConnectDevice.js';


function ModalGatewaySettings({gateway}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [gatewayDevices, setGatewayDevices] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [choosenVer, setChoosenVer] = useState(() => {
    let versions
    typeVersions[gateway.type].forEach(version => {
      versions[version] = patchData.versions.find(item => item === version) && true
    });
    return versions;
  })

  const typeVersions = {
    ethernet: [],
    wifi: ['2.4', '5'],
    ble: ['4', '5']
  }

  const currentData = {
    opRange: gateway.opRange,
    versions: gateway.versions
  }

  const [patchData, setPatchData] = useState({
    opRange: gateway.opRange,
    versions: gateway.versions
  });
  
  async function fetchGatewayDevices() {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/gateways/${gateway.id}/devices`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const rawData = await response.json();
    // console.log(rawData)
    setGatewayDevices(JSON.parse(rawData))

    setIsLoading(false);
  }

  async function deleteGatewayDevice(deviceId) {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/gateways/${gateway.id}/delete`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceID: deviceId
      })
    });

      const rawData = await response.json();
      console.log(rawData);

  }

  const handleSwitch = (event) => {
    const {value, checked} = event.target;
  
    if (checked) {
      let newVersions = patchData.versions;
      newVersions.push(value);
      setPatchData({
        ...patchData,
        versions: newVersions
      })
      // setInvalidSwitches(false);
    }
    else {
      let newVersions = patchData.versions;
      newVersions = newVersions.filter(a => a !== value)
      setPatchData({
        ...patchData,
        versions: newVersions
      })
      // if (choosenVer.length == 0) {
      //   setInvalidSwitches(true);
      // }
    }
    console.log(patchData)
};

  async function handleDelete (event) {
    const value = event.target.value;
    console.log(value);
    await deleteGatewayDevice(value);
    setIsChanged(!isChanged);
  };

  useEffect(() => { 
    if (gatewayDevices.length === 0) {
      setIsEmpty(true);
    }
    else {
      setIsEmpty(false);
    }
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
          <Modal.Title>Настройки шлюза</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Form.Group 
              className="mb-3"
              controlId="gatewaydevices"
            >
              <Form.Label>Подключенные устройства</Form.Label>
              {isEmpty && (
                <Stack gap={2} className="col-md-5 mx-auto">
                  <Form.Label>Нет подключенных устройств</Form.Label>
                  <ModalConnectDevice gatewayID={gateway.id} change={isChanged} saved={setIsChanged}/>
                </Stack>
              )}
              {!isEmpty && (
                <ListGroup style={{ overflow: "auto", height: "200px" }}>
                  {gatewayDevices.map((device) => (
                    <ListGroup.Item>
                      <Row className='align-items-center'>
                        <Col sm="3">
                          {device.name}
                          <Badge className='ms-3' bg="primary">
                            {device.physicalProtocol}
                          </Badge>
                        </Col>
                        <Col >
                          <Button size="sm" variant="danger" value={device.id} onClick={handleDelete} >
                            Удалить
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>
            {gateway.type !== "ethernet" &&
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                {console.log(choosenVer)}
                <Form.Label style={{ display: "flex" }}>
                  Поддерживаемые версии
                </Form.Label>

                {typeVersions[gateway.type].map((version) => (
                    <Form.Check
                      inline
                      value={version}
                      label={version}
                      type="switch"
                      onChange={handleSwitch}
                      checked={choosenVer[version]}
                    />
                ))}
              </Form.Group>}
            <Form.Group
              className="mb-3"
              controlId="gatewaysettings"
            >
              <Form.Label>Дальность работы</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="метры"
                  name="opRange"
                  value={patchData.opRange}
                  // onChange={handleChange}
                  min="1"
                />
                <Form.Control.Feedback type="invalid">
                  Укажите дальность работы
                </Form.Control.Feedback>
              
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" type="submit">
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalGatewaySettings;