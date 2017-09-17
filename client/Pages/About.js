import React from 'react';
import Package from '../components/Package';

const About = () => (
  <div className="about">
    <h1>Hexo Admin Next</h1>
    <p><strong>Goal: Provide an awesome admin experience for managing your blog.</strong></p>
    <p>
      Useful links:
      <ul>
        <li><a href="http://hexo.io">Hexo site</a></li>
        <li><a href="https://github.com/calpa/hexo-admin-plugin">Github page for this plugin</a></li>
        <li><a href="https://github.com/jaredly/hexo-admin-plugin">Calpa&apos;s Blog</a></li>
      </ul>
    </p>
    <Package />
  </div>
);

export default About;
