import { Button, Header, Section } from '@src/components/styles/common';
import { H1, H2, P } from '@src/components/styles/text';
import Toggle from '@src/components/Toggle';
import React, { FC, lazy, Suspense, useCallback, useEffect, useMemo } from 'react';

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
      </Header>
      <Section>
        <Button onClick={handleReqNotification}>알림 발송</Button>
        <Toggle title={<P>예제</P>}>
          <Suspense fallback="">
            {/* @ts-ignore */}
            <Highlight>
              {`
const noti = new Notification('알림', {
  body: '알림 컨텐츠',
  data: {
    createdAt: Date.now()
  }
})
              `}
            </Highlight>
          </Suspense>
        </Toggle>
      </Section>
    </>
  )
}

export default NotificationPage;