import React from 'react';
interface ChatProps {
    messages: {
        nickname: string;
        text: string;
    }[];
    onSend: (msg: string) => void;
}
declare const Chat: React.FC<ChatProps>;
export default Chat;
//# sourceMappingURL=Chat.d.ts.map