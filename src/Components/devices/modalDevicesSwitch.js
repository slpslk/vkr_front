import React, { useEffect, useState } from 'react';
import {CustomSwitch, CustomCase, DefaultCase} from '../CustomSwitch.js';
import SensorWrapper from './sensors/sensorWrapper.js';
import ControlledWrapper from './controlled/controlledWrapper.js';


function ModalDevicesSwitch({reset, name, type, change, saved, error}) {

  const [typeKind, setTypeKind] = useState('')

  useEffect(() => {
    if (type == 'temperature' || type == 'humidity' || type == 'noise' || type == 'lighting' ) {
      setTypeKind('sensor')
    }
    else if (type == 'lamp'){
      setTypeKind('controlled')
    }
  }, [type])

  return (
    <>
      
      <CustomSwitch value={typeKind}>
        <CustomCase value='sensor'><SensorWrapper type={type} reset={reset} name={name} change={change} saved={saved} error={error}/></CustomCase>
        <CustomCase value='controlled'><ControlledWrapper type={type} reset={reset} name={name} change={change} saved={saved} error={error}/></CustomCase>
        <DefaultCase></DefaultCase>
      </CustomSwitch>
    </>
  );
}

export default ModalDevicesSwitch;