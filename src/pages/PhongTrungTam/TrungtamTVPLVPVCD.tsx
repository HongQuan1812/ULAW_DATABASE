import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Steps, Typography } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
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
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Typography.Text>
                    Số lượng dịch vụ tư vấn pháp luật có thu phí đối với <b>cá nhân</b> có nhu cầu
                  </Typography.Text>
                }
                name="slDichVuTuVanCaNhanCoPhi"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng dịch vụ tư vấn pháp luật có thu phí đối với cá nhân có nhu cầu',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <Typography.Text>
                    Số lượng dịch vụ tư vấn pháp luật có thu phí đối với <b>tổ chức</b> có nhu cầu
                  </Typography.Text>
                }
                name="slDichVuTuVanToChucCoPhi"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng dịch vụ tư vấn pháp luật có thu phí đối với tổ chức có nhu cầu',
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
                      'Vui lòng nhập số lượng hỗ trợ pháp lý đối với các đối tượng được hưởng theo quy định của Pháp luật',
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
                    Số lượng hoạt động tuyên truyền, phổ biến pháp luật
                    <sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="slHoatDongTuyenTruyen"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng hoạt động tuyên truyền, phổ biến pháp luật',
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
                    Số lượng các hoạt động liên kết với cơ quan, đơn vị, cá nhân trong và ngoài nước
                    <sup className={styles.sup}>(2)</sup>
                  </>
                }
                name="slHoatDongLienKet"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng các hoạt động liên kết với cơ quan, đơn vị, cá nhân trong và ngoài nước',
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
              <li>Vui lòng điền giá trị = 0 nếu không có</li>
              <li>
                <sup style={{color: 'black'}}><b>(1)</b></sup> Bao gồm các hoạt động: tuyên truyền, phổ biến pháp luật dưới các hình
                thức: báo cáo chuyên đề, diễn phiên tòa giả định, biên soạn tài liệu pháp luật, tổ
                chức thực hiện các chương trình tuyên truyền pháp luật lưu động và các hình thức
                khác
              </li>
              <li>
                <sup style={{color: 'black'}}><b>(2)</b></sup> Trong lĩnh vực cung cấp dịch vụ tư vấn và hỗ trợ pháp luật
              </li>
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

export default TrungtamTVPLVPVCD;
