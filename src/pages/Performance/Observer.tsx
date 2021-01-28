import React from 'react';

import { P, Code, H1, H2, H3 } from '@src/components/styles/text';
import { Header, Section, Ul } from '@src/components/styles/common';
import Highlight from 'react-highlight';
import Toggle from '@src/components/Toggle';
import PerformanceTestButton from '@src/components/PerformanceTestButton';

interface RecordPerformance {
  name: string;
  entryType: 'measure' | 'mark' | 'frame';
  startTime: number;
  duration: number;
}

const Ovserver: React.FC = () => {
  const [records, setRecords] = React.useState<RecordPerformance[]>([]);
  const observer = React.useMemo(() => {
    return new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for(let i = 0, length = entries.length; i < length; i ++) {
        const entry: RecordPerformance = {
          name: entries[i].name,
          entryType: entries[i].entryType as 'measure' | 'mark' | 'frame', 
          startTime: entries[i].startTime,
          duration: entries[i].duration
        }
        setRecords(prev => ([
          ...prev,
          entry
        ]))
        
      }
    })
  }, [setRecords]);

  React.useEffect(() => {
    observer.observe({entryTypes: ['mark', 'measure']});
    
    return () => {
      observer.disconnect();
    }
  }, [observer]);
  return (
    <>
      <Header>
          <H1>PerformanceObserver</H1>
          <P>PerfomanceObserver는 성능 측정 이벤트를 관찰하고 브라우저의 성능 타임라인에 기록 되는 항목에 대한 알림을 받는다.</P>
          <Toggle title={<P>예제</P>}>
            <Highlight>
                {`
const observer = new PerformanceObserver(list => {
  const entries = list.getEntries();
  
  for(let i = 0, length = entries; i < length; i ++) {
    console.log(entries[i]);
  }
})`.trim()
              }
              </Highlight>
          </Toggle>
        </Header>
        <Section>
          <H2>Methods</H2>
          <Ul>
            <li>
              <P>observe</P>
              <P>성능 측정 할 대상을 등록한다. 옵션으로 <Code>entryTypes</Code> <Code>type</Code> <Code>buffered</Code> 을 작성 해줄수 있다.</P>
              <Toggle title={<P>예제</P>}>
                <Highlight>
                {`
                  observer.observe({entryTypes: ['mark', 'frame', 'measure']});
                `.trim()}
                </Highlight>
              </Toggle>
              </li>
              <li>
                <P>takeRecoreds</P>
                <P>측정 된 값을 기록한다</P>
                <Toggle title={<P>예제</P>}>
                  <Highlight>
                    {`
observer.observe({entryTypes: ['mark', 'measure']});
const records = observer.takeRecords();
console.log(records[0]);
                    `.trim()}
                  </Highlight>
                </Toggle>
            </li>
          </Ul>
        </Section>
        <Section>
          <PerformanceTestButton />
        </Section>
        <Section>
          <H3>관찰 결과</H3>
          <Ul>
            {records.map(({name, entryType, startTime, duration}) => (
              <li key={`${name}-${entryType}-${startTime.toString()}-${duration.toString()}`}>
                <Ul>
                  <li>name : {name}</li>
                  <li>entry type : {entryType}</li>
                  <li>start time : {startTime}</li>
                  <li>duration : {duration}</li>
                </Ul>
              </li>
            ))}
          </Ul>
        </Section>
    </>
  )
}

Ovserver.displayName = 'PerformanceObserver';
export default Ovserver;