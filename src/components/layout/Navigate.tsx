import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from '@emotion/styled';

type Menu = {
  title: string;
  path: string;
}

const CATEGORIES: Menu[] = [
  {title: 'BroadCast Channel', path: '/broadcast'},
  {title: 'Background Task', path: '/background'},
  {title: 'Resize Observer', path: '/resize'},
  {title: 'Performance', path: '/performance'},
  {title: 'PerformanceObserver', path: '/performance/observer'},
  {title: 'MediaStream', path: '/media'},
  {title: 'MediaStreamTrack', path: '/media/track'},
  {title: 'MediaDevices', path: '/media/devices'},
  {title: 'WebGL', path: '/webgl'}
]

const Navigate: React.FC = () => {
  
  return (
    <Wrapper className="navigate">
      <Title>목차</Title>
      <MenuList>
        {CATEGORIES.map(({title, path}) => (
          <li key={title}>
            <NavLink to={path} activeStyle={{color: '#C43326'}} exact>{title}</NavLink>
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