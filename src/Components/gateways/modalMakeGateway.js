import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from '../../hooks/use-auth';
//TODO: очищение формы и значений

function ModalGateway({mode, change, saved}) {

  const {token} = useAuth();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isLoading, setIsLoading] = useState(false);

  const nameRegExp = new RegExp('^[\\p{L}\\d_]+$', 'u');
  const versions = {
    ethernet: [],
    wifi: ['2.4', '5'],
    ble: ['4', '5']
  }

  const [validated, setValidated] = useState(false);
  const [values, setValues] = useState({
    name: "",
    type: "ethernet",
    versions: [],
    opRange: 0
  });

  const [showVersions, setShowVersions] = useState(false)
  const [invalidSwitches, setInvalidSwitches] = useState(false)
  const [choosenProtocol, setChoosenProtocol] = useState("ethernet") 
  const [choosenVer, setChoosenVer] = useState([])

  //сохранение версий в массив
  const handleSwitch = (event) => {
    const {value, checked} = event.target;
    if (checked) {
      setChoosenVer([ 
        ...choosenVer, 
        value 
      ])
      setInvalidSwitches(false);
    }
    else {
      setChoosenVer(
        choosenVer.filter(a =>
          a !== value)
      )
      if (choosenVer.length == 0) {
        setInvalidSwitches(true);
      }
    }

};

  //сохранение значений для запроса
  const handleChange= (event) => {
    const { name, value } = event.target;
    setValues({
        ...values,
        [name]: value,
    });
  };

  //смена протокола
  const handleSelect = (event) => {
    handleChange(event);
    if(event.target.value !== "ethernet") {
      setShowVersions(true);
      setInvalidSwitches(true);
    }
    else {
      setShowVersions(false);
      setInvalidSwitches(false);
    }
    setChoosenProtocol(event.target.value)
  };

  // useEffect(() => {
  //   console.log(choosenVer)
  //   console.log(choosenVer.length === 0)
  // }, [choosenVer])

  async function fetchMakeGateway() {
    setIsLoading(true);

    const response = await fetch(`http://localhost:8000/api/gateways/${values.type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: values.name,
          versions: values.versions,
          opRange: values.opRange
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    
    setIsLoading(false);
  }

  const handleSave = () => {
    saved(!change);
    handleClose();
  };

  async function MakeGateway() {   
    if(nameRegExp.test(values.name) && !invalidSwitches && (values.opRange !=0 || values.type == 'ethernet'))
    {
      values.versions = choosenVer;
      await fetchMakeGateway()
      handleSave()
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if(choosenProtocol !== "ethernet" && choosenVer.length == 0) 
    {
      setInvalidSwitches(true)
    }
    setValidated(true);

    MakeGateway()
  };


  return (
    <>
    {mode && 
      <Button variant="primary" onClick={handleShow}>
        Создать шлюз
      </Button>
      }
      {!mode && 
      <Button className="rounded-circle addingButton" onClick={handleShow}>
        +
      </Button>
      }

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Новый шлюз</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {isLoading && <Modal.Body>Loading...</Modal.Body>}
        {!isLoading &&
          <Form noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="deviceform">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Шлюз_1"
                pattern="^[\p{L}\d_]+$"
                isInvalid={validated && !nameRegExp.test(values.name)}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">
                Введите корректное имя!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Тип шлюза</Form.Label>
              <Form.Select
                required
                name="type"
                value={values.type}
                onChange={handleSelect}
              >
                <option selected value="ethernet">
                  Ethernet
                </option>
                <option value="wifi">Wi-Fi</option>
                <option value="ble">Bluetooth Low Energy</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Выберите тип!
              </Form.Control.Feedback>
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
                {invalidSwitches && <div style={{color: '#dc3545'}}>Выберите хотя бы один враиант</div>}
              </Form.Group>
            )}
            {choosenProtocol!="ethernet" &&
            <Form.Group>
              <Form.Label>Дальность работы</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="метры"
                  name="opRange"
                  value={values.opRange}
                  onChange={handleChange}
                  min="1"
                />
                <Form.Control.Feedback type="invalid">
                  Укажите дальность работы
                </Form.Control.Feedback>
              </Form.Group>
              }
          </Form>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Создать
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalGateway;