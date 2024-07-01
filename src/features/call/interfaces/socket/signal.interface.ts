import { User } from "@/features/users/types";

export interface IReturnSignal {
    id: string;
    signal: string;
    user: User;
    isShareScreen: boolean;
}