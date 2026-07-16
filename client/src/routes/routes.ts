import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';



export interface RouteConfig {
    path: string;
    component: LazyExoticComponent<ComponentType>;
    isPrivate: boolean;
    children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
    {
        path: '/login',
        component: lazy(() => import('../pages/Login')),
        isPrivate: false,
    },
    {
        path: '/register',
        component: lazy(() => import('../pages/Register')),
        isPrivate: false,
    },
    {
        path: '/verify-email',
        component: lazy(() => import('../pages/Verification')),
        isPrivate: false,
    },
    {
        path: '/resend-verification',
        component: lazy(() => import('../pages/ResendVerification')),
        isPrivate: false,
    },
    {
        path: '/',
        component: lazy(() => import('../pages/Home')),
        isPrivate: true,
        children: [
            {
                path: '',
                component: lazy(() => import('../components/Dashboard')),
                isPrivate: true,
            },
            {
                path: 'files',
                component: lazy(() => import('../pages/Files')),
                isPrivate: true,
            },
            {
                path: 'shared',
                component: lazy(() => import('../pages/Shared')),
                isPrivate: true,
            },
            {
                path: 'favorites',
                component: lazy(() => import('../pages/Favorites')),
                isPrivate: true,
            },
            {
                path: 'recent',
                component: lazy(() => import('../pages/Recent')),
                isPrivate: true,
            },
            {
                path: 'trash',
                component: lazy(() => import('../pages/Trash')),
                isPrivate: true,
            },
            {
                path: 'settings',
                component: lazy(() => import('../pages/Settings')),
                isPrivate: true,
            },
        ],
    },
    {
        path: '/forbidden',
        component: lazy(() => import('../pages/Forbidden')),
        isPrivate: false,
    },
];
