import React, { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ReportsProvider } from '@context/reports/reportsProvider';
import { ApprovalsProvider } from '../context/approvals/approvalsProvider';
import { ClosureProvider } from '../context/lotClosure/lotClosureProvider';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../Pages/Home/Home')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/homeV2',
      element: lazy(() => import('../Pages/Home/Home_v2')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
        {
      path: '/homeV3',
      element: lazy(() => import('../Pages/Home/Home_v3')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/lotClosure',
      element: lazy(() => import('../Pages/LotClosure/LotClosure')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <ClosureProvider>
          <Component />
        </ClosureProvider>
      ),
    },
    {
      path: '/approvals',
      element: lazy(() => import('../Pages/Approvals/Approvals')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/reportviewer',
      element: lazy(() => import('../Pages/ReportViewer/ReportViewer')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    },
    {
      path: '/currencymanagement',
      element: lazy(() => import('../Pages/CurrencyManagement/CurrencyManagement')),
      roles: ['ADMIN', 'USER'],
    },
    {
      path: '/reports',
      element: lazy(() => import('../Pages/Reports/Reports')),
      roles: ['ADMIN', 'USER'],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    }
  ];
  
  export default routesConfig;