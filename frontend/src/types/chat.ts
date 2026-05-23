/**
 * [WHAT] 화면에 그릴 채팅 메시지 (Store 저장용)
 */
export type ChatMessage = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: number;
}

/**
 * [WHAT] WebSocket으로 오가는 메시지 봉투
 * [WHY] 통신 형식과 화면 표현을 분리하기 위함.
 *       이 형식은 클라끼리의 약속 — 서버는 내용 안 보고 그대로 broadcast.
 */
export type WireMessage = {
    userId: string;
    username: string;
    text: string;
    timestamp: number;
}