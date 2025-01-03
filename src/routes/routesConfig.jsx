import { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../pages/Home/Home')),
      roles: [1, 2],
      wrapper: (Component) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/cashClosing',
      element: lazy(() => import('../pages/CashClosing/CashClosing')),
      roles: [1],
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
    },
    {
      path: '/emptyPage',
      element: lazy(() => import('../pages/Empty/EmptyPage')),
      roles: [],
    },
  ];
  
  export default routesConfig;