import React from "react";
import ReactDOM from 'react-dom';
import ReactWebComponent from 'react-web-component';

import Chat from './Chat';

class ChatAddon extends React.Component {
  render() {
    return <Chat/>;
  }
}
  
ReactWebComponent.create(<ChatAddon />, 'chat-addon', false);

// ReactDOM.render(<Chat />, document.body.appendChild(document.createElement('div')));




