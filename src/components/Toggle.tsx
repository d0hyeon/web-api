import React from 'react';
import styled from '@emotion/styled';
import ResizeObservable from '@src/lib/resizeObservable';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Toggle: React.FC<Props> = ({children, title}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastHeightRef = React.useRef<number>(0);
  const [heightValue, setHeightValue] = React.useState<string>('0px');
  const [isInit, setIsInit] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    const ob = new ResizeObservable();
    ob.register(contentRef.current as HTMLDivElement, ({height}) => {
      if(height >= lastHeightRef.current) {
        lastHeightRef.current = height;
        setIsInit(true);
      }
    });

    return () => ob.disconnect();
  }, [setIsInit, children, contentRef]);

  React.useLayoutEffect(() => {
    // 내용이 열리고 동적으로 컨텐츠가 추가 됬을 때 사이즈 감지를 위해 스타일 속성 중 height 를 auto로 변환시킴.
    const transitionEndHandler = () => setHeightValue('auto');
    contentRef.current?.addEventListener('transitionend', transitionEndHandler);

    return () => contentRef.current?.removeEventListener('transitionend', transitionEndHandler);
  }, [contentRef, setHeightValue]);

  const toggleHandler = React.useCallback(() => {
    // 열고 닫을 때만 스타일에 높이값을 직접 부여하여 transition 효과를 줌
    setHeightValue(lastHeightRef.current + 'px');
    setTimeout(() => {
      setIsOpen(curr => !curr);
    }, 1)
  }, [setIsOpen, lastHeightRef]);

  return ( 
    <Wrapper >
      <Title isOpen={isOpen} onClick={toggleHandler}>{title}</Title>
      <Content 
        isOpen={isOpen}
        height={heightValue}
        isInit={isInit} 
        ref={contentRef} 
        will-change="true"
      >
        {children}
      </Content>
    </Wrapper>
  )
};

export default React.memo(Toggle);

interface StyledProps {
  height: string;
  isInit: boolean;
  isOpen: boolean;
}

const Title = styled.div<Pick<StyledProps, 'isOpen'>>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  &::before {
    margin-right: 8px;
    transition: transform 300ms;
    ${({isOpen}) => !!isOpen && ({
      transform: 'rotate(90deg)'
    })}
    cursor: pointer;
    font-size: inherit;
    line-height: inherit;
    content: '▶'
  }
`;
const Content = styled.div<StyledProps>`
  padding-left: 8px;
  overflow: hidden;
  ${({isInit, height, isOpen}) => `
    ${isInit ? `
      transition: height 300ms;
      height: ${isOpen ? height : '0'};
    ` : `
      height: auto;
      visible: hidden;
    `}
  `};
`

const Wrapper = styled.article`
  position: relative;
`