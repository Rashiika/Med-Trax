import React, { useState } from "react";
import CommunityLayout from "../../components/Layout/CommunityLayout";

const PatientCommunity = () => {
  const [blogs, setBlogs] = useState([
    {
      title: "Managing Diabetes Effectively",
      author: "Dr. Akshita Sharma",
      image: "https://via.placeholder.com/300x200",
      likes: 15,
    },
    {
      title: "Importance of Regular Exercise",
      author: "Dr. Rohan Mehta",
      image: "https://via.placeholder.com/300x200",
      likes: 23,
    },
  ]);

  const handleLike = (index) => {
    setBlogs((prev) =>
      prev.map((blog, i) =>
        i === index ? { ...blog, likes: blog.likes + 1 } : blog
      )
    );
  };

  return (
    <CommunityLayout
      blogs={blogs}
      showPublishButton={false}
      onLike={handleLike}
    />
  );
};

export default PatientCommunity;
