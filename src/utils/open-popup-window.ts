function openPopupWindow(url: string, windowName?: string) {
    let newWindow = window.open(url, windowName, 'height=600,width=800,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no');
    newWindow && newWindow.focus();
  }

export default openPopupWindow;