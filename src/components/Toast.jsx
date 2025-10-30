import toast from 'react-hot-toast';

const toastConfig = {
  duration: 4000,
  position: 'top-right',
  

  style: {
    background: '#fff',
    color: '#363636',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
  },
  
  success: {
    duration: 3000,
    style: {
      background: '#10B981',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  },
  
  error: {
    duration: 4000,
    style: {
      background: '#EF4444',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  },

  loading: {
    style: {
      background: '#3B82F6',
      color: '#fff',
    },
  },
};

export const showToast = {
  success: (message) => {
    toast.success(message, toastConfig.success);
  },
  
  error: (message) => {
    toast.error(message, toastConfig.error);
  },
  
  loading: (message) => {
    return toast.loading(message, toastConfig.loading);
  },
  
  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      toastConfig
    );
  },
  
  custom: (message, options = {}) => {
    toast(message, { ...toastConfig, ...options });
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  
  dismissAll: () => {
    toast.dismiss();
  },
};

export default showToast;