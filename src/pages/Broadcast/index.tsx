import React from 'react';
import styled from '@emotion/styled';
import { SInput } from '@src/components/styles/input';
import { Button, Section } from './detail';
import { useHistory } from 'react-router-dom';

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
        <h1>BroadCast Channel</h1>
        <p>BroadCast Channel은 동일 한 웹 워커 내 (Window, Tab, Frame, IFrame) 에서 브라우징 컨텍스트를 통신 할 수 있게 해주는 API이다.</p>
      </Header>
      <Section>
        <h2>채널 개설하기</h2>
        <div>
          <SInput placeholder="채널이름" ref={inputRef} />
          <Button onClick={setChannelHandler}>생성</Button>
        </div>
      </Section>
    </>
  )
};

const Header = styled.header`
  h1 {
    font-size: 24px;
  }

  p {
    margin-top: 10px;
    line-height: 1.6;
    font-size: 16px;
  }
`;

export default BroadCastChannel;