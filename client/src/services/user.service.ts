import { apiClient, API_ENDPOINTS } from '../api';
import type { RequestCallbacks } from '../api';
import type { UsersResponse } from '../types';



const { USERS } = API_ENDPOINTS;

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

export const userService = {
    /**
     * Get list of users with pagination, search, and sorting
     */
    getUsers(params: GetUsersParams = {}, callbacks?: RequestCallbacks<UsersResponse>) {
        return apiClient.get<UsersResponse>(USERS.LIST, {
            params: params as Record<string, unknown>,
            ...callbacks,
        });
    },
};
