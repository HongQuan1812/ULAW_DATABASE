import {
  Button,
  Form,
  Input,
  Upload,
  Select,
  Col,
  Row,
  Checkbox,
  notification,
  DatePicker,
  Typography,
  Empty,
  ConfigProvider,
} from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { history } from 'umi';
import {
  enrollVB2,
  endpoint,
  getAllEthnicGroups,
  EthnicGroupItem,
  ProvinceData,
  MajorData,
} from '@/services/enroll';
import { CustomMessageError, CustomMessageSuccess } from '@/components/CustomMessage/CustomMessage';
import styles from './index.less';
import moment from 'moment';
import 'moment/locale/vi';
import axios from 'axios';
import { fetchUserInfo, UserInfoResponse } from '@/services/auth';
import ProvincePicker from '@/components/ProvincePicker/ProvincePicker';
import viVN from 'antd/es/locale/vi_VN';
import MajorPickerSmall from '@/components/MajorPicker/MajorPickerSmall';

moment.locale('vi');

const openNotification = (success: boolean, msgTitle: string, msgDescription: string) => {
  notification.open({
    message: msgTitle,
    description: msgDescription,
    className: styles.notiSuccess,
  });
};
const VanBang2: React.FC = () => {
  const trainingSystemType = 'DaoTaoTuXa';
  const educationType = 'vanbang2';
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [studentAvatarFileList, setStudentAvatarFileList] = useState<any[]>([]);
  const [englishCertificateFileList, setEnglishCertificateFileList] = useState<any[]>([]);
  const [franceCertificateFileList, setFranceCertificateFileList] = useState<any[]>([]);
  const [japanCertificateFileList, setJapanCertificateFileList] = useState<any[]>([]);
  const [universityDegreeFileList, setUniversityDegreeFileList] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [ethnicGroups, setEthnicGroups] = useState<EthnicGroupItem[]>();
  const [userInfo, setUserInfo] = useState<any>(null);
  const usertoken = window.localStorage.getItem('token');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [major, setMajor] = useState<MajorData[]>([]);
  const [showEFields, setShowEFields] = useState(false);
  const [showFFields, setShowFFields] = useState(false);
  const [showJFields, setShowJFields] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllEthnicGroups();
    getUserInfo();
    fetchAllProvincesFromLocalJson();
    fetchAllMajorFromLocalJson();
  }, []);

  const handleECheckboxChange = (e: any) => {
    setShowEFields(e.target.checked);
  };

  const handleFCheckboxChange = (e: any) => {
    setShowFFields(e.target.checked);
  };

  const handleJCheckboxChange = (e: any) => {
    setShowJFields(e.target.checked);
  };

  const fetchAllMajorFromLocalJson = async () => {
    try {
      const response = await axios.get('/dataMajor.json');
      if (response.data) {
        setMajor(response.data);
      }
    } catch (error) {
      CustomMessageError({ content: 'Lỗi khi tải danh sách ngành!' });
    }
  };

  const fetchAllProvincesFromLocalJson = async () => {
    try {
      const response = await axios.get('/cities_and_wards.json');
      if (response.data) {
        setProvinces(response.data);
      }
    } catch (error) {
      CustomMessageError({ content: 'Lỗi khi tải danh sách tỉnh/thành phố!' });
    }
  };

  const getUserInfo = async () => {
    try {
      const response: UserInfoResponse = await fetchUserInfo(usertoken);
      if (response.code === 200) {
        setUserInfo(response.data);
        const userFirstName = response?.data?.firstName;
        const userLastName = response?.data?.lastName;
        const userEmail = response?.data?.email;
        const userPhoneNumber = response?.data?.phoneNumber;

        form.setFieldsValue({
          studentInfor: {
            studentEmail: userEmail,
            studentFirstName: userFirstName,
            studentLastName: userLastName,
            studentPhone: userPhoneNumber,
          },
        });
      } else {
        CustomMessageError({ content: 'Không thể tải thông tin người dùng!' });
      }
    } catch (err: any) {
      CustomMessageError({ content: 'Không thể tải thông tin người dùng!' });
    }
  };

  const fetchAllEthnicGroups = async () => {
    try {
      const response = await getAllEthnicGroups();
      if (response) {
        setEthnicGroups(response.data);
      } else {
        CustomMessageError({ content: 'Lỗi tải danh sách dân tộc!' });
      }
    } catch (error) {
      CustomMessageError({ content: 'Lỗi tải danh sách dân tộc!' });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payloadToSend = {
        studentFirstName: userInfo?.firstName,
        studentLastName: userInfo?.lastName,
        studentPhone: userInfo?.phoneNumber,
        studentEmail: userInfo?.email,
        trainingSystemType: trainingSystemType,
        educationType: educationType,
        aspirationMajor: values.userMajor?.majorCode,
        aspirationConfirmation: values.aspirationConfirmation,

        studentInfor: {
          studentIdCard: values.studentInfor?.studentIdCard || '',
          studentDob: values.studentInfor?.studentDob
            ? moment(values.studentInfor.studentDob).format('DD/MM/YYYY')
            : '',
          studentEthnicity: values.studentInfor?.studentEthnicity || '',
          studentFirstName: values.studentInfor?.studentFirstName || '',
          studentLastName: values.studentInfor?.studentLastName || '',
          studentGender: values.studentInfor?.studentGender || '',
          studentPhone: values.studentInfor?.studentPhone || '',
          studentEmail: values.studentInfor?.studentEmail || '',
          studentAvatar: values.studentInfor?.studentAvatar || '',
        },
        highSchoolInfor: {
          highSchoolProvince: values.highSchoolInfor?.highSchoolProvince?.provinceCode || '',
          highSchoolWard: values.highSchoolInfor?.highSchoolProvince?.wardCode || '',
          highSchool: values.highSchoolInfor?.highSchool || '',
          highSchoolAcademicPerformance:
            values.highSchoolInfor?.highSchoolAcademicPerformance || '',
          highSchoolConduct: values.highSchoolInfor?.highSchoolConduct || '',
          highSchoolGraduationYear: values.highSchoolInfor?.highSchoolGraduationYear || 0,
        },
        universityInfor: {
          universityMajor: values.universityInfor?.universityMajor || '',
          universityGpa: parseFloat(values.universityInfor?.universityGpa) || 0,
          universityGraduationYear: values.universityInfor?.universityGraduationYear || '',
          universityTrainingMode: values.universityInfor?.universityTrainingMode || '',
          universitySignDate: values.universityInfor?.universitySignDate
            ? moment(values.universityInfor.universitySignDate).format('DD/MM/YYYY')
            : '',
          universityDegreeNumber: values.universityInfor?.universityDegreeNumber || '',
          universityRegistrationNumber: values.universityInfor?.universityRegistrationNumber || '',
          universityName: values.universityInfor?.universityName || '',
          universityDegree: values.universityInfor?.universityDegree || '',
          universityGraduateDegree: values.universityInfor?.universityGraduateDegree || '',
          universityScoreType: values.universityInfor?.universityScoreType || '',
        },
        contactInfor: {
          studentContactProvince: values.contactInfor?.userProvince?.provinceCode || '',
          studentContactWard: values.contactInfor?.userProvince?.wardCode || '',
          studentContactAddress: values.contactInfor?.studentContactAddress || '',
          studentFullContactAddress: values.contactInfor?.studentFullContactAddress || '',
          fatherName: values.contactInfor?.fatherName || null,
          fatherPhone: values.contactInfor?.fatherPhone || null,
          fatherOccupation: values.contactInfor?.fatherOccupation || null,
          motherName: values.contactInfor?.motherName || null,
          motherPhone: values.contactInfor?.motherPhone || null,
          motherOccupation: values.contactInfor?.motherOccupation || null,
        },
        englishCertificate: {
          englishCertificateName: values.englishCertificate?.englishCertificateName || '',
          englishCertificateNumber: values.englishCertificate?.englishCertificateNumber || '',
          englishCertificateDate: values.englishCertificate?.englishCertificateDate
            ? moment(values.englishCertificate.englishCertificateDate).format('DD/MM/YYYY')
            : '',
          englishCertificateListeningScore:
            parseFloat(values.englishCertificate?.englishCertificateListeningScore) || 0,
          englishCertificateReadingScore:
            parseFloat(values.englishCertificate?.englishCertificateReadingScore) || 0,
          englishCertificateSpeakingScore:
            parseFloat(values.englishCertificate?.englishCertificateSpeakingScore) || 0,
          englishCertificateWritingScore:
            parseFloat(values.englishCertificate?.englishCertificateWritingScore) || 0,
          englishCertificateTotalScore:
            parseFloat(values.englishCertificate?.englishCertificateTotalScore) || 0,
          englishCertificateLevel: values.englishCertificate?.englishCertificateLevel || '',
          englishCertificateFilePath: values.englishCertificate?.englishCertificateFilePath || '',
        },
        franceCertificate: {
          franceCertificateName: values.franceCertificate?.franceCertificateName || '',
          franceCertificateDate: values.franceCertificate?.franceCertificateDate
            ? moment(values.franceCertificate.franceCertificateDate).format('DD/MM/YYYY')
            : '',
          franceCertificateListeningScore:
            parseFloat(values.franceCertificate?.franceCertificateListeningScore) || 0,
          franceCertificateReadingScore:
            parseFloat(values.franceCertificate?.franceCertificateReadingScore) || 0,
          franceCertificateWritingScore:
            parseFloat(values.franceCertificate?.franceCertificateWritingScore) || 0,
          franceCertificateSpeakingScore:
            parseFloat(values.franceCertificate?.franceCertificateSpeakingScore) || 0,
          franceCertificateTotalScore:
            parseFloat(values.franceCertificate?.franceCertificateTotalScore) || 0,
          franceCertificateLevel: values.franceCertificate?.franceCertificateLevel || '',
          franceCertificateFilePath: values.franceCertificate?.franceCertificateFilePath || '',
        },
        japanCertificate: {
          japanCertificateName: values.japanCertificate?.japanCertificateName || '',
          japanCertificateDate: values.japanCertificate?.japanCertificateDate
            ? moment(values.japanCertificate.japanCertificateDate).format('DD/MM/YYYY')
            : '',
          japanCertificateListeningScore:
            parseFloat(values.japanCertificate?.japanCertificateListeningScore) || 0,
          japanCertificateReadingScore:
            parseFloat(values.japanCertificate?.japanCertificateReadingScore) || 0,
          japanCertificateVocabularyScore:
            parseFloat(values.japanCertificate?.japanCertificateVocabularyScore) || 0,
          japanCertificateTotalScore:
            parseFloat(values.japanCertificate?.japanCertificateTotalScore) || 0,
          japanCertificateLevel: values.japanCertificate?.japanCertificateLevel || '',
          japanCertificateFilePath: values.japanCertificate?.japanCertificateFilePath || '',
        },
      };

      const response = await enrollVB2(payloadToSend);

      if (response && response.enrollmentCode) {
        const enrollmentCode = response.enrollmentCode;

        setTimeout(() => {
          history.push(`/thongtin-canhan`);
          window.scrollTo(0, 0);
        }, 1000);

        setTimeout(() => {
          openNotification(
            true,
            'Nộp hồ sơ thành công!',
            `Hồ sơ của bạn đã được gửi. Mã hồ sơ của bạn là: ${enrollmentCode}`,
          );
        }, 1100);
      } else {
        CustomMessageError({ content: 'Không nhận được mã hồ sơ từ hệ thống. Vui lòng thử lại!' });
        setLoading(false);
      }
    } catch (error: any) {
      CustomMessageError({ content: 'Đã xảy ra lỗi không xác định!' });
    }
  };

  const beforeUploadAvatar = (file: File) => {
    const isJpgExt = file.name.toLowerCase().endsWith('.jpg');
    const isJpgMime = file.type === 'image/jpeg';
    const isValid = isJpgExt && isJpgMime;
    if (!isValid) {
      CustomMessageError({ content: 'Bạn chỉ có thể tải lên file JPG (.jpg)!' });
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      CustomMessageError({ content: 'Hình ảnh phải nhỏ hơn 2MB!' });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const beforeUploadFile = (file: File) => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      CustomMessageError({ content: 'Bạn chỉ có thể tải lên file PDF (.pdf)!' });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const setNestedValue = (obj: any, path: string[], value: any) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  };

  const onUploadChange =
    (
      formFieldNamePath: string[],
      setSpecificFileList: React.Dispatch<React.SetStateAction<any[]>>,
    ) =>
    (info: any) => {
      let newFileList = [...info.fileList];

      newFileList = newFileList.slice(-1);

      const processedFileList = newFileList.map((fileItem: any) => {
        if (fileItem.status === 'done') {
          let parsedResponse = fileItem.response;
          if (typeof fileItem.response === 'string') {
            try {
              parsedResponse = JSON.parse(fileItem.response);
            } catch (e) {
              CustomMessageError({
                content: `${fileItem.name} tải lên thất bại: Phản hồi từ server không hợp lệ!`,
              });
              const updateObject = {};
              setNestedValue(updateObject, formFieldNamePath, '');
              form.setFieldsValue(updateObject);
              return { ...fileItem, status: 'error' };
            }
          }

          if (parsedResponse && parsedResponse.url) {
            CustomMessageSuccess({ content: `${fileItem.name} tải lên thành công!` });
            const relativeUrl = parsedResponse.url;
            const updateObject = {};
            setNestedValue(updateObject, formFieldNamePath, relativeUrl);
            form.setFieldsValue(updateObject);

            return {
              ...fileItem,
              url: endpoint + relativeUrl,
            };
          } else {
            CustomMessageError({
              content: `${fileItem.name} tải lên thất bại: Không nhận được URL từ server!`,
            });
            const updateObject = {};
            setNestedValue(updateObject, formFieldNamePath, '');
            form.setFieldsValue(updateObject);
            return { ...fileItem, status: 'error' };
          }
        } else if (fileItem.status === 'error') {
          CustomMessageError({ content: `${fileItem.name} tải lên thất bại!` });
          const updateObject = {};
          setNestedValue(updateObject, formFieldNamePath, '');
          form.setFieldsValue(updateObject);
          return { ...fileItem, status: 'error' };
        }
        return fileItem;
      });

      setSpecificFileList(processedFileList);
    };

  const onFinishFailed = (errorInfo: any) => {
    CustomMessageError({ content: 'Vui lòng kiểm tra lại các trường thông tin bị lỗi!' });
  };

  const textRule = [{ pattern: /^[^\d]*$/, message: 'Chỉ chấp nhận chữ cái và khoảng trắng' }];

  const numberRule = [{ pattern: /^\d+$/, message: 'Chỉ được nhập số' }];

  const yearRule = [
    {
      validator: (_: any, value: string) => {
        const year = Number(value);
        const currentYear = moment().year();
        if (!value || (year >= 1900 && year <= currentYear)) {
          return Promise.resolve();
        }
        return Promise.reject('Năm không hợp lệ hoặc lớn hơn năm hiện tại');
      },
    },
  ];

  const certificateMarkRule: MarkRule[] = [
    {
      pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
      message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
    },
  ];

  const scoreTypeRule = ({
    getFieldValue,
  }: {
    getFieldValue: (name: string | string[]) => any;
  }) => ({
    validator(_: any, value: any) {
      const universityGpaString = form.getFieldValue(['universityInfor', 'universityGpa']);

      const universityGpa = parseFloat(universityGpaString);

      if (!isNaN(universityGpa) && universityGpa > 4 && value !== 'hs10') {
        return Promise.reject(new Error('Khi ĐTB lớn hơn 4, hệ số điểm chỉ có thể là Hệ số 10.'));
      }
      return Promise.resolve();
    },
  });

  const disabledFutureDates = (current: moment.Moment) => {
    return current && current > moment().endOf('day');
  };

  interface IdRule {
    validator: (rule: any, value: string) => Promise<void>;
  }

  interface PhoneRule {
    validator: (rule: any, value: string) => Promise<void>;
  }

  type MarkRule = {
    pattern: RegExp;
    message: string;
  };

  const markRule: MarkRule[] = [
    {
      pattern: /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/,
      message: 'Điểm phải từ 0 đến 10 và tối đa 2 chữ số thập phân',
    },
  ];

  const idRule: IdRule[] = [
    {
      validator: (_: any, value: string) => {
        if (!value || value.length == 12) {
          return Promise.resolve();
        }
        return Promise.reject('Số CCCD/Mã định danh phải đủ 12 chữ số');
      },
    },
  ];

  const phoneRule: PhoneRule[] = [
    {
      validator: (_: any, value: string) => {
        if (!value || value.length == 10) {
          return Promise.resolve();
        }
        return Promise.reject('Số điện thoại phải đủ 10 chữ số');
      },
    },
  ];

  const getProvincePickerRules = (submitted: boolean) => {
    if (!submitted) {
      return [];
    }
    return [
      {
        validator: async (_: any, value: any) => {
          const provinceCode =
            typeof value?.provinceCode === 'string' && value.provinceCode !== ''
              ? value.provinceCode
              : undefined;
          const wardCode =
            typeof value?.wardCode === 'string' && value.wardCode !== ''
              ? value.wardCode
              : undefined;
          if (provinceCode === undefined) {
            return Promise.reject(new Error('Vui lòng chọn Tỉnh/Thành phố'));
          }
          if (wardCode === undefined) {
            return Promise.reject(new Error('Vui lòng chọn Phường/Xã'));
          }
          return Promise.resolve();
        },
      },
    ];
  };

  const getProvincePickerSchoolRules = (submitted: boolean) => {
    if (!submitted) {
      return [];
    }
    return [
      {
        validator: async (_: any, value: any) => {
          const provinceCode =
            typeof value?.provinceCode === 'string' && value.provinceCode !== ''
              ? value.provinceCode
              : undefined;
          const wardCode =
            typeof value?.wardCode === 'string' && value.wardCode !== ''
              ? value.wardCode
              : undefined;
          if (provinceCode === undefined) {
            return Promise.reject(new Error('Vui lòng chọn Tỉnh/Thành phố THPT'));
          }
          if (wardCode === undefined) {
            return Promise.reject(new Error('Vui lòng chọn Phường/Xã THPT'));
          }
          return Promise.resolve();
        },
      },
    ];
  };

  const getMajorPickerSmallRules = (submitted: boolean) => {
    if (!submitted) {
      return [];
    }
    return [
      {
        validator: async (_: any, value: any) => {
          const majorCode = typeof value?.majorCode === 'number' ? value.majorCode : undefined;
          if (majorCode === undefined) {
            return Promise.reject(new Error('Vui lòng chọn Ngành'));
          }
          return Promise.resolve();
        },
      },
    ];
  };

  return (
    <ConfigProvider locale={viVN}>
      <Form
        form={form}
        name="vanBang2Form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className={styles.formContainer}
        autoComplete="off"
        requiredMark={false}
      >
        <div className={styles.formHeader}>
          <ArrowLeftOutlined
            className={styles.backIcon}
            onClick={() => history.push('/trangchu')}
          />
          <h2 className={styles.headerText}>HỆ ĐÀO TẠO TỪ XA - VĂN BẰNG 2</h2>
        </div>
        <h1 className={styles.section}>01. THÔNG TIN CÁ NHÂN</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Số CCCD/Mã định danh
                </Typography.Text>
              }
              name={['studentInfor', 'studentIdCard']}
              rules={[
                { required: true, message: 'Vui lòng nhập Số CCCD/Mã định danh' },
                ...numberRule,
                ...idRule,
              ]}
            >
              <Input placeholder="012345678912" style={{ borderRadius: '8px' }} />
            </Form.Item>
            <p className={styles.noteText}>
              <span className={styles.highlight}>Lưu ý:</span> Số CCCD/Mã định danh dùng đúng số
              đăng ký trên hệ thống của Bộ GD&ĐT
            </p>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Ngày, tháng, năm sinh
                </Typography.Text>
              }
              name={['studentInfor', 'studentDob']}
              rules={[{ required: true, message: 'Vui lòng chọn Ngày, tháng, năm sinh' }]}
              validateTrigger="onChange"
            >
              <DatePicker
                placeholder="01/01/2000"
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                disabledDate={disabledFutureDates}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Dân tộc
                </Typography.Text>
              }
              name={['studentInfor', 'studentEthnicity']}
              rules={[{ required: true, message: 'Vui lòng chọn Dân tộc' }, ...textRule]}
            >
              <Select
                placeholder="Kinh"
                showSearch
                notFoundContent={
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có dữ liệu"
                    imageStyle={{ height: 30 }}
                    style={{ margin: 0 }}
                  />
                }
              >
                {ethnicGroups &&
                  ethnicGroups.map((item) => (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Giới tính
                </Typography.Text>
              }
              name={['studentInfor', 'studentGender']}
              rules={[{ required: true, message: 'Vui lòng chọn Giới tính' }]}
            >
              <Select placeholder="Nam">
                <Select.Option value="0">Nam</Select.Option>
                <Select.Option value="1">Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Họ và tên đệm</Typography.Text>}
              name={['studentInfor', 'studentLastName']}
            >
              <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={<Typography.Text strong>Tên</Typography.Text>}
              name={['studentInfor', 'studentFirstName']}
            >
              <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={<Typography.Text strong>Số điện thoại</Typography.Text>}
              name={['studentInfor', 'studentPhone']}
            >
              <Input
                disabled
                value={userInfo?.phoneNumber}
                style={{ color: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Email</Typography.Text>}
              name={['studentInfor', 'studentEmail']}
            >
              <Input disabled style={{ color: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px' }} />
            </Form.Item>
          </Col>

          {/* PHẦN UPLOAD HÌNH THẺ */}
          <Col xs={24} md={24} className={styles.uploadCol}>
            <Form.Item
              label={<Typography.Text strong></Typography.Text>}
              name={['studentInfor', 'studentAvatar']}
            >
              <Upload
                name="file"
                maxCount={1}
                action={`${endpoint}/api/upload/picture`}
                accept=".jpg"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUploadAvatar}
                fileList={studentAvatarFileList}
                onChange={onUploadChange(
                  ['studentInfor', 'studentAvatar'],
                  setStudentAvatarFileList,
                )}
              >
                {studentAvatarFileList.length < 1 ? (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                ) : (
                  studentAvatarFileList[0]?.url?.endsWith('.jpg') && (
                    <img
                      src={studentAvatarFileList[0].url}
                      alt="Ảnh thẻ"
                      className={styles.imgUploadHolder}
                    />
                  )
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Hình thẻ và URL Hình thẻ
                </Typography.Text>
              }
              name={['studentInfor', 'studentAvatar']}
              rules={[
                { required: true, message: 'URL Hình thẻ là bắt buộc. Vui lòng tải lên hình ảnh' },
              ]}
            >
              <Input
                placeholder="URL Hình thẻ"
                disabled
                style={{ color: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px' }}
              />
            </Form.Item>
            <p className={styles.noteText}>
              <span className={styles.highlight}>Lưu ý:</span> Vui lòng tải lên "Hình thẻ" bằng định
              dạng file JPG (.jpg)
            </p>
          </Col>
        </Row>

        {/* Các trường cho HighSchoolInfor */}
        <h1 className={styles.section}>02. THÔNG TIN TRÌNH ĐỘ THPT</h1>
        <Form.Item
          name={['highSchoolInfor', 'highSchoolProvince']}
          rules={getProvincePickerSchoolRules(isFormSubmitted)}
        >
          <ProvincePicker provinces={provinces} title="THPT" />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Trường THPT
                </Typography.Text>
              }
              name={['highSchoolInfor', 'highSchool']}
              rules={[{ required: true, message: 'Vui lòng nhập Trường THPT' }]}
            >
              <Input placeholder="THPT Hùng Vương" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Năm tốt nghiệp THPT
                </Typography.Text>
              }
              name={['highSchoolInfor', 'highSchoolGraduationYear']}
              rules={[
                { required: true, message: 'Vui lòng nhập Năm tốt nghiệp THPT' },
                ...yearRule,
              ]}
            >
              <Input placeholder="2020" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Học lực
                </Typography.Text>
              }
              name={['highSchoolInfor', 'highSchoolAcademicPerformance']}
              rules={[{ required: true, message: 'Vui lòng chọn Học lực' }]}
            >
              <Select placeholder="Giỏi">
                <Select.Option value="Gioi">Giỏi</Select.Option>
                <Select.Option value="Kha">Khá</Select.Option>
                <Select.Option value="TB">Trung Bình</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Hạnh kiểm
                </Typography.Text>
              }
              name={['highSchoolInfor', 'highSchoolConduct']}
              rules={[{ required: true, message: 'Vui lòng chọn Hạnh kiểm' }]}
            >
              <Select placeholder="Tốt">
                <Select.Option value="Tot">Tốt</Select.Option>
                <Select.Option value="Kha">Khá</Select.Option>
                <Select.Option value="TB">Trung Bình</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Các trường cho UniInfor */}
        <h1 className={styles.section}>03. THÔNG TIN TRÌNH ĐỘ ĐẠI HỌC</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Ngành tốt nghiệp
                </Typography.Text>
              }
              name={['universityInfor', 'universityMajor']}
              rules={[{ required: true, message: 'Vui lòng nhập Ngành tốt nghiệp' }, ...textRule]}
            >
              <Input placeholder="Ngôn ngữ Anh" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>ĐTB tích lũy
                </Typography.Text>
              }
              name={['universityInfor', 'universityGpa']}
              rules={[{ required: true, message: 'Vui lòng nhập Điểm' }, ...markRule]}
            >
              <Input placeholder="10" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Hệ số điểm
                </Typography.Text>
              }
              name={['universityInfor', 'universityScoreType']}
              rules={[{ required: true, message: 'Vui lòng chọn Hệ số' }, scoreTypeRule]}
            >
              <Select placeholder="Hệ số 4">
                <Select.Option value="hs4">Hệ số 4</Select.Option>
                <Select.Option value="hs10">Hệ số 10</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Năm tốt nghiệp
                </Typography.Text>
              }
              name={['universityInfor', 'universityGraduationYear']}
              rules={[{ required: true, message: 'Vui lòng nhập Năm tốt nghiệp' }, ...yearRule]}
            >
              <Input placeholder="2024" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Tên trường cấp
                </Typography.Text>
              }
              name={['universityInfor', 'universityName']}
              rules={[{ required: true, message: 'Vui lòng nhập Tên trường cấp' }, ...textRule]}
            >
              <Input placeholder="Trường Đại học Luật TP.HCM" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Ngày ký
                </Typography.Text>
              }
              name={['universityInfor', 'universitySignDate']}
              rules={[{ required: true, message: 'Vui lòng chọn Ngày ký' }]}
              validateTrigger="onChange"
            >
              <DatePicker
                placeholder="01/01/2024"
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                disabledDate={disabledFutureDates}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Hình thức đào tạo
                </Typography.Text>
              }
              name={['universityInfor', 'universityTrainingMode']}
              rules={[{ required: true, message: 'Vui lòng nhập Hình thức đào tạo' }, ...textRule]}
            >
              <Input placeholder="Chính quy" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Số hiệu văn bằng
                </Typography.Text>
              }
              name={['universityInfor', 'universityDegreeNumber']}
              rules={[{ required: true, message: 'Vui lòng nhập Số hiệu văn bằng' }]}
            >
              <Input placeholder="123" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Số vào sổ
                </Typography.Text>
              }
              name={['universityInfor', 'universityRegistrationNumber']}
              rules={[{ required: true, message: 'Vui lòng nhập Số vào sổ' }]}
            >
              <Input placeholder="ABC456" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Minh chứng bằng tốt nghiệp
                </Typography.Text>
              }
              name={['universityInfor', 'universityDegree']}
              rules={[{ required: true, message: 'Vui lòng tải lên Minh chứng bằng tốt nghiệp' }]}
            >
              <Upload
                name="file"
                action={`${endpoint}/api/upload/file`}
                accept=".pdf"
                maxCount={1}
                listType="text"
                beforeUpload={beforeUploadFile}
                fileList={universityDegreeFileList}
                onChange={onUploadChange(
                  ['universityInfor', 'universityDegree'],
                  setUniversityDegreeFileList,
                )}
              >
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
            <p className={styles.noteText}>
              <span className={styles.highlight}>Lưu ý:</span> Vui lòng scan "Minh chứng bằng tốt
              nghiệp" rõ ràng và định dạng bằng file PDF (.pdf)
            </p>
          </Col>
        </Row>

        {/* Các trường cho ContactInfor */}
        <h1 className={styles.section}>04. THÔNG TIN LIÊN HỆ</h1>
        <Form.Item
          name={['contactInfor', 'userProvince']}
          rules={getProvincePickerRules(isFormSubmitted)}
        >
          <ProvincePicker provinces={provinces} />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Số nhà, tên đường
                </Typography.Text>
              }
              name={['contactInfor', 'studentContactAddress']}
              rules={[{ required: true, message: 'Vui lòng nhập Số nhà, tên đường' }]}
            >
              <Input placeholder="123 Đường XYZ" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label={
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>Địa chỉ liên hệ
                </Typography.Text>
              }
              name={['contactInfor', 'studentFullContactAddress']}
              rules={[{ required: true, message: 'Vui lòng nhập Địa chỉ liên hệ' }]}
            >
              <Input
                placeholder="123 Đường XYZ, Phường Sài Gòn, Thành phố Hồ Chí Minh"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Họ tên Cha</Typography.Text>}
              name={['contactInfor', 'fatherName']}
              rules={[...textRule]}
            >
              <Input placeholder="Nhập Họ tên Cha" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Số điện thoại Cha</Typography.Text>}
              name={['contactInfor', 'fatherPhone']}
              rules={[...numberRule, ...phoneRule]}
            >
              <Input placeholder="Nhập Số điện thoại Cha" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Nghề nghiệp</Typography.Text>}
              name={['contactInfor', 'fatherOccupation']}
              rules={[...textRule]}
            >
              <Input placeholder="Nhập Nghề nghiệp" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Họ tên Mẹ</Typography.Text>}
              name={['contactInfor', 'motherName']}
              rules={[...textRule]}
            >
              <Input placeholder="Nhập Họ tên Mẹ" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Số điện thoại Mẹ</Typography.Text>}
              name={['contactInfor', 'motherPhone']}
              rules={[...numberRule, ...phoneRule]}
            >
              <Input placeholder="Nhập Số điện thoại Mẹ" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text strong>Nghề nghiệp</Typography.Text>}
              name={['contactInfor', 'motherOccupation']}
              rules={[...textRule]}
            >
              <Input placeholder="Nhập Nghề nghiệp" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Các trường chứng chỉ */}
        <h1 className={styles.section}>05. THÔNG TIN CHỨNG CHỈ</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Form.Item name="hasEnglishCertificate" valuePropName="checked" noStyle>
              <Checkbox onChange={handleECheckboxChange}>
                <Typography.Text strong>Chứng chỉ Tiếng Anh</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
          {showEFields && (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Chứng chỉ Tiếng Anh
                    </Typography.Text>
                  }
                  name={['englishCertificate', 'englishCertificateName']}
                  rules={[{ required: true, message: 'Vui lòng chọn Chứng chỉ Tiếng Anh' }]}
                >
                  <Select placeholder="IELTS">
                    <Select.Option value="IELTS">IELTS</Select.Option>
                    <Select.Option value="TOEFL">TOEFL</Select.Option>
                    <Select.Option value="TOEIC">TOEIC</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Ngày hiệu lực
                    </Typography.Text>
                  }
                  name={['englishCertificate', 'englishCertificateDate']}
                  rules={[{ required: true, message: 'Vui lòng chọn Ngày hiệu lực' }]}
                  validateTrigger="onChange"
                >
                  <DatePicker
                    placeholder="01/01/2024"
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                    disabledDate={disabledFutureDates}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Nghe</Typography.Text>}
                  name={['englishCertificate', 'englishCertificateListeningScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Đọc</Typography.Text>}
                  name={['englishCertificate', 'englishCertificateReadingScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Nói</Typography.Text>}
                  name={['englishCertificate', 'englishCertificateSpeakingScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Viết</Typography.Text>}
                  name={['englishCertificate', 'englishCertificateWritingScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Tổng điểm
                    </Typography.Text>
                  }
                  name={['englishCertificate', 'englishCertificateTotalScore']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập Tổng điểm' },
                    ...certificateMarkRule,
                  ]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Trình độ
                    </Typography.Text>
                  }
                  name={['englishCertificate', 'englishCertificateLevel']}
                  rules={[{ required: true, message: 'Vui lòng chọn Trình độ' }]}
                >
                  <Select placeholder="A1">
                    <Select.Option value="A1">A1</Select.Option>
                    <Select.Option value="A2">A2</Select.Option>
                    <Select.Option value="B1">B1</Select.Option>
                    <Select.Option value="B2">B2</Select.Option>
                    <Select.Option value="C1">C1</Select.Option>
                    <Select.Option value="C2">C2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={24}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      Số Test Report Form Number (IELTS)/Reference Number (Cambridge)
                    </Typography.Text>
                  }
                  name={['englishCertificate', 'englishCertificateNumber']}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Minh chứng
                    </Typography.Text>
                  }
                  name={['englishCertificate', 'englishCertificateFilePath']}
                  rules={[{ required: true, message: 'Vui lòng tải lên Minh chứng' }]}
                >
                  <Upload
                    name="file"
                    action={`${endpoint}/api/upload/file`}
                    accept=".pdf"
                    maxCount={1}
                    beforeUpload={beforeUploadFile}
                    listType="text"
                    onChange={onUploadChange(
                      ['englishCertificate', 'englishCertificateFilePath'],
                      setEnglishCertificateFileList,
                    )}
                    fileList={englishCertificateFileList}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                </Form.Item>
                <p className={styles.noteText}>
                  <span className={styles.highlight}>Lưu ý:</span> Vui lòng scan "Minh chứng" rõ
                  ràng và định dạng bằng file PDF (.pdf)
                </p>
              </Col>
            </>
          )}
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Form.Item name="hasFranceCertificate" valuePropName="checked" noStyle>
              <Checkbox onChange={handleFCheckboxChange}>
                <Typography.Text strong>Chứng chỉ Tiếng Pháp</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
          {showFFields && (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Chứng chỉ Tiếng Pháp
                    </Typography.Text>
                  }
                  name={['franceCertificate', 'franceCertificateName']}
                  rules={[{ required: true, message: 'Vui lòng chọn Chứng chỉ Tiếng Pháp' }]}
                >
                  <Select placeholder="DELF">
                    <Select.Option value="DELF">DELF</Select.Option>
                    <Select.Option value="DALF">DALF</Select.Option>
                    <Select.Option value="TCF">TCF</Select.Option>
                    <Select.Option value="TEF">TEF</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Ngày hiệu lực
                    </Typography.Text>
                  }
                  name={['franceCertificate', 'franceCertificateDate']}
                  rules={[{ required: true, message: 'Vui lòng chọn Ngày hiệu lực' }]}
                  validateTrigger="onChange"
                >
                  <DatePicker
                    placeholder="01/01/2024"
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                    disabledDate={disabledFutureDates}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Nghe</Typography.Text>}
                  name={['franceCertificate', 'franceCertificateListeningScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Đọc</Typography.Text>}
                  name={['franceCertificate', 'franceCertificateReadingScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Nói</Typography.Text>}
                  name={['franceCertificate', 'franceCertificateSpeakingScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={<Typography.Text strong>Điểm Viết</Typography.Text>}
                  name={['franceCertificate', 'franceCertificateWritingScore']}
                  rules={[...certificateMarkRule]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Tổng điểm
                    </Typography.Text>
                  }
                  name={['franceCertificate', 'franceCertificateTotalScore']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập Tổng điểm' },
                    ...certificateMarkRule,
                  ]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Trình độ
                    </Typography.Text>
                  }
                  name={['franceCertificate', 'franceCertificateLevel']}
                  rules={[{ required: true, message: 'Vui lòng chọn Trình độ' }]}
                >
                  <Select placeholder="A1">
                    <Select.Option value="A1">A1</Select.Option>
                    <Select.Option value="A2">A2</Select.Option>
                    <Select.Option value="B1">B1</Select.Option>
                    <Select.Option value="B2">B2</Select.Option>
                    <Select.Option value="C1">C1</Select.Option>
                    <Select.Option value="C2">C2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Minh chứng
                    </Typography.Text>
                  }
                  name={['franceCertificate', 'franceCertificateFilePath']}
                  rules={[{ required: true, message: 'Vui lòng tải lên Minh chứng' }]}
                >
                  <Upload
                    name="file"
                    action={`${endpoint}/api/upload/file`}
                    accept=".pdf"
                    maxCount={1}
                    beforeUpload={beforeUploadFile}
                    listType="text"
                    onChange={onUploadChange(
                      ['franceCertificate', 'franceCertificateFilePath'],
                      setFranceCertificateFileList,
                    )}
                    fileList={franceCertificateFileList}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                </Form.Item>
                <p className={styles.noteText}>
                  <span className={styles.highlight}>Lưu ý:</span> Vui lòng scan "Minh chứng" rõ
                  ràng và định dạng bằng file PDF (.pdf)
                </p>
              </Col>
            </>
          )}
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Form.Item name="japanCertificate" valuePropName="checked" noStyle>
              <Checkbox onChange={handleJCheckboxChange}>
                <Typography.Text strong>Chứng chỉ Tiếng Nhật</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
          {showJFields && (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Chứng chỉ Tiếng Nhật
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateName']}
                  rules={[{ required: true, message: 'Vui lòng chọn Chứng chỉ Tiếng Nhật' }]}
                >
                  <Select placeholder="JLPT">
                    <Select.Option value="JLPT">JLPT</Select.Option>
                    <Select.Option value="JTEST">JTEST</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Ngày hiệu lực
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateDate']}
                  rules={[{ required: true, message: 'Vui lòng chọn Ngày hiệu lực' }]}
                  validateTrigger="onChange"
                >
                  <DatePicker
                    placeholder="01/01/2024"
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                    disabledDate={disabledFutureDates}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Điểm Nghe
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateListeningScore']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập Điểm Nghe' },
                    ...certificateMarkRule,
                  ]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Điểm Đọc
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateReadingScore']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập Điểm Đọc' },
                    ...certificateMarkRule,
                  ]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Điểm Từ vựng
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateVocabularyScore']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập Điểm Từ vựng' },
                    ...certificateMarkRule,
                  ]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Tổng điểm
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateTotalScore']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập Tổng điểm' },
                    ...certificateMarkRule,
                  ]}
                >
                  <Input style={{ borderRadius: '8px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Trình độ
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateLevel']}
                  rules={[{ required: true, message: 'Vui lòng chọn Trình độ' }]}
                >
                  <Select placeholder="N5">
                    <Select.Option value="N5">N5</Select.Option>
                    <Select.Option value="N4">N4</Select.Option>
                    <Select.Option value="N3">N3</Select.Option>
                    <Select.Option value="N2">N2</Select.Option>
                    <Select.Option value="N1">N1</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      <span style={{ color: 'red' }}>* </span>Minh chứng
                    </Typography.Text>
                  }
                  name={['japanCertificate', 'japanCertificateFilePath']}
                  rules={[{ required: true, message: 'Vui lòng tải lên Minh chứng' }]}
                >
                  <Upload
                    name="file"
                    action={`${endpoint}/api/upload/file`}
                    accept=".pdf"
                    maxCount={1}
                    beforeUpload={beforeUploadFile}
                    listType="text"
                    onChange={onUploadChange(
                      ['japanCertificate', 'japanCertificateFilePath'],
                      setJapanCertificateFileList,
                    )}
                    fileList={japanCertificateFileList}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                </Form.Item>
                <p className={styles.noteText}>
                  <span className={styles.highlight}>Lưu ý:</span> Vui lòng scan "Minh chứng" rõ
                  ràng và định dạng bằng file PDF (.pdf)
                </p>
              </Col>
            </>
          )}
          <Col xs={24} md={24}></Col>
        </Row>

        {/* Các trường cho Nguyện vọng */}
        <h1 className={styles.section}>06. THÔNG TIN NGUYỆN VỌNG</h1>
        <Form.Item name="userMajor" rules={getMajorPickerSmallRules(isFormSubmitted)}>
          <MajorPickerSmall majors={major} title />
        </Form.Item>

        {/* Checkbox xác nhận */}
        <Form.Item
          name="aspirationConfirmation"
          valuePropName="checked"
          rules={[{ required: true, message: 'Vui lòng chọn Xác nhận' }]}
        >
          <Checkbox className={styles.confirmText}>
            <span className={styles.highlight}>(*)</span>{' '}
            <Typography.Text strong>
              Tôi cam đoan những thông tin trên là hoàn toàn đúng.
            </Typography.Text>
          </Checkbox>
        </Form.Item>

        <Button
          className={styles.buttonSubmit}
          type="primary"
          onClick={() => {
            setIsFormSubmitted(true);
            setTimeout(() => {
              form.submit();
            }, 0);
          }}
          loading={loading}
        >
          Nộp hồ sơ
        </Button>
      </Form>
    </ConfigProvider>
  );
};

export default VanBang2;
