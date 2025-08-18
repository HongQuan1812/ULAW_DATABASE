import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Steps } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
import FormDateSelect from '@/components/FormDateSelect';
import FormStageSelect from '@/components/FormStageSelect';

const TrungtamHL: React.FC = () => {
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

export default TrungtamHL;
