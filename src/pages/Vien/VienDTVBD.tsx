import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Steps } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
import FormDateSelect from '@/components/FormDateSelect';
import FormStageSelect from '@/components/FormStageSelect';
import SelectVPRole from '@/components/SelectVPRole';
import { buildPayloadBCVienDTBD } from '@/constants/payloadMapperVienDTVBD';

const VienDTVBD: React.FC = () => {
  const [current, setCurrent] = useState(0); // step lớn
  const [sectionIndex, setSectionIndex] = useState(0); // section nhỏ trong step 2
  const [form] = Form.useForm();

  const location = useLocation();
  const locationName = getLocationName(location.pathname);

  const numberRule = [
    {
      pattern: /^[0-9][0-9]*$/,
      message: 'Chỉ được nhập số nguyên',
    },
  ];

  useEffect(() => {
    const userInfo = {
      hoVaTen: 'Nguyễn Văn A',
      email: 'nva@hcmulaw.edu.vn',
      capDonVi: 'Viện Đào tạo & Bồi dưỡng',
    };
    form.setFieldsValue(userInfo);
  }, []);

  // Step 1 - Thông tin chung
  const step1Content = (
    <Row gutter={[16, 16]}>
      <Col xs={27} md={8}>
        <Form.Item label="Đơn vị trực thuộc" name="capDonVi">
          <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Họ và tên người nhập báo cáo" name="hoVaTen">
          <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Email người nhập báo cáo" name="email">
          <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
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
                label={
                  <>
                    Số lượng khóa học ngắn hạn
                    <sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="soLuongKhnh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng khóa học ngắn hạn',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <>
                    Số lượng nhân sự được đào tạo, bồi dưỡng hằng năm
                    <sup className={styles.sup}>(2)</sup>
                  </>
                }
                name="soLuongNsddtbdHangNam"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng nhân sự được đào tạo',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng cơ quan, doanh nghiệp, tổ chức được đào tạo, bồi dưỡng, tập huấn, nâng cao kiến thức pháp luật, kỹ năng hành chính, kỹ năng chuyên môn nghiệp vụ"
                name="soLuongCqDnTcddtbd"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng cơ quan, doanh nghiệp, tổ chức được đào tạo, bồi dưỡng, tập huấn, nâng cao kiến thức pháp luật, kỹ năng hành chính, kỹ năng chuyên môn nghiệp vụ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng cá nhân được đào tạo, bồi dưỡng, tập huấn, nâng cao kiến thức pháp luật, kỹ năng hành chính, kỹ năng chuyên môn nghiệp vụ"
                name="soLuongCaNhanddtbd"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng cá nhân được đào tạo, bồi dưỡng, tập huấn, nâng cao kiến thức pháp luật, kỹ năng hành chính, kỹ năng chuyên môn nghiệp vụ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng nhu cầu được đào tạo, bồi dưỡng ngoại ngữ"
                name="soLuongNhuCauddtbdNn"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng nhu cầu được đào tạo, bồi dưỡng ngoại ngữ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng nhu cầu được đào tạo, bồi dưỡng ngoại ngữ pháp lý"
                name="soLuongNhuCauddtbdNnpl"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng nhu cầu được đào tạo, bồi dưỡng ngoại ngữ pháp lý',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng nhu cầu được đào tạo, bồi dưỡng tin học"
                name="soLuongNhuCauddtbdTh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng nhu cầu được đào tạo, bồi dưỡng tin học',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <>
                    Số lượng công tác tổ chức kiểm tra, thi, đánh giá năng lực ngoại ngữ
                    <sup className={styles.sup}>(3)</sup>
                  </>
                }
                name="soLuongCttcktnlNn"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng công tác tổ chức kiểm tra, thi, đánh giá năng lực ngoại ngữ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <>
                    Số lượng công tác tổ chức kiểm tra, thi, đánh giá năng lực tin học
                    <sup className={styles.sup}>(3)</sup>
                  </>
                }
                name="soLuongCttcktnlTh"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng công tác tổ chức kiểm tra, thi, đánh giá năng lực tin học',
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
              <li>
                <sup className={styles.sup}>(1)</sup> Dành cho cơ quan, doanh nghiệp, tổ chức
              </li>
              <li>
                <sup className={styles.sup}>(2)</sup> Dành cho cơ quan, doanh nghiệp, tổ chức theo
                nhu cầu
              </li>
              <li>
                <sup className={styles.sup}>(3)</sup> Đáp ứng nhu cầu cấp chứng chỉ, chứng nhận theo
                quy định pháp luật
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
    const payload = buildPayloadBCVienDTBD(values);
    console.log('Payload gửi BE:', payload);

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

export default VienDTVBD;
