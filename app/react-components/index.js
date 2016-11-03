import ReactDOM from 'react-dom';
import React from 'react';

import Home from './Home';
import Project from './Project';
import Projects from './Projects';
import Gene from './Gene';
import Case from './Case';
import Mutation from './Mutation';
import SideNavLayout from './layouts/SideNavLayout'
import FrequentMutations from './components/FrequentMutations'

// expose to angular
window.ReactComponents = {
  Home,
  Project,
  Gene,
  Mutation,
  SideNavLayout,
  Projects,
  FrequentMutations,
  Case,
};

window.Project = Project;
window.ReactDOM = ReactDOM;
window.React = React;
