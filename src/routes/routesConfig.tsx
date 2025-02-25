import { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ReportsProvider } from '@context/reports/reportsProvider';
import { ApprovalsProvider } from '../context/approvals/approvalsProvider';
import { ClosureProvider } from '../context/lotClosure/lotClosureProvider';

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
      wrapper: (Component: React.ComponentType) => (
        <ClosureProvider>
          <Component />
        </ClosureProvider>
      ),
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
      path: '/reportviewer',
      element: lazy(() => import('../pages/ReportViewer/ReportViewer')),
      roles: [1, 2],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    },
    {
      path: '/emptyPage',
      element: lazy(() => import('../pages/Empty/EmptyPage')),
      roles: [],
    },
  ];
  
  export default routesConfig;