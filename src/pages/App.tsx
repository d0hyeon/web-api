import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {Global, css} from '@emotion/react';
import styled from '@emotion/styled';
import Navigate from '@src/components/layout/Navigate';

const Home = React.lazy(() => import('@src/pages/Home'));
const BroadCastChannel = React.lazy(() => import('@src/pages/Broadcast'));
const BroadCastChannelDetail = React.lazy(() => import('@src/pages/Broadcast/detail'));


const App: React.FC = () => {
  return (
    <Layout>
      <Global styles={globalCss} />
      <BrowserRouter>
        <Navigate /> 
        <Switch>
          <React.Suspense fallback="">
            <main className="content">
              <Route exact path="/" component={Home}/> 
              <Route exact path="/broadcast" component={BroadCastChannel} />
              <Route exact path="/broadcast/:channelId" component={BroadCastChannelDetail} />
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
    flex: 1 0 auto;
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
  }

  html {
    font-family: 'Do Hyeon', sans-serif;
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
`

App.displayName = 'App';
export default App;
