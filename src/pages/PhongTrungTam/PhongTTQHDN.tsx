import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Steps } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';

const PhongTTQHDN: React.FC = () => {
  const [current, setCurrent] = useState(0); // step lớn
  const [sectionIndex, setSectionIndex] = useState(0); // section nhỏ trong step 2
  const [form] = Form.useForm();

  // Step 1 - Thông tin chung
  const step1Content = (
    <Row gutter={[16, 16]}>
      <Col xs={27} md={8}>
        <Form.Item label="Họ và tên người nhập báo cáo" name="hoTen">
          <Input />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Email người nhập báo cáo" name="email">
          <Input type="email" />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Vai trò người nhập báo cáo" name="vaiTro">
          <Input />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item
          label="Năm báo cáo"
          name="namBaoCao"
          rules={[{ required: true, message: 'Vui lòng chọn năm báo cáo' }]}
        >
          <Select placeholder="Chọn năm">
            <Select.Option value="2020">2020</Select.Option>
            <Select.Option value="2021">2021</Select.Option>
            <Select.Option value="2022">2022</Select.Option>
            <Select.Option value="2023">2023</Select.Option>
            <Select.Option value="2024">2024</Select.Option>
            <Select.Option value="2025">2025</Select.Option>
            <Select.Option value="2026">2026</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item
          label="Giai đoạn báo cáo"
          name="giaiDoan"
          rules={[{ required: true, message: 'Vui lòng chọn giai đoạn báo cáo' }]}
        >
          <Select placeholder="Chọn giai đoạn">
            <Select.Option value="firstHaft">
              Giai đoạn 1 (từ 01/01 đến 30/06 hàng năm)
            </Select.Option>
            <Select.Option value="secondHaft">
              Giai đoạn 2 (từ 01/07 đến 31/12 hàng năm)
            </Select.Option>
          </Select>
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
                label="Số lượng truyền thông thương hiệu ULAW"
                name="slTruyenThongThuongHieu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng truyền thông thương hiệu ULAW',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng hình ảnh thương hiệu"
                name="slHinhAnhThuongHieu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng hình ảnh thương hiệu',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng khủng hoảng truyền thông"
                name="slKhungHoangTruyenThong"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng khủng hoảng truyền thông',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <>
                    Số lượng khảo sát tình trạng việc làm của sinh viên sau khi tốt nghiệp
                    <sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="slKhaoSatViecLam"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng khảo sát tình trạng việc làm của sinh viên sau khi tốt nghiệp',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng chương trình thực tập, kiến tập theo nhu cầu của doanh nghiệp"
                name="slChuongTrinhThucTap"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng chương trình thực tập, kiến tập theo nhu cầu của doanh nghiệp',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng hoạt động chăm sóc người học được thực hiện"
                name="slHoatDongChamSoc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng hoạt động chăm sóc người học được thực hiện',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng Cựu sinh viên (Alumni ULAW)"
                name="slCuuSinhVien"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng Cựu sinh viên (Alumni ULAW)',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.noteContainer}>
            <p className={styles.note}>Ghi chú:</p>
            <ul className={styles.noteList}>
              <li>
                <b>(1)</b> Theo dõi, đánh giá thông tin phản hồi của các tổ chức, cá nhân sử dụng
                lao động về khả năng đáp ứng yêu cầu công việc của người học sau tốt nghiệp
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  const step3Content = (
    <div
      style={{
        padding: '16px',
        background: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: '6px',
      }}
    >
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#ad6800',
          marginBottom: '8px',
        }}
      >
        Thầy/Cô vui lòng kiểm tra lại dữ liệu đã nhập trước khi gửi!
      </p>
      <p style={{ marginBottom: '4px', color: '#614700' }}>
        Nhấn nút <b>Quay lại</b> để chỉnh sửa các tiến trình trước;
      </p>
      <p style={{ marginBottom: 0, color: '#614700' }}>
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
            <Button className={styles.btnNext} type="primary" onClick={next}>
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

export default PhongTTQHDN;
