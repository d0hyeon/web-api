import React from 'react';
import { Article, Header, Section, Ul } from '@src/components/styles/common';
import { H1, H2, H3, P, Code } from '@src/components/styles/text';

const MediaStreamTrackPage: React.FC = () => {
  return (
    <>
      <Header>
        <H1>MediaStreamTrack</H1>
        <P>미디어 스트림 트랙은 스트림 내의 하나의 미디어 트랙을 나타내고 일반적으로 오디오나 비디오 트랙이지만 다른 트랙의 유형도 존재 할 수 있다.</P>
        <P>미디어 스트림은 오디오 트랙에서 왼쪽과 오른쪽 처럼 미디어의 가장 작은 단위인 채널을 하나 이상 가질 수 있다.</P>
      </Header>
      <Section>
        <Header>
          <H2>Interface</H2>
          <P>MediaStreamTrack은 아래와 같은 인터페이스로 구성되어 있다.</P>
        </Header>
        <Article>
          <H3>properties</H3>
          <Ul>
            <li>enabled : 트랙이 미디어 소스 스트림을 렌더링 할 수 있는 활성화 된 유뮤에 대한 boolean 값이다. 비활성화인 <Code>false</Code> 일 경우 미디어 소스 스트림을 렌더링 하는 것이 아닌 무음과 검은 색 화면으로 띄운다.</li>
            <li>id</li>
            <li>
              <P>kind : <Code>'audio' | 'video'</Code></P>
            </li>
            <li>label : 내부 마이크와 같이 트랙 소스를 식별하는 사용자 에이전트 할당 레이블을 포함하는 문자열이다. 연결 된 소스가 없다면 문자열은 빈값이다.</li>
            <li>muted : 트랙이 기술적인 문제로 미디어 데이터를 제공 할 수 있는지에 대한 boolean값</li>
            <li>readystate : <Code>'live' | 'ended'</Code></li>
            <li>remote : 트랙이 원격 WebRTC에서 온 트랙인지 로컬 트랙인지에 대한 boolean값</li>
          </Ul>
        </Article>
        <Article>
          <H3>methods</H3>
          <Ul>
            <li>
              <P>applyConstraints([constraints])</P>
              <P>트랙에 제약 조건을 적용한다. 제약 조건은 웹사이트나 앱이 프레임률, 치수, 에코 등과 같은 속성에 대해 이상적인 값과 허용 가능한 값의 범위를 설정한다.</P>
              <P>
                <Code>MediaTrackConstraints</Code>는 다음과 같은 속성이 있다.
                <Ul>
                  <li>deviceId</li>
                  <li>groupId</li>
                  <li>autoGainControl(이하 audio전용)</li>
                  <li>channelCount</li>
                  <li>echoCancellation</li>
                  <li>latency</li>
                  <li>noiseSuppression</li>
                  <li>sampleRate</li>
                  <li>sampleSize</li>
                  <li>volume</li>
                  <li>aspectRatio(이하 video전용)</li>
                  <li>facingMode</li>
                  <li>frameRate</li>
                  <li>height</li>
                  <li>width</li>
                  <li>cursor (이하 screen전용) : 마우스 커서가 움직이지 않을 떄 노출에 대한 설정 - always, motion, never</li>
                  <li>displaySurface : 표시 할 화면에 대한 설정 - application, browser, monitor, window</li>
                </Ul>
              </P>
            </li>
            <li>clone : 트랙을 복사한다.</li>
            <li>getCapabilities : 트랙에서 사용 할 수 있는 제한 가능한 속성 목록을 반환한다.</li>
            <li>getConstraints : 현재 설정 된 제약조건을 반환한다.</li>
            <li>stop : 트랙에 연결 된 소스 재생을 중지하고 소스와 트랙 모두 연결을 해제한다.</li>
          </Ul>
        </Article>
        <Article>
          <H3>event</H3>
          <Ul>
            <li>ended</li>
            <li>mute (일시적으로 데이터가 제공 할 수 없음을 나타냄. 예를 들면 네트워크 장애가 발생한 경우)</li>
            <li>unmute</li>
          </Ul>
        </Article>
      </Section>
    </>
  )
};

MediaStreamTrackPage.displayName = 'MediaStreamTrackPage';
export default MediaStreamTrackPage;