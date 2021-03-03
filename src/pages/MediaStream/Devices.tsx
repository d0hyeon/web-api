import React from 'react';
import { Button, Header, Section, Ul } from '@src/components/styles/common';
import { Code, H1, H2, P } from '@src/components/styles/text';
import Toggle from '@src/components/Toggle';

interface EnumerateDevices {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}

const MediaDevices: React.FC = () => {
  const [enumerateDevices, setEnumerateDevices] = React.useState<EnumerateDevices[]>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        setEnumerateDevices(devices);
      })
  }, []);

  const constraints: MediaStreamConstraints = {
    audio: true,
    video: true
    // video: {
    //   width: { max: 1920, ideal: 1600},
    // }
  }

  const runUserMedia = React.useCallback(() => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        if(videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
  }, [videoRef]);

  const runDisplayMedia = React.useCallback(() => {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia(constraints)
    .then((mediaStream: MediaStream) => {
      if(videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    })
  }, [videoRef]);

  return (
    <>
      <Header>
        <H1>MediaDevices</H1>
        <P>MediaDevices 는 화면 또는 기기에 연결 된 미디어 입력 장치에 대한 엑세스를 제공한다. 본질적으로는 미디어 데이터의 모든 하드웨어 소스에 엑세스 할 수 있다.</P>
        <P>MediaDevices의 API는 아래와 같이 제공된다.</P>
      </Header>
      <Section>
        <H2>event</H2>
        <Ul>
          <li>devicechange</li>
        </Ul>
      </Section>
      <Section>
        <H1>method</H1>
        <Ul>
          <li>enumerateDevices : 미디어 입력 및 출력 장치 목록을 반환한다. 반환 값은 <Code>{'Promise<MediaDeviceInfo>'}</Code> 이다.</li>
          <li>getSupportedConstraints : 사용자 기기의 <Code>MediaTrackSupportedConstraints</Code>를 반환한다.</li>
          <li>getDisplayMedia : 사용자 화면의 스트림 데이터를 반환한다. 반환 값은 <Code>{'Promise<MediaStream>'}</Code>이다</li>
          <li>getUserMedia : 사용자 기기와 연결 된 미디어 입력 장치의 스트림 데이터를 반환한다. 반환 값은 <Code>{'Promise<MediaStream>'}</Code>이다</li>
        </Ul>
      </Section>
      <Section>
        <Toggle title={<P>enumerate devices</P>}>
          <Ul>
            {enumerateDevices.map(({groupId, kind, label}) => (
              <li key={groupId}>
                kind : {kind} / label : {label}
              </li>
            ))}
          </Ul>
        </Toggle>
        <Toggle title={<P>supported constraints</P>}>
          <Ul>
            {Object.entries(navigator.mediaDevices.getSupportedConstraints()).map(([key, value]) => (
              <li key={`${key}-${value}`}>
                {key} : {value.toString()}
              </li>
            ))}
          </Ul>
        </Toggle>
        <Section>
          <P>
            <Button onClick={runUserMedia}>getUserMedia</Button>
          </P>
          <P>
            <Button onClick={runDisplayMedia}>getDisplayMedia</Button>
          </P>
        </Section>
        <Section>
          <video ref={videoRef} autoPlay style={{maxWidth: '1000px'}} />
        </Section>
      </Section>
    </>
  )
}

export default MediaDevices;