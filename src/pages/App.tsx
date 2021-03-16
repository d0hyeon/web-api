import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {Global, css} from '@emotion/react';
import styled from '@emotion/styled';
import Navigate, { CATEGORIES } from '@src/components/layout/Navigate';


const Home = React.lazy(() => import('@src/pages/Home'));
type ComponentMap = {[key: string]: React.ComponentType};

const App: React.FC = () => {
  const componentMap: ComponentMap = React.useMemo(() => {
    let map:ComponentMap = {};
    CATEGORIES.forEach(({path}) => {
      map[path] = React.lazy(() => import(`@src/pages${path}`));
    })
    return map;
  }, []);
  return (
    <Layout>
      <Global styles={globalCss} />
      <BrowserRouter>
        <Navigate /> 
        <Switch>
          <React.Suspense fallback="">
            <main className="content">
              <Route exact path="/" component={Home}/>
              {CATEGORIES.map(({url, path}) => (
                <Route key={url} exact path={url} component={componentMap[path]} />
              ))}
            </main>
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

  .navigate {
    flex: 0 0 auto;
  }
  .content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 20px;
  }
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
