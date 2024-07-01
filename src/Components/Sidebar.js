import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {removeUser} from '../store/slices/userSlice.js';
import { useAuth } from '../hooks/use-auth.js';



const Sidebar = () => {

  const [show, setShow] = useState(false);
  const {fullName, username, token} = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function fetchLogOut() {
    
    const response = await fetch('http://localhost:8000/auth/logout', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const rawData = await response.json();
    return(rawData)
  }

  const handleLogOut = () => {
    fetchLogOut().then(() => {
        dispatch(removeUser())
        navigate('/');
      }
    ).catch(console.error)
  }

  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar toggled textColor="#fff" backgroundColor="#326670">
        <CDBSidebarHeader
          backgroundColor="#fff"
          prefix={<i className="fa fa-bars fa-large"></i>}
        >
          <div
            className="container"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src={"../../logo.png"} alt="" style={{ width: "150px" }} />
          </div>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="network-wired">
                {" "}
                Устройства
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/gateways" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="wifi">Шлюзы</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/settings" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Настройки</CDBSidebarMenuItem>
            </NavLink>
            
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center", paddingBottom: "10px"}}>
          <Button 
              variant="outline-light"
              onClick={handleLogOut}
            >
              <i class=" fa fa-door-open"></i>
            </Button>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
