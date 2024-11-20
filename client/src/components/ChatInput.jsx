import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ChatInput({ onMsgSend, canSend = true }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && canSend) {
      onMsgSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      setInput((prevInput) => prevInput + '\n');
      e.preventDefault();
    } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      handleSend(e);
    }
  };

  const placeholder = 'Message Agent';

  return (
    <div className="relative flex items-center text-black mt-10 mx-1">
      <form className="" onSubmit={(e) => handleSend(e)}>
        <div
          ref={containerRef}
          className="flex gap-1 items-end bg-white p-1 absolute bottom-0 left-0 right-0"
        >
          <label htmlFor="message" className="sr-only">
            {placeholder}
          </label>
          <textarea
            ref={textareaRef}
            rows={1}
            name="message"
            className="h-8 p-[0.35rem] w-full resize-none bg-platinum focus:outline-none overflow-y-auto text-sm"
            placeholder={placeholder}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="flex items-center px-4 h-8 bg-argentBlue text-sm font-semibold hover:brightness-75 rounded-md disabled:brightness-75"
            disabled={!input.trim() && !canSend}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

ChatInput.propTypes = {
  onMsgSend: PropTypes.func.isRequired,
  canSend: PropTypes.bool,
};
