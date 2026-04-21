import { create } from "zustand";

/**
 * 채팅 메시지 모델
 */
type ChatMessage = {
    id: string;
    text: string;
};

/**
 * 채팅 전역 상태(Store)
 *
 * state
 * - messages
 *
 * actions
 * - addMessage
//  * - removeMessage
 */
type ChatStore = {
    messages: ChatMessage[];

    addMessage: (message: ChatMessage) => void;

    // removeMessage: (id: string) => void;
};

const useChatStore = create<ChatStore>((set) => ({
    // 초기 상태
    messages: [],

    // 메시지 추가
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

    // id 기준 메시지 제거
    // removeMessage: (id) => set((state) => ({ messages: state.messages.filter((msg) => msg.id !== id) })),

}));

export default useChatStore;