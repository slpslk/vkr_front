import React from 'react';
import {CustomSwitch, CustomCase, DefaultCase} from './CustomSwitch.js';
import ModalTemperatureSensor from './makeTemp.js';


function ModalDevicesSwitch({name, type, saved}) {

  return (
    <>
      <CustomSwitch value={type}>
        <CustomCase value='temperature'><ModalTemperatureSensor name = {name} saved ={saved} /></CustomCase>
        <CustomCase value="20">Hello 20</CustomCase>
        <CustomCase value="30">Hello 30</CustomCase>
        <CustomCase value="10"><div>Hello 10</div></CustomCase>
        <DefaultCase></DefaultCase>
      </CustomSwitch>
    </>
  );
}

export default ModalDevicesSwitch;