import React from "react";
import styles from "./Loader.module.css";
import { RingLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <RingLoader />
    </div>
  );
};

export default Loader;
