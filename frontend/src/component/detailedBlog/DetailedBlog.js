import React from "react";
import styles from "./Detailed.module.css";
import { getBlogById } from "../../api/internal";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createComment } from "../../api/internal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { getCommentById } from "../../api/internal";
import { deleteBlog } from "../../api/internal";
import { useNavigate } from "react-router-dom";

const DetailedBlog = () => {
  const params = useParams();
  const blogId = params.id;
  const author = useSelector((state) => state.user._id);
  const [newComment, setNewComment] = useState("");
  const [blog, setBlog] = useState([]);
  const [reload, setReload] = useState(false);
  const [comments, setComments] = useState([]);
  const username = useSelector((state) => state.user.username);
  const [owner, setOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async function getBlog() {
      const response = await getBlogById(blogId);

      if (response.status === 200) {
        setBlog(response.data.blog);
      }
      const getComment = await getCommentById(blogId);
      if (getComment.status === 200) {
        setComments(getComment.data.comments);
      }
      if (author === response.data.blog.authId) {
        setOwner(true);
      }
    })();
  }, [reload]);

  const handlePost = async () => {
    const data = {
      content: newComment,
      author,
      blog: blogId,
      creator: username,
    };
    const postComment = await createComment(data);
    if (postComment.status === 201) {
      setNewComment("");
      setReload(!reload);
    }
  };
  const handleDelete = async () => {
    const blogDelete = await deleteBlog(blogId);
    if (blogDelete.status === 200) {
      //navigate to the home page
      navigate("/");
    }
  };

  return (
    <div className={styles.DetailedBlog}>
      <div className={styles.right}>
        <h1>{blog.title}</h1>
        <p>
          {" "}
          Posted@
          {blog.authorUsername + "" + new Date(blog.createdAt).toDateString()}
        </p>
        <p>{blog.content}</p>
        <img src={blog.photopath} width={250} height={250} />
        <div className={styles.createComment}>
          <input
            type="text"
            placeholder="comment goes here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handlePost}>post</button>
        </div>
        {owner && (
          <div>
            <button onClick={() => navigate(`/update/${blogId}`)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      <div className={styles.left}>
        <h1>Comments</h1>
        {comments.map((comment) => (
          <div>
            <h3>{comment.creator}</h3>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedBlog;
