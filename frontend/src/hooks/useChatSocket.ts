import { useEffect, useRef, useState } from 'react';

export function useChatSocket(
    url: string,
    onMessage: (msg: string) => void
) {

    /**
     * [WHAT] 현재 연결 상태
     * [WHY] UI나 로직에서 "연결됨/끊김" 상태 판단 필요
     * [WHEN] socket 연결/종료 시 변경됨
     */
    const [isConnected, setIsConnected] = useState(false);

    /**
     * [WHAT] WebSocket 객체 저장
     * [WHY] 렌더링이 다시 되어도 socket 유지해야 하기 때문
     * [WHEN] 최초 생성 후 계속 유지
     */
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {

        /**
         * ============================
         * 🔥 [동작 시작 시점]
         * [WHEN] 컴포넌트 mount 시 (App 실행 시)
         * ============================
         */

        // WebSocket 객체 생성
        const socket = new WebSocket(url);

        /**
         * [WHY] socket을 ref에 저장해야 이후에도 접근 가능
         * (일반 변수는 렌더링 시 초기화 됨)
         */
        socketRef.current = socket;

        /**
        * ============================
        * 🔥 서버 연결 성공 시
        * ============================
        */
        socket.onopen = () => {

            /**
             * [WHEN] 서버 연결 성공 시
             * [WHY] 상태를 업데이트해서 "연결됨" 표시
             */
            setIsConnected(true);

            console.log('connected to websocket server');

            // 서버에 첫 메시지 보내기 (테스트용)
            socket.send('hello from react');
        };

        /**
        * ============================
        * 🔥 서버로부터 메시지 수신 시
        * ============================
        */
        socket.onmessage = ((event) => {
            console.log('message from server:', event.data);

            /**
             * [WHEN] 서버로부터 메시지를 수신했을 때
             * [WHY] Hook 내부에서 상태(store)를 직접 변경하지 않고
             *       App으로 이벤트를 전달하여 역할을 분리하기 위함
             * [HOW] 전달받은 onMessage 콜백 실행
             */
            onMessage(event.data);
        });

        /**
        * ============================
        * 🔥 에러 발생 시
        * ============================
        */
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        /**
        * ============================
        * 🔥 연결 종료 시
        * ============================
        */
        socket.onclose = () => {
            /**
             * [WHEN] 서버 연결이 끊어졌을 때
             * [WHY] 상태를 false로 바꿔 UI나 로직에서 인지 가능하게
             */
            setIsConnected(false);
            console.log('socket closed');
        };

        /**
        * ============================
        * 🔥 cleanup (정리)
        * ============================
        */
        return () => {
            /**
             * [WHEN] 컴포넌트 unmount 시 (화면 사라질 때)
             * [WHY] 연결을 끊지 않으면 메모리 누수 및 중복 연결 발생
             */
            socket.close();
        };
    }, [url]);

    /**
     * [WAY] 외부(UI)에서 상태를 사용할 수 있도록 반환
     */
    return { isConnected };
}