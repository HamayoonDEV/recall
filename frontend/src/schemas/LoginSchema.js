import * as yup from "yup";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;

const loginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is Required!"),
  password: yup
    .string()
    .matches(passwordPattren, {
      message: "atleast 1 uppercase,lowercase and digit",
    })
    .required("password is Required!"),
});
export default loginSchema;
