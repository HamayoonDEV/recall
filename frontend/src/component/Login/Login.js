import React from "react";
import styles from "./Login.module.css";
import InputText from "../InputText/InputText";
import loginSchema from "../../schemas/LoginSchema";
import { useFormik } from "formik";
import { login } from "../../api/internal";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });
  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await login(data);

      const user = {
        _id: response.data.user._id,
        username: response.data.user.username,
        name: response.data.user.name,
        password: response.data.user.password,
        email: response.data.user.email,
        auth: response.data.auth,
      };
      if (response.status === 200) {
        //update the store
        dispatch(setUser(user));
        //navigate to the home page
        navigate("/");
      } else if (response.code === "ERR_BAD_REQUREST") {
        setError(response.response.data.errormessage);
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.login}>
      <h1>Login Page</h1>
      <div className={styles.input}>
        <InputText
          className={styles.text}
          type="text"
          name="username"
          value={values.username}
          placeholder="username"
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <InputText
          className={styles.text2}
          type="password"
          name="password"
          placeholder="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
      </div>
      <div className={styles.button}>
        <button onClick={handleLogin}>Login</button>
        <span>
          Don't have an account?
          <button onClick={() => navigate("/register")}>Register</button>
        </span>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default Login;
