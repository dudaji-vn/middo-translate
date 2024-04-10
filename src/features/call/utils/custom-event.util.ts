export const sendEvent = (eventName: string, detail?: any) => {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
}
export const listenEvent = (eventName: string, callback: any, context = document) => {
    context.addEventListener(eventName, callback);
    return () => context.removeEventListener(eventName, callback);
}
