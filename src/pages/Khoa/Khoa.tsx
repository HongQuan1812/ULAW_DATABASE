import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Steps, Checkbox, Upload, Select } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
import FormDateSelect from '@/components/FormDateSelect';
import FormStageSelect from '@/components/FormStageSelect';
import SelectKhoaRole from '@/components/SelectKhoaRole';
import { buildPayloadBCKhoa } from '@/constants/payloadMapperKhoa';

const { Option } = Select;

const Khoa: React.FC = () => {
  const [current, setCurrent] = useState(0); // step lớn
  const [sectionIndex, setSectionIndex] = useState(0); // section nhỏ trong step 2
  const [form] = Form.useForm();

  const location = useLocation();
  const locationName = getLocationName(location.pathname);

  const beforeUploadFile = (file: File) => {
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      CustomMessageError({ content: 'Chỉ nhận file Excel (.xlsx)' });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const numberRule = [
    {
      pattern: /^[0-9][0-9]*$/,
      message: 'Chỉ được nhập số nguyên',
    },
  ];

  // Step 1 - Thông tin chung
  const step1Content = (
    <Row gutter={[16, 16]}>
      <Col xs={27} md={8}>
        <Form.Item
          label="Đơn vị trực thuộc"
          name="idDonVi"
          rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}
        >
          <Select placeholder="Khoa Dân sự">
            <Option value={1}>Khoa Luật Dân sự</Option>
            <Option value={2}>Khoa Luật Hình sự</Option>
            <Option value={3}>Khoa Luật Thương mại</Option>
            <Option value={4}>Khoa Luật Quốc tế</Option>
            <Option value={5}>Khoa Luật Hành chính - Nhà nước</Option>
            <Option value={6}>Khoa Quản trị</Option>
            <Option value={7}>Khoa Ngoại ngữ pháp lý</Option>
            <Option value={8}>Khoa Khoa học cơ bản</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Họ và tên người nhập báo cáo" name="hoVaTen">
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
          <SelectKhoaRole />
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
      title: 'Thống kê số lượng giảng viên và người lao động',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng giảng viên cơ hữu"
                name="soLuongGvch"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng giảng viên cơ hữu' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng giảng viên thỉnh giảng"
                name="soLuongGvtg"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng giảng viên thỉnh giảng' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng người lao động"
                name="soLuongNld"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng người lao động' },
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
    {
      title: 'Chương trình đào tạo của Khoa được Trường giao nhiệm vụ xây dựng',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
              <Form.Item
                label="Danh mục ngành"
                name="idNganh"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục ngành' }]}
              >
                <Checkbox.Group style={{ marginLeft: 12, marginTop: 5 }}>
                  <Row gutter={[0, 16]}>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7380101}>Luật</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7340102}>Quản trị - Luật</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7340101}>Quản trị kinh doanh</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7380109}>Luật Thương mại Quốc tế</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7220201}>
                        Ngôn ngữ Anh (chuyên ngành Anh văn pháp lý)
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7340120}>
                        Kinh doanh quốc tế
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value={7340201}>
                        Tài chính - Ngân hàng
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Tổng số bộ môn của Khoa"
                name="tongSoMhk"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số bộ môn của Khoa' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Form.Item
                label={
                  <>
                    Cập nhật (upload) File danh mục môn học<sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="fileDmmh"
                rules={[{ required: true, message: 'Vui lòng tải lên File danh mục môn học' }]}
              >
                <Upload
                  name="file"
                  beforeUpload={beforeUploadFile}
                  accept=".xlsx"
                  listType="text"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.noteContainer}>
            <p className={styles.note}>Ghi chú:</p>
            <ul className={styles.noteList}>
              <li>Vui lòng điền giá trị = 0 nếu không có</li>
              <li>
                <sup className={styles.sup}>(1)</sup> File dạng <b>EXCEL</b> bao gồm các cột:
              </li>
              <li>
                <b>
                  <i>
                    Hệ đào tạo, Mã môn, Tên môn, Số tín chỉ, Số tiết lý thuyết, Số tiết thảo luận,
                    Mã học phần tiên quyết, Ghi chú (mô tả tóm tắt).
                  </i>
                </b>
              </li>
              <li>
                Đặt tên file theo mẫu: <b>tenkhoa_nam_giaidoan.xlsx</b>
              </li>
              <li>
                Ví dụ: Khoa dân sự báo cáo năm 2020 giai đoạn 1 → <b>KhoaDansu_2020_1.xlsx</b>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      title: 'Kế hoạch của Khoa',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tổng số chương trình cần cải tiến"
                name="soCtdtCanCaiTien"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số tổng số chương trình cần cải tiến',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tổng số chương trình đào tạo xây dựng mới"
                name="soCtdtXayDungMoi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tổng số chương trình đào tạo xây dựng mới',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tổng số tài liệu, giáo trình cần chỉnh sửa"
                name="soTlgtCanChinhSua"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tổng số tài liệu, giáo trình cần chỉnh sửa',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tổng số tài liệu, giáo trình biên soạn mới"
                name="soTlgtBienSoanMoi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tổng số tài liệu, giáo trình biên soạn mới',
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
    {
      title: 'Kế hoạch về nhân sự của Khoa',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng giảng viên cần đào tạo, bồi dưỡng, nâng cao trình độ chuyên môn"
                name="soGvCanDtbd"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng giảng viên cần đào tạo, bồi dưỡng, nâng cao trình độ chuyên môn',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng giảng viên cần tuyển"
                name="soGvCanTuyenMoi"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng giảng viên cần tuyển' },
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
    const userInfo = {
      id: 1,
      hoVaTen: 'Nguyễn Văn A',
      email: 'a@gmail.com',
    };

    const payload = buildPayloadBCKhoa(values, userInfo);
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

export default Khoa;
