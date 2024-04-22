import { useState } from 'react';
import Sidebar from "../Components/Sidebar.js";
import Button from 'react-bootstrap/Button';
import DevicePage from '../Components/devicesPage.js';


const Home = () => {

  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="main">
          <h1 className="title">Ваши устройства</h1>
          <DevicePage />
        </div>
      </div>
    </>
  );
}

export default Home;