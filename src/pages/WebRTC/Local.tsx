import React, { MutableRefObject } from 'react';
import styled from '@emotion/styled';
import { Article, Button, Header, Section } from '@src/components/styles/common';
import { H1, H2, P } from '@src/components/styles/text';

const WebRTCLocal: React.FC = () => {
  const localDisabledTracks = React.useRef<MediaStreamTrack[]>([]);
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const userMediaStreamRef: MutableRefObject<null | MediaStream> = React.useRef(null);
  
  const [isPlay, setIsPlay] = React.useState<boolean>(false);
  const [isVideo, setIsVideo] = React.useState<boolean>(true);
  const [isAudio, setIsAudio] = React.useState<boolean>(true);
  const [localPeerConnection, setLocalPeerConnection] = React.useState<RTCPeerConnection | null>(null);
  const [remotePeerConnection, setRemotePeerConnection] = React.useState<RTCPeerConnection| null>(null);
  
  const requestGetUserMedia = React.useCallback(() => {
    const constraints = {
      video: isVideo,
      audio: isAudio
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        userMediaStreamRef.current = mediaStream;
        localVideoRef.current!.srcObject = mediaStream;
      });
  }, [localVideoRef, isVideo, isAudio, userMediaStreamRef]);

  const closeUserMedia = React.useCallback(() => {
    if(remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    (userMediaStreamRef.current?.getTracks?.() ?? [])
      .forEach(track => track.stop());
    
    setLocalPeerConnection(peerConnection => {
      peerConnection?.close();
      return null
    });
    setRemotePeerConnection(peerConnection => {
      peerConnection?.close();
      return null;
    })
  }, [userMediaStreamRef, remoteVideoRef, setLocalPeerConnection, setRemotePeerConnection])

  const handleConnection = React.useCallback((event) => {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if(iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      const otherPeer = peerConnection === localPeerConnection
        ? remotePeerConnection 
        : localPeerConnection;
      otherPeer!.addIceCandidate(newIceCandidate)
    }
  }, [localPeerConnection, remotePeerConnection]);

  const onLoadLocalVideoMedaDataHandler = React.useCallback((event) => {
    const {current: localVideo} = localVideoRef;
    
    if(localVideo && localPeerConnection && remotePeerConnection) {
      const {target: {srcObject}} = event;
      const tracks = (srcObject as MediaStream).getTracks();
      
      tracks.forEach(track => localPeerConnection.addTrack(track));
      localPeerConnection.createOffer({offerToReceiveVideo: true})
        .then(description => {
          localPeerConnection.setLocalDescription(description);
          remotePeerConnection.setRemoteDescription(description);

          remotePeerConnection.createAnswer()
            .then(description => {
              remotePeerConnection.setLocalDescription(description);
              localPeerConnection.setRemoteDescription(description);
            })
      });
    }
  }, [localVideoRef, localPeerConnection, remotePeerConnection]);

  const togglePlay = React.useCallback(() => {
    setIsPlay(curr => !curr);
  }, [setIsPlay]);

  const toggleTracks = React.useCallback((kind: 'video' | 'audio'): MediaStream => {
    const {current: userMediaStream} = userMediaStreamRef;
    const method = kind === 'video' ? 'getVideoTracks' : 'getAudioTracks';
    const targetTracks = userMediaStream![method]() ?? [];
    
    if(targetTracks.length) {
      const newDisabledTracks = targetTracks.map((track) => {
        userMediaStream?.removeTrack(track);
        return track;
      });

      localDisabledTracks.current = [
        ...localDisabledTracks.current,
        ...newDisabledTracks
      ]
    } else {
      const disabledTracks = localDisabledTracks.current.filter((track, idx) => {
        if(track.kind === kind) {
          localDisabledTracks.current.splice(idx, 1);
          return true;
        }
      })
      disabledTracks.forEach((track) => {
        userMediaStream!.addTrack(track);
      });
    }
    return userMediaStream as MediaStream;
  }, [userMediaStreamRef, localDisabledTracks]);

  const toggleVideo = React.useCallback(() => {
    setIsVideo(curr => !curr);
  }, [setIsVideo]);
  const toggleAudio = React.useCallback(() => {
    setIsAudio(curr => !curr);
  }, [setIsAudio]);

  React.useEffect(() => {
    if(isPlay) {
      requestGetUserMedia(); 
      setLocalPeerConnection(new RTCPeerConnection())
      setRemotePeerConnection(new RTCPeerConnection());
    } else {
      closeUserMedia();
    }
  }, [isPlay, closeUserMedia, requestGetUserMedia]);

  React.useEffect(() => {
    if(userMediaStreamRef.current) {
      const mediaStream = toggleTracks('audio');
      userMediaStreamRef.current = mediaStream;
      // localVideoRef.current!.srcObject = mediaStream;
    }
  }, [isAudio, toggleTracks, userMediaStreamRef]);
  React.useEffect(() => {
    if(userMediaStreamRef.current) {
      const mediaStream = toggleTracks('video');
      userMediaStreamRef.current = mediaStream;
    }
  }, [isVideo, toggleTracks, userMediaStreamRef]);


  React.useEffect(() => {
    const {current} = localVideoRef;
    if(current) {
      current.addEventListener('loadedmetadata', onLoadLocalVideoMedaDataHandler);
    }
    return () => {
      if(current) {
        current.removeEventListener('loadedmetadata', onLoadLocalVideoMedaDataHandler);
      }
    }
  }, [localVideoRef, onLoadLocalVideoMedaDataHandler]);
  
  React.useEffect(() => {
    localPeerConnection?.addEventListener?.('icecandidate', handleConnection);
    remotePeerConnection?.addEventListener?.('icecandidate', handleConnection);

    return () => {
      localPeerConnection?.removeEventListener?.('icecandidate', handleConnection);
      remotePeerConnection?.removeEventListener?.('icecandidate', handleConnection);
    }
  }, [localPeerConnection, remotePeerConnection, handleConnection]);

  React.useEffect(() => {
    const addTrackHandler = (event: MediaStreamTrackEvent) => {
      if(remoteVideoRef.current) {
        const mediaStream = remoteVideoRef.current.srcObject 
          ? new MediaStream(remoteVideoRef.current.srcObject as MediaStream)
          : new MediaStream();
          
        mediaStream.addTrack(event.track);
        remoteVideoRef.current.srcObject = mediaStream;
      }
    }
    
    remotePeerConnection?.addEventListener('track', addTrackHandler);
    return () => remotePeerConnection?.removeEventListener('track', addTrackHandler);
  }, [remotePeerConnection, remoteVideoRef]);
  
  return (
    <>
      <Header>
        <H1>WebRTC</H1>
        <P>
            WebRTC는 웹 어플리케이션 간의 비디오나 오디오 미디어를 P2P 방식으로 데이터를 교환 하는 기술이다. <br/>
            Media Stream 또는 Media Capture과 함께 비디오및 오디오, 파일 교환, 화면 공유등 다양한 인터페이스를 포함 한 멀티미디어 기능을 제공한다.<br/>            
        </P>
      </Header>
      <FlexSection>
        <Article>
          <H2>Local Video</H2>
          <div>
            <video ref={localVideoRef} autoPlay/> <br/>
            <Button onClick={togglePlay}>{isPlay ? '중지' : '촬영'}</Button>
            <Button onClick={toggleAudio} disabled={!isVideo || isPlay}>오디오 {isAudio ? 'off' : 'on'}</Button>
            <Button onClick={toggleVideo} disabled={!isAudio || isPlay}>비디오 {isVideo ? 'off' : 'on'}</Button>
          </div>
        </Article>
        <Article>
          <H2>Remote Video</H2>
          <div>
            <video ref={remoteVideoRef} autoPlay />
          </div>
        </Article>
      </FlexSection>
    </>
  )
};

const FlexSection = styled(Section)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  article {
    flex: 1;
  }
`;

WebRTCLocal.displayName = 'WebRTCLocal';
export default WebRTCLocal;