import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Steps, Checkbox, Upload } from 'antd';
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
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Số lượng giảng viên cơ hữu"
              name="slGVCoHuu"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng giảng viên cơ hữu' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Số lượng giảng viên thỉnh giảng"
              name="slGVThinhGiang"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng giảng viên thỉnh giảng' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Số lượng người lao động"
              name="slNguoiLaoDong"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng người lao động' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
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
                name="DanhMucNganh"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục ngành' }]}
              >
                <Checkbox.Group style={{ marginLeft: 12, marginTop: 5 }}>
                  <Row gutter={[0, 16]}>
                    <Col xs={24} sm={12}>
                      <Checkbox value="Luat">Ngành Luật</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value="QTL">Ngành Quản trị - Luật</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value="QTKD">Ngành Quản trị kinh doanh</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value="LTMQT">Ngành Luật Thương mại Quốc tế</Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox value="NNA">
                        Ngành Ngôn ngữ Anh (chuyên ngành Anh văn pháp lý)
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Tổng số bộ môn của Khoa"
                name="tongBoMon"
                rules={[{ required: true, message: 'Vui lòng nhập tổng số bộ môn của Khoa' }]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Form.Item
                label={
                  <>
                    Cập nhật (upload) File danh mục môn học<sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="fileDanhMuc"
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
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tổng số chương trình cần cải tiến"
              name="tsCTCaiTien"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số tổng số chương trình cần cải tiến',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tổng số chương trình đào tạo xây dựng mới"
              name="tsCTMoi"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tổng số chương trình đào tạo xây dựng mới',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tổng số tài liệu, giáo trình cần chỉnh sửa"
              name="tsTLChinhSua"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tổng số tài liệu, giáo trình cần chỉnh sửa',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tổng số tài liệu, giáo trình biên soạn mới"
              name="tsTLMoi"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tổng số tài liệu, giáo trình biên soạn mới',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Kế hoạch về nhân sự của Khoa',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng giảng viên cần đào tạo, bồi dưỡng, nâng cao trình độ chuyên môn"
              name="slDTGV"
              rules={[
                {
                  required: true,
                  message:
                    'Vui lòng nhập số lượng giảng viên cần đào tạo, bồi dưỡng, nâng cao trình độ chuyên môn',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lượng giảng viên cần tuyển"
              name="slGVCanTuyen"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng giảng viên cần tuyển' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
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
