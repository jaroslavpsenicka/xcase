import React, { useContext } from 'react';
import styled from 'styled-components';

import { AppContext } from '../AppContext';

const ChatContainer = styled.div`
  width: 300px;
  min-width: 300px;
  height: calc(100vh - 70px);
`

const AddonContainer = ({ visible }) => {  

  const { selectedAddon } = useContext(AppContext);

  const Addon = () => {
    const AddonTag = `${selectedAddon.name}-addon`;
    return (
      <>
        <h4 className="text-muted font-weight-light text-uppercase mb-4">{selectedAddon.label}</h4>
        <AddonTag class="d-flex flex-grow-1" />
      </>
    )
  }

  return (
    <ChatContainer className={ visible ? 'py-4 pr-4 pl-0 d-flex flex-column' : 'd-none' }>
      { selectedAddon ? <Addon /> : null }
    </ChatContainer>
  ); 
};

export default AddonContainer;

