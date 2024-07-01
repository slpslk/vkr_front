import React,{ useState, useEffect } from 'react';
import SettingsRightech from './settingRightech';
import SettingsPersonal from './settingsPersonal';

function SettingsPage() {

  return (
    <>
      <SettingsRightech />
      <SettingsPersonal />
    </>
  );
}

export default SettingsPage;