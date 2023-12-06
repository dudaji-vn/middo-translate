import { post } from "./apiService";

export const updateInfoUserService = ({ name, language }: {name: string, language: string}) => {
    return post('/users/', { name, language });
};
export const changePasswordUserService = ({ currentPassword, newPassword }: {currentPassword: string, newPassword: string}) => {
    return post('/users/', { currentPassword, newPassword });
};