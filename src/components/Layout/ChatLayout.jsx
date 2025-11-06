import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';

const Chat = () => {
  const { user, role } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAIMessages] = useState([
    { type: 'bot', text: 'Good evening, ' + (user?.username || 'User') },
    { type: 'bot', text: 'How may I help you?' }
  ]);
  const [aiInput, setAIInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch conversations based on active tab
  useEffect(() => {
    fetchConversations();
  }, [activeTab]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'patients' ? '/chat/patients/' : '/chat/doctors/';
      console.log("🔄 Fetching conversations from:", endpoint);
      const response = await axiosInstance.get(endpoint);
      console.log("✅ Conversations fetched successfully:", response.data);
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('❌ Error fetching conversations:', error.response?.status, error.response?.data || error.message);
      // If it's a 404 or other non-auth error, use mock data instead of letting axios redirect
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.log("📝 Using mock data for conversations");
      }
      // Mock data for testing
      setConversations([
        { id: 1, name: 'Naina', lastMessage: 'Hi', timestamp: '2m ago', unread: true },
        { id: 2, name: 'Archi', lastMessage: "I'm having some issues with prescription", timestamp: '5m ago', unread: false },
        { id: 3, name: 'Naina', lastMessage: 'Hi', timestamp: '10m ago', unread: true },
        { id: 4, name: 'Naina', lastMessage: 'Hi', timestamp: '15m ago', unread: true },
        { id: 5, name: 'Naina', lastMessage: 'Hi', timestamp: '20m ago', unread: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axiosInstance.get(`/chat/history/${chatId}/`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowAIChat(false);
    fetchMessages(chat.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // TODO: Send message to API
    // await axiosInstance.post(`/chat/messages/`, { ... });
  };

  const handleAISend = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMessage = { type: 'user', text: aiInput };
    setAIMessages([...aiMessages, userMessage]);
    setAIInput('');

    // TODO: Send to AI endpoint and get response
    setTimeout(() => {
      setAIMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'I understand your concern. How can I assist you further?' 
      }]);
    }, 1000);
  };

  const handleAIChatOpen = () => {
    setShowAIChat(true);
    setSelectedChat(null);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const userRole = role === 'doctor' ? 'Dr.' : '';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Contact List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-800">
                {userRole} {displayName}
              </h2>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'patients'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'doctors'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Doctors
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-400 text-sm">No conversations</div>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleChatSelect(conv)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedChat?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                  {conv.name.charAt(0)}
                </div>
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {conv.name}
                    </h3>
                    {conv.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat with AI Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleAIChatOpen}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="text-sm font-medium">Chat with AI</span>
          </button>
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {showAIChat ? (
          /* AI Chat Interface */
          <div className="flex-1 flex flex-col bg-white">
            {/* AI Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Chatbot</h2>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* AI Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {aiMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleAISend} className="flex space-x-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  placeholder="Message"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        ) : selectedChat ? (
          /* Regular Chat Interface */
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                  {selectedChat.name.charAt(0)}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedChat.name}</h2>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'me'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-24 h-24 mx-auto text-blue-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.29-3.86-.8l-.27-.15-2.82.47.47-2.82-.15-.27c-.51-1.18-.8-2.48-.8-3.86 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg font-medium">Your messages will be displayed here</p>
              <p className="text-gray-300 text-sm mt-2">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;