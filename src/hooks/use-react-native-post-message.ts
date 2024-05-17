import { usePlatformStore } from '@/features/platform/stores';

declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}
type MessageType = 'Trigger' | 'Console';
export const useReactNativePostMessage = () => {
  const platform = usePlatformStore((state) => state.platform);

  const postMessage = ({ type, data }: { type: MessageType; data: any }) => {
    if (window.ReactNativeWebView && platform === 'mobile') {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type,
          data,
        }),
      );
    }
  };
  return { postMessage };
};
