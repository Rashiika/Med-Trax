import React from "react";
import { Plus } from "lucide-react";

const CommunityLayout = ({ blogs = [], showPublishButton = false, onLike }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-sm border-r p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
          <span className="text-blue-600 font-semibold">Med-Trax</span>
        </div>

        <nav className="flex flex-col gap-4 text-gray-700 text-sm flex-1">
          <a href="#" className="flex items-center gap-2 hover:text-blue-600">
            🏠 Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600">
            📅 Appointment
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600">
            💊 Pharmacy
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600">
            💬 Chat
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 p-2 rounded-md"
          >
            📘 Blogs
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600">
            👤 Profile
          </a>
        </nav>

        <button className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium">
          🚪 Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search topic"
            className="w-full max-w-md border border-gray-200 rounded-full px-4 py-2 text-sm shadow-sm focus:ring focus:ring-blue-100 focus:outline-none"
          />
          <div className="w-10 h-10 bg-gray-300 rounded-full ml-3"></div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div
                className="h-40 rounded-t-xl bg-gray-300"
                style={{
                  backgroundImage: `url(${blog.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-xs mb-3">{blog.author}</p>

                <div className="flex justify-between items-center">
                  <button className="text-blue-500 text-xs font-medium flex items-center gap-1 hover:underline">
                    Read More →
                  </button>

                  {/* Like button (for everyone) */}
                  <button
                    onClick={() => onLike && onLike(index)}
                    className="flex items-center gap-1 text-gray-500 text-xs hover:text-blue-600 transition"
                  >
                    ❤️ {blog.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Publish button (Doctor only) */}
        {showPublishButton && (
          <div className="fixed bottom-6 right-6">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition">
              <Plus size={16} /> Publish a new blog
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityLayout;
