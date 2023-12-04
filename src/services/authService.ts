import { AuthData } from "@/types";
import { get, post } from "./apiService";
export const login = async ({ email, password }: AuthData) => {

};

export const registerService = async ({ email, password }: AuthData) => {
    try {
        console.log('run 2')
        const response = await post('/auth/register', { email, password });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};