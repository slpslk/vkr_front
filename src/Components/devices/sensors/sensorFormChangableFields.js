import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';


function SensorFormChangable({values, handleChange, type}) {
 
  const contentTypes = {
    range: ["temperature", "humidity", "lighting", "gas", "noise"],
    error: ["temperature", "humidity", "lighting", "gas", "noise"],
    gasType: ["gas"],
    lightIndication: ["gas", "motion", "magnet"],
    soundIndication: ["gas", "motion", "magnet"],
    viewAngle: ["motion"]
  }

  let fieldsOfType = {
    range: false,
    error: false,
    gasType: false,
    lightIndication: false,
    soundIndication: false,
    viewAngle: false
  }

  const notations = {
    temperature: "C°",
    humidity: "%",
    lighting: "люкс",
    
  }

  const makeFields = () => {
    for(var key in contentTypes)
    {
      fieldsOfType[key] = (contentTypes[key].find(item => item == type) && true) || false
    }
  }

  makeFields()


  return (
    <>
      {fieldsOfType.gasType && (
        <>
          
          <Form.Group className="mb-3" controlId="gastype">
          <Form.Label>Тип газа</Form.Label>
            <Form.Select
              required
              name="gasType"
              value={values.gasType}
              onChange={handleChange}
            >
              <option value="true">Метан</option>
              <option value="false">Углекислый газ</option>
            </Form.Select>
          </Form.Group>
        </>
      )}
      {fieldsOfType.range && (
        <Row>
          <Form.Label>Диапазон измерения</Form.Label>
          <Col>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Min:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  required
                  type="number"
                  placeholder={`${notations[type]}`}
                  name="min"
                  value={values.min}
                  onChange={handleChange}
                  min="-100"
                  max="100"
                />
                <Form.Control.Feedback type="invalid">
                  Укажите число!
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Max:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  required
                  type="number"
                  placeholder={`${notations[type]}`}
                  name="max"
                  value={values.max}
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
        </Row>
      )}
      {fieldsOfType.error && (
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4 ">
            Величина погрешности:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              type="number"
              placeholder={`${notations[type]}`}
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
      )}
      <Row>
        <Col>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Дальность работы:
            </Form.Label>
            <Col sm="9">
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
        </Col>
      </Row>
      {fieldsOfType.lightIndication && (
        <Form.Check
          className="mb-3"
          type="switch"
          id="lightIndication-switch"
          label="Наличие световой индикации"
          // checked={weatherChecked}
          // onChange={handleWeatherCheck}
        />
      )}
      {fieldsOfType.soundIndication && (
        <Form.Check
          className="mb-3"
          type="switch"
          id="soundIndication-switch"
          label="Наличие звуковой индикации"
          // checked={weatherChecked}
          // onChange={handleWeatherCheck}
        />
      )}
      {fieldsOfType.viewAngle && (
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="5">
            Угол обзора:
          </Form.Label>
          <Col sm="7">
            <Form.Control
              required
              type="number"
              placeholder="метры"
              name="operatingRange"
              // value={values.operatingRange}
              // onChange={handleChange}
              min="0"
            />
            <Form.Control.Feedback type="invalid">
              Укажите расстояние!
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
      )}
    </>
  );
}

export default SensorFormChangable;