import React from 'react';
import ResizeObservable from '@src/lib/ResizeObservable';
import {ToggleProps, Wrapper, Title, Content} from './Toggle';
import { isExistWithInTimeout } from '@src/utils';

const ob = new ResizeObservable();

type NodeHTML = React.ReactNode | string;
type GetHTMLOfPromise = (open: boolean) => Promise<NodeHTML>;
type GetChildrenOfFunc = (open: boolean) => React.ReactNode;

interface Props extends ToggleProps  {
  children: GetChildrenOfFunc | GetHTMLOfPromise;
}

const AsyncToggle: React.FC<Props> = ({title, children, loading, duration = 300, timeout = 3000}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastHeightRef = React.useRef<number>(0);
  const [heightValue, setHeightValue] = React.useState<string>('0px');
  const [isInit, setIsInit] = React.useState<boolean>(false); // false 일 경우 visibility 속성을 통해 실제 사이즈를 구하는 상태
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [node, setNode] = React.useState< | React.ReactNode>(null);
  const [html, setHTML] = React.useState<string | null>(null);

  const resizeHandler = React.useCallback(({height}: DOMRect) => {
    if(isOpen && height && !isAnimating) {
      lastHeightRef.current = height;
    }
  }, [isOpen, isAnimating, lastHeightRef]);

  React.useLayoutEffect(() => {
    ob.register(contentRef.current as HTMLDivElement, resizeHandler);
    return () => ob.disconnect();
  }, [resizeHandler, contentRef]);

  React.useLayoutEffect(() => {
    const transitionStartHandler = () => setIsAnimating(true);
    const transitionEndHandler = () => setIsAnimating(false);
    // 내용이 열리고 동적으로 컨텐츠가 추가 됬을 때 사이즈 감지를 위해 스타일 속성 중 height 를 auto로 변환시킴.

    const {current} = contentRef;
    contentRef.current?.addEventListener?.('transitionstart', transitionStartHandler);
    contentRef.current?.addEventListener?.('transitionend', transitionEndHandler);
    contentRef.current?.addEventListener?.('transitioncancel', transitionEndHandler);

    return () => {
      current?.removeEventListener?.('transitionstart', transitionStartHandler);
      current?.removeEventListener?.('transitionend', transitionEndHandler);
      current?.removeEventListener?.('transitioncancel', transitionEndHandler);
    }
  }, [contentRef, setHeightValue, setIsAnimating]);

  const setContents = React.useCallback((isOpen) => {
    return new Promise((resolve) => {
      const setHTMLNode = (value: React.ReactNode) => {
        if(value instanceof String) {
          setHTML(value as string);
        } else {
          setNode(value as React.ReactNode);
        }
        resolve(null);
      }
      const content = children(isOpen);
      if(content instanceof Promise) {
        return content.then(setHTMLNode);
      } 
      setHTMLNode(content);
    })
    
  }, [setHTML, setNode, contentRef, children]);

  const onLoadContentHandler = React.useCallback<() => Promise<number>>(() => {
    return new Promise(async (resolve, reject) => {
      const contentHeightRef = await isExistWithInTimeout<{current: number}>(lastHeightRef, timeout, 200);
      if(contentHeightRef) {
        resolve(lastHeightRef.current);
      } else {
        reject(null);
      }
    })
  }, [lastHeightRef, contentRef, timeout]);

  const toggleClose = React.useCallback(() => {
    setHeightValue(lastHeightRef.current + 'px');
      setTimeout(() => {
        setHeightValue('0px');
        setTimeout(() => {
          setIsOpen(false); 
          setContents(false);
        }, duration);
      });
  }, [setContents, setHeightValue, setHeightValue, setIsOpen]);

  const toggleOpen = React.useCallback(() => {
    setIsLoading(true);
    setIsOpen(true);
    setIsInit(false);
    setContents(true)
      .then(() => {
        onLoadContentHandler()
          .then((height) => {
            setIsLoading(false);
            setTimeout(() => {
              setIsInit(true);
              setHeightValue('0px');
              requestAnimationFrame(() => {
                setHeightValue(`${height}px`);
                setTimeout(() => setHeightValue('auto'), duration);
              })
            });
          })
      });
  }, [setIsOpen, setIsInit, setIsLoading, setHeightValue, onLoadContentHandler, duration, children]);

  const toggleHandler = React.useCallback<React.MouseEventHandler<Element>>(() => {
    if(isAnimating) {
      return;
    }
    if(isOpen) {
      toggleClose();
    } else {
      toggleOpen();
    }
  }, [isOpen, isAnimating, toggleClose, toggleOpen]);

  return (
    <Wrapper className="toggle-article">
      <Title isOpen={isOpen} onClick={toggleHandler} duration={duration} className="toggle__title">{title}</Title>
      {(isLoading && isOpen && loading) && loading}
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