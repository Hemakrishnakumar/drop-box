
import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';



export interface RouteConfig {
    path: string
    component: LazyExoticComponent<ComponentType>
    isPrivate: boolean
    children?: RouteConfig[]
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
        path: '/home',
        component: lazy(() => import('../pages/Home')),
        isPrivate: true,
    },
    {
        path: '/forbidden',
        component: lazy(() => import('../pages/Forbidden')),
        isPrivate: false,
    },
];
