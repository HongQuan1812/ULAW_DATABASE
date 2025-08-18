import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Steps } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
import { ArrowLeftOutlined } from '@ant-design/icons';
import FormDateSelect from '@/components/FormDateSelect';
import FormStageSelect from '@/components/FormStageSelect';

const TrungtamTVPLVPVCD: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [form] = Form.useForm();

  const location = useLocation();
  const locationName = getLocationName(location.pathname);

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
          <Input />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Email người nhập báo cáo" name="email">
          <Input type="email" />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Chức vụ người nhập báo cáo" name="chucVu">
          <Input />
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
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng dịch vụ tư vấn pháp luật có thu phí đối với cá nhân có nhu cầu"
              name="slDichVuTuVanCaNhanCoPhi"
              rules={[
                {
                  required: true,
                  message:
                    'Số lượng dịch vụ tư vấn pháp luật có thu phí đối với cá nhân có nhu cầu',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng dịch vụ tư vấn pháp luật có thu phí đối với tổ chức có nhu cầu"
              name="slDichVuTuVanToChucCoPhi"
              rules={[
                {
                  required: true,
                  message:
                    'Số lượng dịch vụ tư vấn pháp luật có thu phí đối với tổ chức có nhu cầu',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng hỗ trợ pháp lý đối với các đối tượng được hưởng theo quy định của Pháp luật"
              name="slHoTroPhapLy"
              rules={[
                {
                  required: true,
                  message:
                    'Số lượng hỗ trợ pháp lý đối với các đối tượng được hưởng theo quy định của Pháp luật',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng hoạt động tuyên truyền, phổ biến pháp luật"
              name="slHoatDongTuyenTruyen"
              rules={[
                { required: true, message: 'Số lượng hoạt động tuyên truyền, phổ biến pháp luật' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng các hoạt động liên kết với cơ quan, đơn vị, cá nhân trong và ngoài nước"
              name="slHoatDongLienKet"
              rules={[
                {
                  required: true,
                  message:
                    'Số lượng các hoạt động liên kết với cơ quan, đơn vị, cá nhân trong và ngoài nước',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
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
            <Button className={styles.btnBack} onClick={prev}>
              Quay lại
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {current < 2 && (
            <Button type="primary" onClick={next} className={styles.btnNext}>
              Tiếp tục
            </Button>
          )}
          {current === 2 && (
            <Button className={styles.btnSubmit} type="primary" htmlType="submit">
              Hoàn thành
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default TrungtamTVPLVPVCD;
