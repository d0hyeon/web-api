import React from 'react';
import { Button, Ul } from '@src/components/styles/common';
import { P } from '@src/components/styles/text';

export const START_MARK_NAME = 'start-performance';
export const END_MARK_NAME = 'end-performance';

const PerformanceTestButton: React.FC = () => {
  const [performState, setPerformState] = React.useState<0 | 1 | 2>(0);
  const [startMark, setStartMark] = React.useState<any>(null);
  const [endMark, setEndMark] = React.useState<any>(null);

  const togglePerformHandler = React.useCallback(() => {
    setPerformState(prev => {
      const next = prev + 1;
      if(next > 2) {
        return 0;
      }
      return next as 0 | 1 | 2;
    })
  }, [setPerformState]);

  React.useEffect(() => {
    switch(performState) {
      case 1: {
        setStartMark(performance.mark(START_MARK_NAME));
        break;
      }
      case 2: {
        setEndMark(performance.mark(END_MARK_NAME));
        break;
      }
      default: {
        setStartMark(null);
        setEndMark(null);
      }
    }
  }, [performState, setStartMark, setEndMark]);

  React.useEffect(() => {
    return () => {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }, []);

  const measure: any = React.useMemo(() => {
    if(startMark && endMark) {
      return performance.measure('example', START_MARK_NAME, END_MARK_NAME);
    }
    return null;
  }, [startMark, endMark]);

  return (
    <>
      <Button onClick={togglePerformHandler}>
        {!performState 
          ? '성능 측정하기'
          : performState === 1 ? '성능 측정 중지' : '리셋'
        }
      </Button>
      <Ul>
        {!!startMark && (
          <li>
            <P>startMark timestamp : {startMark.startTime}</P>
          </li>
        )}
        {!!endMark && (
          <li>
            <P>endMark timestamp : {endMark.startTime}</P>
          </li>
        )}
        {!!measure && (
          <li>
            <P>measure</P>
            <Ul>
              <li>startTime : {measure.startTime}</li>
              <li>duration : {measure.duration}</li>
            </Ul>
          </li>
        )}
      </Ul>
    </>
  )
}

PerformanceTestButton.displayName = 'PerformanceTestButton';
export default React.memo(PerformanceTestButton);