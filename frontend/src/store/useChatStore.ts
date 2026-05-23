import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ChatMessage } from "../types/chat";

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

    addMessage: (msg: ChatMessage) => void;
    clearMessages: () => void;
};

const useChatStore = create<ChatStore>()(
    devtools(
        (set) => ({
            // 초기 상태
            messages: [],

            // [WHY] 메시지 추가 시 불변성 유지
            addMessage: (msg) =>
                set(
                    (state) => ({ messages: [...state.messages, msg] }),
                    false,
                    'chat/addMessage',
                ),

            // 메시지 전체 삭제
            clearMessages: () =>
                set({ messages: [] }, false, 'chat/clearMessages'),
        }),
        { name: "ChatStore" }
    )
);

export default useChatStore;