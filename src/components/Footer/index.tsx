import React from 'react';
import styles from './index.less';
import {
  FacebookOutlined,
  YoutubeOutlined,
  GoogleOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';

const Footer: React.FC = () => {
  return (
    <>
      <footer className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <div className={styles.footerSectionsWrapper}>
            <div className={styles.footerSection}>
              <Typography.Title level={4} className={styles.footerSectionTitle}>
                LIÊN HỆ
              </Typography.Title>
              <p>Phòng Đào tạo Đại học - A.102</p>
              <p>
                <a
                  href="https://www.google.com/maps/place/Law+University+of+HCMC/@10.7673011,106.706206,19z/data=!4m6!3m5!1s0x31752f41f8d0bb9f:0x888dfc345b5e0461!8m2!3d10.7674758!4d106.7056752!16s%2Fm%2F02pz1xy?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Số 02, Nguyễn Tất Thành, Phường Xóm Chiếu, Thành phố Hồ Chí Minh
                </a>
              </p>
              <p>
                Email: <a href="mailto:elearning@hcmulaw.edu.vn">elearning@hcmulaw.edu.vn</a>
              </p>
              <div className={styles.socialIconsLeft}>
                <a
                  href="https://www.facebook.com/hcmulaw"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookOutlined className={styles.icon} />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCRbvVsvf42YoNoh1rBfYWmA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YoutubeOutlined className={styles.icon} />
                </a>
                <a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">
                  <GoogleOutlined className={styles.icon} />
                </a>
              </div>
            </div>
            <div className={styles.footerSection}>
              <Typography.Title level={4} className={styles.footerSectionTitle}>
                LIÊN KẾT WEBSITE
              </Typography.Title>
              <p>
                <a href="https://sdh.hcmulaw.edu.vn/" target="_blank">
                  Phòng Đào tạo Sau đại học
                </a>
              </p>
              <p>
                <a href="https://tuvanphapluat.hcmulaw.edu.vn/" target="_blank">
                  Trung tâm tư vấn pháp luật và Phục vụ cộng đồng
                </a>
              </p>
            </div>
            <div className={styles.footerSection}>
              <Typography.Title level={4} className={styles.footerSectionTitle}>
                HỖ TRỢ
              </Typography.Title>
              <div className={styles.helpBox}>
                <PhoneOutlined className={styles.phoneIcon} />
                <Typography.Text className={styles.phoneNumber}>(028). 39400 989</Typography.Text>
                <Typography.Text className={styles.extensionNumber}>
                  MÁY LẺ 112, 113
                </Typography.Text>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerRight}></div>
      </footer>
      <div className={styles.copyrightBar}>
        <a href="https://www.hcmulaw.edu.vn/" target="_blank">
          Copyright © 2025 Trường Đại học Luật Thành phố Hồ Chí Minh
        </a>
      </div>
    </>
  );
};

export default Footer;
