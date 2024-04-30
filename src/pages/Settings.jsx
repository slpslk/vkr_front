import { useState } from 'react';
import Sidebar from "../Components/Sidebar.js";
import Button from 'react-bootstrap/Button';
import SettingsPage from '../Components/settingsPage.js';


const Settings = () => {

  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="main">
          <h1 className="title">Настройки</h1>
          <SettingsPage />
        </div>
      </div>
    </>
  );
}

export default Settings;