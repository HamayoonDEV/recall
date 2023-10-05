import "./App.css";
import Navbar from "./component/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./component/Login/Login";
import Home from "./component/Home/Home";
import Protected from "./component/Protected/Protected";
import Blog from "./component/Blog/Blog";
import Crypto from "./component/Crypto/Crypto";
import SubmitBlog from "./component/SubmitBlog/SubmitBlog";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Register from "./component/Register/Register";
import DetailedBlog from "./component/detailedBlog/DetailedBlog";
import Update from "./component/updateBlog/Update";

function App() {
  const isAuth = useSelector((state) => state.user.auth);

  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="login" exact element={<Login />} />
        <Route path="register" exact element={<Register />} />
        <Route path="/" exact element={<Home />} />
        <Route path="crypto" exact element={<Crypto />} />
        <Route path="update/:id" exact element={<Update />} />
        <Route
          path="blog"
          exact
          element={
            <Protected isAuth={isAuth}>
              <Blog />
            </Protected>
          }
        />
        <Route path="blog/:id" exact element={<DetailedBlog />} />
        <Route
          path="submit"
          exact
          element={
            <Protected isAuth={isAuth}>
              <SubmitBlog />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
