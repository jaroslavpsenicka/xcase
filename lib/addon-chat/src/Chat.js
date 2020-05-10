import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

import Loading from './Loading';
import LoadingError from './LoadingError';

import photo from '../static/photo.jpg';
import avatar from '../static/avatar.svg';

const SERVICE_URL = 'http://localhost:8080';
const OPERATOR = 'Kiki';
const USER = 'You';

const AvatarImage = styled.img`
  width: 32px;
  height: 32px;
`
const UserImage = styled.img`
  width: 32px;
  height: 32px;
  filter: grayscale(100%);
  opacity: 0.8;
`
const NonResizableTextArea = styled.textarea`
  resize: none;
`
const ChatListContainer = styled.div`
  max-height: calc(100vh - 280px);
  padding-right: 10px;
`
const styledLoadingImage = {
  width: '20px !important',
  height: '20px',
  margin: '12px auto'
}

const Chat = ({ caseId }) => {  

  const [ session, setSession ] = useState({ loading: true });
  const [ chatData, setChatData ] = useState([]);
  const [ waitingForResponse, setWaitingForResponse ] = useState(false);

  const actionRef = useRef(null); 

  const handleSubmit = (message) => {
    setWaitingForResponse(true);
    setChatData(prev => [ ...prev, { orientation: 'right', message: message, timestamp: Date.now() }]);

    const payload = { 
      input: { 
        text: message,
        options: {
          return_context: true
        }
      },
      context: {
        skills: {
          "main skill": {
            user_defined: {
              caseId: caseId
            }
          }
        }
      }
    }

    Axios.post(SERVICE_URL + '/api/assistant/' + session.session_id + '/message', payload)
      .then(response => handleResponse(response))
      .catch(err => handleError(err));
  }

  const handleResponse = (response) => {
    setWaitingForResponse(false);
    setChatData(prev => [ ...prev, response.data]);
  }

  const handleError = () => {
    setWaitingForResponse(false);
    setChatData(prev => [ ...prev, { err: err.response.data }]);
  }

  useEffect(() => {
    Axios.post(SERVICE_URL + '/api/assistant')
      .then(response => {
        setSession({ loading: false, session_id: response.data.session_id });
        Axios.post(SERVICE_URL + '/api/assistant/' + response.data.session_id + '/message')
          .then(response => handleResponse(response))
          .catch(err => handleError(err));
        })
      .catch(err => setSession({ loading: false, error: {
        message: err.response.data && err.response.data.error ? err.response.data.error : err
      }}));
  }, []);

  const ChatInput = ({ onSubmit }) => {

    const [ msg, setMsg ] = useState();
    const inputRef = useRef(null);

    const handleKeyUp = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
    }

    const handleSubmit = () => {
      onSubmit(msg.replace(/^\s+|\s+$/g, ''));
      setMsg('');
      inputRef.current.focus();
    }

    useEffect(() => {
      inputRef.current.focus();
    }, []);

    return (
      <NonResizableTextArea type="text" rows="3" placeholder="type here,  &#9166;  to submit" className="bg-white form-control mb-2"
        ref={inputRef} value={msg}
        onChange={(event) => setMsg(event.target.value)}  
        onKeyUp={(event) => handleKeyUp(event)} />
    )
  }

  const ChatList = () => {
    const messages = chatData.map(i => i.orientation === 'right' ? 
      <RightMessage data={i} key={i.timestamp}/> : <LeftMessage data={i} key={i.timestamp}/>
    );

    if (waitingForResponse) {
      const title = `${OPERATOR}, operator`;
      const message = `${OPERATOR} is typing...`;
      messages.push(<LeftMessageTyping title={title} message={message} key='typingMessage'/>);
    }

    return messages;
  }

  const TextResponse = ({output}) => {
    const out = output.generic.find(o => o.response_type === 'text');
    return out ? <div>{out.text}</div> : null;
  }

  const ActionResponse = ({output}) => {
    const out = output.generic.find(o => o.response_type === 'option');
    return out ? <ActionList options={out.options} /> : null;
  }

  const ActionList = ({options}) => (
    <div className="text-right">
      { options.map(o => <Action option={o} key={o.label} />) }
    </div>  
  )

  const Action = ({option}) => (
    <button ref={actionRef} className="mt-2 ml-2 btn btn-secondary btn-sm" 
      onClick={() => actionRef.current.dispatchEvent(new CustomEvent("navigate", { 
        bubbles: true, 
        detail: '/cases/' + caseId + '/action/' + option.value.input.text 
      }))}>{option.label}</button>
  )

  const LeftMessage = ({ data }) => (
    <div className="d-flex mb-2">
      <div className="d-flex float-left flex-grow-1">
        <AvatarImage src={avatar} className="mt-1 rounded-circle" />
        <div className="d-flex flex-column ml-2 flex-grow-1">
          <div className="text-secondary small">{OPERATOR}, operator</div>
          <TextResponse output={data.output} />
          <ActionResponse output={data.output} />
        </div>
      </div>
    </div>
  )

  const RightMessage = ({ data }) => (
    <div className="d-flex mb-2">
      <div className="d-flex float-right flex-grow-1">
        <div className="d-flex flex-column mr-2 flex-grow-1">
          <div className="text-secondary text-right small">{USER}</div>
          <div className="text-secondary text-right">{data.message}</div>
        </div>
        <UserImage src={photo} className="mt-1 rounded-circle" />
      </div>
    </div>
  )

  const LeftMessageTyping = ({ title, message }) => (
    <div className="d-flex mb-2">
      <div className="d-flex float-left flex-grow-1">
        <FontAwesomeIcon icon={faSpinner} className="fa-pulse mb-3 d-block" style={styledLoadingImage}/>
        <div className="d-flex flex-column ml-2 flex-grow-1">
          <div className="text-secondary small">{title}</div>
          <div className="text-secondary">{message}</div>
        </div>
      </div>
    </div>
  )

  const ChatView = () => (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1">
        <ChatListContainer className="overflow-auto">
          <ChatList />
        </ChatListContainer>
      </div>
      <ChatInput onSubmit={handleSubmit}/>
    </div>
  )

  return session.loading ? <Loading text="Searching the operator..."/> :
    session.error ? <LoadingError error={session.error} /> :
    <ChatView />
}

export default Chat;

