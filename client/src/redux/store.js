import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import guestReducer from './guestSlice.js'
import menuReducer from './menuSlice.js'
import cartReducer from './cartSlice.js'
import tableReducer from './tableSlice.js'
import coupanReducer from './coupanSlice.js'
const store=configureStore({
    reducer: {
        auth: authReducer,
        guest:guestReducer,
        menu : menuReducer,
        cart : cartReducer,
        table: tableReducer,
        coupan: coupanReducer
    }
})

export default store