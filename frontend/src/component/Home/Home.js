import React, { useState } from "react";
import styles from "./Home.module.css";
import { useEffect } from "react";
import { getnews } from "../../api/external";
import Loader from "../Loader/Loader";
const Home = () => {
  const [articles, setArticle] = useState([]);
  useEffect(() => {
    (async function getNewFuntion() {
      try {
        const response = await getnews();

        setArticle(response.articles);
      } catch (error) {
        return error;
      }
    })();
  }, []);
  const handleFull = (url) => {
    window.open(url, "_blank");
  };
  if (articles.length === 0) {
    return <Loader />;
  }
  return (
    <div className={styles.home}>
      <div className={styles.cards}>
        {articles.map((article) => (
          <div
            className={styles.card}
            key={article.title}
            onClick={() => handleFull(article.url)}
          >
            <h1>{article.title}</h1>
            <h2>{article.author}</h2>
            <h3>{article.publishedAt}</h3>
            <img src={article.urlToImage} />
            <p>{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
