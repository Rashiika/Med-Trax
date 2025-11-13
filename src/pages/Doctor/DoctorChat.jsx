import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';
import {
  connectSocketAction,
  disconnectSocketAction,
  sendLiveMessage,
} from "../../redux/features/socketSlice";
import {
  fetchChatDoctors,
  fetchChatPatients,
  fetchChatHistory,
} from "../../redux/features/chatSlice";
import axiosInstance from "../../api/axiosInstance";

const DoctorChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatDoctors, chatPatients, currentChat } = useSelector((state) => state.chat);

  const [showAiChat, setShowAiChat] = useState(false); // ✅ AI Chat state

  useEffect(() => {
    if (user?.id) {
      dispatch(connectSocketAction(user.id));
      dispatch(fetchChatDoctors());
      dispatch(fetchChatPatients());
    }
    return () => dispatch(disconnectSocketAction());
  }, [dispatch, user?.id]);

  // When selecting any patient/doctor → close AI Chat
  const handleSelectChat = (chat) => {
    setShowAiChat(false);
    if (chat.id) dispatch(fetchChatHistory(chat.id));
  };

  // Send normal message
  const handleSendMessage = async (text, receiverId) => {
    dispatch(sendLiveMessage({ sender: user.id, receiver: receiverId, text }));
    if (receiverId)
      await axiosInstance.post(`/chat/rooms/${receiverId}/messages/`, {
        content: text,
      });
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/doctor/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/doctor/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/doctor/chats", icon: chatsIcon },
    { label: "Blogs", to: "/doctor/blogs", icon: blogIcon },
    { label: "Profile", to: "/doctor/profile", icon: profileIcon },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="doctor">
      <ChatLayout
        role="doctor"
        userName={`Dr. ${user?.first_name || ""}`}
        doctors={chatDoctors}
        patients={chatPatients}
        currentChat={currentChat}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        showAiChat={showAiChat}           // ✅ pass AI chat flag
        onCloseAiChat={() => setShowAiChat(false)}
        onOpenAiChat={() => setShowAiChat(true)}  // ✅ pass function to open AI chat
      />


    </DashboardLayout>
  );
};

export default DoctorChat;
