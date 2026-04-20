import { useEffect } from 'react';

export function useChatSocket(url: string) {

    useEffect(() => {
        // WebSocket 객체 생성
        const socket = new WebSocket(url);

        // 연결 성공
        socket.onopen = () => {
            console.log('connected to websocket server');
            // 서버 메시지 받기
            socket.send('hello from react');
        };

        // 서버 메시지 받기
        socket.onmessage = ((event) => {
            console.log(event);
            console.log(
                'message from server:',
                event.data
            );
        });

        // 에러 처리
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // 연결 종료
        socket.onclose = () => {
            console.log('socket closed');
        };

        // 컴포넌트 종료 시 정리
        return () => {
            socket.close();
        };
    }, [url]);
}