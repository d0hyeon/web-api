import React, { useMemo } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {Global, css} from '@emotion/react';
import styled from '@emotion/styled';
import Navigate from '@src/components/layout/Navigate';
import { ROUTES } from '@src/constants/route'


const Home = React.lazy(() => import('@src/pages/Home'));
type ComponentMap = {[key: string]: React.ComponentType};

const App: React.FC = () => {
  const componentMap: ComponentMap = useMemo(() => {
    let map:ComponentMap = {};
    ROUTES.forEach(({path}) => {
      map[path] = React.lazy(() => import(`@src/pages${path}`));
    })
    return map;
  }, []);
  const navigateWidth = useMemo(() => 300, [])
  return (
    <Layout>
      <Global styles={globalCss} />
      <BrowserRouter>
        <Navigate width={navigateWidth}/> 
        <Switch>
          <React.Suspense fallback="">
            <Content blank={navigateWidth}>
              <Route exact path="/" component={Home}/>
              {ROUTES.map(({url, path}) => (
                <Route key={url} exact path={url} component={componentMap[path]} />
              ))}
            </Content>
          </React.Suspense>
        </Switch>
      </BrowserRouter>
    </Layout>
  );
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  align-items: flex-start;
`

const Content = styled.main<{blank: number}>`
  padding: ${({ blank }) => `20px ${blank + 20}px`};
`

const globalCss = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1;
    max-width: 100%;
  }

  html {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 62.5%;
  }

  ul, li, ol {
    list-style: none; 
  }

  button, a {
    display: inline-block;
    background-color: transparent;
    border: 0;
    outline: none;
    vertical-align: middle;
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    text-align: center;
    line-height: inherit;
    font-family: inherit;
  }

  img {
    max-width: 100%;
  }
  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
  }

  .hljs {
    padding: 10px; 
    font-size: 14px;
    font-family: 'Source Code Pro';
    font-weight: 100;
    line-height: 1.5;
    letter-spacing: 1px;

    span {
      font: inherit;
    }
  }
`

App.displayName = 'App';
export default App;
