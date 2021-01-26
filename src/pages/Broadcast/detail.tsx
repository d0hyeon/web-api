import React from 'react';
import styled from '@emotion/styled';
import { Input } from '@src/components/styles/input';
import { useLocation, RouteChildrenProps } from 'react-router-dom';
import { Button, Section, Header } from '@src/components/styles/common';
import { H2, H3, Em } from '@src/components/styles/text';

type MutableRefObject<T> = {
  current: T | null;
}

interface Params {
  channelId: string;
}

interface Message {
  data: string;
  timeStamp: number;
}

const BroadCast: React.FC<RouteChildrenProps<Params>> = ({match}) => {
  const channelId = match?.params.channelId ?? '';
  const location = useLocation();
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  const channelRef:MutableRefObject<any> = React.useRef(null);

  const messagePostHandler = React.useCallback(() => {
    channelRef.current?.postMessage?.(inputRef.current?.value);
    alert('다른 탭을 확인해주세요.');
  }, [inputRef, channelRef]);

  React.useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      alert('메세지가 도착하였습니다.');
      const {data, timeStamp} = event;
      setMessageList(prev => ([
        ...prev,
        {data, timeStamp}
      ]))
    }
    const channel = new BroadcastChannel(channelId);
    channelRef.current = channel;
    channel.addEventListener('message', messageHandler);
    
    return () => {
      channel.removeEventListener('message', messageHandler);
      channel.close();
    }
  }, [channelRef, channelId, setMessageList]);

  return (
    <>
      <Header>
        <H2><Em>{channelId}</Em> 채널</H2>
        <div>
          {/* @ts-ignore */}
          <Button as="a" href={location?.pathname} target="_blank" rel="norefferrer">
            탭간의 통신하기
          </Button>
        </div>
      </Header>
      <Section>
        <H3>발신하기</H3>
        <div>
          <Input ref={inputRef}/>
          <Button onClick={messagePostHandler}>전송</Button>
        </div>
      </Section>
      {!!messageList.length && (
        <Section>
          <H3>수신내역</H3>
          <MessageList>
            {messageList.map(({timeStamp, data}) => (
              <li key={timeStamp.toString()}>
                {data}
              </li>
            ))}
          </MessageList>
        </Section>
      )}
    </>
  )
};

export default React.memo(BroadCast);

const MessageList = styled.ul`
  margin-top: 10px;
  li {
    font-size: 14px;
    & ~ li {
      margin-top: 5px;
    }
  }
`