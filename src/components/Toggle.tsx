import React from 'react';
import styled from '@emotion/styled';
import ResizeObservable from '@src/lib/ResizeObservable';
import { onLoadChildren } from '@src/utils/element';

export interface ToggleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  duration?: number;
}

const ob = new ResizeObservable();

const Toggle: React.FC<ToggleProps> = ({title, children, duration = 300}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastHeightRef = React.useRef<number>(0);
  const [heightValue, setHeightValue] = React.useState<string>('0px');
  const [isInit, setIsInit] = React.useState<boolean>(false); // 실 컨텐츠 높이가 구해졌는가?
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  const resizeHandler = React.useCallback(({height}: DOMRect) => {
    if(isOpen && height) {
      lastHeightRef.current = height;
    }
  }, [isOpen, lastHeightRef]);

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
          ? curr // 닫는 시점에서는 auto가 될 필요 없음
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
    }
    // 열고 닫을 때만 스타일에 높이값을 직접 부여하여 transition 효과를 줌
    if(isOpen) {
      // 닫을때
      setHeightValue(lastHeightRef.current + 'px');
      setTimeout(() => {
        setHeightValue('0px');
        setTimeout(() => {
          setIsOpen(false); 
        }, duration);
      });
    } else {
      // 열때
      setIsOpen(true);
    }
  }, [isOpen, isAnimating, setIsOpen, lastHeightRef, duration]);
  
  React.useEffect(() => {
    if(isOpen) {
      onLoadChildren((contentRef.current) as Element, 'img')
        .then(() => {
          setIsInit(false);
          setTimeout(() => {
            setIsInit(true);
            setHeightValue('0px');
            setTimeout(() => setHeightValue(lastHeightRef.current + 'px'), 20);
          }, 30)
        })
    }
  }, [isOpen, setHeightValue, setIsInit, lastHeightRef, contentRef])

  return (
    <Wrapper className="toggle-article">
      <Title isOpen={heightValue !== '0px' && isOpen} onClick={toggleHandler} duration={duration} className="toggle__title">{title}</Title>
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