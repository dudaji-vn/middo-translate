function openPopupWindow(url: string, windowName?: string) {
    const windowFeatures = "height=600,width=800,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no";
    const newWindow = window.open(url, windowName, windowFeatures);
    newWindow && newWindow.focus();
  }

export default openPopupWindow;