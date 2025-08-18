import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Steps } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';

const PhongHCTH: React.FC = () => {
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
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng văn bản đến"
                name="slVanBanDen"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng văn bản đến',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng văn bản đi"
                name="slVanBanDi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng văn bản đi',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng văn bản mật"
                name="slVanBanMat"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng văn bản mật',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng chứng thực - sao y các văn bản giấy tờ của Nhà trường"
                name="slChungThucSaoY"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng chứng thực - sao y các văn bản giấy tờ của Nhà trường',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng cấp phát văn bằng - chứng chỉ của Trường"
                name="slCapPhatVanBang"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng cấp phát văn bằng - chứng chỉ của Trường',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng các báo cáo về công tác hành chính, quản trị định kỳ - đột xuất"
                name="slBaoCaoHanhChinh"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng các báo cáo về công tác hành chính, quản trị định kỳ - đột xuất',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng định mức sử dụng văn phòng phẩm"
                name="slDinhMucVanPhongPham"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng định mức sử dụng văn phòng phẩm',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng hồ sơ lưu trữ, tài liệu lưu trữ tại Trường"
                name="slHoSoLuuTru"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng hồ sơ lưu trữ, tài liệu lưu trữ tại Trường',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng hồ sơ lưu trữ, tài liệu lưu trữ nộp kho lưu trữ"
                name="slHoSoLuuTruKho"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng hồ sơ lưu trữ, tài liệu lưu trữ nộp kho lưu trữ',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
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

export default PhongHCTH;
