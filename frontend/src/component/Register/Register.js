import React from "react";
import styles from "./Register.module.css";
import InputText from "../InputText/InputText";
import registerSchema from "../../schemas/RegisterSchema";
import { useFormik } from "formik";
import { register } from "../../api/internal";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
    validationSchema: registerSchema,
  });
  const handleRegister = async () => {
    const data = {
      username: values.username,
      name: values.name,
      email: values.email,
      password: values.password,
    };
    try {
      const response = await register(data);
      const user = {
        _id: response.data.user._id,
        username: response.data.user.username,
        name: response.data.user.name,
        email: response.data.user.email,
        password: response.data.user.password,
        auth: response.data.auth,
      };
      if (response.status === 201) {
        //update the state
        dispatch(setUser(user));
        //navigate to the homepage
        navigate("/");
      } else if (response.code === "ERR_BAD_REQUREST") {
        setError(response.response.data.errormessge);
      }
    } catch (error) {}
  };
  return (
    <div className={styles.register}>
      <h1>Register Page</h1>
      <div className={styles.text}>
        <InputText
          className={styles.text1}
          type="text"
          name="username"
          placeholder="username"
          value={values.username}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <InputText
          className={styles.text1}
          type="text"
          name="name"
          placeholder="name"
          value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.name && touched.name ? 1 : undefined}
          errormessage={errors.name}
        />
        <InputText
          className={styles.text2}
          type="email"
          name="email"
          placeholder="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.email && touched.email ? 1 : undefined}
          errormessage={errors.email}
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
        <button onClick={handleRegister}>Register</button>
        <span>
          Already have an account?
          <button onClick={() => navigate("/login")}>Login</button>
        </span>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default Register;
