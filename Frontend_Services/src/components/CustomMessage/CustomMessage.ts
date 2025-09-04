import { message } from 'antd';
import styles from './CustomMessage.less';

interface MessageProps {
  content: string;
}

export const CustomMessageSuccess = ({ content }: MessageProps) => {
  message.success({ content, className: `${styles.successMess}` });
};

export const CustomMessageError = ({ content }: MessageProps) => {
  message.error({ content, className: `${styles.errorMess}` });
};

export const CustomMessageInfo = ({ content }: MessageProps) => {
  message.info({ content, className: `${styles.infoMess}` });
};

export const CustomMessageWarning = ({ content }: MessageProps) => {
  message.warning({ content, className: `${styles.warningMess}` });
};
