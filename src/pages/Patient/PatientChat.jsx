import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import {
  connectSocketAction,
  disconnectSocketAction,
  sendLiveMessage,
} from "../../redux/features/socketSlice";
import { fetchChatDoctors, fetchChatHistory } from "../../redux/features/chatSlice";
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';

//import AiChatModal from "../shared/AiChatModal";

const PatientChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatDoctors, currentChat } = useSelector((state) => state.chat);
  //const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(connectSocketAction(user.id));
      dispatch(fetchChatDoctors());
    }
    return () => dispatch(disconnectSocketAction());
  }, [dispatch, user?.id]);

  const handleSelectChat = (chat) => {
    if (chat.id) dispatch(fetchChatHistory(chat.id));
  };

  const handleSendMessage = async (text, receiverId) => {
    dispatch(sendLiveMessage({ sender: user.id, receiver: receiverId, text }));
    if (receiverId)
      await axiosInstance.post(`/chat/rooms/${receiverId}/messages/`, {
        content: text,
      });
  };

  const sidebarItems = [
      { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
      { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
      { label: "Chats", to: "/patient/chats", icon: chatsIcon },
      { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
      { label: "Profile", to: "/patient/profile", icon: profileIcon },
  ];
  

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="patient">
      <ChatLayout
        role="patient"
        userName={`${user?.first_name || ""} ${user?.last_name || ""}`}
        doctors={chatDoctors}
        patients={[]}
        currentChat={currentChat}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        //onOpenAiChat={() => setShowAiModal(true)}
      />
      {/* {showAiModal && <AiChatModal onClose={() => setShowAiModal(false)} />} */}
    </DashboardLayout>
  );
};

export default PatientChat;
