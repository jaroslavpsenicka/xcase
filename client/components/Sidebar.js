import React, { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { A } from 'hookrouter';
import { faHome, faCog, faCube, faTasks } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  border-bottom: none;
  width: 200px;
  position: fixed;
  padding: 25px;
`
const StyledNav = styled(Nav)`
  flex-direction: column !important;
`

const Sidebar = ({ visible }) => {  

  return (
    <StyledNavbar className={ visible ? '' : 'd-none' }>
      <Navbar.Collapse>
        <StyledNav className="vertical">
          <div className="mb-2">
            <FontAwesomeIcon icon={faHome} className="text-secondary"/>
            <A className="pb-2 pl-2 font-weight-bold" href="/cases">CASES</A>
          </div>
          <div className="mb-2">
            <FontAwesomeIcon icon={faTasks} className="text-secondary"/>
            <A className="pb-2 pl-2 font-weight-bold" href="/tasks">TASKS</A>
          </div>
          <div className="mb-2 mt-4">
            <FontAwesomeIcon icon={faCube} className="text-secondary"/>
            <A className="pb-2 pl-2 font-weight-bold" href="/products">PRODUCTS</A>
          </div>
          <div className="mb-2">
            <FontAwesomeIcon icon={faCog} className="text-secondary"/>
            <A className="pb-2 pl-2 font-weight-bold" href="/settings">SETTINGS</A>
          </div>
        </StyledNav>
      </Navbar.Collapse>
    </StyledNavbar>
  ); 
};

export default Sidebar;

