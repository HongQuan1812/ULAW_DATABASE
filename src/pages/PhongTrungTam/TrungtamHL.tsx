import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Steps, Card } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';

const TrungtamHL: React.FC = () => {
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
      title: 'Hình thức học liệu - Sách của Trường',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên giáo trình"
              name="soTenGiaoTrinh"
              rules={[{ required: true, message: 'Vui lòng nhập số tên giáo trình' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn của giáo trình"
              name="soCuonGiaoTrinh"
              rules={[{ required: true, message: 'Vui lòng nhập số cuốn của giáo trình' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên của tập bài giảng"
              name="soTenTapBaiGiang"
              rules={[{ required: true, message: 'Vui lòng nhập số tên của tập bài giảng' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn của tập bài giảng"
              name="soCuonTapBaiGiang"
              rules={[{ required: true, message: 'Vui lòng nhập số cuốn của tập bài giảng' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên của sách tình huống"
              name="soTenSachTinhHuong"
              rules={[{ required: true, message: 'Vui lòng nhập số tên của sách tình huống' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn của sách tình huống"
              name="soCuonSachTinhHuong"
              rules={[
                { required: true, message: 'Vui lòng nhập tổng số cuốn của sách tình huống' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên của sách chuyên khảo"
              name="soTenSachChuyenKhao"
              rules={[
                { required: true, message: 'Vui lòng nhập tổng số tên của sách chuyên khảo' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn của sách chuyên khảo"
              name="soCuonSachChuyenKhao"
              rules={[{ required: true, message: 'Vui lòng nhập số cuốn của sách chuyên khảo' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên của sách tham khảo"
              name="soTenSachThamKhao"
              rules={[{ required: true, message: 'Vui lòng nhập số tên của sách tham khảo' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn của sách tham khảo"
              name="soCuonSachThamKhao"
              rules={[{ required: true, message: 'Vui lòng nhập số cuốn của sách tham khảo' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Hình thức học liệu - Sách ký gửi',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên sách ký gửi của giảng viên"
              name="soTenSachKyGuiGiangVien"
              rules={[
                { required: true, message: 'Vui lòng nhập số tên sách ký gửi của giảng viên' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn sách ký gửi của giảng viên"
              name="soCuonSachKyGuiGiangVien"
              rules={[
                { required: true, message: 'Vui lòng nhập số cuốn sách ký gửi của giảng viên' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số tên sách ký gửi của tổ chức/ cá nhân khác"
              name="soTenSachKyGuiToChucCaNhan"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số tên sách ký gửi của tổ chức/ cá nhân khác',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số cuốn sách ký gửi của tổ chức/ cá nhân khác"
              name="soCuonSachKyGuiToChucCaNhan"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số cuốn sách ký gửi của tổ chức/ cá nhân khác',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Thông tin doanh thu và thù lao phát hành (đvt: VNĐ)',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Doanh thu từ sách của Trường"
              name="doanhThuSachTruong"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập doanh thu từ sách của Trường',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Thù lao từ sách ký gửi"
              name="thuLaoSachKyGui"
              rules={[{ required: true, message: 'Vui lòng nhập thù lao từ sách ký gửi' }]}
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
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Steps
          current={current}
          items={[{ title: 'Thông tin chung' }, { title: 'Nội dung' }, { title: 'Hoàn thành' }]}
        />
      </Card>

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
              <h3>{sec.title}</h3>
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
            <Button className={styles.btnNext} type="primary" onClick={next}>
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

export default TrungtamHL;
