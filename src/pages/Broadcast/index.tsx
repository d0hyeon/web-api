import React from 'react';
import { Input } from '@src/components/styles/input';
import { Button, Section, Header } from '@src/components/styles/common';
import { useHistory } from 'react-router-dom';
import { H1, P } from '@src/components/styles/text';

const BroadCastChannel: React.FC = () => {
  const history = useHistory();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const setChannelHandler = React.useCallback(() => {
    const value = (inputRef.current?.value ?? '').trim();
    if(value) {
      history.push(`/broadcast/${value}`);
    }
  }, [inputRef, history]);

  return (
    <>
      <Header>
        <H1>BroadCast Channel</H1>
        <P>BroadCast Channel은 동일 한 웹 워커 내 (Window, Tab, Frame, IFrame) 에서 브라우징 컨텍스트를 통신 할 수 있게 해주는 API이다.</P>
      </Header>
      <Section>
        <h2>채널 개설하기</h2>
        <div>
          <Input placeholder="채널이름" ref={inputRef} />
          <Button onClick={setChannelHandler}>생성</Button>
        </div>
      </Section>
    </>
  )
};

export default BroadCastChannel;