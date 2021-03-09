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
  }, []);

  const acceptMessageOfIceCandidate = React.useCallback((candidate) => {
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
  }, [peerConnection]);

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
  }, [localMediaStreamRef, peerConnection, createAnswer]);

  const acceptAnswer = React.useCallback(description => {
    if(peerConnection) {
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
          acceptMessageOfIceCandidate({
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
  }, [acceptOffer, acceptAnswer, acceptMessageOfIceCandidate]);

  React.useEffect(() => {
    const readyClientHandler = () => {
      setPeerConnection(peerConnection => {
        // 상대방이 떠나고 재 접속을 한다면 PeerConnection을 재 설정 해줌
        if(!peerConnection) {
          const newPeerConnection = new RTCPeerConnection();
          localMediaStreamRef.current!.getTracks().forEach(track => {
            newPeerConnection.addTrack(track);
          });

          return newPeerConnection;
        }
        // 상대방이 처음으로 들어오면 기존의 PeerConnection을 반환 
        return peerConnection;
      });
      setTimeout(() => setIsAccessOther(true));
    }
    const leaveClientHandler = () => {
      setIsAccessOther(false);
      setPeerConnection(peerConnection => {
        // PeerConnection 종료하고 null로 반환 
        if(peerConnection) {
          peerConnection?.close();
        }
        return null;
      });
      if(remoteVideoRef.current) {
        // 상대방이 떠난것 이므로 상대방의 MediaStreamTrack들을 종료해줌
        (remoteVideoRef.current.srcObject as MediaStream)
          ?.getTracks()
          ?.forEach(track => track.stop());   
          remoteVideoRef.current.srcObject = null;
      }
    }
    socket.emit('joinRoom', room);
    socket.on('readyClient', readyClientHandler); // 상대방이 접속 후 준비가 완료 됬을 때
    socket.on('leavedClient', leaveClientHandler); // 상대방이 떠났을 때

    return () => {
      socket.emit('leaveRoom', room);
      socket.off('readyClient', readyClientHandler);
      socket.off('leavedClient', leaveClientHandler);
    }
  }, [room, localMediaStreamRef, remoteVideoRef, setPeerConnection, setIsAccessOther]);

  React.useEffect(() => {
    // 다른 사용자의 준비가 완료 되고 MediaStream 데이터가 준비 됬을 때 연결을 시도함
    if(isAccessOther) {
      isExistWithInTimeout(localMediaStreamRef.current)
        .then(createOffer)
        .catch(() => {
          alert('권한을 허용해주세요.');
        })
    } 
  }, [createOffer, localMediaStreamRef, isAccessOther]);

  React.useEffect(() => {
    return () => {
      // 방에서 나갔을 때 녹화, 녹취중인 MediaStreamTrack 들을 종료 시킴
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
    const {current: localVideo} = localVideoRef;
    if(localVideo) {
      localVideo.addEventListener('loadedmetadata', onMetaDataLocalVideoHandler);
      return () => {
        localVideo.removeEventListener('loadedmetadata', onMetaDataLocalVideoHandler);
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