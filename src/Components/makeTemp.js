import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';

function ModalTemperatureSensor({name, saved}) {
  const [show, setShow] = useState(true); //отображение

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isLoading, setIsLoading] = useState(false);
  const [meanErrorChecked, setErrorChecked] = useState(false);
  const [weatherChecked, setWeatherChecked] = useState(false);
  const [showVersions, setShowVersions] = useState(false)
  const [choosenProtocol, setChoosenProtocol] = useState("ethernet") 
  const versions = {
    ethernet: [],
    wifi: ['2.4', '5'],
    ble: ['4', '5']
  }

  const [validated, setValidated] = useState(false);
  const meanErrorRegExp = new RegExp("^((0\\.\\d+)|([1-9]+\\d*(\\.\\d+)?))$")


  //параметры
  const [values, setValues] = useState({
    name: name,
    place: true,
    minTemp: "",
    maxTemp: "",
    operatingRange: "",
    error: "",
    sendingPeriod: "",
    protocolPhysical: 'ethernet',
    protocolMessage: 'MQTT',
  });


  //запись изменений
  const handleChange= (event) => {
    const { name, value } = event.target;
    setValues({
        ...values,
        [name]: value,
    });
  };

  const handleSelect = (event) => {
    // handleChange(event);
    if(event.target.value !== "ethernet") {
      setShowVersions(true);
    }
    else {
      setShowVersions(false);
    }
    setChoosenProtocol(event.target.value)
  };

  //запрос на создание
  async function fetchMakeTemp() {
    setIsLoading(true);

    const response = await fetch("http://localhost:8000/api/devices/temperature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          place: values.place,
          meanTimeFailure: values.meanError,
          protocol: { physical: values.protocolPhysical, message: values.protocolMessage },
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    
    setIsLoading(false);
  }

  const handleCreating = () => {
    saved(true);
    handleClose();
  }

  //сабмит
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);


    // запись параметров в пропсы
      // fetchMakeTemp();
      console.log(values);
      // handleCreating();     

  };

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        {isLoading && <Modal.Body>Loading...</Modal.Body>}

        {!isLoading && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Датчик температуры</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate validated={validated}>
                <Form.Label style={{ fontWeight: "bold" }}>
                  Параметры работы устройства
                </Form.Label>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="devicename">
                      <Form.Label>Имя устройства</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={name}
                        disabled
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="deviceplace">
                      <Form.Label>Место установки</Form.Label>
                      <Form.Select
                        required
                        name="place"
                        value={values.place}
                        onChange={handleChange}
                      >
                        <option selected value="true">
                          В помещении
                        </option>
                        <option value="false">На улице</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                <Form.Label>Диапазон измерения</Form.Label>
                  <Col sm="4">
                  
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">Min:</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          required
                          type="number"
                          placeholder="C&deg;"
                          name="minTemp"
                          value={values.minTemp}
                          onChange={handleChange}
                          min="-100"
                          max="100"
                        />
                        <Form.Control.Feedback type="invalid">Укажите температуру!</Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">Max:</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          required
                          type="number"
                          placeholder="C&deg;"
                          name="maxTemp"
                          value={values.maxTemp}
                          onChange={handleChange}
                          min="-100"
                          max="100"
                        />
                        <Form.Control.Feedback type="invalid">Укажите температуру!</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                  </Col>
                  <Col sm="7">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">Дальность работы:</Form.Label>
                      <Col sm="7">
                        <Form.Control
                          required
                          type="number"
                          placeholder="метры"
                          name="operatingRange"
                          value={values.operatingRange}
                          onChange={handleChange}
                          min="0"
                        />
                        <Form.Control.Feedback type="invalid">Укажите расстояние!</Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="6">Величина погрешности:</Form.Label>
                      <Col sm="6">
                        <Form.Control
                          required
                          type="number"
                          placeholder="C&deg;"
                          name="error"
                          value={values.error}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          step="0.1"
                        />
                        <Form.Control.Feedback type="invalid">Укажите погрешность!</Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="deviceTime">
                  <Form.Label>Период отправки сообщений</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      placeholder="минуты"
                      name="sendingPeriod"
                      value={values.sendingPeriod}
                      onChange={handleChange}
                      min="0"
                    />
                </Form.Group>
                
                <Form.Check 
                  noValidate
                  className="mb-3"
                  type="switch"
                  id="weather-switch"
                  label="Настроить погодный API"
                  checked={weatherChecked}
                  onChange={(e) => setWeatherChecked(e.currentTarget.checked)}
                />
                {weatherChecked &&
                  <>
                    <Form.Group as={Row} className="mb-3" controlId="devicename">
                    <Form.Label
                      column 
                      sm="2"
                    >
                      Location:
                    </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          placeholder="Novosibirsk"
                        />
                      </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="devicename">
                    <Form.Label
                      column 
                      sm="2"
                    >
                      API Key:
                    </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          placeholder="API Key"
                        />
                      </Col>
                  </Form.Group>
                  </>
                }

                <Form.Check
                  className="mb-3"
                  type="switch"
                  id="custom-switch"
                  label="Использовать наработку на отказ"
                  checked={meanErrorChecked}
                  onChange={(e) => setErrorChecked(e.currentTarget.checked)}
                />
                {meanErrorChecked &&
                  <Form.Group className="mb-3" controlId="devicelyambda">
                  <Form.Label
                  >
                    Время наработки на отказ (чем число больше, тем раньше
                    устройство выйдет из строя)
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="meanError"
                    value={values.meanError}
                    onChange={handleChange}
                    placeholder="Число больше нуля"
                    pattern="^((0\.\d+)|([1-9]+\d*(\.\d+)?))$"
                    isInvalid={
                      validated && !meanErrorRegExp.test(values.meanError)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Введите корректное число!
                  </Form.Control.Feedback>
                </Form.Group>
                }

                <Form.Label style={{ fontWeight: "bold" }}>
                  Параметры соединения
                </Form.Label>


                    <Form.Group className="mb-3" controlId="devicephysical">
                      <Form.Label>Физический протокол</Form.Label>
                      <Form.Select
                        name="protocolPhysical"
                        value={values.protocolPhysical}
                        onChange={handleChange}
                      >
                        <option selected value="ethernet">
                          Ethernet
                        </option>
                        <option value="wifi">Wi-Fi</option>
                        <option value="ble">Bluetooth Low Energy</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="devicemessage">
                      <Form.Label>Протокол передачи сообщений</Form.Label>
                      <Form.Select
                        required
                        name="protocolMessage"
                        value={values.protocolMessage}
                        onChange={handleChange}
                      >
                        <option selected value="MQTT">
                          MQTT
                        </option>
                        <option value="HTTP">HTTP</option>
                      </Form.Select>
                    </Form.Group>

                {values.protocolMessage == "MQTT" &&
                  <Form.Group className="mb-3" controlId="devicebroker">
                      <Form.Label>Используемый брокер</Form.Label>
                      <Form.Select
                        name="protocolPhysical"
                        // value={values.protocolPhysical}
                        // onChange={handleChange}
                      >
                        <option selected value="rightech">
                          Rightech
                        </option>
                        <option disabled value="personal">Персональный брокер</option>
                      </Form.Select>
                    </Form.Group>
                    }
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Отмена
              </Button>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Создать
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}

export default ModalTemperatureSensor;