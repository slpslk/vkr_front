import Sidebar from "../Components/Sidebar.js";
import GatewaysPage from "../Components/gatewaysPage.js";

const Gateways = () => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="main">
          <h1 className="title">Ваши шлюзы</h1>
          <GatewaysPage />
        </div>
      </div>
    </>
  );
}

export default Gateways;