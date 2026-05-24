import { useEffect, useState, useRef } from "react";
import { useChatSocket } from "../hooks/useChatSocket";

/**
 * [WHAT] 일반 변수 / useState / useRef 의 동작 차이를 비교하는 테스트 컴포넌트
 * [WHY] 렌더 사이에서 값이 어떻게 유지/초기화되는지, 화면에 어떻게 반영되는지 직접 확인하기 위함
 */
const Test = () => {

    /**
     * [WHAT] 컴포넌트 함수 본문에서 선언한 일반 변수
     * [WHY] 렌더가 일어날 때마다 함수가 다시 실행되므로 매번 0으로 초기화됨을 확인
     * [HOW] updateCount에서 ++ 해도 다음 렌더에서 다시 0이 됨
     */
    let count = 0;

    /**
     * [WHAT] useState로 관리하는 카운트
     * [WHY] 값 변경 시 리렌더가 트리거되어 화면에 반영되는지 확인
     * [WHEN] setCountState 호출 시 React가 리렌더 스케줄
     */
    const [countState, setCountState] = useState(0);

    /**
     * [WHAT] useRef로 관리하는 값
     * [WHY] 렌더 사이에서 값이 유지되지만, 변경해도 리렌더가 발생하지 않음을 확인
     * [HOW] countRef.current를 변경해도 화면은 그대로 (다른 원인으로 리렌더되면 그제서야 반영)
     */
    const countRef = useRef('🐰');

    useEffect(() => {
        /**
         * [WHEN] 마운트 시점의 각 값 확인
         * [WHY] 초기값이 어떻게 잡히는지 비교
         */
        console.log("mount count: ", count);
        console.log("mount useState: ", countState);
        console.log("mount useRef: ", countRef.current);

        return () => {
            /**
             * [WHEN] 언마운트 시점의 각 값 확인
             * [WHY] cleanup 시점에 closure로 캡처된 값이 무엇인지 확인 (특히 countState는 마운트 당시 값)
             */
            console.log("unmount count: ", count);
            console.log("unmount useState: ", countState);
            console.log("unmount useRef: ", countRef.current);
        }
    }, []);

    /**
     * [WHAT] 일반 변수 증가
     * [HOW] 클릭할 때마다 count는 0 → 1이 되지만, 리렌더 시 함수가 다시 실행되며 0으로 초기화
     */
    const updateCount = () => {
        count++
        console.log("update count: ", count);
    }

    /**
     * [WHAT] useState 증가
     * [WHY] 상태 변경 → 리렌더 → 화면 갱신 흐름 확인
     * [HOW] 로그에 찍히는 countState는 "이번 렌더의 값"이므로 setState 직후에도 이전 값이 출력됨 (stale closure)
     */
    const updateCountState = () => {
        setCountState((prev) => prev + 1);
        console.log("update useState: ", countState);
    };

    /**
     * [WHAT] useRef 값 변경
     * [WHY] ref는 변경해도 리렌더가 발생하지 않음을 확인
     * [HOW] 화면은 즉시 갱신되지 않고, 다른 상태 변경으로 리렌더가 일어날 때 비로소 반영
     */
    const updateCountRef = () => {
        countRef.current += '안녕?';
        console.log("update useRef: ", countRef.current);
    };

    /**
     * [WHAT] useChatSocket을 활용한 useRef 동작 검증
     * [WHY] 훅 내부의 socketRef(useRef)가 컴포넌트 리렌더 후에도 동일한 WebSocket 인스턴스를
     *       유지하는지 확인하기 위함
     * [HOW] countState 버튼으로 리렌더를 여러 번 유발한 뒤 sendPing을 누르면,
     *       socket이 새로 만들어지지 않고도 메시지가 정상 전송됨
     *       (만약 socket을 일반 변수로 보관했다면 매 렌더마다 사라졌을 것이고,
     *        useState로 보관했다면 set할 때마다 effect가 재실행되며 재연결됐을 것)
     */
    const { isConnected, sendMessage } = useChatSocket(
        'ws://localhost:3000',
        (msg) => {
            console.log('[Test] message from server:', msg);
        }
    );

    const sendPing = () => {
        sendMessage(`ping (countState=${countState}, ref=${countRef.current})`);
    };

    return (
        <div>
            <h1>Test Page</h1>
            <p>count: {count}</p>
            <p>useState: {countState}</p>
            <p>useRef: {countRef.current}</p>
            <button onClick={updateCount}>Update count</button>
            <button onClick={updateCountState}>Update useState</button>
            <button onClick={updateCountRef}>Update useRef</button>

            <hr />

            {/*
              * useRef 사례: useChatSocket 내부 socketRef
              * 1) Update useState를 여러 번 눌러 리렌더 유발
              * 2) Send Ping 클릭 → 동일한 socket으로 전송되는지 확인
              */}
            <p>WebSocket 연결: {isConnected ? '연결됨' : '연결 끊김'}</p>
            <button onClick={sendPing} disabled={!isConnected}>Send Ping</button>
        </div>
    );
};

export default Test;
