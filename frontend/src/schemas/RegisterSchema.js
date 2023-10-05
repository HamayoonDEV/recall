import * as yup from "yup";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const registerSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is required!"),
  name: yup.string().max(30).required("name is required!"),
  email: yup
    .string()
    .email("Enter a valid email!")
    .required("Email is required!"),
  password: yup
    .string()
    .matches(passwordPattren, {
      message: "Atleast 1 uppercase,lowerCase and digit!",
    })
    .required("Password is required!"),
});
export default registerSchema;
