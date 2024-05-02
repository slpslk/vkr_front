import React, { useEffect, useState } from 'react';
import {CustomSwitch, CustomCase, DefaultCase} from './CustomSwitch.js';
import SensorWrapper from './sensorWrapper.js';
import ModalTemperatureSensor from './makeTemp.js';


function ModalDevicesSwitch({reset, name, type, change, saved, error}) {

  const [typeKind, setTypeKind] = useState('')

  useEffect(() => {
    if (type == 'temperature' || type == 'humidity' || type == 'gas' || type == 'lighting' ) {
      setTypeKind('sensor')
    }
    else {
      setTypeKind('controlled')
    }
  }, [type])

  return (
    <>
      
      <CustomSwitch value={typeKind}>
        <CustomCase value='sensor'><SensorWrapper type={type} reset={reset} name={name} change={change} saved ={saved}/></CustomCase>
        <CustomCase value="20">Hello 20</CustomCase>
        <CustomCase value="30">Hello 30</CustomCase>
        <CustomCase value="10"><div>Hello 10</div></CustomCase>
        <DefaultCase></DefaultCase>
      </CustomSwitch>
    </>
  );
}

export default ModalDevicesSwitch;