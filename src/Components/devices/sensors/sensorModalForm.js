import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import SensorFormChangable from './sensorFormChangableFields.js';
import { useAuth } from '../../../hooks/use-auth.js';


function SensorModalForm({id, values, setValues, type, mode, handleSubmit, deleted}) {
  const {token} = useAuth();
  const [show, setShow] = useState(mode !== 'settings'); //отображение

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const headers = {
    temperature: "Датчик температуры",
    humidity: "Датчик влажности",
    lighting: "Датчик освещенности",
    noise: "Датчик шума"
  }

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

  //запись изменений
  const handleChange= (event) => {
    const { name, value } = event.target;
    setValues({
        ...values,
        [name]: value,
    });
  };

  //смена физ.протокола
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

  //изменение версий протокола
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

  //смена соо. протокола
  const handleMessageProtocolChange = (event) => {
    const value = event.target.value;

    if(value == "HTTP") {
      values.mqttPassword = ''
      values.mqttUsername = ''
      values.mqttTopic = ''
      values.mqttQoS = 0
    }
    handleChange(event);
  };

  //добавление данных об weatherAPI
  const handleWeatherCheck = (e) => {
    const checked = e.currentTarget.checked
    setWeatherChecked(checked);
    if(!checked) {
      delete values.weatherCity
      delete values.weatherKey
    }
  }

  //добавление данных об наработка на отказ
  const handleMeanErrorCheck = (e) => {
    const checked = e.currentTarget.checked
    setErrorChecked(checked);
    if(!checked) {
      delete values.meanTimeFailure
    }
  }

  //"валидация" формы на на наличие пустых полей
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

  async function deleteDevice() {

    const response = await fetch(`http://localhost:8000/api/devices`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        deviceID: id
      })
    });

      const rawData = await response.json();
      console.log(rawData);

  }

  const handleDelete = async () => {
    await deleteDevice();
    deleted(id);
    handleClose();
  };

  //сабмит
  const handleFormSubmit = () => {
    
    setValidated(true);

    if(checkFetchData()) {// запись параметров в пропсы
      // setSubmit(!submit)
      handleSubmit()
      // console.log("валидировано")
      handleClose();
    }
    // console.log(values)
  };

  return (
    <>
      {mode == 'settings' && 
        <Button variant="outline-secondary" onClick={handleShow}>Настроить</Button>
      }

      <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{headers[type]}</Modal.Title>
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
                        placeholder={values.name}
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

                <SensorFormChangable values={values} handleChange={handleChange} type={type}/>

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
                        name="broker"
                        value={values.broker}
                        onChange={handleChange}
                      >
                        <option value="rightech">
                          Rightech
                        </option>
                        <option value="personal">
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
              {mode == 'settings' && 
                <Button variant="danger" onClick={handleDelete}>
                  Удалить
                </Button>
              }
              <Button variant="secondary" onClick={handleClose}>
                Отмена
              </Button>
              <Button variant="primary" disabled={mode !== 'settings' ? false : true} type="submit" onClick={handleFormSubmit}>
                {mode !== 'settings' ? 'Создать' : 'Сохранить'}
              </Button>
            </Modal.Footer>
      </Modal>
    </>
  );
}

export default SensorModalForm;