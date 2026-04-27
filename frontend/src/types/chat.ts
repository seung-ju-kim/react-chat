/**
 * [WHAT] 채팅 메시지 모델
 * [WHY] 클라이언트 전체에서 동일한 데이터 구조 사용
 */
export type ChatMessage = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: number;
}