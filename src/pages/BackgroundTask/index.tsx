import React from 'react';

import Toggle from '@src/components/Toggle';
import { Header, Section, Ul, Button } from '@src/components/styles/common';
import { H1, H2, P, Code } from '@src/components/styles/text';

type RequestIdleCallbackArgument = {
  didTimeout: boolean;
  timeRemaining: () => number;
}
type RequestIdleHandler = (handler: RequestIdleCallbackArgument) => void;
declare global {
  interface Window {
    requestIdleCallback: ((callback: RequestIdleHandler) => any) | null
    cancelIdleCallback: ((id: any) => void) | null;
  }
};

const idleTasks = [() => alert('run idle task 1'), () => alert('run idle task 2'),() => alert('run idle task 3'),() => alert('run idle task 4')];

const BackgroundTask: React.FC = () => {
  const idleTaskIdxRef = React.useRef<number>(0);
  const mainTaskCntRef = React.useRef<number>(0);
  const timerIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    // Polyfill
    const isSupport = !!window.requestIdleCallback;
    if(!isSupport) {
      alert('해당 브라우저에서는 requestIdleCallback이 지원되지 않습니다.\n polyfill로 작동 시키므로 실제 결과물과 다를 수 있습니다.')
    }
    window.requestIdleCallback = window.requestIdleCallback || function (handler: RequestIdleHandler) {
      let startTime = Date.now();
      return setTimeout(() => {
        handler({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50.0 - (Date.now() - startTime));
          }
        })
      }, 1);
    };
    window.cancelIdleCallback = window.cancelIdleCallback || function(id: any) {
      clearTimeout(id);
    }

    return () => {
      if(!isSupport) {
        window.requestIdleCallback = null;
        window.cancelIdleCallback = null;
      }
    }
  }, []);

  const idleFn = React.useCallback((idle) => {
    idleTasks[idleTaskIdxRef.current](); 
    console.log(idle.didTimeout, idle.timeRemaining());
    if(idleTasks.length-1 > idleTaskIdxRef.current++) {
      //@ts-ignore
      window.requestIdleCallback(idleFn);
    }
  }, [idleTaskIdxRef]);


  const mainFn: any = React.useCallback(() => {
    const timer = Math.random() * 1000;
    alert(`run main task(${mainTaskCntRef}) (delayTime: ${parseInt(timer.toString())}ms)`);
    if(idleTasks.length-1 > mainTaskCntRef.current++) {
      return setTimeout(mainFn, timer);
    }
  }, [mainTaskCntRef]);

  React.useEffect(() => {
    return () => {
      //@ts-ignore
      window.cancelIdleCallback(idleFn);
      clearTimeout(timerIdRef.current);
    }
  }, [idleFn, timerIdRef]);

  const runIdleTaskWithMainTask = React.useCallback(() => {
    idleTaskIdxRef.current = 0;
    mainTaskCntRef.current = 0;
    //@ts-ignore
    window.requestIdleCallback(idleFn);
    timerIdRef.current = mainFn();
  }, [idleFn, mainFn, timerIdRef, mainTaskCntRef, idleTaskIdxRef])


  return (
    <>
      <Header>
        <H1>Background Task</H1>
        <P>
          백그라운드 태스크는 <Code>requestIdleCallback</Code> 라고도 부른다.<br />
          user agent가 자유시간이 있다고 판단하게 되면, 자동으로 실행 될 작업을 태스크 큐에 넣을 수 있도록 기능을 제공 해준다.
        </P>
        <P>
          웹 브라우저의 메인 스레드는 이벤트 루프를 중심으로 동작한다. 페이지에서 실행 해야하는 스크립트 코드를 실행하고 입력 장치에서 이벤트를 받아들이고, 받을 요소에 이벤트를 전달(dispatch) 한다.<br/>
          또한 이벤트 루프는 운영체제와 상호작용, 브라우저 자체의 유저 인터페이스에 대한 업데이트 등을 처리한다. 이는 매우 복잡한 코드 덩어리이며, 메인 자바스크립트 코드는 이 모든 스레드와 함께 바로 실행 될 수 있다.<br/>
        </P>
        <P>
          이벤트 처리 및 화면 업데이트는 유저가 성능 문제를 인식 할 수 있는 가장 확실한 부분이다. 따라서 우리의 코드가 훌륭한 시민이 되어야 하고 이벤트 루프의 실행이 지연되는 것을 방지하는것이 중요하다. <br/>
          과거에는 이런 작업을 웹 워커에게 맡기는 것 외에는 안정적으로 수행 할 수 있는 방법이 없었다.<br/>
          <Code>Window.requestIdleCallback</Code>을 사용하면 브라우저의 이벤트 루프가 원할하게 실행되도록 보장하는데 적극적으로 참여 할 수 있다. 또한 브라우저가 시스템에서 지연없이 사용 할 수 있는 시간을 코드에게 알릴 수 있다.
        </P>
      </Header>
      <Section>
        <Toggle title={<P><Code>requestIdleCallback</Code>의 주의사항</P>}>
          <Ul>
            <li>
              우선순위가 높지 않은 태스크만 <Code>requestIdleCallback</Code>를 사용한다. <br/>
              <Code>requestIdleCallback</Code>은 얼마나 많은 콜백이 설정 되었는지 알지 못하고, 사용자의 시스템이 얼마나 바쁜지 알 수 없다.(timeout을 지정하지 않으면) <br/>
              이벤트 루프 또는 화면 업데이트 주기를 통과 할 때 마다 콜백이 실행된다는 보장이 없다.
            </li>
            <li>
              <Code>requestIdleCallback</Code> 은 할당 된 시간을 초과하지 않도록 해야한다.<br/>
              브라우저는 일반적으로 지정된 시간제한을 초과해도 정상적으로 계속 실행된다.<br/> 
              이벤트 루프를 통해 현재 패스를 끝내고 다른 코드가 버벅이거나 애니메이션 효과가 지연되지 않도록 한다.<br/>
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline/timeRemaining" target="_blank" rel="noreferrer">
                <Code>timeRemaining</Code>
              </a>를 보면 50밀리초의 상한선이 있으나, 실제로는 이벤트 프로세서 시간을 필요로 하는 브라우저 확장 등으로 인해 이미 그 시간이 적을 수 있다.
            </li>
            <li>
              <Code>requestIdleCallback</Code> 내에서 DOM 변경은 피해야 한다. <br/>
              현재 프레임은 이미 드로잉을 마쳤으므로 모든 레이아웃의 업데이트와 계산이 완료 된 상태이다. 레이아웃에 영향을 주는 변경사항을 적용하면 브라우저가 중지되어야 하고 재계산 해야하는 상황이 발생 할 수 있다.<br/>
              DOM 변경이 요구된다면 <Code>requestAnimationFrame</Code>을 사용해야 한다.
            </li>
            <li>
              실행시간을 예측 할 수 없는 태스크는 피해야 한다. <br/>
              위와 같은 사유로 예측 가능한 태스크만 작성해야한다.<br/>
              또한 <Code>Promise</Code>를 통해 <Code>resolve</Code> 나 <Code>reject</Code>하는 것은 피해야한다. 콜백이 반환되는 순간 해당 promise의 resolve와 reject에 대한 처리기를 호출하기 때문이다.
            </li>
            <li>timeout 은 정말 필요할 때 만 써야한다.</li>
          </Ul>
        </Toggle>
      </Section>
      <Section>
        <H2>requestIdleCallback</H2>
        <P>
          requestIdleCallback는 브라우저의 idle 상태에 호출 될 함수를 대기열에 넣습니다. <br/>
          이를 통해 개발자는 애니메이션 및 입력 응답과 같은 대기 시간이 중요한 이벤트에 영향을 미치지 않고 백그라운드 및 우선순위가 낮은 작업을 수행 할 수 있습니다.<br/>
          일반적으로 함수는 stack 형태로 FIFO순서로 호출되지만 <Code>timeout</Code> 옵션이 지정 된 callback은 제한 시간이 지나기 전에 실행하기 위해 순서에 맞지 않게 호 출 될 수 있다.
        </P>
        <P>
          파라미터로는 <Code>callback</Code>과 <Code>options</Code>를 각각 전달 할 수 있는데, <br/>
          <Code>options</Code>는 <Code>timeout</Code>을 설정 할 수 있다. 해당 <Code>timeout</Code>이 지날 때 까지 <Code>callback</Code>이 실행되지 않았다면 다음 idle상태에 호출 된다. <br/>
        </P>
        <P>
          임의로 작성 한 코드는 메인 테스크가 제귀적으로 실행되는데, 0ms ~ 1000ms 내의 랜덤 한 delay 시간을 두고 반복된다.<br/> 
          이 때 delay시간으로 인해 idle상태가 될 수 있는데 이 때 idleCallback이 실행 된다.
        </P>
        <P>
          <Button onClick={runIdleTaskWithMainTask}>체험해보기</Button>
        </P>
      </Section>
    </>
  )
}

BackgroundTask.displayName = 'BackgroundTask';
export default BackgroundTask;