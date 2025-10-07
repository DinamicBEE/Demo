import React, { lazy } from 'react';
import { HomeProvider } from '../context/home/homeProvider';
import { ReportsProvider } from '@context/reports/reportsProvider';
import { ApprovalsProvider } from '../context/approvals/approvalsProvider';
import { ClosureProvider } from '../context/lotClosure/lotClosureProvider';
import { ROLES } from '@models/const/menu.consts';

const routesConfig = [
    {
      path: '/home',
      element: lazy(() => import('../Pages/Home/Home')),
      roles: [ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/homeV2',
      element: lazy(() => import('../Pages/Home/Home_v2')),
      roles: [ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
        {
      path: '/homeV3',
      element: lazy(() => import('../Pages/Home/Home_v3')),
      roles: [ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE],
      wrapper: (Component: React.ComponentType) => (
        <HomeProvider>
          <Component />
        </HomeProvider>
      ),
    },
    {
      path: '/lotClosure',
      element: lazy(() => import('../Pages/LotClosure/LotClosure')),
      roles: [ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE],
      wrapper: (Component: React.ComponentType) => (
        <ClosureProvider>
          <Component />
        </ClosureProvider>
      ),
    },
    {
      path: '/approvals',
      element: lazy(() => import('../Pages/Approvals/Approvals')),
      roles: [ROLES.CONTROLLER],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/requests',
      element: lazy(() => import('../Pages/Approvals/requests')),
      roles: ['ADMINFRONT'],
      wrapper: (Component: React.ComponentType) => (
        <ApprovalsProvider>
          <Component />
        </ApprovalsProvider>
      ),
    },
    {
      path: '/reportviewer',
      element: lazy(() => import('../Pages/ReportViewer/ReportViewer')),
      roles: ['ADMINFRONT'],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    },
    {
      path: '/currencymanagement',
      element: lazy(() => import('../Pages/CurrencyManagement/CurrencyManagement')),
      roles: ['ADMINFRONT'],
    },
    {
      path: '/reports',
      element: lazy(() => import('../Pages/Reports/Reports')),
      roles: ['ADMINFRONT'],
      wrapper: (Component: React.ComponentType) => (
        <ReportsProvider>
          <Component />
        </ReportsProvider>
      )
    },
    {
      path: '/starbucks',
      element: lazy(() => import('../Pages/starbucksClosure/Closure')),
      roles: [ROLES.GENERAL_ZONE],
    }
  ];
  
  export default routesConfig;