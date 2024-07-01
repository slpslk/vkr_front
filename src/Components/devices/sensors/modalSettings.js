import { useEffect, useState } from 'react';
import SensorModalForm from './sensorModalForm.js';
import { useAuth } from '../../../hooks/use-auth.js';

const FROM_MILISECONDS = 60000;

function ModalSettings({device, change, saved, deleted}) {

  const {token} = useAuth();
  
  let currentData = {
    name: device.name,
    place: device.place,
    sendingPeriod: device.sendingPeriod/FROM_MILISECONDS,
    meanTimeFailure: device.lyambda || '',
    protocolPhysical: device.physicalProtocol,
    protocolVersions: device.protocolVersions,
    protocolMessage: device.mqttClient == null ? 'HTTP': 'MQTT',
    ClientID: device.ConnectionOptions && device.ConnectionOptions.clientId,
    mqttPassword: device.ConnectionOptions && (device.ConnectionOptions.password == null ? '' : device.ConnectionOptions.password),
    mqttUsername: device.ConnectionOptions && (device.ConnectionOptions.username == null ? '' : device.ConnectionOptions.username),
    mqttTopic: device.sendingTopic == null ? '' : device.sendingTopic,
    mqttQoS: device.QoS == null ? 0 : device.QoS
  }

  const [patchData, setPatchData] = useState({
      
  });

  const fillChangableData = () => {
    let changableData
    switch (device.type) {
      case 'temperature':
      case 'humidity':
      case 'lighting':
        {
          changableData = {
            min: device.measureRange.min,
            max: device.measureRange.max,
            operatingRange: device.measureRange.opRange,
            error: device.measureRange.error
          }
          Object.assign (currentData, changableData);
        }
    }
  }

  const fillCurrentData = () => {
    Object.assign(patchData, currentData)
  }

  async function changeDevice(fetchData) {
    
    const response = await fetch(`http://localhost:8000/api/devices/${device.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify(fetchData)
    });

    return response.ok ? true : false

  }

  const validateChanges = (changedData) => {
    
    console.log(patchData)
    console.log(currentData)
    for(var key in patchData){
      if(patchData[key].toString() !== currentData[key].toString()) {
        changedData[key] = patchData[key]
      }
    }

    return Object.keys(changedData).length !== 0 ?  true : false
  }

  const makeFetchData = (changedData) => {
    let fetchData = {
      name: changedData.name,
      place: changedData.place,
      meanTimeFailure: changedData.meanTimeFailure,
      sendingPeriod: changedData.sendingPeriod,
    }

    if (changedData.name || changedData.place || changedData.meanTimeFailure)
    {
      fetchData['protocol'] = {
        physical: patchData.protocolPhysical,
        message: patchData.protocolMessage,
        versions: patchData.protocolVersions
      }
    }

    if(changedData.min || changedData.max || changedData.error || changedData.operatingRange) {
      fetchData['measureRange'] = {
        min: patchData.min,
        max: patchData.max,
        error: patchData.error,
        opRange: patchData.operatingRange
      }
    }

    if(changedData.ClientID || changedData.mqttUsername || changedData.mqttPassword || changedData.mqttTopic || changedData.mqttQoS) {
      fetchData['connectionOptions'] = {
        clientId: patchData.ClientID, 
        username: patchData.mqttUsername,
        password: patchData.mqttPassword,
        sendingTopic: patchData.mqttTopic,
        QoS: patchData.mqttQoS
      }
    }

    return fetchData
    
  }

  const handleSave = async() => {
    let changedData = {}
    if(validateChanges(changedData)) {
      let fetchData = makeFetchData(changedData)
      console.log(fetchData)
      if (await changeDevice(fetchData))
      {
        saved(!change);
        
      }
      console.log(fetchData)
    }

  }

  fillChangableData()


  useEffect(() => {
    fillCurrentData()
  }, [])

  return (
    <>      

      <SensorModalForm 
        id={device.id}
        values={patchData}
        setValues={setPatchData} 
        type={device.type}
        mode={'settings'}
        handleSubmit={handleSave}
        deleted={deleted} />
    </>
  );
}

export default ModalSettings;