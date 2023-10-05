import React from "react";
import styles from "./Blog.module.css";
import { useState, useEffect } from "react";
import { getBlog } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlog] = useState([]);
  useEffect(() => {
    (async function fetchBlogs() {
      try {
        const response = await getBlog();
        console.log(response.data.blogs);
        if (response.status === 200) {
          setBlog(response.data.blogs);
        }
      } catch (error) {
        return error;
      }
    })();
  }, []);
  if (blogs.length === 0) {
    return <Loader />;
  }
  return (
    <div className={styles.blogs}>
      {blogs.map((blog) => (
        <div
          className={styles.blog}
          onClick={() => navigate(`/blog/${blog._id}`)}
          key={blog._id}
        >
          <h1>{blog.title}</h1>
          <p>{blog.content}</p>
          <img src={blog.photopath} alt={`Image for ${blog.title}`} />
          <h3>{blog.author}</h3>
        </div>
      ))}
    </div>
  );
};

export default Blog;
