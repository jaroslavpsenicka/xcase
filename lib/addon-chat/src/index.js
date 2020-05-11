import React from "react";
import ReactWebComponent from 'react-web-component';

import Chat from './Chat';

class ChatAddon extends React.Component {
  render() {
    var rootElement = document.getElementById('chat-addon');
    const caseId = rootElement ? rootElement.getAttribute('caseid') : undefined;
    const serviceUrl = rootElement ? rootElement.getAttribute('serviceurl') : undefined;
    return <Chat caseId={caseId} serviceUrl={serviceUrl} />;
  }
}
  
ReactWebComponent.create(<ChatAddon />, 'chat-addon', false);




