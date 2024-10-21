function getWindowSize() {
  const iw = window?.innerWidth;

  if (iw < 576) {
    return 'xs';
  }

  if (iw < 768) {
    return 'sm';
  }

  if (iw < 992) {
    return 'md';
  }

  if (iw < 1200) {
    return 'lg';
  }

  if (iw < 1600) {
    return 'xl';
  }

  return 'xxl';
}

export { getWindowSize }