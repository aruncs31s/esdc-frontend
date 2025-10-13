
import { LoginCredentials, UserRegisterData } from '@/types/index';
import { ApiSuccessResponse } from '@/types/index';
import { User } from '@/domain';
import apiClient from '@/infrastructure/api/ApiClient';

export const createUser = async (user: UserRegisterData): Promise<ApiSuccessResponse<string>> => {
    const { data } = await apiClient.post<ApiSuccessResponse<string>>('/user/register', user);
    return data;
};
export const loginUser = async (user: LoginCredentials): Promise<ApiSuccessResponse<User>> => {
    const { data } = await apiClient.post<ApiSuccessResponse<User>>('/user/login', user);
    return data;
}

export interface CoordinatePrograms {
    id: number;
    title: string;
}

// const coordinatePrograms = await apiClient.get<ApiSuccessResponse<CoordinatePrograms[]>>('/coordinate-programs');

