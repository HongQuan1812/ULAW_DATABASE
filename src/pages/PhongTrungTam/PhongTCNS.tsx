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

const PhongTCNS: React.FC = () => {
  const [current, setCurrent] = useState(0); // step lớn
  const [sectionIndex, setSectionIndex] = useState(0); // section nhỏ trong step 2
  const [form] = Form.useForm();

  const location = useLocation();
  const locationName = getLocationName(location.pathname);

  const numberRule = [
    {
      pattern: /^[1-9][0-9]*$/,
      message: 'Chỉ được nhập số nguyên',
    },
  ];

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
      title: 'Tuyển dụng - Sử dụng viên chức, người lao động, cộng tác viên',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng ký hợp đồng mới"
                name="soLuongHopDongMoi"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng ký hợp đồng mới' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng thanh lý hợp đồng"
                name="soLuongThanhLyHopDong"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng thanh lý hợp đồng' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng thỏa thuận cộng tác viên"
                name="soLuongThoaThuanCTV"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng thỏa thuận cộng tác viên' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số viên chức"
                name="vienChuc"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số viên chức' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số viên chức nam"
                name="vienChucNam"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số viên chức nam' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số viên chức nữ"
                name="vienChucNu"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số viên chức nữ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số cộng tác viên"
                name="cTV"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số cộng tác viên' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số học hàm giáo sư"
                name="giaoSu"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số học hàm giáo sư' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số học hàm phó giáo sư"
                name="phoGiaoSu"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số học hàm phó giáo sư' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số học vị tiến sĩ"
                name="tienSi"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số học vị tiến sĩ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số học vị thạc sĩ"
                name="thacSi"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số học vị thạc sĩ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số học vị đại học"
                name="hocViDH"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số học vị đại học' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số học vị dưới đại học"
                name="hoViDuoiDH"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số học vị dưới đại học' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số giảng viên cơ hữu"
                name="gVCoHuu"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số giảng viên cơ hữu' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số giảng viên thỉnh giảng"
                name="gVThinhGiang"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số giảng viên thỉnh giảng' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số tuổi bình quân"
                name="tuoiBinhQuan"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số tuổi bình quân' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tổng số thu nhập bình quân"
                name="thuNhapBinhQuan"
                rules={[
                  { required: true, message: 'Vui lòng nhập tổng số thu nhập bình quân' },
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
      title: 'Quản lý viên chức',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng quy hoạch"
                name="quyHoach"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng quy hoạch' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng quy hoạch bổ sung"
                name="quyHoachBoSung"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng quy hoạch bổ sung' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu bổ nhiệm"
                name="boNhiem"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu bổ nhiệm' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu bổ nhiệm lại"
                name="boNhiemLai"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu bổ nhiệm lại' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu kéo dài thời gian giữ chức vụ"
                name="keoDaiChucVu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu kéo dài thời gian giữ chức vụ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu thôi giữ chức vụ"
                name="thoiChucVu"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu thôi giữ chức vụ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu từ chức"
                name="tuChuc"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu từ chức' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu miễn nhiệm"
                name="mienNhiem"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu miễn nhiệm' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu chuyển đổi công tác"
                name="chuyenCongTac"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu chuyển đổi công tác' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu bổ nhiệm chức danh nghề nghiệp"
                name="boNhiemChucDanh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu bổ nhiệm chức danh nghề nghiệp',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu chuyển hạng chức danh nghề nghiệp"
                name="chuyenHangChucDanh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu chuyển hạng chức danh nghề nghiệp',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu thăng hạng chức danh nghề nghiệp"
                name="thangHangChucDanh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu thăng hạng chức danh nghề nghiệp',
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
      title: 'Đào tạo, bồi dưỡng',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu đào tạo về chuyên môn nghiệp vụ"
                name="daoTaoChuyenMon"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu đào tạo về chuyên môn nghiệp vụ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu đào tạo nâng cao trình độ"
                name="daoTaoNangCao"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu đào tạo nâng cao trình độ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu đào tạo về lý luận chính trị"
                name="daoTaoLyLuan"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu đào tạo về lý luận chính trị' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu đào tạo ngoài nước"
                name="daoTaoNgoaiNuoc"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu đào tạo ngoài nước' },
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
      title: 'Tiền lương và phụ cấp',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu nâng bậc lương thường xuyên"
                name="nangBacThuongXuyen"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu nâng bậc lương thường xuyên' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu nâng bậc lương trước hạn"
                name="nangBacTruocHan"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu nâng bậc lương trước hạn' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu nâng bậc lương vượt khung"
                name="nangBacVuotKhung"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu nâng bậc lương vượt khung' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu kéo dài thời gian nâng bậc lương"
                name="keoDaiNangBac"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu kéo dài thời gian nâng bậc lương',
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
      title: 'Chế độ chính sách',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu nghỉ chế độ bảo hiểm, hưu trí"
                name="nghiCheDo"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu nghỉ chế độ bảo hiểm, hưu trí',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu thôi việc"
                name="thoiViec"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu thôi việc' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu chuyển công tác"
                name="chuyenCongTac2"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu chuyển công tác' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu kê khai tài sản đối với viên chức"
                name="keKhaiTaiSan"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu kê khai tài sản đối với viên chức',
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
      title: 'Đánh giá - xếp loại cá nhân',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu chiến sĩ thi đua"
                name="chienSiThiDua"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu chiến sĩ thi đua' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu lao động tiên tiến"
                name="laoDongTienTien"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu lao động tiên tiến' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu hoàn thành xuất sắc"
                name="hoanThanhXuatSac"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu hoàn thành xuất sắc' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số liệu hoàn thành tốt"
                name="hoanThanhTot"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu hoàn thành tốt' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số liệu hoàn thành nhiệm vụ"
                name="hoanThanhNhiemVu"
                rules={[
                  { required: true, message: 'Vui lòng nhập số liệu hoàn thành nhiệm vụ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số liệu viên chức - người lao động bị kỷ luật"
                name="kyLuat"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số liệu viên chức - người lao động bị kỷ luật',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số liệu viên chức - người lao động khen thưởng khác (Nếu có)"
                name="khenThuongKhac"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập số liệu viên chức - người lao động khen thưởng khác (Nếu có)',
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
      title: 'Đánh giá - xếp loại tập thể',
      content: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tập thể lao động tiên tiến"
                name="soLuongTapTheTienTien"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng tập thể lao động tiên tiến' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tập thể hoàn thành xuất sắc"
                name="soLuongTapTheXuatSac"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng tập thể hoàn thành xuất sắc' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tập thể hoàn thành tốt"
                name="soLuongTapTheTot"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng tập thể hoàn thành tốt' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tập thể hoàn thành nhiệm vụ"
                name="soLuongTapTheNhiemVu"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng tập thể hoàn thành nhiệm vụ' },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tập thể không hoàn thành nhiệm vụ"
                name="soLuongTapTheKhongHoanThanh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng tập thể không hoàn thành nhiệm vụ',
                  },
                  ...numberRule,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tập thể khen thưởng khác (Nếu có)"
                name="soLuongTapTheKhenThuongKhac"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng tập thể khen thưởng khác (Nếu có)',
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

export default PhongTCNS;
