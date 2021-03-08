import React from 'react';
import { Header } from '@src/components/styles/common';
import { H1 } from '@src/components/styles/text';

const WebRTCRoomDetail = () => {
  return (
    <>
      <Header>
        <H1>Room Detail</H1>
      </Header>
    </>
  )
};
WebRTCRoomDetail.displayName = 'WebRTCRoomDetail';
export default React.memo(WebRTCRoomDetail);