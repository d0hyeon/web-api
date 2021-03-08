import React from 'react';
import styled from '@emotion/styled';
import { io } from "socket.io-client";
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, Header, Section, Ul } from '@src/components/styles/common';
import { H1, P } from '@src/components/styles/text';
import { Input } from '@src/components/styles/input';

const socket = io();

type Room = {
  title: string;
  count: number;
}

type RoomCountFromSocket = {[key: string]: number};

const WebRTCRemote = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [inputValue, setInputValue] = React.useState<string>('');
  const [roomList, setRoomList] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const inputChangeHandler = React.useCallback(({target: {value}}) => {
    setInputValue(value);
  }, [setInputValue]);

  const buttonClickHandler = React.useCallback(() => {
    socket.emit('joinRoom', inputValue);
  }, [inputValue]);

  const getRoomListFromSocket = React.useCallback((rooms: RoomCountFromSocket): Room[] => {
    return Object.entries(rooms).map(([key, value]) => ({
      title: key,
      count: value
    }))
  }, []);

  React.useEffect(() => {
    socket.on('joinedRoom', (roomName: string) => {
      history.push(roomName);
    })
  }, [history]);

  React.useEffect(() => {
    setLoading(true);
    socket.emit('getRoomList');

    socket.on('roomList', (rooms: RoomCountFromSocket) => {
      setRoomList(getRoomListFromSocket(rooms));
      setLoading(false);
    });

    socket.on('createdRoom', (roomName: string) => {
      setRoomList(prev => ([
        ...prev,
        {title: roomName, count: 1}
      ]))
    });

    socket.on('updatedRoom', (rooms: RoomCountFromSocket) => {
      alert('update!');
      const roomList = getRoomListFromSocket(rooms);
      setRoomList(prev => {
        return prev.map((room) => {
          const updateRoom = roomList.find(({title}) => title === room.title);
          if(updateRoom) {
            return updateRoom;
          }
          return room;
        })
      })
    });

    socket.on('deletedRoom', (roomName: string) => {
      setRoomList(prev => prev.filter(({title}) => title !== roomName));
    })
  }, [setRoomList, setLoading]);

  return (
    <>
      <Header>
        <H1>Room List</H1>
      </Header>
      <Section>
        {(!roomList.length && !loading) 
          ? <P>방이 없습니다.</P> 
          : loading
            ? 'loading...'
            : (
              <Ul>
                {roomList.map(({title, count}) => (
                  <li key={title}>
                    {count === 1 ? (
                      <Link to={`${pathname}/${title}`}>{title} ({count}/2)</Link>
                    ) : (
                      <DisabledP>{title} ({count}/2)</DisabledP>
                    )}
                  </li>
                ))}
              </Ul>
            )
        }
      </Section>
      <Section>
        <Input type={inputValue} onChange={inputChangeHandler}/>
        <Button onClick={buttonClickHandler}>방 추가</Button>
      </Section>
    </>
  )
};

const DisabledP = styled.p`
  opacity: 0.5;
`;

WebRTCRemote.displayName = 'WebRTCRemote';
export default WebRTCRemote;
