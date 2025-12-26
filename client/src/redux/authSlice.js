import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const login = createAsyncThunk('/auth/login', async (data, thunkApi) => {
    try {
        const res = await axios.post('http://localhost:3000/api/v1/auth/login', data)
        return res.data

    } catch (error) {
        // console.log(error);
        return thunkApi.rejectWithValue(error.response.data.messsage)

    }
});

export const register = createAsyncThunk('/auth/register', async (data, thunkApi) => {
    try {
        // console.log(thunkApi)
        const res = await axios.post(
            'http://localhost:3000/api/v1/auth/register',
            data
        );
        return res.data;
    } catch (error) {
        console.log(error)
        return thunkApi.rejectWithValue(error.response.data.messsage)
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        userId: localStorage.getItem('userId') || null,
        name: localStorage.getItem('name') || null,
        role: localStorage.getItem('role') || null,
        email: localStorage.getItem('email') || null,
        accessToken: null,
        refreshToken: null,
    },

    reducers: {
        logout: (state) => {
            state.name = null;
            state.email = null;
            state.role = null;
            state.userId=null;
            localStorage.removeItem('userId')
            localStorage.removeItem('accessToken');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            localStorage.removeItem('email')
            localStorage.removeItem('refreshToken')
            state.refreshToken = null;
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.loading = true


        }).addCase(login.fulfilled, (state, action) => {
            console.log(action.payload);
            state.userId=action.payload.data._id
            state.name = action.payload.data.name
            state.email = action.payload.data.email
            state.role = action.payload.data.role
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            localStorage.setItem('accessToken', action.payload.accessToken)
            localStorage.setItem('refreshToken', action.payload.refreshToken)
            localStorage.setItem('userId',action.payload.data._id)
            localStorage.setItem('role', action.payload.data.role);
            localStorage.setItem('name', action.payload.data.name);
            localStorage.setItem('email', action.payload.data.email)
            state.loading = false

        }).addCase(login.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        }).addCase(register.pending, (state, action) => {
            state.loading = true;
        }).addCase(register.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loading = false
        }).addCase(register.rejected, (state, action) => {
            console.log(action.payload)
            state.error = action.payload;
            state.loading = false
        });
    }
})


export default authSlice.reducer
export const { logout } = authSlice.actions;
