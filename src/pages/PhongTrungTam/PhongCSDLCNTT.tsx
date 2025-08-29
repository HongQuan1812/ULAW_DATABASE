import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Steps, Tooltip } from 'antd';
import { history, useLocation } from 'umi';
import styles from './index.less';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { CustomMessageSuccess, CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getLocationName } from '@/utils/getLocationName';
import FormDateSelect from '@/components/FormDateSelect';
import FormStageSelect from '@/components/FormStageSelect';
import SelectVPRole from '@/components/SelectVPRole';
import { buildPayloadBCPhongCSDLCNTT } from '@/constants/payloadMapperPhongCSDLCNTT';

const PhongCSDLCNTT: React.FC = () => {
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
      capDonVi: 'Phòng Cơ sở dữ liệu & Công nghệ thông tin',
    };
    form.setFieldsValue(userInfo);
  }, []);

  // Step 1 - Thông tin chung
  const step1Content = (
    <Row gutter={[16, 16]}>
      <Col xs={27} md={8}>
        <Form.Item label="Đơn vị trực thuộc" name="capDonVi">
          <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)' }}/>
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Họ và tên người nhập báo cáo" name="hoVaTen">
          <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)' }}/>
        </Form.Item>
      </Col>
      <Col xs={27} md={8}>
        <Form.Item label="Email người nhập báo cáo" name="email">
          <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)' }}/>
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
      title: 'Hạ tầng Công nghệ thông tin',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng máy chủ vật lý tại trường"
                name="soLuongMcvlTaiTruong"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng máy chủ vật lý tại trường' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng máy chủ ảo tại trường"
                name="soLuongMcaTaiTruong"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng máy chủ ảo tại trường' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng máy chủ Cloud (Thuê)"
                name="soLuongMccThue"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng máy chủ Cloud (Thuê)' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng đường truyền Leased-line"
                name="soLuongDtLeasedLine"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng đường truyền Leased-line' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Dung lượng đường truyền internet trong nước (Mbps)"
                name="dungLuongDtInternetTrongNuoc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập dung lượng đường truyền internet trong nước',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Dung lượng đượng truyền internet quốc tế (Mbps)"
                name="dungLuongDtInternetQuocTe"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập dung lượng đường truyền internet quốc tế',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng Switch tầng"
                name="soLuongSwitchTang"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng Switch tầng' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng thiết bị Camera"
                name="soLuongThietBiCamera"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng thiết bị Camera' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tổng đài điện thoại thuộc phạm vi Trường"
                name="soLuongTddtThuocPvt"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng tổng đài điện thoại thuộc phạm vi Trường',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng thiết bị wifi"
                name="soLuongThietBiWifi"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng thiết bị wifi' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số lượng hạ tầng CNTT"
                name="soLuongHtCntt"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số lượng hạ tầng CNTT' },
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
      title: 'Các danh mục có liên quan',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng trang web"
                name="soLuongTrangWeb"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng trang web' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng phần mềm"
                name="soLuongPhanMem"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng phần mềm' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng thẻ từ đã cấp phát cho sinh viên"
                name="soLuongTtdcpChoSv"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng thẻ từ đã cấp phát cho sinh viên',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng thẻ từ đã cấp phát cho người học"
                name="soLuongTtdcpChoNguoiHoc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng thẻ từ đã cấp phát cho người học',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng thẻ từ đã cấp phát cho người lao động"
                name="soLuongTtdcpChoNld"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng thẻ từ đã cấp phát cho người lao động',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số lượng thiết bị cửa từ"
                name="soLuongThietBiCuaTu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng thiết bị cửa từ',
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
      title: 'Thông tin Hệ thống Cơ sở dữ liệu dùng chung',
      content: (
        <>
          <Form.List name="htCsdlList" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={[16, 16]} key={key} align="middle">
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'tenHtCsdl']}
                        label="Tên hệ thống CSDL dùng chung"
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên hệ thống CSDL dùng chung' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'soLuongCsdl']}
                        label="Số lượng"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số lượng CSDL' },
                          ...numberRule,
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={2} className={styles.dynamicListActions}>
                      {fields.length > 1 ? (
                        <Tooltip title="Xóa dòng này">
                          <MinusCircleOutlined
                            className={styles.removeIcon}
                            onClick={() => remove(name)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Cần ít nhất 1 dòng">
                          <MinusCircleOutlined className={styles.removeIconDisabled} />
                        </Tooltip>
                      )}
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusCircleOutlined />}
                    className={styles.addBtn}
                  >
                    Thêm hệ thống CSDL
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
      title: 'Thông tin Tường lửa',
      content: (
        <>
          <Form.List name="tuongLuaList" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={[16, 16]} key={key} align="middle">
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'tenTuongLua']}
                        label="Tên tường lửa (Firewall)"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tường lửa' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'soLuongTuongLua']}
                        label="Số lượng"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số lượng tường lửa' },
                          ...numberRule,
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={2} className={styles.dynamicListActions}>
                      {fields.length > 1 ? (
                        <Tooltip title="Xóa dòng này">
                          <MinusCircleOutlined
                            className={styles.removeIcon}
                            onClick={() => remove(name)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Cần ít nhất 1 dòng">
                          <MinusCircleOutlined className={styles.removeIconDisabled} />
                        </Tooltip>
                      )}
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusCircleOutlined />}
                    className={styles.addBtn}
                  >
                    Thêm tường lửa
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
      title: 'Thông tin Phần mềm diệt Virus',
      content: (
        <>
          <Form.List name="pmdvList" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={[16, 16]} key={key} align="middle">
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'tenPmdv']}
                        label="Tên phần mềm diệt Virus"
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên phần mềm diệt Virus' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'soLuongPmdv']}
                        label="Số lượng"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số lượng phần mềm diệt Virus' },
                          ...numberRule,
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={2} className={styles.dynamicListActions}>
                      {fields.length > 1 ? (
                        <Tooltip title="Xóa dòng này">
                          <MinusCircleOutlined
                            className={styles.removeIcon}
                            onClick={() => remove(name)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Cần ít nhất 1 dòng">
                          <MinusCircleOutlined className={styles.removeIconDisabled} />
                        </Tooltip>
                      )}
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusCircleOutlined />}
                    className={styles.addBtn}
                  >
                    Thêm phần mềm diệt Virus
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
    const payload = buildPayloadBCPhongCSDLCNTT(values);
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

export default PhongCSDLCNTT;
