import { User } from "@/features/users/types";

export default interface IDrawDoodle {
    image: string;
    user: User;
    color: string;
    socketId: string;
}