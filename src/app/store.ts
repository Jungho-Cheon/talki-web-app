import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from '../features/chatroom/chatroomSlice';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import friendRequestReducer from '../features/friendRequest/friendRequestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chatroom: chatroomReducer,
    theme: themeReducer,
    friendRequest: friendRequestReducer,
  },
});

export default store;
