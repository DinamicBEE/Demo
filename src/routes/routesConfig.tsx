import { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ReportsProvider } from '@context/reports/reportsProvider';
import { ApprovalsProvider } from '../context/approvals/approvalsProvider';
import { ClosureProvider } from '../context/lotClosure/lotClosureProvider';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../pages/Home/Home')),
      roles: ['admin'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/lotClosure',
      element: lazy(() => import('../pages/LotClosure/LotClosure')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <ClosureProvider>
          <Component />
        </ClosureProvider>
      ),
    },
    {
      path: '/request',
      element: lazy(() => import('../pages/Requests/Requests')),
      roles: ['user'],
    },
    {
      path: '/approvals',
      element: lazy(() => import('../pages/Approvals/Approvals')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/reportviewer',
      element: lazy(() => import('../pages/ReportViewer/ReportViewer')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    },
    {
      path: '/currencymanagement',
      element: lazy(() => import('../pages/CurrencyManagement/CurrencyManagement')),
      roles: ['admin'],
    },
    {
      path: '/emptyPage',
      element: lazy(() => import('../pages/Empty/EmptyPage')),
      roles: [],
    },
  ];
  
  export default routesConfig;