import axios from "axios";

const NEWS_ATRICAL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.REACT_APP_NEW_API}`;
const CRYPTO_SCRTING = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`;

export const getnews = async () => {
  let response;
  try {
    response = await axios.get(NEWS_ATRICAL);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCrypto = async () => {
  let response;
  try {
    response = await axios.get(CRYPTO_SCRTING);
    return response.data;
  } catch (error) {
    return error;
  }
};
