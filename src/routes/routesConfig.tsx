import { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ApprovalsProvider } from '../context/approvals/approvalsProvider';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../pages/Home/Home')),
      roles: [1],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/lotClosure',
      element: lazy(() => import('../pages/LotClosure/LotClosure')),
      roles: [1, 2],
    },
    {
      path: '/request',
      element: lazy(() => import('../pages/Requests/Requests')),
      roles: [2],
    },
    {
      path: '/approvals',
      element: lazy(() => import('../pages/Approvals/Approvals')),
      roles: [1],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/emptyPage',
      element: lazy(() => import('../pages/Empty/EmptyPage')),
      roles: [],
    },
  ];
  
  export default routesConfig;