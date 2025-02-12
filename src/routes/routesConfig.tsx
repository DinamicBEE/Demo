import { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ApprovalsProvider } from '@context/approvals/approvalsProvider';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../Pages/Home/Home')),
      roles: [1],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/lotClosure',
      element: lazy(() => import('../Pages/LotClosure/LotClosure')),
      roles: [1, 2],
    },
    {
      path: '/request',
      element: lazy(() => import('../Pages/Requests/Requests')),
      roles: [2],
    },
    {
      path: '/approvals',
      element: lazy(() => import('../Pages/Approvals/ApprovalsMain')),
      roles: [1],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/emptyPage',
      element: lazy(() => import('../Pages/Empty/EmptyPage')),
      roles: [],
    },
  ];
  
  export default routesConfig;