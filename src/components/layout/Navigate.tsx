import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '@src/constants/route';

const Navigate: React.FC = () => {
  const routes = useMemo(() => {
    return ROUTES.sort((a, b) => {
      if(a.title && b.title) {
        return (a.title!.charCodeAt(0) < b.title!.charCodeAt(0)) ? -1 : 1
      }
      return 0;
    })
  }, [])
  return (
    <Wrapper className="navigate">
      <Title>목차</Title>
      <MenuList>
        {routes.map(({title, url}) => title && (
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