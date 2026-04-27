
import { useState } from 'react';
import '../hooks/useChatSocket';
import { useChatSocket } from '../hooks/useChatSocket';

import useChatStore from '../store/useChatStore';
export default function Chat() {

    /**
     * [WHAT] 입력값 상태
     * [WHY] 사용자가 입력한 메시지를 관리하기 위해
     */
    const [inputValue, setInputValue] = useState('');
    /**
     * [WHAT] 채팅 메시지 목록
     */
    const messages = useChatStore((state) => state.messages);
    /**
     * [WHAT] 메시지 추가 action
     * [WHY] 상태 변경은 Store에서만 일어나도록 하기 위함
     * [WHEN] 컴포넌트 렌더 시 초기화
     */
    const addMessage = useChatStore((state) => state.addMessage);



    /**
     * [WHAT] WebSocket 연결
     * TODO: URL은 환경변수로 관리하는 게 좋음!
     */
    const { isConnected, sendMessage } = useChatSocket(
        'ws://localhost:3000',
        (msg) => {
            /**
             * [WHEN] 서버에서 메시지를 수신했을 때 실행
             * [WHY] Hook에서 전달된 메시지를 Store에 반영하기 위함
             * [HOW] addMessage 호출
             */
            addMessage({
                id: Date.now().toString(),
                text: msg,
                sender: "other",
                timestamp: Date.now(),
            });
        }
    );

    /**
     * [WHAT] 메시지 전송
     */
    const handleSendMessage = () => {

        if (!inputValue.trim()) return; // 빈 메시지 전송 방지

        /**
         * [WHAT] 입력값을 서버로 전송
         * [WHY] 사용자가 입력한 메시지를 서버로 보내기 위해
         * [HOW] useChatSocket 훅이 제공하는 sendMessage 호출 (socketRef는 훅 내부에 캡슐화)
         */
        sendMessage(inputValue);

        // 내 메시지 UI 반영
        // addMessage({
        //     id: Date.now().toString(),
        //     text: inputValue,
        //     sender: "me",
        //     timestamp: Date.now(),
        // });

        setInputValue(''); // 입력창 초기화
    };

    return (
        <div>
            <h1>Chat Component</h1>
            <p>상태: {isConnected ? (<b>연결됨</b>) : <b>연결 끊김</b>}</p>
            <div>
                {messages.map((msg) => (
                    <p key={msg.id}>{msg.sender}:{msg.text}</p>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={((e) => {
                    console.log(e.nativeEvent.isComposing)
                    // [WHAT] IME 입력 중인 경우 Enter 키 무시
                    if (e.nativeEvent.isComposing) return;

                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                })}
                placeholder="메시지를 입력하세요"
            />
            <button onClick={handleSendMessage} disabled={!isConnected}>
                전송
            </button>
        </div>
    );
};