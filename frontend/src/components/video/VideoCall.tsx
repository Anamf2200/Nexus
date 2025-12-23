import { useEffect, useRef } from 'react';
import { socket } from '../../../lib/socket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { endCall, toggleAudio, toggleVideo } from '../../store/call/callSlice';

export default function VideoCall({ roomId }: { roomId: string }) {
  const dispatch = useDispatch();
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);

  const { videoEnabled, audioEnabled } = useSelector(
    (state: RootState) => state.call
  );

  useEffect(() => {
    // Join the room
    socket.emit('join-room', roomId);

    // Create peer connection
    peer.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;

        // Set local video
        if (localVideo.current) localVideo.current.srcObject = stream;

        // Add tracks to peer
        stream.getTracks().forEach(track => peer.current?.addTrack(track, stream));
      });

    // Remote stream
    peer.current.ontrack = (e) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
    };

    // ICE candidates
    peer.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: e.candidate });
      }
    };

    // Socket listeners
    socket.on('offer', async (offer) => {
      await peer.current?.setRemoteDescription(offer);
      const answer = await peer.current?.createAnswer();
      await peer.current?.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    });

    socket.on('answer', async (answer) => {
      await peer.current?.setRemoteDescription(answer);
    });

    socket.on('ice-candidate', async (candidate) => {
      await peer.current?.addIceCandidate(candidate);
    });

    socket.on('call-ended', () => {
      // Stop local tracks
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      // Close peer connection
      peer.current?.close();
      dispatch(endCall());
    });

    return () => {
      // End call on unmount
      socket.emit('end-call', roomId);
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peer.current?.close();
    };
  }, [roomId]);

  // Handle toggling audio/video
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = audioEnabled);
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = videoEnabled);
    }
  }, [audioEnabled, videoEnabled]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <video ref={localVideo} autoPlay muted className="w-1/4 absolute bottom-4 right-4" />
      <video ref={remoteVideo} autoPlay className="w-full h-full" />

      <div className="absolute bottom-4 left-1/2 flex gap-4">
        <button className="bg-green-600 px-4 py-2 rounded" onClick={() => dispatch(toggleAudio())}>
          {audioEnabled ? 'Mute' : 'Unmute'}
        </button>

        <button className="bg-red-500 px-4 py-2 rounded" onClick={() => dispatch(toggleVideo())}>
          {videoEnabled ? 'Camera Off' : 'Camera On'}
        </button>

        <button className="bg-blue-800 px-4 py-2 rounded" onClick={() => dispatch(endCall())}>
          End
        </button>
      </div>
    </div>
  );
}
