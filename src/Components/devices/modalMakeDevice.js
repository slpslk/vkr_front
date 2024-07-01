import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function ModalDevice(props) {
  const [show, setShow] = useState(false);
  const setParams = props.method

  const handleClose = () => {
    setShow(false);
    setValues({
      name: "",
      type: "temperature",
    })
  }
  const handleShow = () => setShow(true);

  const nameRegExp = new RegExp('^[\\p{L}\\d_]+$', 'u');

  const [validated, setValidated] = useState(false);
  const [values, setValues] = useState({
    name: "",
    type: "temperature",
  });

  const handleChange= (event) => {
    const { name, value } = event.target;
    setValues({
        ...values,
        [name]: value,
    });
};

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if(nameRegExp.test(values.name))
    {
      handleClose();
      setParams(values);
    }
  };


  return (
    <>
      {props.mode && 
      <Button variant="primary" onClick={handleShow}>
        Создать устройство
      </Button>
      }
      {!props.mode && 
      <Button className="rounded-circle addingButton" onClick={handleShow}>
        +
      </Button>
      }

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Новое устройство</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} >
            <Form.Group className="mb-3" controlId="deviceform">
              <Form.Label>Имя устройства</Form.Label>
              <Form.Control
                required 
                autocomplete="off"
                type="text" 
                name="name"                                
                value={values.name}
                onChange={handleChange}
                placeholder="Датчик_1"
                pattern='^[\p{L}\d_]+$'
                isInvalid={
                  validated &&
                  !nameRegExp.test(values.name)
                } 
                autoFocus/>
              <Form.Control.Feedback type="invalid">Введите корректное имя!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Тип устройства</Form.Label>
              <Form.Select 
                required
                name="type"                                
                value={values.type}
                onChange={handleChange}
                >
                <option selected value="temperature">Датчик температуры</option>
                <option value="humidity">Датчик влажности</option>
                <option value="lighting">Датчик освещенности</option>
                <option value="noise">Датчик шума</option>
                <option value="lamp">Лампа</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Выберите тип!</Form.Control.Feedback>
            </Form.Group>
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
      </Modal>
    </>
  );
}

export default ModalDevice;