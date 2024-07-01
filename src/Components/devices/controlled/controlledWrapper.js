import { useState, useEffect } from 'react';
import ControlledModalForm from './controlledModalForm.js';
import { useAuth } from '../../../hooks/use-auth.js';

function ControlledWrapper({type, reset, name, change, saved, error}) {

  const {token} = useAuth();
  const typeValues = {
    
  }

  const [values, setValues] = useState({
    name: name,
    sendingPeriod: '',
    protocolPhysical: 'ethernet',
    protocolVersions: [],
    protocolMessage: 'MQTT',
    broker: 'rightech',
    operatingRange: '',
    ClientID: '',
    mqttPassword: '',
    mqttUsername: '',
    mqttTopic: '',
  });
  
  // const handleTypeChange = (fields) => {
  //   for (var key in fields) {
  //     values[key] = fields[key]
  //   }
  // }

  async function fetchMakeControlled() {
    const response = await fetch(`http://localhost:8000/api/devices/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: values.name,
          meanTimeFailure: values.meanTimeFailure,
          protocol: { 
            physical: values.protocolPhysical,
            message: values.protocolMessage,
            versions: values.protocolVersions,
            broker: values.broker,
          },
          sendingPeriod: values.sendingPeriod,
          connectionOptions: {
            clientId: values.ClientID, 
            username: values.mqttUsername,
            password: values.mqttPassword,
            sendingTopic: values.mqttTopic,
          },
          opRange: values.operatingRange
        }),
      }
    );

    const data = await response.json();

    if(response.ok) {
      handleCreating()
    }
    else {
      error(data.error);
    }
  }


  const handleCreating = () => {
    saved(!change);
    reset({
      name: "",
      type: "",
    })
  }

  //сделать async
  const handleSubmit = async () => {
    await fetchMakeControlled();  
    console.log(values)
  };

  // useEffect(() => {
  //   const changeableFields = typeValues[type]
  //   handleTypeChange(changeableFields)
    
  // }, [type] )


  return (
    <>
      <ControlledModalForm 
        values={values}
        setValues={setValues} 
        type={type} 
        handleSubmit={handleSubmit}/>
    </>
  );
}

export default ControlledWrapper;

