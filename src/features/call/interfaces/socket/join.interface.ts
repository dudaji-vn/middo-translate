import SimplePeer from "simple-peer";

export interface IJoinCallPayload {
    signal: SimplePeer.SignalData;
    callerId: string;
    user: any;
    isShareScreen: boolean;
    isElectron?: boolean;
    isTurnOnMic?: boolean;
}