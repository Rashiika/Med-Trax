import React, { useState } from "react";
import CommunityLayout from "../../components/Layout/CommunityLayout";

const DoctorCommunity = () => {
  const [blogs, setBlogs] = useState([
    {
      title: "Benefits of a Healthy Diet",
      author: "Dr. Akshita",
      image: "https://via.placeholder.com/300x200",
      likes: 12,
    },
    {
      title: "Managing Stress with Yoga",
      author: "Dr. Rohan",
      image: "https://via.placeholder.com/300x200",
      likes: 8,
    },
    {
      title: "Boosting Immunity Naturally",
      author: "Dr. Meera",
      image: "https://via.placeholder.com/300x200",
      likes: 15,
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
      showPublishButton={true}
      onLike={handleLike}
    />
  );
};

export default DoctorCommunity;
