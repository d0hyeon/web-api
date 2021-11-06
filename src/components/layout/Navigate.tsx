import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '@src/constants/route';

const Navigate: React.FC = () => {
  return (
    <Wrapper className="navigate">
      <Title>목차</Title>
      <MenuList>
        {ROUTES.map(({title, url}) => title && (
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