import React from 'react';
import styled from '@emotion/styled';
import ResizeObservable from '@src/lib/ResizeObservable';
import { isExistWithInTimeout } from '@src/utils';

export interface ToggleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  duration?: number;
  loading?: React.ReactNode;
  timeout?: number;
}

const ob = new ResizeObservable();

const Toggle: React.FC<ToggleProps> = ({
  title, 
  children, 
  loading,
  duration = 300, 
  timeout = 3000
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastHeightRef = React.useRef<number>(0);
  const [heightValue, setHeightValue] = React.useState<string>('0px');
  const [isInit, setIsInit] = React.useState<boolean>(false); // 실 컨텐츠 높이가 구해졌는가?
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const resizeHandler = React.useCallback(({height}: DOMRect) => {
    if(isOpen && height && !isAnimating) {
      lastHeightRef.current = height;
    }
  }, [isAnimating, isOpen, lastHeightRef]);

  React.useLayoutEffect(() => {
    ob.register(contentRef.current as HTMLDivElement, resizeHandler);
    return () => ob.disconnect();
  }, [resizeHandler, contentRef]);

  React.useLayoutEffect(() => {
    const transitionStartHandler = () => setIsAnimating(true);
    const transitionEndHandler = () => setIsAnimating(false);
    
    contentRef.current?.addEventListener('transitionstart', transitionStartHandler);
    contentRef.current?.addEventListener('transitionend', transitionEndHandler);
    contentRef.current?.addEventListener('transitioncancel', transitionEndHandler);

    return () => {
      contentRef.current?.removeEventListener('transitionstart', transitionStartHandler);
      contentRef.current?.removeEventListener('transitionend', transitionEndHandler);
      contentRef.current?.removeEventListener('transitioncancel', transitionEndHandler);
    }
  }, [contentRef, setHeightValue, setIsAnimating]);

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
        }, duration);
      });
  }, [setHeightValue, setHeightValue, setIsOpen]);

  const toggleOpen = React.useCallback(() => {
    setIsLoading(true);
    setIsOpen(true);
    setIsInit(false);
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
      
  }, [setIsOpen, setIsInit, setIsLoading, setHeightValue, onLoadContentHandler, duration]);

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
  
  // React.useEffect(() => {
  //   if(isOpen) {
  //     if(lastHeightRef.current) {
  //       onLoadContent((contentRef.current) as Element, 'img')
  //         .then(() => {
  //           setIsInit(false);
  //           setTimeout(() => {
  //             setIsInit(true);
  //             setHeightValue('0px');
  //             setTimeout(() => setHeightValue(lastHeightRef.current + 'px'), 20);
  //           }, 0)
  //         })
  //     };
  //   }
  // }, [isOpen, timeout, setIsLoading, setIsError, setHeightValue, setIsInit, lastHeightRef, contentRef])

  return (
    <Wrapper className="toggle-article">
      <Title isOpen={heightValue !== '0px' && isOpen} onClick={toggleHandler} duration={duration} className="toggle__title">{title}</Title>
      {(loading && isOpen && isLoading) && loading}
      <Content 
        height={heightValue}
        isInit={isInit} 
        ref={contentRef} 
        duration={duration}
        will-change="true"
        className={`toggle__content ${isOpen ? '' : 'hidden'}`}
      >
        {isOpen && children}
      </Content>
    </Wrapper>
  )
};

export default React.memo(Toggle);

interface StyledProps {
  height: string;
  isInit: boolean;
  isOpen: boolean;
  duration: number;
}

export const Title = styled.div<Pick<StyledProps, 'isOpen' | 'duration'>>`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  cursor: pointer;
  &::before {
    margin-right: 8px;
    transition: transform ${({duration}) => duration}ms;
    ${({isOpen}) => !!isOpen && ({
      transform: 'rotate(90deg)'
    })}
    cursor: pointer;
    font-size: inherit;
    line-height: inherit;
    content: '▶'
  }
`;
export const Content = styled.div<Omit<StyledProps, 'isOpen'>>`
  position: relative;
  padding-left: 8px;
  overflow: hidden;
  left: 0; 
  top: 0;
  ${({isInit, height, duration}) => `
    ${isInit ? `
      transition: height ${duration}ms;
      height: ${height};
    ` : `
      position: absolute;
      z-index: -9999;
      height: auto;
      visibility: hidden;
      opacity: 0;
    `}
  `};
`

export const Wrapper = styled.article`
  position: relative;
`