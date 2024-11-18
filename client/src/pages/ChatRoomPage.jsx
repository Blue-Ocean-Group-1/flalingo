import { useEffect, useState } from 'react';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import ChatInput from '../components/ChatInput';
import { useParams } from 'react-router-dom';
import {
  getChatroom,
  getChatroomMessages,
  createChatMessage,
} from '../services/chatroom.api';
import { hashCode } from '../utils/utils';

// const PLACEHOLDER_ROOM_DATA = {
//   _id: '6736a8e8035497da3f5e0554',
//   name: 'Spanish Beginner 1',
//   language: 'Spanish',
//   messages: [
//     {
//       _id: '6737ec24ff5ad3358cba15fe',
//       senderId: '6736458965254b8c8d10f6f0',
//       senderName: 'Eva Perez',
//       content: 'Hola, ¿cómo estás?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:00:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba15ff',
//       senderId: '6736458965254b8c8d10f6f1',
//       senderName: 'Carlos Ramirez',
//       content: '¡Hola Eva! Estoy bien, ¿y tú?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:01:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1600',
//       senderId: '6736458965254b8c8d10f6f2',
//       senderName: 'Pablo Ruiz',
//       content: '¿Qué tal, amigos?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:02:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1601',
//       senderId: '6736458965254b8c8d10f6f3',
//       senderName: 'Javier Lopez',
//       content: 'Todo bien, ¿y tú Pablo?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:03:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1602',
//       senderId: '6736458965254b8c8d10f6f4',
//       senderName: 'Martina Ruiz',
//       content:
//         'Hola, estoy aprendiendo español, ¿puedo unirme a la conversación?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:04:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1603',
//       senderId: '6736458965254b8c8d10f6f5',
//       senderName: 'Antonio Fernandez',
//       content: '¡Claro que sí! Todos estamos aprendiendo.',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:05:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1604',
//       senderId: '6736458965254b8c8d10f6f6',
//       senderName: 'Sofia Alvarez',
//       content: "¿Alguien sabe cómo decir 'good morning' en español?",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:06:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1605',
//       senderId: '6736458965254b8c8d10f6f7',
//       senderName: 'Lucia Martinez',
//       content: "Es 'buenos días'.",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:07:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1606',
//       senderId: '6736458965254b8c8d10f6f8',
//       senderName: 'Daniel Fernandez',
//       content: '¡Gracias Lucia! ¿Alguien más tiene preguntas?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:08:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1607',
//       senderId: '6736458965254b8c8d10f6f9',
//       senderName: 'Felipe Romero',
//       content: "Sí, ¿cómo se dice 'I don't understand'?",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:09:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1608',
//       senderId: '6736458965254b8c8d10f6fa',
//       senderName: 'Isabel Gonzalez',
//       content: "Se dice 'No entiendo'.",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:10:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1609',
//       senderId: '6736458965254b8c8d10f6fb',
//       senderName: 'Andrea Vargas',
//       content: "¿Qué significa 'gracias'?",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:11:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba160a',
//       senderId: '6736458965254b8c8d10f6fc',
//       senderName: 'Mateo Morales',
//       content: "Significa 'thank you'.",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:12:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba160b',
//       senderId: '6736458965254b8c8d10f6fd',
//       senderName: 'Diego Garcia',
//       content: "¿Cómo se dice 'I'm learning'?",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:13:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba160c',
//       senderId: '6736458965254b8c8d10f6fe',
//       senderName: 'Maria Garcia',
//       content: "Se dice 'estoy aprendiendo'.",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:14:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba160d',
//       senderId: '6736458965254b8c8d10f6ff',
//       senderName: 'Raul Hernandez',
//       content: '¿Alguien quiere practicar más?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:15:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba160e',
//       senderId: '6736458965254b8c8d10f700',
//       senderName: 'Lucia Sanchez',
//       content: '¡Sí, yo quiero practicar más!',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:16:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba160f',
//       senderId: '6736458965254b8c8d10f701',
//       senderName: 'Josefina Sanchez',
//       content: 'Yo también, me encanta aprender español.',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:17:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1610',
//       senderId: '6736458965254b8c8d10f702',
//       senderName: 'Santiago Reyes',
//       content: '¡Qué bueno! ¿Alguien quiere compartir algo en español?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:18:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1611',
//       senderId: '6736458965254b8c8d10f703',
//       senderName: 'Monica Perez',
//       content: "Yo puedo decir algo. 'Me gusta la música.'",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:19:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1612',
//       senderId: '6736458965254b8c8d10f704',
//       senderName: 'Maria Lopez',
//       content: "¡Qué bien, Monica! Yo quiero decir 'Tengo un perro'.",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:20:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1613',
//       senderId: '6736458965254b8c8d10f705',
//       senderName: 'Nina Castro',
//       content: '¡Qué lindo! Yo tengo un gato.',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:21:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1614',
//       senderId: '6736458965254b8c8d10f706',
//       senderName: 'Alejandra Rodriguez',
//       content: '¡Yo también tengo un gato!',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:22:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1615',
//       senderId: '6736458965254b8c8d10f707',
//       senderName: 'Anna Schmidt',
//       content: "¿Cómo se dice 'dog' en español?",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:23:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1616',
//       senderId: '6736458965254b8c8d10f708',
//       senderName: 'Hans Müller',
//       content: "Se dice 'perro'.",
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:24:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1617',
//       senderId: '6736458965254b8c8d10f709',
//       senderName: 'Maximilian Wagner',
//       content: '¡Gracias Hans! Ahora sé cómo decirlo.',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:25:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1618',
//       senderId: '6736458965254b8c8d10f710',
//       senderName: 'Andres Navarro',
//       content:
//         '¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:26:00.000Z',
//     },

//     {
//       _id: '6737ec24ff5ad3358cba1618',
//       senderId: '6736458965254b8c8d10f710',
//       senderName: 'Andres Navarro',
//       content:
//         '¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:26:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1618',
//       senderId: '6736458965254b8c8d10f710',
//       senderName: 'Andres Navarro',
//       content:
//         '¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:26:00.000Z',
//     },
//     {
//       _id: '6737ec24ff5ad3358cba1618',
//       senderId: '6736458965254b8c8d10f710',
//       senderName: 'Andres Navarro',
//       content:
//         '¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas? ¡De nada! ¿Alguien más tiene preguntas?',
//       language: 'Spanish',
//       timestamp: '2024-11-14T10:26:00.000Z',
//     },
//   ],
// };

// const PLACEHOLDER_ROOM_DETAILS = {
//   _id: '6736a8e8035497da3f5e0554',
//   name: 'Spanish Beginner 1',
//   language: 'Spanish',
// };

export default function ChatRoomPage() {
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState({ name: '', language: '' });
  const [errMsg, setErrMsg] = useState('');
  let { roomId } = useParams();

  const fakeUserContext = { userId: '6736458965254b8c8d10f6f0' };

  useEffect(() => {
    async function fetchChatRoomData() {
      try {
        const details = await getChatroom(roomId);
        setDetails(details);
        const results = await getChatroomMessages(roomId);
        setMessages(results.messages);
      } catch (err) {
        setErrMsg('Failed to fetch chatroom data');
      }
    }
    fetchChatRoomData(roomId);
  }, []);

  // Set up polling
  useEffect(() => {
    let intervalId;
    intervalId = setInterval(async () => {
      const results = await getChatroomMessages(roomId);
      setMessages(results.messages);
    }, 3000);
    return () => clearInterval(intervalId);
  });

  async function handleChatSend(content) {
    try {
      await createChatMessage(fakeUserContext.userId, roomId, content);
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
      <h1 className="text-xl font-semibold pt-2">Chatroom - {details.name}</h1>
      <div className="h-[calc(100dvh_-_9rem)] p-1 bg-white text-black overflow-y-scroll">
        <div className="px-1">
          {messages.map((message) => (
            <div key={message._id} className="flex gap-2">
              <p
                className={`text-sm font-semibold text-nowrap text-${getMsgColor(message.senderId)} brightness-90`}
              >
                {message.senderName}:
              </p>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative bg-white">
        <ChatInput onMsgSend={handleChatSend} />
        <div className="absolute top-0 left-1 text-red-500 text-xs">
          {errMsg}
        </div>
      </div>
    </DefaultPageLayout>
  );
}
