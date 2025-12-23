import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CallState {
  inCall: boolean;
  roomId: string | null;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

const initialState: CallState = {
  inCall: false,
  roomId: null,
  videoEnabled: true,
  audioEnabled: true,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall(state, action: PayloadAction<string>) {
      state.inCall = true;
      state.roomId = action.payload;
    },
    endCall(state) {
      state.inCall = false;
      state.roomId = null;
    },
    toggleVideo(state) {
      state.videoEnabled = !state.videoEnabled;
    },
    toggleAudio(state) {
      state.audioEnabled = !state.audioEnabled;
    },
  },
});

export const {
  startCall,
  endCall,
  toggleVideo,
  toggleAudio,
} = callSlice.actions;

export default callSlice.reducer;
