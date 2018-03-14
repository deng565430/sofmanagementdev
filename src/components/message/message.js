import { message } from 'antd';

export const success = (msg) => {
  message.success(msg);
};

export const error = (msg) => {
  message.error(msg);
};
