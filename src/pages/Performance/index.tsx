import React from 'react';
import { P, Code, H1, H2 } from '@src/components/styles/text';
import { Header, Section, Ul } from '@src/components/styles/common';
import PerformanceTestButton from '@src/components/PerformanceTestButton';


const Performance: React.FC = () => {
  return (
    <>
      <Header>
        <H1>Performance</H1>
        <P>Performance 인터페이스는 현재 페이지에 대한 성능 관련 정보에 대한 엑세스를 제공한다.</P>
        <P>Performance는 <Code>window.performance</Code>으로 읽을 수 있다.</P>
      </Header>
      <Section>
        <H2>Properties</H2>
        <Ul>
          <li>
            <strong>memory</strong>
            <P>기본 메모리 사용 정보 객체를 제공한다.</P>
            <P>
              {/* @ts-ignore */}
              jsHeapSizeLimit: <Code>{performance?.memory?.jsHeapSizeLimit}</Code> / 
              {/* @ts-ignore */}  
              totalJSHeapSize: <Code>{performance.memory.totalJSHeapSize}</Code> / 
              {/* @ts-ignore */}
              usedJSHeapSize: <Code>{performance.memory.usedJSHeapSize}</Code>
            </P>
          </li>
          <li>
            <strong>timeOrigin</strong>
            <P>성능 측정 시간의 고해상도 타임 스탬프를 반환한다</P>
            <P>{performance.timeOrigin}</P>
          </li>
        </Ul>
      </Section>
      <Section>
        <H2>Methods</H2>
        <Ul>
          <li>
            <strong>mark(name)</strong>
            <P>지정된 이름으로 브라우저의 성능 항목 버퍼에 타임스탬프를 만든다.</P>
          </li>
          <li>
            <strong>measure(name, startMark, endMark)</strong>
            <P>
              지정된 이름으로 브라우저의 탐색 시작 시간과 현재 시간 사이에 타임스탬프를 만든다. <br/>
              두 표시 사이를 측정 할 때 각각 시작 표시와 끝 표시가 있다. <br/>
              startMark 와 endMark는 performance.mark로 마킹 한 네임을 명명한다.
            </P>
          </li>
          <li>
            <strong>clearMarks()</strong>
            <P>브라우저의 성능 입력 버퍼에서 지정 된 표시를 제거한다.</P>
          </li>
          <li>
            <strong>clearMeasures()</strong>
            <P>브라우저의 성능 입력 버퍼에서 지정 된 측정값을 제거한다.</P>
          </li>
          <li>
            <strong>clearResourceTimings()</strong>
            <P>브라우저의 성능 데이터 버퍼에서 <Code>performance entries</Code>가 있는 모든 항목을 제거한다.</P>
          </li>
          <li>
            <strong>getEntries()</strong>
            <P><Code>performanceEntry</Code>에서 주어진 객체 목록을 반환한다.</P>
          </li>
        </Ul>
      </Section>
      <Section>
        <PerformanceTestButton />
      </Section>
    </>
  )
};

Performance.displayName = 'Performance';
export default Performance;