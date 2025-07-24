import { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ReportsProvider } from '@context/reports/reportsProvider';
import { ApprovalsProvider } from '../context/approvals/approvalsProvider';
import { ClosureProvider } from '../context/lotClosure/lotClosureProvider';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../Pages/Home/Home')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/homeV2',
      element: lazy(() => import('../Pages/Home/Home_v2')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
        {
      path: '/homeV3',
      element: lazy(() => import('../Pages/Home/Home_v3')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/lotClosure',
      element: lazy(() => import('../Pages/LotClosure/LotClosure')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <ClosureProvider>
          <Component />
        </ClosureProvider>
      ),
    },
    {
      path: '/approvals',
      element: lazy(() => import('../Pages/Approvals/Approvals')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/reportviewer',
      element: lazy(() => import('../Pages/ReportViewer/ReportViewer')),
      roles: ['admin', 'user'],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    },
    {
      path: '/currencymanagement',
      element: lazy(() => import('../Pages/CurrencyManagement/CurrencyManagement')),
      roles: ['admin', 'user'],
    },
    {
      path: '/starbucks',
      element: lazy(() => import('../Pages/starbucksClosure/Closure')),
      roles: ['admin', 'user'],
    }
  ];
  
  export default routesConfig;