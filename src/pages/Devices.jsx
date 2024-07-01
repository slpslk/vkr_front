import Sidebar from "../Components/Sidebar.js";
import DevicePage from '../Components/devices/devicesPage.js';
import ModalEvents from "../Components/devices/events/modalEvent.js";


const Devices = () => {

  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="main">
          <div 
            style={{ display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center" }}
          >
                <h1 className="title">Ваши устройства</h1>  
                <ModalEvents/>
          </div>
          <DevicePage />
        </div>
      </div>
    </>
  );
}

export default Devices;