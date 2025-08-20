import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Steps } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
import FormDateSelect from '@/components/FormDateSelect';
import FormStageSelect from '@/components/FormStageSelect';
import SelectVPRole from '@/components/SelectVPRole';

const PhongKHCNHTPT: React.FC = () => {
  const [current, setCurrent] = useState(0); // step lớn
  const [sectionIndex, setSectionIndex] = useState(0); // section nhỏ trong step 2
  const [form] = Form.useForm();

  const location = useLocation();
  const locationName = getLocationName(location.pathname);

  const numberRule = [
    {
      pattern: /^[1-9][0-9]*$/,
      message: 'Chỉ được nhập số nguyên',
    },
  ];

  // Step 1 - Thông tin chung
  const step1Content = (
    <Row gutter={[16, 16]}>
      <Col xs={27} md={8}>
        <Form.Item label="Đơn vị trực thuộc" name="donVi">
          <Input disabled />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Họ và tên người nhập báo cáo" name="fullName">
          <Input disabled />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Email người nhập báo cáo" name="email">
          <Input disabled />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item
          label="Chức vụ người nhập báo cáo"
          name="chucVu"
          rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
        >
          <SelectVPRole />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item
          label="Năm báo cáo"
          name="namBaoCao"
          rules={[{ required: true, message: 'Vui lòng chọn năm báo cáo' }]}
        >
          <FormDateSelect />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item
          label="Giai đoạn báo cáo"
          name="giaiDoan"
          rules={[{ required: true, message: 'Vui lòng chọn giai đoạn báo cáo' }]}
        >
          <FormStageSelect />
        </Form.Item>
      </Col>
    </Row>
  );

  // Step 2 - Các section nhỏ
  const sections = [
    {
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng đề tài nghiên cứu khoa học các cấp do Trường chủ trì tổ chức thực hiện"
                name="soLuongDeTaiNCKHCapTruong"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng đề tài nghiên cứu khoa học các cấp do Trường chủ trì tổ chức thực hiện',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng đề tài nghiên cứu khoa học các cấp do viên chức, người lao động của Trường thực hiện"
                name="soLuongDeTaiNCKHCapVienChuc"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng đề tài nghiên cứu khoa học các cấp do viên chức, người lao động của Trường thực hiện',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng chuyển giao kết quả nghiên cứu khoa học của Trường với các tổ chức, cá nhân ngoài Trường"
                name="soLuongChuyenGiaoKetQua"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng chuyển giao kết quả nghiên cứu khoa học của Trường với các tổ chức, cá nhân ngoài Trường',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng các dự án hợp tác quốc tế về nghiên cứu khoa học và đào tạo"
                name="soLuongDuAnHopTacQT"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng các dự án hợp tác quốc tế về nghiên cứu khoa học và đào tạo',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số liệu tiếp nhận, đề xuất lập hội đồng xét thưởng các công bố quốc tế của viên chức, người lao động và người học của Trường"
                name="deXuatLapHoiDong"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số liệu tiếp nhận, đề xuất lập hội đồng xét thưởng các công bố quốc tế của viên chức, người lao động và người học của Trường',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng các hội thảo, hội nghị khoa học từ cấp Trường trở lên và quản lý việc thực hiện các hội thảo, hội nghị khoa học trong Trường"
                name="soLuongHoiThao"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng các hội thảo, hội nghị khoa học từ cấp Trường trở lên và quản lý việc thực hiện các hội thảo, hội nghị khoa học trong Trường',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng đoàn ra vào"
                name="soLuongDoanRaVao"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng đoàn ra vào',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng viên chức, người lao động của Trường ra nước ngoài dự hội thảo, hội nghị khoa học"
                name="soLuongVienChucHoiThaoNuocNgoai"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng viên chức, người lao động của Trường ra nước ngoài dự hội thảo, hội nghị khoa học',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng viên chức, người lao động của Trường đi đào tạo, học tập ngắn hạn ở nước ngoài"
                name="soLuongVienChucDaoTaoNuocNgoai"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng viên chức, người lao động của Trường đi đào tạo, học tập ngắn hạn ở nước ngoài',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng người học của Trường ra nước ngoài dự hội thảo, hội nghị khoa học"
                name="soLuongNguoiHocHoiThaoNuocNgoai"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng người học của Trường ra nước ngoài dự hội thảo, hội nghị khoa học',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng người học của Trường đi đào tạo, học tập ngắn hạn ở nước ngoài"
                name="soLuongNguoiHocDaoTaoNuocNgoai"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng người học của Trường đi đào tạo, học tập ngắn hạn ở nước ngoài',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng công trình KHCN toàn Trường"
                name="soLuongCongTrinhKHCN"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng công trình KHCN toàn Trường',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng ký hợp tác với các tổ chức trong nước"
                name="soLuongHopTacTrongNuoc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng ký hợp tác với các tổ chức trong nước',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng ký hợp tác với các tổ chức ngoài nước"
                name="soLuongHopTacNgoaiNuoc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng ký hợp tác với các tổ chức ngoài nước',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.noteContainer}>
            <p className={styles.note}>Ghi chú:</p>
            <ul className={styles.noteList}>
              <li>Vui lòng điền giá trị = 0 nếu không có</li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  const step3Content = (
    <div className={styles.step3Container}>
      <p className={styles.step3Content}>
        Thầy/Cô vui lòng kiểm tra lại dữ liệu đã nhập trước khi gửi!
      </p>
      <p className={styles.step3BackContent}>
        Nhấn nút <b>Quay lại</b> để chỉnh sửa các tiến trình trước;
      </p>
      <p className={styles.step3SubmitContent}>
        Nhấn nút <b>Hoàn thành</b> để lưu và gửi dữ liệu.
      </p>
    </div>
  );

  const onFinish = (values: any) => {
    console.log('Form data:', values);
    CustomMessageSuccess({ content: 'Lưu dữ liệu thành công!' });
    history.push('/trangchu');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Form submit failed:', errorInfo);
    CustomMessageError({ content: 'Vui lòng kiểm tra lại thông tin' });
  };

  const next = () => {
    if (current === 1) {
      if (sectionIndex < sections.length - 1) {
        setSectionIndex(sectionIndex + 1);
      } else {
        setCurrent(current + 1);
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current === 1) {
      if (sectionIndex > 0) {
        setSectionIndex(sectionIndex - 1);
      } else {
        setCurrent(current - 1);
      }
    } else {
      setCurrent(current - 1);
    }
  };

  return (
    <>
      <div className={styles.stepHeader}>
        <ArrowLeftOutlined style={{ marginRight: 4 }} onClick={() => history.push('/trangchu')} />{' '}
        {locationName}
      </div>
      <div className={styles.stepCard}>
        <Steps
          current={current}
          items={[{ title: 'Thông tin chung' }, { title: 'Nội dung' }, { title: 'Hoàn thành' }]}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        preserve
        className={styles.container}
      >
        {/* Step 1 */}
        <div style={{ display: current === 0 ? 'block' : 'none' }}>{step1Content}</div>

        {/* Step 2 */}
        <div style={{ display: current === 1 ? 'block' : 'none' }}>
          {sections.map((sec, idx) => (
            <div key={idx} style={{ display: idx === sectionIndex ? 'block' : 'none' }}>
              {sec.content}
            </div>
          ))}
        </div>

        {/* Step 3 */}
        <div style={{ display: current === 2 ? 'block' : 'none' }}>{step3Content}</div>

        {/* Buttons */}
        <div style={{ display: 'flex', marginTop: 24 }}>
          {!(current === 0 && sectionIndex === 0) && (
            <Button className={styles.btnBack} onClick={prev} icon={<ArrowLeftOutlined />}>
              Quay lại
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {current < 2 && (
            <Button type="primary" onClick={next} className={styles.btnNext}>
              Tiếp tục
              <ArrowRightOutlined />
            </Button>
          )}
          {current === 2 && (
            <Button className={styles.btnSubmit} type="primary" htmlType="submit">
              Hoàn thành
              <CheckOutlined />
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default PhongKHCNHTPT;
