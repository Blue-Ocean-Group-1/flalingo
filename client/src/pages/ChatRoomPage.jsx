import { useEffect, useState, useRef, useCallback } from 'react';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import ChatInput from '../components/ChatInput';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getChatroom,
  getChatroomMessages,
  createChatMessage,
  updateChatroomParticipantCount,
} from '../services/chatroom.api';
import { hashCode } from '../utils/utils';
import { useUserData } from '../hooks/useUserData';
import Logger from '../../config/logger.js';
import getDailyProgress from '../utils/getDailyProgress.js';
import { updateUserData, updateDailyProgress } from '../services/user.api.js';

export default function ChatRoomPage() {
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState({ name: '', language: '' });
  const [errMsg, setErrMsg] = useState('');
  let { roomId } = useParams();
  const { userData, updateUser } = useUserData();
  const scrollableContainerRef = useRef(null);
  const navigate = useNavigate();

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

  const incrementParticipantCount = useCallback(async () => {
    try {
      await updateChatroomParticipantCount(roomId, 'join');
    } catch (err) {
      console.error(err);
    }
  }, [roomId]);

  const decrementParticipantCount = useCallback(async () => {
    try {
      await updateChatroomParticipantCount(roomId, 'leave');
    } catch (err) {
      console.error(err);
    }
  }, [roomId]);

  useEffect(() => {
    async function handleVisibilityChange() {
      try {
        if (document.hidden) {
          await decrementParticipantCount();
        } else {
          await incrementParticipantCount();
        }
      } catch (err) {
        console.log(err);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomId, incrementParticipantCount, decrementParticipantCount]);

  useEffect(() => {
    incrementParticipantCount();

    return () => {
      decrementParticipantCount();
    };
  }, [navigate, roomId, incrementParticipantCount, decrementParticipantCount]);

  useEffect(() => {
    async function updateUserProgress() {
      if (userData?.dailyGoalProgress) {
        const dailyProgress = getDailyProgress(userData.dailyGoalProgress);
        console.log('daily progress in user progress', dailyProgress);
        if (dailyProgress['conversationRoomJoined'] !== true) {
          dailyProgress['conversationRoomJoined'] = true;
          // this will need to be updated if more fields are added to in order to be
          if (dailyProgress['deckCompleted'] === true) {
            dailyProgress['completed'] = true;
          }
          try {
            const result = await updateDailyProgress(
              userData._id,
              dailyProgress,
            );

            if (result) {
              updateUser({
                ...result,
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    updateUserProgress();
  }, [userData?.dailyGoalProgress, updateUser, userData?._id]);

  return (
    <DefaultPageLayout>
      <div className="flex items-center gap-2 mx-2 mb-1 text-black overflow-y-hidden">
        <button
          onClick={() => navigate('/conversation_rooms')}
          className="bg-wisteria h-8 px-3 rounded-md text-black text-sm font-semibold self-center"
        >
          Leave
        </button>
        <h1 className="text-lg sm:text-xl font-semibold">{details.name}</h1>
      </div>
      <div
        ref={scrollableContainerRef}
        className="h-[calc(100dvh_-_9.8rem)] px-4 text-black overflow-y-scroll mx-2 bg-white"
      >
        <div className="">
          {messages.map((message) => (
            <div key={message._id} className="flex gap-2 pb-1.5">
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
      <div className="relative -mt-[0.01rem]">
        <ChatInput onMsgSend={handleChatSend} />
        <div className="absolute -top-1 left-2 text-red-500 text-xs">
          {errMsg}
        </div>
      </div>
    </DefaultPageLayout>
  );
}
