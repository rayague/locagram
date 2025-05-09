import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for conversations
const conversations = [
  {
    id: 1,
    client: {
      name: 'Jean Dupont',
      avatar: 'JD',
      status: 'online',
    },
    lastMessage: {
      content: 'Bonjour, je suis intéressé par la Villa Luxe.',
      time: '10:30',
      unread: true,
    },
    property: {
      title: 'Villa Luxe avec Piscine',
      type: 'Vente',
    },
  },
  {
    id: 2,
    client: {
      name: 'Marie Martin',
      avatar: 'MM',
      status: 'offline',
    },
    lastMessage: {
      content: 'Merci pour les informations supplémentaires.',
      time: 'Hier',
      unread: false,
    },
    property: {
      title: 'Appartement Moderne Centre-Ville',
      type: 'Location',
    },
  },
  {
    id: 3,
    client: {
      name: 'Pierre Durand',
      avatar: 'PD',
      status: 'online',
    },
    lastMessage: {
      content: 'Quand pourrions-nous visiter le studio ?',
      time: 'Lundi',
      unread: false,
    },
    property: {
      title: 'Studio Meublé',
      type: 'Location',
    },
  },
];

// Mock data for messages
const messages = [
  {
    id: 1,
    sender: 'client',
    content: 'Bonjour, je suis intéressé par la Villa Luxe.',
    time: '10:30',
  },
  {
    id: 2,
    sender: 'agent',
    content: 'Bonjour Jean, je suis ravi de votre intérêt. Que souhaitez-vous savoir ?',
    time: '10:31',
  },
  {
    id: 3,
    sender: 'client',
    content: 'Quelle est la surface totale du terrain ?',
    time: '10:32',
  },
  {
    id: 4,
    sender: 'agent',
    content: 'La villa est située sur un terrain de 500m² avec un jardin paysager.',
    time: '10:33',
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = conversations.filter((conversation) =>
    conversation.client.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // TODO: Implement message sending
      setNewMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations list */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedConversation === conversation.id
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                    {conversation.client.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      conversation.client.status === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {conversation.client.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.lastMessage.time}
                    </p>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      conversation.lastMessage.unread
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {conversation.lastMessage.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {conversation.property.title}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat header */}
              <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      {currentConversation.client.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                        currentConversation.client.status === 'online'
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentConversation.client.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentConversation.property.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === 'agent' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender === 'agent'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'agent'
                            ? 'text-green-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="p-2 text-green-600 hover:text-green-700"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Sélectionnez une conversation pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 