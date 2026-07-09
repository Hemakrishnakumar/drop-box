
import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';



export interface RouteConfig {
    path: string
    component: LazyExoticComponent<ComponentType>
    isPrivate: boolean
    roles?: string[]
    deny?: (role: string) => boolean
    redirectTo?: string
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
        path: '/admin/users',
        component: lazy(() => import('../pages/Admin/Users')),
        isPrivate: false,
        roles: ['admin', 'superAdmin'],
    },
    {
        path: '/admin/users/:id',
        component: lazy(() => import('../pages/Admin/UserDetails')),
        isPrivate: false,
        roles: ['admin', 'superAdmin'],
    },

    // {
    //     path: '/admin',
    //     component: lazy(() => import('../layouts/AdminLayout')),
    //     isPrivate: true,
    //     roles: ['admin'],
    //     children: [
    //         {
    //             path: '',
    //             component: lazy(() => import('../pages/Admin/Dashboard')),
    //             isPrivate: true,
    //             roles: ['admin'],
    //         },
    //         {
    //             path: 'users',
    //             component: lazy(() => import('../pages/Admin/Users')),
    //             isPrivate: true,
    //             roles: ['admin'],
    //         },
    //         {
    //             path: 'reports',
    //             component: lazy(() => import('../pages/Admin/Reports')),
    //             isPrivate: true,
    //             roles: ['admin'],
    //         },
    //     ],
    // },
    {
        path: '/forbidden',
        component: lazy(() => import('../pages/Forbidden')),
        isPrivate: false,
    },
];
