import React from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import { Header } from '@src/components/styles/common';
import { H1 } from '@src/components/styles/text';

const socket = io();

const WebRTCRoomDetail = () => {
  const { room } = useParams<{room: string}>();
  
  React.useEffect(() => {
    socket.on('joinedRoom', () => {
      console.log('join!');
    })
    socket.emit('joinRoom', room);
    return () => {
      socket.emit('leaveRoom', room);
    }
  }, []);

  return (
    <>
      <Header>
        <H1>Room Detail</H1>
      </Header>
    </>
  )
};
WebRTCRoomDetail.displayName = 'WebRTCRoomDetail';
export default React.memo(WebRTCRoomDetail);