import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  name: "",
  email: "",
  password: "",
  auth: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, username, name, password, auth } = action.payload;
      state._id = _id;
      state.username = username;
      state.name = name;
      state.password = password;
      state.auth = auth;
    },
    resetUser: (state, action) => {
      state._id = "";
      state.username = "";
      state.name = "";
      state.password = "";
      state.auth = false;
    },
  },
});
export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
