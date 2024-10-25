import { notification } from 'antd';

export function abrirJanela(url) {
  const newWindow = window.open();

  if (!newWindow) {
    notification.warning({
      message: 'Atenção!',
      description: 'Ação bloqueada pelo navegador',
    });

    return null;
  }

  newWindow.opener = null;
  newWindow.location = url;

  return newWindow;
}