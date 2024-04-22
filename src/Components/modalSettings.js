import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function ModalSettings(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

//   const setParams = props.method
//   const nameRegExp = new RegExp('^[\\p{L}\\d_]+$', 'u');

//   const [validated, setValidated] = useState(false);
//   const [values, setValues] = useState({
//     name: "",
//     type: "temperature",
// });

//   const handleChange= (event) => {
//     const { name, value } = event.target;
//     setValues({
//         ...values,
//         [name]: value,
//     });
// };

//   const handleSubmit = (event) => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//     }

//     setValidated(true);

//     if(nameRegExp.test(values.name))
//     {
//       console.log(values);
//       handleClose();
//       setParams(values);
//     }
//   };


  return (
    <>
      <Button variant="outline-secondary" onClick={handleShow}>Настроить</Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Новое устройство</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" type="submit">
            Создать
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalSettings;