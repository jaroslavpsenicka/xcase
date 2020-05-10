import React from "react";
import ReactDOM from 'react-dom';
import ReactWebComponent from 'react-web-component';

import Chat from './Chat';

class ChatAddon extends React.Component {
  render() {
    var rootElement = document.getElementById('chat-addon');
    const caseId = rootElement ? rootElement.getAttribute('caseid') : undefined;
    return <Chat caseId={caseId} />;
  }
}
  
ReactWebComponent.create(<ChatAddon />, 'chat-addon', false);

// ReactDOM.render(<Chat />, document.body.appendChild(document.createElement('div')));




