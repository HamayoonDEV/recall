import React from "react";
import styles from "./Update.module.css";
import { updateBlog } from "../../api/internal";
import { useEffect, useState } from "react";
import { getBlogById } from "../../api/internal";
import { useParams } from "react-router-dom";
import InputText from "../InputText/InputText";
import { useNavigate } from "react-router-dom";

const Update = () => {
  const params = useParams();
  const blogId = params.id;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photopath, setPhotopath] = useState("");
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    (async function getBlog() {
      const blogGet = await getBlogById(blogId);

      if (blogGet.status === 200) {
        setBlog(blogGet.data.blog);
        setTitle(blogGet.data.blog.title);
        setContent(blogGet.data.blog.content);
        setPhotopath(blogGet.data.blog.photopath);
      }
    })();
  }, []);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotopath(reader.result);
    };
  };
  const handleUpdate = async () => {
    let data;
    if (photopath.includes("http")) {
      data = {
        content,
        title,

        author: blog.authId,
        blogId: blogId,
      };
    } else {
      data = {
        content,
        title,
        photopath,
        author: blog.authId,
        blogId: blogId,
      };
    }
    const blogUpdate = await updateBlog(data);
    if (blogUpdate.status === 200) {
      //navigate to the blog page
      navigate("/blog");
    }
  };
  return (
    <div className={styles.update}>
      <h1>UpdateBlog</h1>
      <div className={styles.input}>
        <InputText
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
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default Update;
