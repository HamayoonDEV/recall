import React from "react";
import styles from "./SubmitBlog.module.css";
import { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import InputText from "../InputText/InputText";
import { submitBlog } from "../../api/internal";
import { useNavigate } from "react-router-dom";

const SubmitBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photopath, setPhotopath] = useState("");
  const author = useSelector((state) => state.user._id);
  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotopath(reader.result);
    };
  };
  const handleSubmit = async () => {
    const data = {
      content,
      title,
      photopath,
      author,
    };
    try {
      const response = await submitBlog(data);
      if (response.status === 201) {
        //navigate to home page
        navigate("/");
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div className={styles.submit}>
      <h1>Create Blog</h1>
      <div className={styles.input}>
        <InputText
          className={styles.title}
          type="text"
          name="title"
          placeholder="Add Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder="write description here..."
          maxLength={400}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <p>please choose a file</p>
        <input
          type="file"
          id="file"
          accept="image/jpg,image/jpeg,image/png"
          onChange={getPhoto}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SubmitBlog;
