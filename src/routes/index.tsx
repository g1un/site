import React from 'react';

import { About } from 'pages/About';
import { Works } from 'pages/Works';
import { Contacts } from 'pages/Contacts';
import { Admin } from '../pages/Admin';

export type Route = {
  path: string;
  component: React.ReactNode;
  title: string;
  isVisible?: boolean;
  isPrivate?: boolean;
};

export const routes: Route[] = [
  {
    path: '/',
    component: <About />,
    title: 'About',
  },
  {
    path: '/works',
    component: <Works />,
    title: 'Works',
  },
  {
    path: '/contacts',
    component: <Contacts />,
    title: 'Contacts',
  },
  {
    path: '/admin',
    component: <Admin />,
    title: 'Admin',
    isVisible: false,
  },
  {
    path: '/admin/skills',
    component: <Admin />,
    title: 'Admin',
    isPrivate: true,
  },
];
