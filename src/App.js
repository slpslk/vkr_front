import "./App.css";
import { Navigate, Outlet } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Devices from "./pages/Devices.jsx";
import Gateways from "./pages/Gateways.jsx";
import Settings from "./pages/Settings.jsx"
import store, {persistor} from './store'
import { useAuth } from "./hooks/use-auth.js";


function App() {
  
  const ProtectedRoute = ({ redirectPath = '/' }) => {
    const {isAuth} = useAuth();
    if (!isAuth) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  };

  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/devices" element={<Devices />} />
              <Route path="/gateways" element={<Gateways />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </PersistGate>
      </Provider>
    </Router>
  );
}

export default App;
