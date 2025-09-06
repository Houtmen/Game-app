import React, { useState } from 'react';
import logger from './logger';

interface ChatProps {
  messages: { nickname: string; text: string }[];
  onSend: (msg: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, onSend }) => {
  React.useEffect(() => {
    logger.info('Chat component mounted');
    return () => {
      logger.info('Chat component unmounted');
    };
  }, []);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      logger.info('Message sent', { message: input });
      onSend(input);
      setInput('');
    } else {
      logger.warn('Attempted to send empty message');
    }
  };

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 16 }}>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <b>{msg.nickname}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        style={{ width: '70%', marginRight: 8 }}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
