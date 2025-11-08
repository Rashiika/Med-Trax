import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogDetail from "../../components/Layout/Community/BlogDetail";

const dummyBlogs = [
  {
    id: 1,
    slug: "healthy-diet-tips",
    title: "Healthy Diet Tips for Heart",
    author: "Dr. Akshita",
    image: "https://via.placeholder.com/300x200",
    likes: 15,
    content:
      "A healthy diet helps maintain your heart. Include leafy greens, fruits, and avoid processed foods...",
  },
  {
    id: 2,
    slug: "mental-health-care",
    title: "Mental Health Awareness",
    author: "Dr. Meera",
    image: "https://via.placeholder.com/300x200",
    likes: 10,
    content:
      "Taking care of mental health is as important as physical health. Practice mindfulness and self-care...",
  },
];

const DoctorBlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const blog = dummyBlogs.find((b) => b.slug === slug);
  const relatedBlogs = dummyBlogs.filter((b) => b.slug !== slug);

  const handleLike = (slug) => {
    console.log("Doctor liked:", slug);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <BlogDetail blog={blog} relatedBlogs={relatedBlogs} onLike={handleLike} />
    </div>
  );
};

export default DoctorBlogDetail;
