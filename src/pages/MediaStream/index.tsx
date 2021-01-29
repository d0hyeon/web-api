import React from 'react';
import { Article, Header, Section, Ul } from '@src/components/styles/common';
import { H1, P, Code, H2, H3 } from '@src/components/styles/text';

const MediaStreamPage: React.FC = () => {
  return (
    <>
      <Header>
        <H1>Media Stream API</H1>
        <P>미디어 스트림은 Web RTC에서 사용하는 MediaStream API이다. API는 스트림을 구성하는 트랙, 데이터 형식과 관련 된 제한 인자, 비동기적으로 사용할 때 성공과 오류 콜백 또 이 때 발생하는 이벤트에 대한 인터페이스다.</P>
        <P>미디어 스트림은 사용자의 입력 장치를 이용하여 오디오나 비디오의 데이터를 스트림으로 얻을 수 있게 API를 제공해준다.</P>
        <P>미디어 스트림은 <Code>MediaStreamTrack</Code>이란 오디오 또는 비디오 트랙을 나태내는 객체로 구성되어 있다.</P>
      </Header>
      <Section>
        <Header>
          <H2>Interface</H2>
          <P>
            스트림 데이터를 얻는 방법은 <Code>getUserMedia</Code>와 <Code>getUserDisplay</Code>가 있다. <br/>
            두가지 메서드로 스트림 데이터를 추출 할 수 있으며 스트림 데이터는 다음과 같은 인터페이스를 갖는다.
          </P>
        </Header>
        <Article>
          <H3>Properties</H3>
          <Ul>
            <li>
              <P>active</P>
              <P>미디엄 스트림으 활성 상태인지에 대한 boolean 값</P>
            </li>
            <li>
              <P>id</P>
              <P>객UUID를 나타내는 36자를 포함하는 DOMString</P>
            </li>
          </Ul>
        </Article>
        <Article>
          <H3>Methods</H3>
          <Ul>
            <li>
              <P>addTrack</P>
              <P><Code>MediaStreamTrack</Code>의 복사본을 추가한다.</P>
            </li>
            <li>
              <P>clone</P>
              <P><Code>MediaStream</Code> 객체를 복사한다.</P>
            </li>
            <li>
              <P>getTrackById(id)</P>
              <P>
                파라미터의 id에 해당하는 <Code>MediaStreamTrack</Code>을 반환한다. <br/>
                없을 경우 <Code>null</Code>을 반환한다.<br/>
                여러개 일 경우 첫 번째 트랙을 반환한다.
              </P>
            </li>
            <li>
              <P>getTracks</P>
              <P>모든 트랙을 반환한다.</P>
            </li>
            <li>
              <P>getAudioTracks getVideoTracks</P>
              <P>각 타입에 맞는 트랙을 가져온다,.</P>
            </li>
          </Ul>
        </Article>
        <Article>
          <H3>Event</H3>
          <Ul>
            <li>addTrack</li>
            <li>removeTrack</li>
          </Ul>
        </Article>
      </Section>
    </>
  )
}

MediaStreamPage.displayName = 'MediaStreamPage';
export default MediaStreamPage;