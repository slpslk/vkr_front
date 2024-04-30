import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';


function ModalTemperatureSensor({reset, name, change, saved}) {
  const [show, setShow] = useState(true); //отображение

  const handleClose = () => setShow(false);

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
  // const [formValid, setFormValid] = useState(false);
  // const topicRegExp = new RegExp("")


  //параметры
  const [values, setValues] = useState({
    name: name,
    place: true,
    minTemp: '',
    maxTemp: '',
    operatingRange: '',
    error: '',
    sendingPeriod: '',
    protocolPhysical: 'ethernet',
    protocolVersions: [],
    protocolMessage: 'MQTT',
    ClientID: '',
    mqttPassword: '',
    mqttUsername: '',
    mqttTopic: '',
    mqttQoS: 0
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
    handleChange(event);
    if(event.target.value !== "ethernet") {
      setShowVersions(true);
    }
    else {
      setShowVersions(false);
    }
    setChoosenProtocol(event.target.value)
  };

  const handleSwitch = (event) => {
    const {value, checked} = event.target;
    if (checked) {
      values.protocolVersions.push(value)
      // setInvalidSwitches(false);
    }
    else {
        values.protocolVersions = values.protocolVersions.filter(a => a !== value)
      
      // if (choosenVer.length == 0) {
      //   setInvalidSwitches(true);
      // }
    }

};

  const handleMessageProtocolChange = (event) => {
    const value = event.target.value;

    if(value == "HTTP") {
      values.mqttPassword = ''
      values.mqttUsername = ''
      values.mqttTopic = ''
      values.mqttQoS = 0
    }
    handleChange(event);
  }

  //запрос на создание
  async function fetchMakeTemp() {
    setIsLoading(true);

    // requestData.name,
    // requestData.place,
    // requestData.meanTimeFailure,
    // requestData.protocol,
    // requestData.connectionOptions,
    // requestData.measureRange,
    // requestData.sendingPeriod,
    // requestData.weatherAPI

    const response = await fetch("http://localhost:8000/api/devices/temperature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          place: values.place,
          meanTimeFailure: values.meanTimeFailure,
          protocol: { 
            physical: values.protocolPhysical,
            message: values.protocolMessage,
            versions: values.protocolVersions
          },
          measureRange: {
            min: values.minTemp,
            max: values.maxTemp,
            error: values.error,
            opRange: values.operatingRange,
          },
          sendingPeriod: values.sendingPeriod,
          connectionOptions: {
            clientId: values.ClientID, 
            username: values.mqttUsername,
            password: values.mqttPassword,
            sendingTopic: values.mqttTopic,
            QoS: values.mqttQoS
          }

        }),
      }
    );

    const data = await response.json();
    setIsLoading(false);
  }

  const handleCreating = () => {
    saved(!change);
    handleClose();
    reset({
      name: "",
      type: "",
    })
  }

  const handleWeatherCheck = (e) => {
    const checked = e.currentTarget.checked
    setWeatherChecked(checked);
    if(!checked) {
      delete values.weatherCity
      delete values.weatherKey
    }
  }

  const handleMeanErrorCheck = (e) => {
    const checked = e.currentTarget.checked
    setErrorChecked(checked);
    if(!checked) {
      delete values.meanTimeFailure
    }
  }

  const checkFetchData = () => {

    if (values.minTemp == '' || values.maxTemp == '' || values.operatingRange == '' ||
        values.error == '' || values.sendingPeriod == '') {
          return false;
        }
    else {
      if (values.protocolMessage == "MQTT") {
        if (values.mqttClientID == '' || values.mqttUsername == '' || values.mqttPassword == '' ||
            values.mqttTopic == '') {
              return false;
            }
      }
    }
    return true;
  }

  

  //сабмит
  const handleSubmit = (event) => {
    
    setValidated(true);

    if(checkFetchData()) {// запись параметров в пропсы
      fetchMakeTemp();
      handleCreating();     
    }
    console.log(values)
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
                        <option value="true">
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
                      <Form.Label column sm="2">
                        Min:
                      </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          Укажите температуру!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        Max:
                      </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          Укажите температуру!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm="7">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Дальность работы:
                      </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          Укажите расстояние!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="6">
                        Величина погрешности:
                      </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          Укажите погрешность!
                        </Form.Control.Feedback>
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
                    min="1"
                  />
                </Form.Group>

                <Form.Check
                  className="mb-3"
                  type="switch"
                  id="weather-switch"
                  label="Настроить погодный API"
                  checked={weatherChecked}
                  onChange={handleWeatherCheck}
                />
                {weatherChecked && (
                  <>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="devicename"
                    >
                      <Form.Label column sm="2">
                        Location:
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          name="weatherCity"
                          value={values.weatherCity || ''}
                          placeholder="Novosibirsk"
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="devicename"
                    >
                      <Form.Label column sm="2">
                        API Key:
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          name="weatherKey"
                          value={values.weatherKey || ''}
                          placeholder="API Key"
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>
                  </>
                )}

                <Form.Check
                  className="mb-3"
                  type="switch"
                  id="custom-switch"
                  label="Использовать наработку на отказ"
                  checked={meanErrorChecked}
                  onChange={handleMeanErrorCheck}
                />
                {meanErrorChecked && (
                  <Form.Group className="mb-3" controlId="devicelyambda">
                    <Form.Label>
                      Время наработки на отказ (чем число больше, тем раньше
                      устройство выйдет из строя)
                    </Form.Label>
                    <Form.Control
                      required
                      type="number"
                      name="meanTimeFailure"
                      value={values.meanTimeFailure || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                    />
                    <Form.Control.Feedback type="invalid">
                      Введите корректное число!
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Form.Label style={{ fontWeight: "bold" }}>
                  Параметры соединения
                </Form.Label>
                <Form.Group className="mb-3" controlId="devicephysical">
                  <Form.Label>Физический протокол</Form.Label>
                  <Form.Select
                    name="protocolPhysical"
                    value={values.protocolPhysical}
                    onChange={handleSelect}
                  >
                    <option value="ethernet">
                      Ethernet
                    </option>
                    <option value="wifi">Wi-Fi</option>
                    <option value="ble">Bluetooth Low Energy</option>
                  </Form.Select>
                </Form.Group>
                {showVersions && (
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label style={{ display: "flex" }}>
                      Выберите версии
                    </Form.Label>

                    {versions[choosenProtocol].map((version) => (
                      <Form.Check
                        inline
                        value={version}
                        label={version}
                        type="switch"
                        onChange={handleSwitch}
                      />
                    ))}
                    {/* {invalidSwitches && (
                      <div style={{ color: "#dc3545" }}>
                        Выберите хотя бы один враиант
                      </div>
                    )} */}
                  </Form.Group>
                )}
                <Form.Group className="mb-3" controlId="devicemessage">
                  <Form.Label>Протокол передачи сообщений</Form.Label>
                  <Form.Select
                    required
                    name="protocolMessage"
                    value={values.protocolMessage}
                    onChange={handleMessageProtocolChange}
                  >
                    <option value="MQTT">
                      MQTT
                    </option>
                    <option value="HTTP">HTTP</option>
                  </Form.Select>
                </Form.Group>

                {values.protocolMessage == "MQTT" && (
                  <>
                    <Form.Group className="mb-3" controlId="devicebroker">
                      <Form.Label>Используемый брокер</Form.Label>
                      <Form.Select                      
                        name="protocolPhysical"
                        // value={values.protocolPhysical}
                        // onChange={handleChange}
                      >
                        <option value="rightech">
                          Rightech
                        </option>
                        <option disabled value="personal">
                          Персональный брокер
                        </option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="mqttparamsid">
                      <Form.Label column sm="2">clientID:</Form.Label>
                      <Col sm="10">
                        <Form.Control
                        required
                        type="text"
                        name="ClientID"
                        value={values.ClientID || ''}
                        onChange={handleChange}
                        placeholder="clientID объекта, к которому вы хотите подключиться"
                        // isInvalid={
                        //   validated &&
                        //   !meanErrorRegExp.test(values.meanTimeFailure)
                        // }
                      />
                      </Col>
                    <Form.Control.Feedback type="invalid">
                      Введите корректное число!
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="mqttparamsusnm">
                      <Form.Label column sm="2">username:</Form.Label>
                      <Col sm="10">
                        <Form.Control
                        required
                        type="text"
                        name="mqttUsername"
                        value={values.mqttUsername || ''}
                        onChange={handleChange}
                        placeholder="username"
                        // isInvalid={
                        //   validated &&
                        //   !meanErrorRegExp.test(values.meanTimeFailure)
                        // }
                      />
                      </Col>
                    {/* <Form.Control.Feedback type="invalid">
                      Введите корректное число!
                    </Form.Control.Feedback> */}
                    </Form.Group>
                    <Form.Group  as={Row} className="mb-3" controlId="mqttparamspsswd">
                      <Form.Label column sm="2">password:</Form.Label>
                      <Col sm="10">
                        <Form.Control
                        required
                        type="password"
                        name="mqttPassword"
                        value={values.mqttPassword || ''}
                        onChange={handleChange}
                        placeholder="password"
                        // isInvalid={
                        //   validated &&
                        //   !meanErrorRegExp.test(values.meanTimeFailure)
                        // }
                      />
                      </Col>
                    {/* <Form.Control.Feedback type="invalid">
                      Введите корректное число!
                    </Form.Control.Feedback> */}
                    </Form.Group>
                    <Form.Group  as={Row} className="mb-3" controlId="mqttparamstopic">
                      <Form.Label column sm="3">Топик для публикации:</Form.Label>
                      <Col sm="9">
                        <Form.Control
                        required
                        type="text"
                        name="mqttTopic"
                        value={values.mqttTopic || ''}
                        onChange={handleChange}
                        placeholder="Например: base/state/temperature"
                        // isInvalid={
                        //   validated &&
                        //   !meanErrorRegExp.test(values.meanTimeFailure)
                        // }
                      />
                      </Col>
                    {/* <Form.Control.Feedback type="invalid">
                      Введите корректное число!
                    </Form.Control.Feedback> */}
                    </Form.Group>
                    <Form.Group  as={Row} className="mb-3" controlId="mqttparamsqos">
                      <Form.Label column sm="3">QoS:</Form.Label>
                      <Col sm="9">
                      <Form.Select                      
                        name="mqttQoS"
                        value={values.mqttQoS || ''}
                        onChange={handleChange}
                      >
                        <option defaultValue="1">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </Form.Select>
                      </Col>
                    {/* <Form.Control.Feedback type="invalid">
                      Введите корректное число!
                    </Form.Control.Feedback> */}
                    </Form.Group>
                  </>
                  
                )}
                {values.protocolMessage == "HTTP" && (
                  <Form.Group as={Row} className="mb-3" controlId="httpparamsid">
                  <Form.Label column sm="2">clientID:</Form.Label>
                  <Col sm="10">
                    <Form.Control
                    required
                    type="text"
                    name="ClientID"
                    value={values.ClientID || ''}
                    onChange={handleChange}
                    placeholder="clientID объекта, к которому вы хотите подключиться"
                    // isInvalid={
                    //   validated &&
                    //   !meanErrorRegExp.test(values.meanTimeFailure)
                    // }
                  />
                  </Col>
                <Form.Control.Feedback type="invalid">
                  Введите корректное число!
                </Form.Control.Feedback>
                </Form.Group>
                )}
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