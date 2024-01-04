export const storageFCMToken = async (token: string) => {
  localStorage.setItem('FCM_TOKEN', token);
};
