import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import DoctorConnectionManager from "../../components/shared/DoctorConnectionManager";

import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";
import { FileText } from "lucide-react";
import {
  connectSocketAction,
  disconnectSocketAction,
} from "../../redux/features/socketSlice";

import {
  fetchDoctorPatients,
  fetchDoctorDoctors,
  fetchChatRoomDetails,
  clearCurrentChat,
} from "../../redux/features/chatSlice";

import { sendSocketMessage } from "../../utils/socket";

const DoctorChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { doctorPatients, doctorDoctors, currentMessages, loading } = useSelector(
    (state) => state.chat
  );

  const [showAiChat, setShowAiChat] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [showConnectionManager, setShowConnectionManager] = useState(false);

  useEffect(() => {
    console.log("🔄 DoctorChat mounted, loading chats...");
    if (user?.id) {
      dispatch(fetchDoctorPatients());
      dispatch(fetchDoctorDoctors());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    return () => {
      console.log("🧹 DoctorChat unmounting...");
      dispatch(disconnectSocketAction());
      dispatch(clearCurrentChat());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("📊 Doctor patients:", doctorPatients);
    console.log("📊 Doctor-to-doctor chats:", doctorDoctors);
  }, [doctorPatients, doctorDoctors]);
useEffect(() => {
  const handleAppointmentCompleted = (event) => {
    console.log("⏰ Appointment completed event received:", event.detail);
    
    if (selectedChatRoom) {
      alert("⏰ This appointment has ended. The chat is now closed.");
      
      dispatch(disconnectSocketAction());
      dispatch(clearCurrentChat());
      setSelectedChatRoom(null);
      
      setTimeout(() => {
        dispatch(fetchDoctorPatients());
        dispatch(fetchDoctorDoctors());
      }, 1000);
    }
  };
  
  window.addEventListener('appointmentCompleted', handleAppointmentCompleted);
  
  return () => {
    window.removeEventListener('appointmentCompleted', handleAppointmentCompleted);
  };
}, [selectedChatRoom, dispatch]);
  const handleSelectChat = async (chatRoom) => {
    console.log("📱 Doctor selecting chat:", chatRoom);
    setShowAiChat(false);
    setSelectedChatRoom(chatRoom);
    dispatch(disconnectSocketAction());

    try {
      console.log("🔍 Fetching room details for room:", chatRoom.id);
      const result = await dispatch(fetchChatRoomDetails(chatRoom.id)).unwrap();
      console.log("✅ Room details loaded:", result);
      
      if (result && result.id) {
        console.log("🔌 Connecting WebSocket to room:", result.id);
        dispatch(connectSocketAction(chatRoom.id));
      }
    } catch (error) {
      console.error("❌ Failed to load chat room:", error);
      
      if (error?.roomDeleted || error?.status === 404) {
        alert("This chat is no longer available.");
      } else {
        alert("Unable to load this chat. Please try again.");
      }
      
      setSelectedChatRoom(null);
      dispatch(fetchDoctorPatients());
      dispatch(fetchDoctorDoctors());
    }
  };

  const handleSendMessage = (text, roomId) => {
    if (!text.trim() || !roomId) return;
    console.log("📤 Sending message to room:", roomId, text);
    sendSocketMessage(text);
  };

  const handleConnectionAccepted = () => {
    console.log("✅ Connection accepted, refreshing doctor list...");
    dispatch(fetchDoctorDoctors());
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/doctor/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/doctor/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/doctor/chats", icon: chatsIcon },
    { label: 'Prescriptions', to: '/doctor/prescriptions', icon: <FileText className="w-5 h-5" /> },
    { label: "Blogs", to: "/doctor/blogs", icon: blogIcon },
    { label: "Profile", to: "/doctor/profile", icon: profileIcon },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="doctor">
      <div className="relative h-full">
        <ChatLayout
          role="doctor"
          userName={`Dr. ${user?.username || user?.email || "Doctor"}`}
          doctors={doctorDoctors}
          patients={doctorPatients}
          currentMessages={currentMessages}
          onSelectChat={handleSelectChat}
          onSendMessage={handleSendMessage}
          onFetchDoctorPatients={() => dispatch(fetchDoctorPatients())}
          showAiChat={showAiChat}
          onCloseAiChat={() => setShowAiChat(false)}
          onOpenAiChat={() => {
            setShowAiChat(true);
            setSelectedChatRoom(null);
            dispatch(disconnectSocketAction());
            dispatch(clearCurrentChat());
          }}
          onOpenConnectionManager={() => setShowConnectionManager(true)}
        />
        {showConnectionManager && (
          <DoctorConnectionManager
            onClose={() => setShowConnectionManager(false)}
            onConnectionAccepted={handleConnectionAccepted}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorChat;