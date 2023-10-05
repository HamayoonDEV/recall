import React from "react";
import styles from "./Crypto.module.css";
import { getCrypto } from "../../api/external";
import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
const Crypto = () => {
  const [crypto, setCrypto] = useState([]);

  useEffect(() => {
    (async function fetchCrypto() {
      try {
        const response = await getCrypto();
        setCrypto(response);
      } catch (error) {
        return error;
      }
    })();
  }, []);
  if (crypto.length === 0) {
    return <Loader />;
  }
  return (
    <div className={styles.crypto}>
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Coin</td>
            <td>Symbol</td>
            <td>Price</td>
            <td>24h%</td>
          </tr>
        </thead>
        <tbody>
          {crypto.map((cryp) => (
            <tr>
              <td>{cryp.market_cap_rank}</td>
              <td>{cryp.name}</td>
              <td>{cryp.symbol}</td>
              <td>{cryp.current_price}</td>
              <td
                className={
                  cryp.price_change_percentage_24h < 0
                    ? styles.red
                    : styles.green
                }
              >
                {cryp.price_change_percentage_24h}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crypto;
