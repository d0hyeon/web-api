import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from '@emotion/styled';

type Menu = {
  title?: string;
  url: string;
  path: string;
}

export const CATEGORIES: Menu[] = [
  {title: 'BroadCast Channel', url: '/broadcast', path: '/Broadcast'},
  {url: '/broadcast/:channelId', path: '/Broadcast/detail'},
  {title: 'Background Task', url: '/background', path: '/BackgroundTask'},
  {title: 'Resize Observer', url: '/resize', path: '/ResizeObserver'},
  {title: 'Performance', url: '/performance', path: 'Performance'},
  {title: 'PerformanceObserver', url: '/performance/observer', path: '/Performance/Observer'},
  {title: 'MediaStream', url: '/media', path: '/MediaStream'},
  {title: 'MediaStreamTrack', url: '/media/track', path: '/MediaStream/Track'},
  {title: 'MediaDevices', url: '/media/devices', path: '/MediaStream/Devices'},
  {title: 'WebRTC', url: '/webrtc', path: '/WebRTC'},
  {title: 'WebGL', url: '/webgl', path: '/WebGL'}
]

const Navigate: React.FC = () => {
  
  return (
    <Wrapper className="navigate">
      <Title>목차</Title>
      <MenuList>
        {CATEGORIES.map(({title, url}) => title && (
          <li key={title}>
            <NavLink to={url} activeStyle={{color: '#C43326'}} exact>{title}</NavLink>
          </li>
        ))}
      </MenuList>
    </Wrapper>
  )
}

Navigate.displayName = 'Navigate';
export default React.memo(Navigate);

const Title = styled.p`
  font-size: 22px;
  margin-bottom: 20px;
`

const Wrapper = styled.nav`
  width: 300px;
  height: 100%;
  padding: 10px 20px;
  border-right: 1px solid #ddd;
`;

const MenuList = styled.ul`
  li {
    & ~ li {
      margin-top: 8px;
    }

    a {
      color: #333;
      font-size: 16px;
    }
  }
`