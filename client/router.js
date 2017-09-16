import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// import App from './app';
// import Post from './post';
import Posts from './posts';
// import Page from './page';
// import Pages from './pages';
import Home from './Home';
import About from './about';
import Deploy from './deploy';
import Settings from './settings';
// import AuthSetup from './auth-setup';

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
);

const CustomRouter = () => (
  <Router>
    <div>
      <div className="app_header">
        <Link to="/">
          <img src="logo.png" className="app_logo" alt="logo" />
          <span className="app_title">Hexo Admin</span>
        </Link>
        <ul className="app_nav">
          <li><Link to="posts">Posts</Link></li>
          {/* <li><Link to="pages">Pages</Link></li> */}
          <li><Link to="about">About</Link></li>
          <li><Link to="deploy">Deploy</Link></li>
          <li><Link to="settings">Settings</Link></li>
        </ul>
      </div>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route name="posts" component={Posts} path="/posts" />
        {/* <Route name="post" component={Post} path="/posts/:postId" /> */}
        {/* <Route name="page" component={Page} path="/pages/:pageId" /> */}
        {/* <Route name="pages" component={Pages} path="/pages" /> */}
        <Route name="about" component={About} path="/about" />
        <Route name="deploy" component={Deploy} path="/deploy" />
        <Route name="settings" component={Settings} path="/settings" />
        {/* <Route name="auth-setup" component={AuthSetup} /> */}
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default CustomRouter;
