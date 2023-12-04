import { AuthData } from "@/types";
import { get, post } from "./apiService";
export const login = async ({ email, password }: AuthData) => {

};

export const registerService = ({ email, password }: AuthData) => {
    return post('/auth/sign-up', { email, password });
};
export const loginService = ({ email, password }: AuthData) => {
    return post('/auth/sign-in', { email, password });
};
export const verifyEmailService = () => {
    return get('/auth/activate-account');
};
export const resendEmailService = (email: string) => {
    return post('/auth/resend-verify-email', { email });
};