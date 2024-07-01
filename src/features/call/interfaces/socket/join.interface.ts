import { User } from "@/features/users/types";
import SimplePeer from "simple-peer";

export interface IJoinCallPayload {
    signal: SimplePeer.SignalData;
    callerId: string;
    user: User;
    isShareScreen: boolean;
    isElectron?: boolean;
    isTurnOnMic?: boolean;
}