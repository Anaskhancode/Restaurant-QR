import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  sessionToken: null,
  loading: false,
  error: null,
};

//session creation thunk
export const session = createAsyncThunk('/session', async (data, thunkApi) => {
  try {
    console.log(thunkApi);
    const res = await axios.post('http://localhost:3000/api/v1/session', data);
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkApi.rejectWithValue(error.response.data.message);
  }
});

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
      guestout: (state) => {
        localStorage.removeItem('sessionToken')
        state.sessionToken=null
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(session.pending, () => {})
      .addCase(session.fulfilled, (state, action) => {
        console.log(action.payload);
        state.sessionToken = action.payload.data.sessionToken;
        localStorage.setItem('sessionToken', action.payload.data.sessionToken);
      })
      .addCase(session.rejected, () => {});
  },
});

export default guestSlice.reducer;
export const { guestout } = guestSlice.actions;
