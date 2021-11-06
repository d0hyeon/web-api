import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '@src/constants/route';

interface Props {
  width: number
}

const Navigate: React.FC<Props> = ({width}) => {
  const routes = useMemo(() => {
    return ROUTES.sort((a, b) => {
      if(a.title && b.title) {
        return (a.title!.charCodeAt(0) < b.title!.charCodeAt(0)) ? -1 : 1
      }
      return 0;
    })
  }, [])
  return (
    <Wrapper className="navigate" width={width}>
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

const Wrapper = styled.nav<Props>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({width}) => `${width}px`};
  height: 100%;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
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