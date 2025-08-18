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

const PhongDBCLKT: React.FC = () => {
  const [current, setCurrent] = useState(0); // step lớn
  const [sectionIndex, setSectionIndex] = useState(0); // section nhỏ trong step 2
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
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng kế hoạch đảm bảo chất lượng của Trường được thực hiện"
                name="slKeHoachDBCL"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng kế hoạch đảm bảo chất lượng của Trường được thực hiện',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng kế hoạch đảm bảo chất lượng của Trường được rà soát, điều chỉnh"
                name="slKeHoachRaoSoat"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng kế hoạch đảm bảo chất lượng của Trường được rà soát, điều chỉnh',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng kế hoạch đảm bảo chất lượng của Trường được tổng kết"
                name="slKeHoachTongKet"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng kế hoạch đảm bảo chất lượng của Trường được tổng kết',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng kế hoạch khảo sát thuộc chức năng, nhiệm vụ của đơn vị"
                name="slKeHoachKhaoSat"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng kế hoạch khảo sát thuộc chức năng, nhiệm vụ của đơn vị',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng kế hoạch cải tiến cấp cơ sở giáo dục
                    <sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="slKeHoachCaiTien"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng kế hoạch cải tiến cấp cơ sở giáo dục',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng kế hoạch cải tiến cấp chương trình đào tạo
                    <sup className={styles.sup}>(1)</sup>
                  </>
                }
                name="slKeHoachCaiTienCTDT"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng kế hoạch cải tiến cấp chương trình đào tạo',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng hệ thống văn bản về đảm bảo chất lượng của Trường được cập nhật"
                name="slVanBanDBCL"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng hệ thống văn bản về đảm bảo chất lượng của Trường được cập nhật',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng hội thảo, tập huấn, trao đổi kinh nghiệm giảng dạy cho giảng viên mới"
                name="slHoiThaoTapHuan"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng hội thảo, tập huấn, trao đổi kinh nghiệm giảng dạy cho giảng viên mới',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng hội thảo, hội nghị, tọa đàm cấp Trường
                    <sup className={styles.sup}>(2)</sup>
                  </>
                }
                name="slHoiThaoHoiNghi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng hội thảo, hội nghị, tọa đàm cấp Trường',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng văn bản hợp tác trong nước và ngoài nước
                    <sup className={styles.sup}>(3)</sup>
                  </>
                }
                name="slVanBanHopTac"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng văn bản hợp tác trong nước và ngoài nước',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng đề thi kết thúc học phần được in/sao
                    <sup className={styles.sup}>(4)</sup>
                  </>
                }
                name="slDeThiKetThuc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng đề thi kết thúc học phần được in/sao',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng cán bộ coi thi kết thúc học phần được điều phối
                    <sup className={styles.sup}>(4)</sup>
                  </>
                }
                name="slCanBoCoiThi"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng cán bộ coi thi kết thúc học phần được điều phối',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng cán bộ coi thi vi phạm quy chế"
                name="slCanBoViPham"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng cán bộ coi thi vi phạm quy chế',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng sinh viên vi phạm quy chế"
                name="slSinhVienViPham"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng sinh viên vi phạm quy chế',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng bài thi được chấm
                    <sup className={styles.sup}>(4)</sup>
                  </>
                }
                name="slCanBoCoiThi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng bài thi được chấm',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng bài thi được quản lý
                    <sup className={styles.sup}>(4)</sup>
                  </>
                }
                name="slCanBoCoiThi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng bài thi được quản lý',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng giảng viên chấm thi vi phạm quy chế"
                name="slGiangVienChamThiViPham"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng giảng viên chấm thi vi phạm quy chế',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <>
                    Số lượng buổi tập huấn công tác coi thi kết thúc học phần
                    <sup className={styles.sup}>(5)</sup>
                  </>
                }
                name="slBuoiTapHuan"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số lượng buổi tập huấn công tác coi thi kết thúc học phần',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.noteContainer}>
            <p className={styles.note}>Ghi chú:</p>
            <ul className={styles.noteList}>
              <li>
                <sup className={styles.sup}>(1)</sup> Theo khuyến nghị của các Đoàn Đánh giá ngoài
              </li>
              <li>
                <sup className={styles.sup}>(2)</sup> Theo phương pháp giảng dạy tích cực, phương
                pháp kiểm tra, đánh giá đáp ứng yêu cầu của chuẩn đầu ra
              </li>
              <li>
                <sup className={styles.sup}>(3)</sup> Về mặt trao đổi kinh nghiệm và đào tạo giáo
                viên về phương pháp giảng dạy
              </li>
              <li>
                <sup className={styles.sup}>(4)</sup> Thuộc các chương trình đào tạo của Trường
              </li>
              <li>
                <sup className={styles.sup}>(5)</sup> Dành cho các giảng viên và chuyên viên mới
                được tuyển dụng
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

export default PhongDBCLKT;
