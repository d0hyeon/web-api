import React from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import { Article, Header } from '@src/components/styles/common';
import { H1 } from '@src/components/styles/text';
import { FlexSection } from '../Local';
import { isExistWithInTimeout } from '@src/utils';

const socket = io();

enum MessageEnum {
  OFFER = 'offer',
  ANSWER = 'answer',
  CANDIDATE = 'candidate'
}

type MessagePayload<T, Payload> = {
  type: T;
} & Payload;

type CandidatePayload = {candidate: string; label: number; id: string};
type DescriptionPayload = {sdp: string;};

type OfferMessage = MessagePayload<MessageEnum.OFFER, DescriptionPayload>;
type AnswerMessage = MessagePayload<MessageEnum.ANSWER, DescriptionPayload>;

type CandidateMessage = MessagePayload<MessageEnum.CANDIDATE, CandidatePayload>;

const WebRTCRoomDetail = () => {
  const { room } = useParams<{room: string}>();
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const localMediaStreamRef: React.MutableRefObject<null | MediaStream> = React.useRef(null);
  const [peerConnection, setPeerConnection] = React.useState<null | RTCPeerConnection>(new RTCPeerConnection());
  const [isAccessOther, setIsAccessOther] = React.useState<boolean>(false);

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((mediaStream) => {
        localMediaStreamRef.current = mediaStream;
        const videoMediaStream = new MediaStream();
        mediaStream.getVideoTracks().forEach((track) => {
          videoMediaStream.addTrack(track);
        })
        localVideoRef.current!.srcObject = mediaStream;
        socket.emit('ready');
      })
  }, [room, localVideoRef, localMediaStreamRef]);

  const onMetaDataLocalVideoHandler = React.useCallback(() => {
    if(peerConnection) {
      localMediaStreamRef.current!.getTracks().forEach(track => {
        peerConnection.addTrack(track);
      });
    }
  }, [peerConnection, localMediaStreamRef]);

  const sendMessageToIceCandidate = React.useCallback((event: RTCPeerConnectionIceEvent) => {
    if(event.candidate) {
      socket.emit('message', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      })
    }
  }, [peerConnection]);

  const addCandidateFromRemote = React.useCallback((candidate) => {
    if(peerConnection) {
      const remoteCandidate = new RTCIceCandidate(candidate);
      peerConnection.addIceCandidate(remoteCandidate);
    }
  }, [peerConnection]);

  const addTrackHandler = React.useCallback((event) => {
    if(remoteVideoRef.current) {
      const mediaStream = (remoteVideoRef.current.srcObject as MediaStream | undefined) ?? new MediaStream();
      mediaStream.addTrack(event.track);
      remoteVideoRef.current.srcObject = mediaStream;
    }
  }, [remoteVideoRef]);

  const createOffer = React.useCallback(() => {
    if(peerConnection) {
      peerConnection.createOffer({offerToReceiveVideo: true})
        .then((description) => {
          peerConnection.setLocalDescription(description)
            .then(() => socket.emit('message', description))
            .catch(console.error);
        }).catch(console.error)
    }
  }, [peerConnection]);

  const createAnswer = React.useCallback(() => {
    if(peerConnection) {
      peerConnection.createAnswer()
        .then(description => {
          peerConnection.setLocalDescription(description)
            .then(() => socket.emit('message', description))
            .catch(console.error)
        })
    }
  }, [peerConnection, localMediaStreamRef]);

  const acceptOffer = React.useCallback((description) => {
    if(peerConnection) {
      isExistWithInTimeout(localMediaStreamRef.current)
        .then(() => {
          peerConnection.setRemoteDescription(description).then(createAnswer).catch(console.error)
        })
        .catch(() => {
          alert('권한을 허용해주세요.');
        })
    }
  }, [localMediaStreamRef, peerConnection, createAnswer, localMediaStreamRef]);

  const acceptAnswer = React.useCallback(description => {
    if(peerConnection) {
      console.log('answer description', description)
      peerConnection.setRemoteDescription(description).catch(console.error)
    }
  }, [peerConnection]);


  React.useEffect(() => {
    const onMessageHandler = (message: CandidateMessage | OfferMessage | AnswerMessage) => {
      switch(message.type) {
        case 'offer': {
          acceptOffer({type: message.type, sdp: message.sdp})
          break;
        }
        case 'answer': {
          acceptAnswer({type: message.type, sdp: message.sdp});
          break;
        }
        case 'candidate': {
          addCandidateFromRemote({
            sdpMLineIndex: message.label,
            candidate: message.candidate
          });
          break;
        }
      }
    }
    socket.on('message', onMessageHandler);
    return () => {
      socket.off('message', onMessageHandler);
    }
  }, [acceptOffer, acceptAnswer, addCandidateFromRemote]);

  React.useEffect(() => {
    if(isAccessOther) {
      isExistWithInTimeout(localMediaStreamRef.current)
        .then(createOffer)
        .catch(() => {
          alert('권한을 허용해주세요.');
        })
    } 
  }, [createOffer, localMediaStreamRef.current, isAccessOther]);

  React.useEffect(() => {
    const readyClientHandler = () => {
      setPeerConnection(peerConnection => {
        if(!peerConnection) {
          const newPeerConnection = new RTCPeerConnection();
          localMediaStreamRef.current!.getTracks().forEach(track => {
            newPeerConnection.addTrack(track);
          });

          return newPeerConnection;
        }
        return peerConnection;
      });
      setTimeout(() => setIsAccessOther(true));
    }
    const leaveClientHandler = () => {
      setIsAccessOther(false);
      setPeerConnection(peerConnection => {
        if(peerConnection) {
          peerConnection?.close();
        }
        return null;
      });
      if(remoteVideoRef.current) {
        (remoteVideoRef.current.srcObject as MediaStream)
          ?.getTracks()
          ?.forEach(track => track.stop());   
          remoteVideoRef.current.srcObject = null;
      }
    }
    socket.emit('joinRoom', room);
    socket.on('readyClient', readyClientHandler);
    socket.on('leavedClient', leaveClientHandler);

    return () => {
      socket.emit('leaveRoom', room);
      socket.off('readyClient', readyClientHandler);
      socket.off('leavedClient', leaveClientHandler);
    }
  }, [room, localMediaStreamRef, remoteVideoRef, setPeerConnection, setIsAccessOther]);

  React.useEffect(() => {
    return () => {
      if(localMediaStreamRef.current) {
        const tracks = localMediaStreamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  }, [room, localMediaStreamRef, remoteVideoRef]);

  React.useEffect(() => {
    if(peerConnection) {
      peerConnection.addEventListener('icecandidate', sendMessageToIceCandidate);
      return () => {
        peerConnection.removeEventListener('icecandidate', sendMessageToIceCandidate)
      }
    }
  }, [peerConnection, sendMessageToIceCandidate]);

  React.useLayoutEffect(() => {
    if(localVideoRef.current) {
      localVideoRef.current!.addEventListener('loadedmetadata', onMetaDataLocalVideoHandler);
      return () => {
        localVideoRef.current!.removeEventListener('loadedmetadata', onMetaDataLocalVideoHandler);
      }
    }
  }, [localVideoRef, onMetaDataLocalVideoHandler]);

  React.useEffect(() => {
    peerConnection?.addEventListener('track', addTrackHandler);
  }, [peerConnection, addTrackHandler]);

  return (
    <>
      <Header>
        <H1>{room}</H1>
      </Header>
      <FlexSection>
        <Article>
          <video ref={localVideoRef} autoPlay />
        </Article>
        <Article>
          <video ref={remoteVideoRef} autoPlay />
        </Article>
      </FlexSection>
    </>
  )
};
WebRTCRoomDetail.displayName = 'WebRTCRoomDetail';
export default React.memo(WebRTCRoomDetail);