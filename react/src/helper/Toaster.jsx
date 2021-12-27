import { ToastsStore } from 'react-toasts';

export const toaster = (type, msg) => {

    switch (type) {
      case "success":
        return ToastsStore.success(msg)

      case "error":
        return ToastsStore.error(msg)

      case "warning":
        return ToastsStore.warning(msg)

      default:
    }


};
