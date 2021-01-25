import React from 'react';
import styled from '@emotion/styled';
import { SInput } from '@src/components/styles/input';
import { useLocation, RouteChildrenProps } from 'react-router-dom';

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
      <Section>
        <h2>{channelId} 채널</h2>
        <div>
          {/* @ts-ignore */}
          <Button as="a" href={location?.pathname} target="_blank" rel="norefferrer">
            탭간의 통신하기
          </Button>

          <article>
            <h4>발신하기</h4>
            <div>
              <SInput ref={inputRef}/>
              <Button onClick={messagePostHandler}>전송</Button>
            </div>
          </article>
        </div>
      </Section>
      {!!messageList.length && (
        <Section>
          <h1>수신내역</h1>
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

export const Section = styled.section`
  margin-top: 20px;
  h3 {
    font-size: 20px;
  }
  
  > div {
    margin-top: 15px;
  }

  article {
    h4 {
      margin: 10px 0;
      font-size: 18px;
    }
  }
`

export const Button = styled.button`
  min-width: 100px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #666;
  color: #666 ;
  line-height: 28px;
  font-size: 14px;
`;

const MessageList = styled.ul`
  margin-top: 10px;
  li {
    font-size: 14px;
    & ~ li {
      margin-top: 5px;
    }
  }
`

