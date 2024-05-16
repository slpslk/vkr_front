import { useState, useEffect } from 'react';
import SensorModalForm from './sensorModalForm.js';


function SensorWrapper({type, reset, name, change, saved}) {

  const typeValues = {
    temperature: {
      min: '',
      max: '',
      operatingRange: '',
      error: '',
    },
    humidity: {
      min: '',
      max: '',
      operatingRange: '',
      error: '',
    },
    lighting : {
      min: '',
      max: '',
      operatingRange: '',
      error: '',
    },
    gas : {
      min: '',
      max: '',
      operatingRange: '',
      error: '',
      gasType: '',
    },
  }

  const [values, setValues] = useState({
    name: name,
    place: true,
    sendingPeriod: '',
    broker: 'rightech',
    protocolPhysical: 'ethernet',
    protocolVersions: [],
    protocolMessage: 'MQTT',
    ClientID: '',
    mqttPassword: '',
    mqttUsername: '',
    mqttTopic: '',
    mqttQoS: 0
  });
  
  const handleTypeChange = (fields) => {
    for (var key in fields) {
      values[key] = fields[key]
    }
  }

  async function fetchMakeSensor() {

    // requestData.name,
    // requestData.place,
    // requestData.meanTimeFailure,
    // requestData.protocol,
    // requestData.connectionOptions,
    // requestData.measureRange,
    // requestData.sendingPeriod,
    // requestData.weatherAPI

    const response = await fetch(`http://localhost:8000/api/devices/${type}`, {
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
            versions: values.protocolVersions,
            broker: values.broker,
          },
          measureRange: {
            min: values.min,
            max: values.max,
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
  }


  const handleCreating = () => {
    saved(!change);
    reset({
      name: "",
      type: "",
    })
  }

  //сделать async
  const handleSubmit = () => {

// запись параметров в пропсы
    fetchMakeSensor();
    handleCreating();     
    console.log(values)
  };

  useEffect(() => {
    const changeableFields = typeValues[type]
    handleTypeChange(changeableFields)
    
  }, [type] )


  return (
    <>
      <SensorModalForm 
        values={values}
        setValues={setValues} 
        type={type} 
        handleSubmit={handleSubmit}/>
    </>
  );
}

export default SensorWrapper;

