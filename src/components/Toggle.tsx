import React from 'react';
import styled from '@emotion/styled';
import { P } from '@src/components/styles/text';
import ResizeObservable from '@src/lib/resizeObservable';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Toggle: React.FC<Props> = ({children, title}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const maxHeightRef = React.useRef<number>(0);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isInit, setIsInit] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    const ob = new ResizeObservable();
    ob.register(contentRef.current as HTMLDivElement, ({height}) => {
      if(height >= maxHeightRef.current) {
        maxHeightRef.current = height;
        setIsInit(true);
      }
    });

    return () => ob.disconnect();
  }, [setIsInit, children, contentRef]);

  const toggleHandler = React.useCallback(() => {
    setIsOpen(curr => !curr);
  }, [setIsOpen])

  return ( 
    <Wrapper >
      <Title isOpen={isOpen} onClick={toggleHandler}>{title}</Title>
      <Content 
        height={maxHeightRef.current} 
        isInit={isInit} 
        isOpen={isOpen} 
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
  height: number;
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
    ${({isOpen}) => isOpen && ({
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
      height: ${isOpen ? height : 0}px;
    ` : `
      height: auto;
      visible: hidden;
    `}
  `};
`

const Wrapper = styled.article`
  position: relative;
`