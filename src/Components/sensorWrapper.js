import { useState, useEffect } from 'react';


function SensorWrapper({type, reset, name, change, saved}) {

  const typeValues = {
    temperature: {
      minTemp: '',
      maxTemp: '',
      operatingRange: '',
      error: '',
    }
  }

  const [values, setValues] = useState({
    name: name,
    place: true,
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
  
  const handleTypeChange = (fields) => {
    for (var key in fields) {
      values[key] = fields[key]
    }
  }

  useEffect(() => {
    const changeableFields = typeValues[type]
    handleTypeChange(changeableFields)
    
  }, [type] )

// здесь еще написать fetch 

//внутрь засунуть компонент sensormodalform, нверное, передавать в него обобщенный state типа submited
  return (
    <>
    
    </>
  );
}

export default SensorWrapper;

