function openPopupWindow(url: string, windowName?: string) {
    const windowFeatures = "height=600,width=800";
    const newWindow = window.open(url, windowName, windowFeatures);
    newWindow && newWindow.focus();
  }

export default openPopupWindow;