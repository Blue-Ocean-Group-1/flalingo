import { useEffect, useState, useRef } from 'react';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import ChatInput from '../components/ChatInput';
import { useParams } from 'react-router-dom';
import {
  getChatroom,
  getChatroomMessages,
  createChatMessage,
} from '../services/chatroom.api';
import { hashCode } from '../utils/utils';
import useUserData from '../hooks/useUserData';
import Logger from '../../config/logger.js';

export default function ChatRoomPage() {
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState({ name: '', language: '' });
  const [errMsg, setErrMsg] = useState('');
  let { roomId } = useParams();
  const [userData] = useUserData();
  const scrollableContainerRef = useRef(null);

  function scrollToBottom() {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    async function fetchChatRoomData() {
      try {
        const roomResults = await getChatroom(roomId);
        setDetails(roomResults.chatroom);
        const msgResults = await getChatroomMessages(roomId);
        setMessages(msgResults.messages);
      } catch (err) {
        setErrMsg('Failed to fetch chatroom data');
      }
    }
    fetchChatRoomData(roomId);
  }, []);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollToBottom();
    }
  }, [scrollableContainerRef]);

  // Set up polling
  useEffect(() => {
    let intervalId;
    intervalId = setInterval(async () => {
      const results = await getChatroomMessages(roomId);
      if (results.messages.length === messages.length) return;
      setMessages(results.messages);
    }, 750);
    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleChatSend(content) {
    const { username, _id } = userData;
    if (!userData || !username || !_id) {
      Logger.error('User data not found');
    }
    try {
      await createChatMessage({
        userId: _id,
        username,
        roomId,
        language: details.language,
        content,
      });
      setErrMsg('');
    } catch (err) {
      setErrMsg('Failed to send message');
    }
  }

  function getMsgColor(senderId) {
    const colors = [
      'pistachio',
      'jet',
      'pear',
      'argentBlue',
      'wisteria',
      'webViolet',
    ];
    const colorIndex = Math.abs(hashCode(senderId) % colors.length);
    return colors[colorIndex];
  }

  return (
    <DefaultPageLayout>
      <h1 className="text-xl font-semibold pt-2 ">Chatroom - {details.name}</h1>
      <div
        ref={scrollableContainerRef}
        className="h-[calc(100dvh_-_9rem)] p-1 bg-white text-black overflow-y-scroll"
      >
        <div className="bg-white">
          {messages.map((message) => (
            <div key={message._id} className="flex gap-2">
              <p
                className={`text-sm font-semibold text-nowrap text-${getMsgColor(message.senderId)} brightness-90`}
              >
                {message.senderName}:
              </p>
              <p className="text-sm ">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative bg-white -mt-[0.01rem]">
        <ChatInput onMsgSend={handleChatSend} />
        <div className="absolute top-0 left-1 text-red-500 text-xs">
          {errMsg}
        </div>
      </div>
    </DefaultPageLayout>
  );
}
