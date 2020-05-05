import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';

import Loading from './Loading';
import LoadingError from './LoadingError';

import photo from '../static/photo.jpg';

const SERVICE_URL = 'http://localhost:8080';

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

const Chat = () => {  

  const [ chatData, setChatData ] = useState({ loading: true });

  const handleResponse = (response) => {
    setChatData({
      loading: false, 
      data: [{
        id: '441646514',
        avatar: '/avatar.svg',
        title: 'Kiki, operator',
        message: "What's up?",
        orientation: 'left',
        date: new Date()
      }, {
        id: '441646515',
        avatar: '/avatar.svg',
        title: 'You',
        message: "Hey, the case kind of sucks",
        orientation: 'right',
        date: new Date()
      }]
    });
  }

  useEffect(() => {
    Axios.post(SERVICE_URL + '/api/assistant')
      .then(response => handleResponse(response))
      .catch(err => setChatData({ loading: false, error: {
        message: err.response.data && err.response.data.error ? err.response.data.error : err
      }}));
  }, []);

  const ChatInput = () => (
    <div>
      <NonResizableTextArea type="text" rows="3" placeholder="type here" className="bg-white form-control mb-2"></NonResizableTextArea>
      <button type="submit" className="btn btn-primary float-right">Submit message</button>
    </div>
  )

  const ChatList = ({ data }) => {
    return data.map(i => i.orientation === 'left' ? 
      <LeftMessage data={i} key={i.id}/> : <RightMessage data={i} key={i.id}/>
    );
  }

  const LeftMessage = ({ data }) => (
    <div className="d-flex mb-2">
      <div className="d-flex float-left flex-grow-1">
        <AvatarImage src={data.avatar} className="mt-1 rounded-circle" />
        <div className="d-flex flex-column ml-2 flex-grow-1">
          <div className="text-secondary small">{data.title}</div>
          <div>{data.message}</div>
        </div>
      </div>
    </div>
  )

  const RightMessage = ({ data }) => (
    <div className="d-flex mb-2">
      <div className="d-flex float-right flex-grow-1">
        <div className="d-flex flex-column mr-2 flex-grow-1">
          <div className="text-secondary text-right small">{data.title}</div>
          <div className="text-secondary text-right">{data.message}</div>
        </div>
        <UserImage src={photo} className="mt-1 rounded-circle" />
      </div>
    </div>
  )

  const ChatView = ({ data }) => (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1">
        <ChatList data={data} />
      </div>
      <ChatInput />
    </div>
  )

  return chatData.loading ? <Loading text="Searching the operator..."/> :
    chatData.error ? <LoadingError error={chatData.error} /> :
    <ChatView data={chatData.data} />
}

export default Chat;

