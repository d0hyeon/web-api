import React from 'react';
import { P, Code, H1, H2, H3 } from '@src/components/styles/text';
import { Header, Section, Ul } from '@src/components/styles/common';
import Toggle from '@src/components/Toggle';
import AsyncToggle from '@src/components/AsyncToggle';
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
  
  const Highlight = React.useMemo(() => {
    return React.lazy(() => import('react-highlight'));
  }, []);

  const images = (process.env.REACT_APP_DUMP_IMAGES as string).split(',');

  const getContents = React.useCallback((open) => {
    const content = (
      <>
        {images.map((url, idx) => (
          <p key={`${url}-${idx}`}>
            <img src={url} width="100" alt="person"/>
          </p>
        ))}
        <React.Suspense fallback={null}>
          {/* @ts-ignore */}
          <Highlight>
            <div>{`
      observer.observe({entryTypes: ['mark', 'measure']});
      const records = observer.takeRecords();
      console.log(records[0]);
              `.trim()}
            </div>
          </Highlight>
        </React.Suspense>
    </>
    )
    if(open) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(content);
        }, 500)
      })
    }
  }, [images, Highlight]);

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
            <React.Suspense fallback="">
              <>  
                {/* @ts-ignore */}
                <Highlight>
{`
const observer = new PerformanceObserver(list => {
const entries = list.getEntries();
    
  for(let i = 0, length = entries; i < length; i ++) {
    console.log(entries[i]);
  }
})`.trim()}
                </Highlight>
                <img src={images[0]} alt="person"/>
                {images.map((url) => (
                  <p key={url}>
                    <img src={url} width="100" alt="person"/>
                  </p>
                ))}
              </>
            </React.Suspense>
          </Toggle>
        </Header>
        <Section>
          <H2>Methods</H2>
          <Ul>
            <li>
              <P>observe</P>
              <P>성능 측정 할 대상을 등록한다. 옵션으로 <Code>entryTypes</Code> <Code>type</Code> <Code>buffered</Code> 을 작성 해줄수 있다.</P>
              <Toggle title={<P>예제</P>}>
                <React.Suspense fallback="">
                  {/* @ts-ignore */}
                  <Highlight>
                  {`
                    observer.observe({entryTypes: ['mark', 'frame', 'measure']});
                  `.trim()}
                  </Highlight>
                </React.Suspense>
              </Toggle>
              </li>
              <li>
                <P>takeRecoreds</P>
                <P>측정 된 값을 기록한다</P>
                <AsyncToggle title={<P>예제</P>} >
                  {getContents}
                </AsyncToggle>
                <Toggle title={<P>예제</P>}>
                  <React.Suspense fallback="">
                    {/* @ts-ignore */}
                    <Highlight>
                      {`
  observer.observe({entryTypes: ['mark', 'measure']});
  const records = observer.takeRecords();
  console.log(records[0]);
                      `.trim()}
                    </Highlight>
                    </React.Suspense>
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
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <Section>
          <H3>해당 페이지의 로딩속도저하 원인</H3>
          <Ul>
            <li>1. font 파일 로딩 </li>
            <li><del>2. highlight 모듈 로딩 - 호출과 사용의 비용이 상당함.</del> - lazy loading 적용</li>
            <li><del>3. 토글 컴포넌트 내의 highlight 마운트 (닫혀있는데 불필요한 마운트)</del> - Toggle 컴포넌트 전면 개편</li>
          </Ul>
        </Section>
    </>
  )
}

Ovserver.displayName = 'PerformanceObserver';
export default Ovserver;