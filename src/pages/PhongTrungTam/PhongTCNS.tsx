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
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng ký hợp đồng mới"
              name="hopDongMoi"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng ký hợp đồng mới' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng thanh lý hợp đồng"
              name="thanhLyHopDong"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng thanh lý hợp đồng' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng thỏa thuận cộng tác viên"
              name="thoaThuanCTV"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng thỏa thuận cộng tác viên' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số viên chức"
              name="tongVienChuc"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số viên chức' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số viên chức nam"
              name="vienChucNam"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số viên chức nam' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số viên chức nữ"
              name="vienChucNu"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số viên chức nữ' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số cộng tác viên"
              name="tongCTV"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số cộng tác viên' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số học hàm giáo sư"
              name="giaoSu"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số học hàm giáo sư' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số học hàm phó giáo sư"
              name="phoGiaoSu"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số học hàm phó giáo sư' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số học vị tiến sĩ"
              name="tienSi"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số học vị tiến sĩ' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số học vị thạc sĩ"
              name="thacSi"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số học vị thạc sĩ' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số học vị đại học"
              name="daiHoc"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số học vị đại học' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số học vị dưới đại học"
              name="duoiDaiHoc"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số học vị dưới đại học' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số giảng viên cơ hữu"
              name="giangVienCoHuu"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số giảng viên cơ hữu' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số giảng viên thỉnh giảng"
              name="giangVienThinhGiang"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số giảng viên thỉnh giảng' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số tuổi bình quân"
              name="tuoiBinhQuan"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số tuổi bình quân' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Tổng số thu nhập bình quân"
              name="thuNhapBinhQuan"
              rules={[{ required: true, message: 'Vui lòng nhập tổng số thu nhập bình quân' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Quản lý viên chức',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng quy hoạch"
              name="quyHoach"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng quy hoạch' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng quy hoạch bổ sung"
              name="quyHoachBoSung"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng quy hoạch bổ sung' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu bổ nhiệm"
              name="boNhiem"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu bổ nhiệm' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu bổ nhiệm lại"
              name="boNhiemLai"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu bổ nhiệm lại' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu kéo dài thời gian giữ chức vụ"
              name="keoDaiChucVu"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu kéo dài thời gian giữ chức vụ' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu thôi giữ chức vụ"
              name="thoiChucVu"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu thôi giữ chức vụ' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu từ chức"
              name="tuChuc"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu từ chức' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu miễn nhiệm"
              name="mienNhiem"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu miễn nhiệm' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu chuyển đổi công tác"
              name="chuyenCongTac"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu chuyển đổi công tác' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu bổ nhiệm chức danh nghề nghiệp"
              name="boNhiemChucDanh"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu bổ nhiệm chức danh nghề nghiệp' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu chuyển hạng chức danh nghề nghiệp và thăng hạng"
              name="chuyenHangThangHang"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số liệu chuyển hạng chức danh nghề nghiệp và thăng hạng',
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
      title: 'Đào tạo, bồi dưỡng',
      content: (
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
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu đào tạo nâng cao trình độ"
              name="daoTaoNangCao"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu đào tạo nâng cao trình độ' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu đào tạo về lý luận chính trị"
              name="daoTaoLyLuan"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu đào tạo về lý luận chính trị' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu đào tạo ngoài nước"
              name="daoTaoNgoaiNuoc"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu đào tạo ngoài nước' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Tiền lương và phụ cấp',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu nâng bậc lương thường xuyên"
              name="nangBacThuongXuyen"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu nâng bậc lương thường xuyên' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu nâng bậc lương trước hạn"
              name="nangBacTruocHan"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu nâng bậc lương trước hạn' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu nâng bậc lương vượt khung"
              name="nangBacVuotKhung"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu nâng bậc lương vượt khung' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
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
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Chế độ chính sách',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu nghỉ chế độ bảo hiểm, hưu trí"
              name="nghiCheDo"
              rules={[
                { required: true, message: 'Vui lòng nhập số liệu nghỉ chế độ bảo hiểm, hưu trí' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu thôi việc"
              name="thoiViec"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu thôi việc' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu chuyển công tác"
              name="chuyenCongTac2"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu chuyển công tác' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
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
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Đánh giá - xếp loại cá nhân',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu chiến sĩ thi đua"
              name="chienSiThiDua"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu chiến sĩ thi đua' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu lao động tiên tiến"
              name="laoDongTienTien"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu lao động tiên tiến' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu hoàn thành xuất sắc"
              name="hoanThanhXuatSac"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu hoàn thành xuất sắc' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu hoàn thành tốt"
              name="hoanThanhTot"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu hoàn thành tốt' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu hoàn thành nhiệm vụ"
              name="hoanThanhNhiemVu"
              rules={[{ required: true, message: 'Vui lòng nhập số liệu hoàn thành nhiệm vụ' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu viên chức - người lao động bị kỷ luật"
              name="kyLuat"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số liệu viên chức - người lao động bị kỷ luật',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số liệu viên chức - người lao đọng khen thưởng khác (Nếu có)"
              name="khenThuongKhac"
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Đánh giá - xếp loại tập thể',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng tập thể lao động tiên tiến"
              name="tapTheTienTien"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng tập thể lao động tiên tiến' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng tập thể hoàn thành xuất sắc"
              name="tapTheXuatSac"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng tập thể hoàn thành xuất sắc' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng tập thể hoàn thành tốt"
              name="tapTheTot"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng tập thể hoàn thành tốt' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng tập thể hoàn thành nhiệm vụ"
              name="tapTheNhiemVu"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng tập thể hoàn thành nhiệm vụ' },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng tập thể không hoàn thành nhiệm vụ"
              name="tapTheKhongHoanThanh"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng tập thể không hoàn thành nhiệm vụ',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Số lượng tập thể khen thưởng khác (Nếu có)"
              name="tapTheKhenThuongKhac"
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

export default PhongTCNS;
