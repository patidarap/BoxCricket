import {showMessage, MessageOptions} from 'react-native-flash-message';
import {RefObject} from 'react';
import FlashMessage from 'react-native-flash-message';

export const showDangerMessage = (
  message: string = '',
  options?: Omit<MessageOptions, 'message'>,
  ref?: RefObject<FlashMessage | null>,
) => {
  if (ref?.current) {
    ref.current?.showMessage({
      type: 'danger',
      message: message ?? '',
      duration: 2000,
      ...options,
    });
    return;
  }
  showMessage({
    type: 'danger',
    message: message ?? '',
    duration: 2000,
    ...options,
  });
};

export const showSuccessMessage = (
  message: string,
  options?: Omit<MessageOptions, 'message'>,
  ref?: RefObject<FlashMessage | null>,
) => {
  if (ref?.current) {
    ref.current?.showMessage({
      type: 'success',
      message: message ?? '',
      duration: 2000,
      ...options,
    });
    return;
  }
  showMessage({
    type: 'success',
    message: message ?? '',
    duration: 2000,
    ...options,
  });
};

export const showInfoMessage = (
  message: string,
  options?: Omit<MessageOptions, 'message'>,
  ref?: RefObject<FlashMessage | null>,
) => {
  if (ref?.current) {
    ref.current?.showMessage({
      type: 'info',
      message: message ?? '',
      duration: 2000,
      ...options,
    });
    return;
  }
  showMessage({
    type: 'info',
    message: message ?? '',
    duration: 2000,
    ...options,
  });
};

export const showWarningMessage = (
  message: string,
  options?: Omit<MessageOptions, 'message'>,
  ref?: RefObject<FlashMessage | null>,
) => {
  if (ref?.current) {
    ref.current?.showMessage({
      type: 'warning',
      message: message ?? '',
      duration: 2000,
      ...options,
    });
    return;
  }
  showMessage({
    type: 'warning',
    message: message ?? '',
    duration: 2000,
    ...options,
  });
};
