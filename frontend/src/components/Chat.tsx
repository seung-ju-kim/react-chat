import { useEffect, useMemo, useRef, useState } from 'react';
import { useChatSocket } from '../hooks/useChatSocket';
import useChatStore from '../store/useChatStore';
import useUserStore from '../store/useUserStore';
import type { WireMessage } from '../types/chat';

export default function Chat() {

    /**
     * [WHAT] 본인 식별자 (탭별 고유, 새로고침 견딤)
     * [WHY] 수신한 메시지가 본인이 보낸 건지 판단하기 위해.
     *       sessionStorage라 탭별로 독립 → 두 탭 띄워서 채팅 테스트 가능.
     */
    const myId = useMemo(() => {
        let id = sessionStorage.getItem('myId');
        if (!id) {
            id = crypto.randomUUID();
            sessionStorage.setItem('myId', id);
        }
        return id;
    }, []);

    /**
     * [WHAT] Google 로그인으로 받은 실제 사용자 이름
     * [WHY] WireMessage에 담겨 상대방 화면에 발신자 이름으로 표시됨
     *       useUserStore에서 꺼내므로 로그인 상태와 항상 동기화됨
     */
    const myUsername = useUserStore((state) => state.user?.name ?? '나');

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
     */
    const addMessage = useChatStore((state) => state.addMessage);

    /**
     * [WHAT] 메시지 목록 끝 위치를 가리키는 ref
     * [WHY] 새 메시지가 들어올 때마다 자동으로 맨 아래로 스크롤하기 위함
     */
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /**
     * [WHAT] WebSocket 연결
     * [WHY] URL은 환경별(개발/운영)로 다르므로 .env로 분리.
     *       Vite는 VITE_ 접두사 변수만 클라이언트 번들에 노출함.
     */
    const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3000';

    const { isConnected, sendMessage } = useChatSocket(
        WS_URL,
        (msg) => {
            /**
             * [WHEN] 서버에서 메시지를 수신했을 때 실행
             * [HOW] JSON 봉투를 풀고, userId가 본인이면 'me' 아니면 'other'.
             *       id는 발신측 timestamp + userId로 — 모든 탭에서 동일한 id.
             */
            const data: WireMessage = JSON.parse(msg);
            addMessage({
                id: `${data.timestamp}-${data.userId}`,
                text: data.text,
                sender: data.userId === myId ? 'me' : 'other',
                timestamp: data.timestamp,
            });
        }
    );

    /**
     * [WHAT] 메시지 전송
     * [HOW] WireMessage 봉투에 담아 서버로 전송.
     *       서버는 broadcast만 하므로, 본인 메시지도 곧바로 echo로 돌아옴
     *       → 받는 쪽에서 sender 판단까지 일원화됨 (낙관적 업데이트 불필요).
     */
    const handleSendMessage = () => {
        if (!inputValue.trim()) return; // 빈 메시지 전송 방지

        const wire: WireMessage = {
            userId: myId,
            username: myUsername,
            text: inputValue,
            timestamp: Date.now(),
        };
        sendMessage(JSON.stringify(wire));
        setInputValue('');
    };

    return (
        <div>
            <h1>Chat Component</h1>
            <p>상태: {isConnected ? (<b>연결됨</b>) : <b>연결 끊김</b>}</p>
            <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 8 }}>
                {messages.map((msg) => (
                    <p key={msg.id}>{msg.sender}:{msg.text}</p>
                ))}
                <div ref={bottomRef} />
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    // IME 입력 중(한글 조합 등)인 경우 Enter 키 무시
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="메시지를 입력하세요"
            />
            <button onClick={handleSendMessage} disabled={!isConnected}>
                전송
            </button>
        </div>
    );
};
