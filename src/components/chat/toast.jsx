import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToastNotification = (message) => {
  toast(message);
};
