import { notification } from 'antd';

export function isPopUpAvailable(newWindow) {
  if (!newWindow) {
    notification.info({
      message: 'POPUP bloqueado!',
      description: 'verifique se o seu navegador está bloqueando os popups deste site',
    });

    return false;
  } else {
    return true;
  }
}

export function openWindow(hash) {
  const newWindow = window.open();

  if (isPopUpAvailable(newWindow)) {
    newWindow.opener = null;
    newWindow.location = `/read/relatorio/${hash}`;
  }

  return newWindow;
}