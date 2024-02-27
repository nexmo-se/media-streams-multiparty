export const getInitials = function (name) {
  var parts = name.split(' ');
  var initials = '';
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== '') {
      initials += parts[i][0];
    }
  }
  return initials;
};

export const getAudioSourceDeviceId = (audioInputDevices, currentAudioSource) => {
  let toReturn = '';
  console.log('getAudioSourceDeviceId', audioInputDevices, currentAudioSource);
  if (!audioInputDevices || !currentAudioSource) {
    return toReturn;
  }
  for (let i = 0; i < audioInputDevices.length; i += 1) {
    if (audioInputDevices[i].label === currentAudioSource.label) {
      toReturn = audioInputDevices[i].deviceId;
      break;
    }
  }
  return toReturn;
};

export const isMobile = () => {
  let hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else {
    // Ignoring this error which says matchMedia is always present, hence the statement is always true
    // But this breaks in travis where matchMedia throws a Reference error
    // @ts-ignore
    const mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      const UA = navigator.userAgent;
      hasTouchScreen = /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return hasTouchScreen;
};
