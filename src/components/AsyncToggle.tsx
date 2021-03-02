import React from 'react';
import ResizeObservable from '@src/lib/ResizeObservable';
import {ToggleProps, Wrapper, Title, Content} from './Toggle';
import { onLoadChildren } from '@src/utils/element';

const ob = new ResizeObservable();

type NodeHTML = React.ReactNode | string;
type GetHTMLOfPromise = (open: boolean) => Promise<NodeHTML>;
type GetChildrenOfFunc = (open: boolean) => React.ReactNode;

interface Props extends ToggleProps {
  children: GetChildrenOfFunc | GetHTMLOfPromise;
}

const AsyncToggle: React.FC<Props> = ({title, children, duration = 300}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastHeightRef = React.useRef<number>(0);
  const [heightValue, setHeightValue] = React.useState<string>('0px');
  const [isInit, setIsInit] = React.useState<boolean>(false); // false 일 경우 visibility 속성을 통해 실제 사이즈를 구하는 상태
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [node, setNode] = React.useState< | React.ReactNode>(null);
  const [html, setHTML] = React.useState<string | null>(null);

  const resizeHandler = React.useCallback(({height}: DOMRect) => {
    if(isOpen && height) {
      lastHeightRef.current = height;
    }
  }, [isOpen, isInit, lastHeightRef]);

  React.useLayoutEffect(() => {
    ob.register(contentRef.current as HTMLDivElement, resizeHandler);
    return () => ob.disconnect();
  }, [resizeHandler, contentRef]);

  React.useLayoutEffect(() => {
    const transitionStartHandler = () => setIsAnimating(true);
    const transitionCancleHandler = () => setIsAnimating(false);
    // 내용이 열리고 동적으로 컨텐츠가 추가 됬을 때 사이즈 감지를 위해 스타일 속성 중 height 를 auto로 변환시킴.
    const transitionEndHandler = () => {
      setIsAnimating(false);
      setHeightValue(curr => {
        return curr === '0px' 
          ? curr
          : 'auto'
      });
    };
    contentRef.current?.addEventListener('transitionstart', transitionStartHandler);
    contentRef.current?.addEventListener('transitionend', transitionEndHandler);
    contentRef.current?.addEventListener('transitioncancel', transitionCancleHandler);

    return () => {
      contentRef.current?.removeEventListener('transitionstart', transitionStartHandler);
      contentRef.current?.removeEventListener('transitionend', transitionEndHandler);
      contentRef.current?.removeEventListener('transitioncancel', transitionCancleHandler);
    }
  }, [contentRef, setHeightValue, setIsAnimating]);

  const toggleHandler = React.useCallback<React.MouseEventHandler<Element>>(() => {
    if(isAnimating) {
      return;
    };
    if(isOpen) {
      // 닫을때
      setHeightValue(lastHeightRef.current + 'px');
      setTimeout(() => {
        lastHeightRef.current = 0;
        setHeightValue('0px');
        // 트렌지션 시작
        setTimeout(() => {
          // 트렌지션 종료
          setIsOpen(false); // 모두 닫힌 후에 컨텐츠 미노출           
        }, duration)
      })
    } else {
      // 열때
      setIsOpen(true);
    }
  }, [isOpen, isAnimating, setIsOpen, setIsInit, lastHeightRef, duration]);

  const setContents = React.useCallback((value: NodeHTML) => {
    if(value instanceof String) {
      setHTML(value as string);
    } else {
      setNode(value as React.ReactNode);
    }
  }, [setHTML, setNode])

  React.useEffect(() => {
    const loadedCallback = () => {
      setIsLoaded(true);
      setIsInit(false); // resizeObserver를 통해 사이즈를 구하는 모드로 변경
      setTimeout(() => {
        setIsInit(true); // 사이즈 구했으면 종료
        setTimeout(() => setHeightValue(lastHeightRef.current + 'px'), 50)
      }, 50);
    }
    if(isOpen) {
      setIsLoaded(false);
      const content = children(isOpen);
      if(content instanceof Promise) {
        content.then((value) => {
          setContents(value);
          onLoadChildren((contentRef.current as Element), 'img').then(loadedCallback);
        });
      } else {
        setContents(content);
        onLoadChildren((contentRef.current as Element), 'img').then(loadedCallback);
      }
    }
  }, [children, isOpen, lastHeightRef, contentRef, setIsInit, setContents]);

  return (
    <Wrapper className="toggle-article">
      <Title isOpen={isOpen} onClick={toggleHandler} duration={duration} className="toggle__title">{title}</Title>
      {(!isLoaded && isOpen) && 'loading...' }
      <Content 
        height={heightValue}
        isInit={isInit} 
        ref={contentRef} 
        duration={duration}
        will-change="true"
        className={`toggle__content ${isOpen ? '' : 'hidden'}`}
      >
        {(html || node) &&  (
          html ? <div dangerouslySetInnerHTML={{__html: html}} /> : node
        )}
      </Content>
    </Wrapper>
  )
};

AsyncToggle.displayName = 'AsyncToggle';
export default React.memo(AsyncToggle);