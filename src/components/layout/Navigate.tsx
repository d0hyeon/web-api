import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from '@emotion/styled';

type Menu = {
  title: string;
  path: string;
}

const CATEGORIES: Menu[] = [
  {title: 'BroadCast Channel', path: '/broadcast'}
]

const Navigate: React.FC = () => {
  
  return (
    <Wrapper className="navigate">
      <MenuList>
        {CATEGORIES.map(({title, path}) => (
          <li key={title}>
            <NavLink to={path} activeStyle={{fontWeight: 'bold'}}>{title}</NavLink>
          </li>
        ))}
      </MenuList>
    </Wrapper>
  )
}

Navigate.displayName = 'Navigate';
export default React.memo(Navigate);

const Wrapper = styled.nav`
  width: 300px;
  height: 100%;
  padding: 10px 20px;
  border-right: 1px solid #ddd;
`;

const MenuList = styled.ul`
  
`