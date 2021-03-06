import React from 'react';
import styled from '@emotion/styled';
import { Header, Section } from '@src/components/styles/common';
import { H1, H2, P, Code, Em } from '@src/components/styles/text';
import Toggle from '@src/components/Toggle';
import Async from '@src/components/AsyncToggle';

const MY_TEXT = '낮엔 파란하늘\n 별이 보이는밤 \n 기분좋은날 모두 모일까 내가사랑하는 삶을 사랑하지 나는\n 우야야야야\n'
let IMAGES = [
  ...(process.env.REACT_APP_DUMP_IMAGES ?? '').split(','),
];

for(let i = 0; i < 20; i ++) {
  IMAGES.push(`https://picsum.photos/600/600/?random${Math.random() * i}`);
}

const ResizeObserverPage: React.FC = () => {
  const [text, setText] = React.useState<string>('');
  const addTextHandler = React.useCallback(() => {
    setText(prev => !!prev ? '' : MY_TEXT);
  }, [setText]);

  const getContents = React.useCallback((open) => {
    const content = (
      <GridLayout>
        {IMAGES.map((url) => (
          <div key={`async-${url}`}>
            <img src={url} alt="image"/>
          </div>
        ))}
    </GridLayout>
    )
    if(open) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(content);
        }, 500)
      })
    }
  }, []);

  return (
    <>
      <Header>
        <H1>ResizeObserver</H1>
        <P>
          ResizeObserver는 엘리먼트의 사이즈가 변경 됬을 때를 감지하여 관찰자에게 알림과 함께 요소의 크기 변경을 모니터링 할 수 있게 해주는 API이다.
        </P>
      </Header>
      <Section>
        <H2>Why?</H2>
        <P>
          기존에서는 엘리먼트 사이즈 변경 시 처리를 하고 싶다면, <Code>Element</Code> 이벤트 중 <Code>onresize</Code>이벤트를 등록하고, 해당 엘리먼트에 접근하여<br/>
          <Code>clientHeight</Code>, <Code>getBoundingClientRect()</Code> 등 엘리먼트에 직접 접근하거나 <Code>Window.getComputedStyle()</Code>에 접근하여 크기값을 가져와야했다.<br/>
          하지만 이러한 솔루션은 제한 된 사용 사례에서만 사용하고 성능에도 좋지 않으며 (프로퍼티를 접근하거나 메서드를 실행하는것 만으로 reflow가 발생함) , 브라우저 창 크기가 변경되지 않으면 작동하지 않는 경우가 많았다.          
        </P>
        <P>
          Resize Observer API는 이러한 문제에 대한 솔루션을 제공하고 요소의 박스 모델 크기 변경을 성능적으로 제공한다.
        </P>
        <ExampleSection>
          <Toggle title={<P>예제(텍스트)</P>}>
            <P>해당 컴포넌트는 Resize Observer API를 통해 엘리먼트의 사이즈를 구하고<br/> style 속성 중 height 속성을 스위칭 시키는 형태의 컴포넌트이다.</P>
            <div>
              {!!text && text.split('\n').map(text => (
                  <P key={text}>
                    {text}
                  </P>
              ))}
              <P onClick={addTextHandler}><Em>텍스트 추가</Em></P>
            </div>
          </Toggle>
        </ExampleSection>
        <ExampleSection>
          <Toggle title={<P>예제(이미지)</P>} duration={700}>
            <GridLayout>
              {IMAGES.map(url => (
                <div key={url}>
                  <img src={url} alt="banner" />
                </div>
              ))}
            </GridLayout>
          </Toggle>
        </ExampleSection>
        <ExampleSection>
          <Async title={<P>예제(비동기)</P>} loading={<P>Loading...</P>}>
            {getContents}
          </Async>
        </ExampleSection>
      </Section>
    </>
  )
};

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  row-gap: 15px;
  align-items: center;
`;

const ExampleSection = styled.div`  
  width: 100%;
  .toggle__content {
    border: 1px solid #ddd;

    &.hidden {
      border-color: transparent;
    }
  }
`;

ResizeObserverPage.displayName = 'ResizeObserverPage';
export default ResizeObserverPage;