import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchDoctors,
  sendConnectionRequest,
  fetchPendingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  clearSearchResults,
} from "../../redux/features/chatSlice";

const DoctorConnectionManager = ({ onClose, onConnectionAccepted }) => {
  const dispatch = useDispatch();
  const { searchResults, pendingRequests, loading } = useSelector(
    (state) => state.chat
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => {
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      dispatch(searchDoctors(searchQuery));
    }
  };

const handleSendRequest = async (doctorId) => {
  try {
    await dispatch(sendConnectionRequest(doctorId)).unwrap();
    setSearchResults(prev => 
      prev.map(doc => 
        doc.id === doctorId 
          ? { ...doc, requestSent: true } 
          : doc
      )
    );
    alert("✅ Connection request sent successfully!");
  } catch (error) {
    const errorMsg = error?.error || error?.message || "Failed to send request";
    alert(`❌ ${errorMsg}`);
  }
};


  const handleAccept = async (requestId) => {
    try {
      await dispatch(acceptConnectionRequest(requestId)).unwrap();
      alert("Connection accepted!");
      
      // ✅ Notify parent to reload doctor list
      if (onConnectionAccepted) {
        onConnectionAccepted();
      }
    } catch (error) {
      alert("Failed to accept connection");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await dispatch(rejectConnectionRequest(requestId)).unwrap();
      alert("Connection rejected!");
    } catch (error) {
      alert("Failed to reject connection");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Doctor Connections</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 ${
              activeTab === "search"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("search")}
          >
            Search Doctors
          </button>
          <button
            className={`flex-1 py-3 ${
              activeTab === "requests"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Pending Requests ({pendingRequests.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "search" ? (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by name or specialization..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{doctor.full_name}</p>
                        <p className="text-sm text-gray-600">
                          {doctor.specialization}
                        </p>
                      </div>
<button
  onClick={() => handleSendRequest(doctor.id)}
  disabled={doctor.requestSent}
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
    doctor.requestSent 
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  }`}
>
  {doctor.requestSent ? (
    <span className="flex items-center gap-1">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
      </svg>
      Request Sent
    </span>
  ) : (
    'Connect'
  )}
</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-10">
                  Search for doctors to connect with
                </p>
              )}
            </div>
          ) : (
            <div>
              {pendingRequests.length > 0 ? (
                <div className="space-y-2">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {request.from_doctor.full_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.from_doctor.specialization}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-10">
                  No pending connection requests
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorConnectionManager;