function openPopupWindow(url: string, windowName?: string) {
    let newWindow = window.open(url, windowName, 'height=500,width=700,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no');
    newWindow && newWindow.focus();
  }

export default openPopupWindow;