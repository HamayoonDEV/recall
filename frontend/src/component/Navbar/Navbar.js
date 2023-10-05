import React from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUser } from "../../store/userSlice";
import { logout } from "../../api/internal";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.user.auth);
  const username = useSelector((state) => state.user.username);

  const handleSignOut = async () => {
    try {
      await logout();
      //update the store
      dispatch(resetUser());
      //navigate to the home page
      navigate("/");
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.navbar}>
      <h1>Recall</h1>
      <h4>{username}</h4>
      <div className={styles.menu}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="crypto">Crypto</NavLink>
        <NavLink to="blog">Blog</NavLink>
        <NavLink to="submit">SubmitBlog</NavLink>
      </div>
      <div>
        {isAuth ? (
          <div>
            <NavLink>
              <button onClick={handleSignOut}>SignOut</button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to="login">
              <button>Login</button>
            </NavLink>
            <NavLink to="register">
              <button>SignUp</button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
