import { FC, lazy, Suspense, useCallback, useEffect, useMemo } from 'react';
import { Article, Button, Header, Section, Ul } from '@src/components/styles/common';
import { Code, H1, H2, P } from '@src/components/styles/text';
import Toggle from '@src/components/Toggle';

enum NotificationPermissionEnum {
  GRANTED = 'granted',
  DENIED = 'denied',
  DEFAULT = 'default'
}

const NotificationPage: FC = () => {
  const requestPermission = useCallback<() => Promise<boolean>>(async () => {
    const permission = await Notification.requestPermission();
    return permission === NotificationPermissionEnum.GRANTED;
  }, []);

  const handleClickNotification = useCallback(({target}: NotificationEventMap['click']) => {
    const data = (target as NotificationOptions).data;
    if(data) {
      alert(`[notification]\n${Object.keys(data).map(key => `${key} : ${data[key]}\n`)}`);
    }
  }, [])

  const handleReqNotification = useCallback(async () => {
    if(Notification.permission !== NotificationPermissionEnum.GRANTED) {
      const isPermission = await requestPermission();
      if(isPermission) {
        handleReqNotification();
      }
      return;
    }

    const notification = new Notification('My Notification', {
      body: 'hello do hyeon app',
      data: {
        createdAt: Date.now(),
      }
    })

    notification.addEventListener('click', handleClickNotification)
  }, [requestPermission, handleClickNotification]);
  
  const Highlight = useMemo(() => {
    return lazy(() => import('react-highlight'));
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission])
  
  return (
    <>
      <Header>
        <H1>Notification</H1>
        <P>Notification은 웹 브라우저에 알림을 띄우는 API이다</P>
        <P>Notification은 HTTPS 프로토콜의 웹 사이트에서만 사용할 수 있다.</P>
        <P>Notification.requestPermission API를 통해 사용자에게 사전 권한을 부여 받아야 한다.</P>
      </Header>
      <Section>
        <Header>
          <H2>Interface</H2>
        </Header>
        <Article>
          <Ul>
            <li>title: <Code>string</Code></li>
            <li>
              options: <Code>NotificationOptions</Code>
              <Ul>
                <li>
                  actions: <Code>NotificationAction</Code>
                </li>
                <li>
                  dir: <Code>ltr | rtr</Code> - 알림 표시 방향 (defualt: auto)
                </li>
                <li>
                  lang: <Code>string</Code>
                </li>
                <li>
                  badge: <Code>string</Code> - 알림을 표시할 공간이 부족할 때 표현되는 이미지의 URL
                </li>
                <li>
                  body: <Code>string</Code> - 알림의 본문
                </li>
                <li>
                  tag: <Code>string</Code> - 식별 태그
                </li>
                <li>
                  icon: <Code>string</Code> - 알림에 표시할 아이콘 경로
                </li>
                <li>
                  image: <Code>string</Code> - 알림에 표시할 이미지의 경로 
                </li>
                <li>
                  data: <Code>any</Code> - 알림에서 사용할 데이터
                </li>
                <li>
                  vibrate: <Code>VibratePattern</Code> - 진동 패턴
                </li>
                <li>
                  renotify: <Code>boolean</Code> - 새로운 알림이 기존의 알림을 교체하는지의 여부 (default: <Code>false</Code>)
                </li>
                <li>
                  requireInteraction: <Code>boolean</Code> - 알림이 자동으로 닫히지 않고 사용자가 클릭하거나 닫기 전까지 활성화 되는 여부 (default: <Code>false</Code>)
                </li>
                <li>
                  silent: <Code>boolean</Code> - 알림이 무음인지 여부 (default: <Code>false</Code>)
                </li>
              </Ul>
            </li>
          </Ul>
        </Article>
        <br/>
        <Article>
          <P>
            특히나 알림 API는 서비스 워커 환경에서도 사용할 수 있는데 이러한 특성을 활용하여<br/>
            서비스 워커를 브라우저에 설치하고, 푸쉬 API를 사용하여 웹 사이트를 종료하더라도 서버에서 내려주는 알림을 언제든 띄울 수 있다.<br/>
            (물론 모든 접속했던 사용자의 정보를 저장할 수 있을 만큼 서버의 메모리가 무한하다는 가정 하에..)
          </P>
        </Article>
        <Article>
          <Button onClick={handleReqNotification}>알림 발송</Button>
          <br /><br />
          <Toggle title={<P>예제</P>}>
            <Suspense fallback="">
              {/* @ts-ignore */}
              <Highlight>
                {`
  const notification = new Notification('알림', {
    body: '알림 컨텐츠',
    data: {
      createdAt: Date.now()
    }
  })
                `}
              </Highlight>
            </Suspense>
          </Toggle>
        </Article>
      </Section>
    </>
  )
}

export default NotificationPage;