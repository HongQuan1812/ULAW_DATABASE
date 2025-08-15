import React, { useEffect, useState } from 'react';
import {
  Steps,
  Card,
  Typography,
  Button,
  Collapse,
  Descriptions,
  Image,
  Input,
  Spin,
  Checkbox,
  Timeline,
} from 'antd';
import {
  InfoCircleOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
  CaretDownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  getEnrollmentForm,
  AdminEnrollManagementDto,
  getLocationNameByCode,
  updateEnrollmentAsAdmin,
} from '@/services/enroll';
import {
  CustomMessageError,
  CustomMessageSuccess,
  CustomMessageWarning,
} from '@/components/CustomMessage/CustomMessage';
import NoFoundPage from '@/pages/404';
import { useParams, history } from 'umi';
import axios from 'axios';
import { ArrowLeftOutlined, WarningOutlined } from '@ant-design/icons';
import styles from './index.less';
import moment from 'moment';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import api from '@/apiEndpoint/index';

const endpoint = api.UMI_API_BASE_URL;

const { Text, Title } = Typography;
const { Panel } = Collapse;

type LocationNameData = {
  provinceName: string;
  wardName: string;
};

type MajorData = {
  code: number;
  name: string;
  subjectGroup?: { code: string; name: string }[];
};

const EnrollmentDetail: React.FC = () => {
  const { enrollmentCode }: any = useParams();
  const [formData, setFormData] = useState<AdminEnrollManagementDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [highSchoolAddressNames, setHighSchoolAddressNames] = useState<LocationNameData | null>(
    null,
  );
  const [contactAddressNames, setContactAddressNames] = useState<LocationNameData | null>(null);
  const [majorData, setMajorData] = useState<MajorData[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [actualStep, setActualStep] = useState<number>(1);
  const [adminNote, setAdminNote] = useState<string>('');
  const [showNote, setShowNote] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState(false);
  const [afterUniMajors, setAfterUniMajors] = useState<AfterUniMajor[]>([]);
  const [isHandler, setIsHandler] = useState<boolean>(true);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await getEnrollmentForm(enrollmentCode);
      if (res?.data) setFormData(res.data);
    } catch (err) {
      CustomMessageError({ content: 'Không thể tải hồ sơ' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enrollmentCode) fetchData();
  }, [enrollmentCode]);

  useEffect(() => {
    if (formData?.enrollmentCode) {
      const currentUsername = localStorage.getItem('username') || '';
      const currentRole = localStorage.getItem('role') || '';

      const isSdhCode = formData.enrollmentCode.toUpperCase().startsWith('SDH');
      const isAdminSdh = currentRole === 'adminSdh';
      const isAdminPdt = currentRole === 'adminPdt';

      // Nếu mã SDH nhưng là adminPdt - chỉ xem
      if (isSdhCode && isAdminPdt) {
        setIsHandler(false);
        return;
      }

      // Nếu mã không phải SDH nhưng là adminSdh - chỉ xem
      if (!isSdhCode && isAdminSdh) {
        setIsHandler(false);
        return;
      }

      // Nếu hồ sơ đã có người xử lý, kiểm tra đúng người hay không
      if (formData.adminUsername) {
        setIsHandler(currentUsername === formData.adminUsername);
      } else {
        // Nếu chưa có ai xử lý, thì cho phép người đúng quyền vào xử lý
        setIsHandler(true);
      }
    }
  }, [formData?.adminUsername, formData?.enrollmentCode]);

  useEffect(() => {
    fetchAllMajorFromLocalJson();
    fetchAfterUniMajors().then(setAfterUniMajors);
  }, []);

  useEffect(() => {
    if (formData?.highSchoolInfor) {
      fetchHighSchoolLocationNames(
        formData.highSchoolInfor.highSchoolProvince,
        formData.highSchoolInfor.highSchoolWard,
      );
    }
    if (formData?.contactInfor) {
      fetchContactLocationNames(
        formData.contactInfor.studentContactProvince,
        formData.contactInfor.studentContactWard,
      );
    }
  }, [formData?.highSchoolInfor, formData?.contactInfor]);

  useEffect(() => {
    if (formData?.step != null) {
      setActualStep(formData.step);
      switch (formData.step) {
        case 1:
          setCurrentStep(1);
          setIsRejected(false);
          break;
        case 2:
          setCurrentStep(1);
          setIsRejected(false);
          break;
        case 3:
          setCurrentStep(2);
          setIsRejected(true);
          break;
        case 4:
          setCurrentStep(2);
          setIsRejected(false);
          break;
        case 5:
          setCurrentStep(2);
          setIsRejected(false);
          break;
        case 0:
        default:
          setCurrentStep(0);
          setIsRejected(false);
          break;
      }
    }
  }, [formData?.step]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const connection = new HubConnectionBuilder()
      .withUrl(`${endpoint}/enrollmenthub`, {
        accessTokenFactory: () => token || '',
      })
      .configureLogging(LogLevel.None)
      .withAutomaticReconnect()
      .build();

    connection.onclose((error) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('401')) {
        CustomMessageError({ content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' });
      }
    });

    connection.start().catch((err) => {
      if (err?.message?.includes('Unauthorized') || err?.message?.includes('401')) {
        CustomMessageError({ content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' });
      }
    });

    connection.on('enrollmentDetailDataChanged', () => {
      fetchData();
    });

    return () => {
      connection.off('enrollmentDetailDataChanged');
      connection.stop();
    };
  }, []);

  const renderDescription = (label: string, value: any) => (
    <Descriptions.Item label={label}>
      <Text strong>{value || null}</Text>
    </Descriptions.Item>
  );

  const fetchAllMajorFromLocalJson = async () => {
    try {
      const response = await axios.get<MajorData[]>('/dataMajor.json');
      if (response.data) {
        setMajorData(response.data);
      }
    } catch (error) {
      return;
    }
  };

  interface AfterUniMajor {
    name: string;
    code: number;
    codename: string;
  }

  const fetchAfterUniMajors = async (): Promise<AfterUniMajor[]> => {
    try {
      const res = await axios.get<AfterUniMajor[]>('/after_uni_major.json');
      return res.data;
    } catch (error) {
      return [];
    }
  };

  const getAfterUniMajorNameByCode = (code?: number | null): string => {
    if (!code) return 'Chưa có dữ liệu';
    return afterUniMajors.find((m) => m.code === code)?.name || 'Không xác định';
  };

  const fetchHighSchoolLocationNames = async (
    provinceCodeStr: string | undefined,
    wardCodeStr: string | undefined,
  ) => {
    if (provinceCodeStr && wardCodeStr) {
      try {
        const response: { code: number; data: LocationNameData | null; message: string } =
          await getLocationNameByCode(provinceCodeStr, wardCodeStr);
        if (response.code === 200 && response.data) {
          setHighSchoolAddressNames(response.data);
        } else {
          setHighSchoolAddressNames(null);
        }
      } catch (error) {
        setHighSchoolAddressNames(null);
      }
    } else {
      setHighSchoolAddressNames(null);
    }
  };

  const fetchContactLocationNames = async (
    provinceCodeStr: string | undefined,
    wardCodeStr: string | undefined,
  ) => {
    if (provinceCodeStr && wardCodeStr) {
      try {
        const provinceCode = provinceCodeStr;
        const wardCode = wardCodeStr;

        if (provinceCode !== '' && wardCode !== '') {
          const response: { code: number; data: LocationNameData | null; message: string } =
            await getLocationNameByCode(provinceCode, wardCode);
          if (response.code === 200 && response.data) {
            setContactAddressNames(response.data);
          } else {
            setContactAddressNames(null);
          }
        } else {
          setContactAddressNames(null);
        }
      } catch (error) {
        setContactAddressNames(null);
      }
    } else {
      setContactAddressNames(null);
    }
  };

  const getTrainingSystemDisplayName = (type?: string) => {
    switch (type) {
      case 'DaoTaoTuXa':
        return 'Đào Tạo Từ Xa';
      case 'VuaLamVuaHoc':
        return 'Vừa Làm Vừa Học';
      case 'ChinhQuy':
        return 'Chính Quy';
      case 'SauDaiHoc':
        return 'Sau Đại Học';
      default:
        return type || '-';
    }
  };

  const getProgramName = (code?: string) => {
    if (!code) return '-';
    const parts = code.split('-');
    const tag = parts[1]?.toUpperCase();
    switch (tag) {
      case 'DH':
        return 'Đại học';
      case 'LT':
        return 'Liên thông';
      case 'VB2':
        return 'Văn bằng 2';
      case 'M':
        return 'Thạc sĩ';
      case 'P':
        return 'Tiến sĩ';
      case 'R':
        return 'Nghiên cứu sinh';
      default:
        return '-';
    }
  };

  const getGenderDisplay = (type: string | undefined): string => {
    if (!type) return '-';
    switch (type) {
      case '0':
        return 'Nam';
      case '1':
        return 'Nữ';
      default:
        return type;
    }
  };

  const getMajorNameByCode = (code: string | number | undefined | null): string | undefined => {
    if (code == null) return undefined;

    const numericCode = typeof code === 'string' ? Number(code) : code;
    if (isNaN(numericCode)) return undefined;

    const foundMajor = majorData.find((item) => item.code === numericCode);
    return foundMajor ? foundMajor.name : String(code);
  };

  const getAcademicPeformanceDisplayName = (type: string | undefined): string => {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'Gioi':
        return 'Giỏi';
      case 'Kha':
        return 'Khá';
      case 'TB':
        return 'Trung bình';
      default:
        return type;
    }
  };

  const getConductDisplayName = (type: string | undefined): string => {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'Tot':
        return 'Tốt';
      case 'Kha':
        return 'Khá';
      case 'TB':
        return 'Trung bình';
      default:
        return type;
    }
  };

  const getUniDegree = (type: string | undefined): string => {
    if (!type) {
      return 'Đại học';
    }
    switch (type) {
      case 'TC':
        return 'Trung cấp';
      case 'CD':
        return 'Cao đẳng';
      default:
        return type;
    }
  };

  const getAdmissionMethodDisplayName = (type: string | undefined): string => {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'HocBa':
        return 'Học bạ';
      case 'THPTQG':
        return 'Kết quả thi THPT Quốc Gia';
      default:
        return type;
    }
  };

  const getSubjectGroupNameByCodeAndMajorCode = (
    examGroupCode: string | undefined | null,
    majorCode: number | undefined | null,
  ): string | undefined => {
    if (examGroupCode == null || majorCode == null) {
      return undefined;
    }

    const foundMajor = majorData.find((m) => m.code === majorCode);
    if (foundMajor) {
      const foundSubjectGroup = foundMajor.subjectGroup?.find((sg) => sg.code === examGroupCode);
      return foundSubjectGroup ? foundSubjectGroup.name : examGroupCode;
    }

    return examGroupCode;
  };

  const getScoreTypeName = (type: string | undefined): string => {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'hs4':
        return 'Hệ số 4';
      case 'hs10':
        return 'Hệ số 10';
      default:
        return type;
    }
  };

  const getHighStudyDegree = (type: number | undefined): string => {
    if (!type) {
      return '';
    }
    switch (type) {
      case 1:
        return 'Thạc sĩ';
      case 2:
        return 'Cử nhân loại Giỏi';
      default:
        return 'Không xác định';
    }
  };

  const getEducationTypeFromCode = (
    code: string,
  ): 'daihoc' | 'lienthong' | 'vanbang2' | 'saudaihoc' => {
    const tag = code?.split('-')[1]?.toUpperCase();

    switch (tag) {
      case 'DH':
        return 'daihoc';
      case 'LT':
        return 'lienthong';
      case 'VB2':
        return 'vanbang2';
    }

    if (['M', 'P', 'R'].includes(tag)) {
      return 'saudaihoc';
    }

    throw new Error('Không thể xác định chương trình từ mã hồ sơ!');
  };

  const saveAdminStep = async (
    educationType: 'daihoc' | 'lienthong' | 'vanbang2' | 'saudaihoc',
    stepValue: number,
    note: string,
  ) => {
    try {
      const firstName = localStorage.getItem('firstname') || '';
      const lastName = localStorage.getItem('lastname') || '';
      const AdminName = `${lastName} ${firstName}`.trim();
      const AdminUsername = localStorage.getItem('username') || '';

      await updateEnrollmentAsAdmin(educationType, {
        EnrollmentCode: enrollmentCode,
        step: stepValue,
        adminMess: note,
        AdminName,
        AdminUsername,
      });
      return true;
    } catch (err) {
      CustomMessageError({ content: 'Lỗi khi lưu trạng thái hồ sơ!' });
      return false;
    }
  };

  let isVanBang2 = false;
  if (formData && formData?.enrollmentCode) {
    const codeParts = formData?.enrollmentCode.split('-');
    if (codeParts.length > 1 && codeParts[1].toUpperCase() === 'VB2') {
      isVanBang2 = true;
    }
  }

  let isSDH = false;
  if (formData?.enrollmentCode) {
    const codeParts = formData.enrollmentCode.split('-');
    if (codeParts.length >= 2 && ['M', 'P', 'R'].includes(codeParts[1].toUpperCase())) {
      isSDH = true;
    }
  }

  const handleStepChange = async (stepValue: number, note: string = '') => {
    if ((stepValue === 2 || stepValue === 3) && (!note || note.trim() === '')) {
      setShowNote(true);
      CustomMessageWarning({ content: 'Vui lòng nhập ghi chú trước khi thực hiện thao tác này!' });
      return;
    }

    let educationType: 'daihoc' | 'lienthong' | 'vanbang2' | 'saudaihoc';

    const newNote =
      stepValue +
      `-` +
      `${moment().format('DD/MM/YYYY HH:mm:ss')}-` +
      (note && note.trim() !== ''
        ? note.trim()
        : stepValue === 5
        ? 'Hồ sơ đã được phê duyệt'
        : stepValue === 1
        ? 'Hồ sơ đã được tiếp nhận'
        : stepValue === 4
        ? 'Hồ sơ đã được chấp nhận'
        : '');

    let noteList: string[] = [];
    try {
      noteList = formData?.adminMess?.startsWith('[')
        ? JSON.parse(formData.adminMess)
        : formData?.adminMess
        ? [formData.adminMess]
        : [];
    } catch {
      noteList = [];
    }

    noteList.push(newNote);

    const finalNote = JSON.stringify(noteList);

    try {
      educationType = getEducationTypeFromCode(enrollmentCode);
    } catch (err) {
      CustomMessageError({ content: 'Không xác định được chương trình từ mã hồ sơ!' });
      return;
    }

    const success = await saveAdminStep(educationType, stepValue, finalNote);
    if (!success) return;

    setActualStep(stepValue);
    if (note !== undefined) setAdminNote(note);

    switch (stepValue) {
      case 1:
        setCurrentStep(1);
        CustomMessageSuccess({ content: 'Đã tiếp nhận hồ sơ!' });
        break;
      case 2:
        setCurrentStep(1);
        CustomMessageSuccess({ content: 'Đã yêu cầu cập nhật hồ sơ!' });
        break;
      case 3:
        setCurrentStep(2);
        setIsRejected(true);
        CustomMessageSuccess({ content: 'Đã từ chối hồ sơ!' });
        break;
      case 4:
        setCurrentStep(2);
        CustomMessageSuccess({ content: 'Đã chấp nhận hồ sơ!' });
        break;
      case 5:
        CustomMessageSuccess({ content: 'Đã phê duyệt hồ sơ!' });
        break;
    }

    setLoading(true);
    setAdminNote('');
    // getEnrollmentForm(enrollmentCode)
    //   .then((res) => setFormData(res?.data))
    //   .catch(() => {})
    //   .finally(() => {
    //     setLoading(false);
    //     setShowNote(false);
    //     setAdminNote('');
    //   });

    const currentUsername = localStorage.getItem('username') || '';
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            adminUsername: currentUsername,
            adminName: `${localStorage.getItem('lastname') || ''} ${
              localStorage.getItem('firstname') || ''
            }`.trim(),
          }
        : prev,
    );
    setIsHandler(true);
  };

  const getStepStatus = (stepIndex: number, formStep: number): 'wait' | 'process' | 'finish' => {
    if (formStep === 3) {
      if (stepIndex < 2) return 'finish';
      if (stepIndex === 2) return 'finish';
    }

    if (formStep === 5) return 'finish';

    if (formStep === 2 && stepIndex === 1) return 'process';
    if (formStep === 2 && stepIndex < 1) return 'finish';
    if (formStep === 2 && stepIndex > 1) return 'wait';

    if (formStep === 4) {
      if (stepIndex < 2) return 'finish';
      if (stepIndex === 2) return 'process';
    }

    if (stepIndex === formStep) return 'process';
    return stepIndex < formStep ? 'finish' : 'wait';
  };

  const onStepClick = async (step: number) => {
    setLoadingStep(step);
    try {
      await handleStepChange(step, adminNote);
    } finally {
      setLoadingStep(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!formData) {
    return <NoFoundPage />;
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <ArrowLeftOutlined
          onClick={() => history.push('/quanly-hoso')}
          style={{ fontSize: '20px' }}
        />
        <Text className={styles.enrollmentCode}>Hồ sơ {enrollmentCode}</Text>
      </div>
      <>
        <div className={styles.stepCard}>
          <Steps
            items={[
              { title: 'Tiếp nhận hồ sơ', status: getStepStatus(0, formData.step ?? 0) },
              { title: 'Xử lý hồ sơ', status: getStepStatus(1, formData.step ?? 0) },
              { title: 'Kết quả hồ sơ', status: getStepStatus(2, formData.step ?? 0) },
            ]}
          />
        </div>

        {!isHandler && (
          <Card
            style={{
              marginTop: 14,
              background: '#fffbe6',
              border: '1px solid #dc5539',
              borderRadius: 8,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {(() => {
              const currentRole = localStorage.getItem('role');
              const isAdminSdh = currentRole === 'adminSdh';
              const isAdminPdt = currentRole === 'adminPdt';
              const isEnrollmentSdh = formData?.enrollmentCode?.toUpperCase().startsWith('SDH');

              const shouldShowRoleWarning =
                (isAdminSdh && !isEnrollmentSdh) || (isAdminPdt && isEnrollmentSdh);

              return (
                <>
                  {formData?.adminUsername && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        ...(shouldShowRoleWarning ? { marginBottom: 8 } : {}),
                      }}
                    >
                      <WarningOutlined style={{ color: '#dc5539', marginTop: 4 }} />
                      <Text style={{ color: '#dc5539' }}>
                        Hồ sơ này đã được tiếp nhận và xử lý bởi <b>{formData.adminName}</b>
                      </Text>
                    </div>
                  )}

                  {shouldShowRoleWarning && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <WarningOutlined style={{ color: '#dc5539', marginTop: 4 }} />
                      <Text style={{ color: '#dc5539' }}>
                        Bạn chỉ có quyền thao tác trên hồ sơ của{' '}
                        <b>{isAdminSdh ? 'Phòng Đào tạo Sau đại học' : 'Phòng Đào tạo Đại học'}</b>
                      </Text>
                    </div>
                  )}
                </>
              );
            })()}
          </Card>
        )}

        <Card
          title={
            <>
              <InfoCircleOutlined className={styles.infoIcon} />
              <Text style={{ color: '#1890ff' }}>Thông tin chi tiết hồ sơ</Text>
            </>
          }
          style={{ marginTop: 14, borderRadius: 8, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          {formData.studentInfor?.studentAvatar && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Title level={5}>Hình thẻ thí sinh</Title>
              <Image
                width={100}
                height={150}
                src={formData.studentInfor.studentAvatar}
                alt="Hình thẻ thí sinh"
                style={{
                  objectFit: 'cover',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                }}
              />
            </div>
          )}
          <Collapse
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 180 : 0} />}
          >
            <Panel header="Thông tin hồ sơ" key="1">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                {renderDescription('Mã hồ sơ', formData.enrollmentCode)}
                {renderDescription(
                  'Ngày nộp',
                  formData?.regisDate && !isNaN(new Date(formData.regisDate).getTime())
                    ? new Date(formData.regisDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : 'Không xác định',
                )}
                {renderDescription(
                  'Hệ đào tạo',
                  getTrainingSystemDisplayName(formData.trainingSystemType),
                )}
                {renderDescription('Chương trình đào tạo', getProgramName(formData.enrollmentCode))}
              </Descriptions>
            </Panel>
            <Panel header="Thông tin thí sinh" key="2">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                {renderDescription(
                  'Họ và tên',
                  `${formData.studentLastName} ${formData.studentFirstName}`,
                )}
                {renderDescription('Số CCCD/Mã định danh', formData?.studentInfor?.studentIdCard)}
                {renderDescription('Ngày, tháng, năm sinh', formData?.studentInfor?.studentDob)}
                {renderDescription(
                  'Giới tính',
                  getGenderDisplay(formData?.studentInfor?.studentGender),
                )}
                {renderDescription('Dân tộc', formData?.studentInfor?.studentEthnicity)}
              </Descriptions>
            </Panel>
            <Panel header="Thông tin liên hệ" key="3">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                {renderDescription('Số điện thoại', formData?.studentPhone)}
                {renderDescription('Email', formData?.studentEmail)}

                {renderDescription(
                  'Địa chỉ thường trú',
                  formData?.contactInfor?.studentContactAddress +
                    (contactAddressNames
                      ? `, ${contactAddressNames.wardName || ''}${
                          contactAddressNames.wardName && contactAddressNames.provinceName
                            ? ', '
                            : ''
                        }${contactAddressNames.provinceName || ''}`
                      : ' (Đang tải địa chỉ...)'),
                )}

                {renderDescription(
                  'Địa chỉ liên hệ',
                  formData?.contactInfor?.studentFullContactAddress,
                )}

                {isSDH && <>{renderDescription('Nơi công tác', formData.workPlace)}</>}
                {!isSDH && (
                  <>
                    {renderDescription('Họ và tên Cha', formData.contactInfor.fatherName)}

                    {renderDescription('Họ và tên Mẹ', formData.contactInfor.motherName)}

                    {renderDescription('Số điện thoại Cha', formData.contactInfor.fatherPhone)}

                    {renderDescription('Số điện thoại Mẹ', formData.contactInfor.motherPhone)}

                    {renderDescription('Nghề nghiệp Cha', formData.contactInfor.fatherOccupation)}

                    {renderDescription('Nghề nghiệp Mẹ', formData.contactInfor.motherOccupation)}
                  </>
                )}
              </Descriptions>
            </Panel>
            {!isSDH && (
              <Panel header="Thông tin THPT" key="4">
                <Descriptions
                  bordered
                  column={{ xs: 1, md: 2 }}
                  size="small"
                  labelStyle={{ backgroundColor: '#e6e6e6' }}
                >
                  {renderDescription('Trường THPT', formData?.highSchoolInfor?.highSchool)}
                  {renderDescription(
                    'Địa chỉ trường THPT',
                    highSchoolAddressNames
                      ? `${highSchoolAddressNames.wardName || ''}${
                          highSchoolAddressNames.wardName && highSchoolAddressNames.provinceName
                            ? ', '
                            : ''
                        }${highSchoolAddressNames.provinceName || ''}`
                      : 'Đang tải địa chỉ...',
                  )}
                  {renderDescription(
                    'Học lực THPT',
                    getAcademicPeformanceDisplayName(
                      formData?.highSchoolInfor?.highSchoolAcademicPerformance,
                    ),
                  )}
                  {renderDescription(
                    'Hạnh kiểm THPT',
                    getConductDisplayName(formData?.highSchoolInfor?.highSchoolConduct),
                  )}
                  {renderDescription(
                    'Năm tốt nghiệp THPT',
                    formData?.highSchoolInfor?.highSchoolGraduationYear,
                  )}
                </Descriptions>
              </Panel>
            )}
            {formData?.universityInfor?.universityName && (
              <Panel
                header={isVanBang2 || isSDH ? 'Thông tin Đại học' : 'Thông tin Cao đẳng/Trung cấp'}
                key="5"
              >
                <Descriptions
                  bordered
                  column={{ xs: 1, md: 2 }}
                  size="small"
                  labelStyle={{ backgroundColor: '#e6e6e6' }}
                >
                  {renderDescription('Tên trường', formData?.universityInfor?.universityName)}
                  {renderDescription(
                    'Ngành tốt nghiệp',
                    formData?.universityInfor?.universityMajor,
                  )}
                  {renderDescription('ĐTB tích lũy', formData?.universityInfor?.universityGpa)}
                  {renderDescription(
                    'Hệ số điểm',
                    getScoreTypeName(formData?.universityInfor?.universityScoreType),
                  )}
                  {renderDescription(
                    'Năm tốt nghiệp',
                    formData?.universityInfor?.universityGraduationYear,
                  )}
                  {renderDescription(
                    'Hình thức đào tạo',
                    formData?.universityInfor?.universityTrainingMode,
                  )}
                  {renderDescription('Ngày ký', formData?.universityInfor?.universitySignDate)}
                  {renderDescription(
                    'Số hiệu văn bằng',
                    formData?.universityInfor?.universityDegreeNumber,
                  )}
                  {renderDescription(
                    'Số vào sổ',
                    formData?.universityInfor?.universityRegistrationNumber,
                  )}
                  {renderDescription(
                    'Bậc tốt nghiệp',
                    getUniDegree(formData?.universityInfor?.universityGraduateDegree),
                  )}
                  {formData?.universityInfor?.universityDegree &&
                    renderDescription(
                      'File bằng tốt nghiệp',
                      <a
                        href={formData?.universityInfor?.universityDegree}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem/Tải xuống
                      </a>,
                    )}
                </Descriptions>
              </Panel>
            )}
            {isSDH && formData?.highStudyInfor?.highStudyUniversity != '' && (
              <>
                <Panel header="Thông tin Cao học" key="10">
                  <Descriptions
                    bordered
                    column={{ xs: 1, md: 2 }}
                    size="small"
                    labelStyle={{ backgroundColor: '#e6e6e6' }}
                  >
                    {renderDescription('Tên trường', formData?.highStudyInfor?.highStudyUniversity)}
                    {renderDescription(
                      'Loại bằng',
                      getHighStudyDegree(formData?.highStudyInfor?.highStudyDegree),
                    )}
                    {formData.highStudyInfor?.highStudyDegree != 1 && (
                      <>
                        {renderDescription(
                          'Ngành tốt nghệp',
                          formData?.highStudyInfor?.highStudyGraduateMajor,
                        )}
                        {renderDescription(
                          'Ngày ký',
                          formData?.highStudyInfor?.highStudyDate
                            ? moment(formData.highStudyInfor.highStudyDate).format('DD/MM/YYYY')
                            : '',
                        )}
                      </>
                    )}
                    {renderDescription(
                      'Chuyên ngành tốt nghiệp',
                      getAfterUniMajorNameByCode(formData?.highStudyInfor?.highStudyTrainingMajor),
                    )}
                    {formData?.highStudyInfor?.highStudyDegreeFile &&
                      renderDescription(
                        'File bằng tốt nghiệp',
                        <a
                          href={formData?.highStudyInfor?.highStudyDegreeFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyTranscript &&
                      renderDescription(
                        'File bảng điểm',
                        <a
                          href={formData?.highStudyInfor?.highStudyTranscript}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyApplication &&
                      renderDescription(
                        'File hồ sơ dự tuyển',
                        <a
                          href={formData?.highStudyInfor?.highStudyApplication}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyBackground &&
                      renderDescription(
                        'File lý lịch khoa học',
                        <a
                          href={formData?.highStudyInfor?.highStudyBackground}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyReseachExperience &&
                      renderDescription(
                        'File kinh nghiệm nghiên cứu',
                        <a
                          href={formData?.highStudyInfor?.highStudyReseachExperience}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyReseachProposal &&
                      renderDescription(
                        'File dự thảo đề án nghiên cứu',
                        <a
                          href={formData?.highStudyInfor?.highStudyReseachProposal}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyPlan &&
                      renderDescription(
                        'File kế hoạch học tập',
                        <a
                          href={formData?.highStudyInfor?.highStudyPlan}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyRecommendationLetter &&
                      renderDescription(
                        'File thư giới thiệu',
                        <a
                          href={formData?.highStudyInfor?.highStudyRecommendationLetter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                    {formData?.highStudyInfor?.highStudyLetterForStudy &&
                      renderDescription(
                        'File công văn cử đi học',
                        <a
                          href={formData?.highStudyInfor?.highStudyLetterForStudy}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>,
                      )}
                  </Descriptions>
                </Panel>
              </>
            )}
            <Panel header="Nguyện vọng đăng ký" key="6">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                {renderDescription(
                  'Nguyện vọng đăng ký',
                  isSDH
                    ? getAfterUniMajorNameByCode(Number(formData?.aspirationMajor))
                    : getMajorNameByCode(formData?.aspirationMajor) || 'Chưa có dữ liệu',
                )}

                {formData?.aspirationExamGroup != null &&
                  renderDescription(
                    'Tổ hợp môn',
                    getSubjectGroupNameByCodeAndMajorCode(
                      formData?.aspirationExamGroup,
                      Number(formData?.aspirationMajor),
                    ),
                  )}
                {formData?.aspirationAdmissionMethod != null &&
                  renderDescription(
                    'Phương thức xét tuyển',
                    getAdmissionMethodDisplayName(formData.aspirationAdmissionMethod),
                  )}
                {formData?.aspirationSubject1Score != null &&
                  renderDescription('Điểm môn 1', formData?.aspirationSubject1Score)}
                {formData?.aspirationSubject2Score != null &&
                  renderDescription('Điểm môn 2', formData?.aspirationSubject2Score)}
                {formData?.aspirationSubject3Score != null &&
                  renderDescription('Điểm môn 3', formData?.aspirationSubject3Score)}
              </Descriptions>
            </Panel>

            {formData?.englishCertificate?.englishCertificateName && (
              <Panel header="Thông tin Chứng chỉ Tiếng Anh" key="7">
                <Descriptions
                  bordered
                  column={{ xs: 1, md: 2 }}
                  size="small"
                  labelStyle={{ backgroundColor: '#e6e6e6' }}
                >
                  {renderDescription(
                    'Tên chứng chỉ',
                    formData?.englishCertificate?.englishCertificateName,
                  )}
                  {renderDescription(
                    'Ngày cấp',
                    formData?.englishCertificate?.englishCertificateDate,
                  )}
                  {formData?.englishCertificate?.englishCertificateListeningScore &&
                    renderDescription(
                      'Điểm Nghe',
                      formData?.englishCertificate?.englishCertificateListeningScore,
                    )}
                  {formData?.englishCertificate?.englishCertificateReadingScore &&
                    renderDescription(
                      'Điểm Đọc',
                      formData?.englishCertificate?.englishCertificateReadingScore,
                    )}
                  {formData?.englishCertificate?.englishCertificateWritingScore &&
                    renderDescription(
                      'Điểm Viết',
                      formData?.englishCertificate?.englishCertificateWritingScore,
                    )}
                  {formData?.englishCertificate?.englishCertificateSpeakingScore &&
                    renderDescription(
                      'Điểm Nói',
                      formData?.englishCertificate?.englishCertificateSpeakingScore,
                    )}
                  {renderDescription(
                    'Tổng điểm',
                    formData?.englishCertificate?.englishCertificateTotalScore,
                  )}
                  {renderDescription(
                    'Cấp độ',
                    formData?.englishCertificate?.englishCertificateLevel,
                  )}
                  {formData?.englishCertificate?.englishCertificateFilePath &&
                    renderDescription(
                      'File chứng chỉ',
                      <a
                        href={formData?.englishCertificate?.englishCertificateFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem/Tải xuống
                      </a>,
                    )}
                </Descriptions>
              </Panel>
            )}
            {formData?.franceCertificate?.franceCertificateName && (
              <Panel header="Thông tin Chứng chỉ Tiếng Pháp" key="8">
                <Descriptions
                  bordered
                  column={{ xs: 1, md: 2 }}
                  size="small"
                  labelStyle={{ backgroundColor: '#e6e6e6' }}
                >
                  {renderDescription(
                    'Tên chứng chỉ',
                    formData?.franceCertificate?.franceCertificateName,
                  )}
                  {renderDescription(
                    'Ngày cấp',
                    formData?.franceCertificate?.franceCertificateDate,
                  )}
                  {formData?.franceCertificate?.franceCertificateListeningScore &&
                    renderDescription(
                      'Điểm Nghe',
                      formData?.franceCertificate?.franceCertificateListeningScore,
                    )}
                  {formData?.franceCertificate?.franceCertificateReadingScore &&
                    renderDescription(
                      'Điểm Đọc',
                      formData?.franceCertificate?.franceCertificateReadingScore,
                    )}
                  {formData?.franceCertificate?.franceCertificateWritingScore &&
                    renderDescription(
                      'Điểm Viết',
                      formData?.franceCertificate?.franceCertificateWritingScore,
                    )}
                  {formData?.franceCertificate?.franceCertificateSpeakingScore &&
                    renderDescription(
                      'Điểm Nói',
                      formData?.franceCertificate?.franceCertificateSpeakingScore,
                    )}
                  {renderDescription(
                    'Tổng điểm',
                    formData?.franceCertificate?.franceCertificateTotalScore,
                  )}
                  {renderDescription('Cấp độ', formData?.franceCertificate?.franceCertificateLevel)}
                  {formData?.franceCertificate?.franceCertificateFilePath &&
                    renderDescription(
                      'File chứng chỉ',
                      <a
                        href={formData?.franceCertificate?.franceCertificateFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem/Tải xuống
                      </a>,
                    )}
                </Descriptions>
              </Panel>
            )}
            {formData?.japanCertificate?.japanCertificateName && (
              <Panel header="Thông tin Chứng chỉ Tiếng Nhật" key="9">
                <Descriptions
                  bordered
                  column={{ xs: 1, md: 2 }}
                  size="small"
                  labelStyle={{ backgroundColor: '#e6e6e6' }}
                >
                  {renderDescription(
                    'Tên chứng chỉ',
                    formData?.japanCertificate?.japanCertificateName,
                  )}
                  {renderDescription('Ngày cấp', formData?.japanCertificate?.japanCertificateDate)}
                  {renderDescription(
                    'Điểm Nghe',
                    formData?.japanCertificate?.japanCertificateListeningScore,
                  )}
                  {renderDescription(
                    'Điểm Đọc',
                    formData?.japanCertificate?.japanCertificateReadingScore,
                  )}
                  {renderDescription(
                    'Điểm Viết',
                    formData?.japanCertificate?.japanCertificateVocabularyScore,
                  )}
                  {renderDescription(
                    'Tổng điểm',
                    formData?.japanCertificate?.japanCertificateTotalScore,
                  )}
                  {renderDescription('Cấp độ', formData?.japanCertificate?.japanCertificateLevel)}
                  {formData?.japanCertificate?.japanCertificateFilePath &&
                    renderDescription(
                      'File chứng chỉ',
                      <a
                        href={formData?.japanCertificate?.japanCertificateFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem/Tải xuống
                      </a>,
                    )}
                </Descriptions>
              </Panel>
            )}
            {isSDH && (
              <>
                <Panel header="Minh chứng đóng lệ phí" key="11">
                  <Descriptions
                    bordered
                    column={{ xs: 1, md: 2 }}
                    size="small"
                    labelStyle={{ backgroundColor: '#e6e6e6' }}
                  >
                    {renderDescription(
                      'File minh chứng lệ phí',
                      <a href={formData?.feeFile} target="_blank" rel="noopener noreferrer">
                        Xem/Tải xuống
                      </a>,
                    )}
                  </Descriptions>
                </Panel>
              </>
            )}
          </Collapse>
        </Card>

        {currentStep === 0 && isHandler && (
          <div className={styles.buttonGroup}>
            <Button
              className={styles.btnTiepNhan}
              onClick={() => onStepClick(1)}
              loading={loadingStep === 1}
            >
              Tiếp nhận
            </Button>
          </div>
        )}

        {currentStep === 1 && !isRejected && isHandler && (
          <>
            {formData?.adminMess?.startsWith('[') && (
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HistoryOutlined className={styles.historyIcon} />
                    <Text style={{ color: '#faad14' }}>Lịch sử ghi chú</Text>
                  </div>
                }
                style={{
                  marginTop: 14,
                  borderRadius: 8,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                bodyStyle={{ paddingBottom: 0 }}
              >
                <Timeline>
                  {JSON.parse(formData.adminMess)
                    .reverse()
                    .map((item: string, idx: number) => {
                      const step = item.split('-');
                      const date = step[1];
                      const note = step.slice(2).join('-');

                      return (
                        <Timeline.Item color="orange" key={idx}>
                          <div>
                            <Text strong style={{ display: 'block' }}>
                              {date}
                            </Text>
                            <Text style={{ display: 'block', paddingLeft: 12 }}>{note}</Text>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                </Timeline>
              </Card>
            )}

            <div style={{ marginTop: 14 }}>
              <span className={styles.noteCardContainer}>
                <Checkbox
                  checked={showNote}
                  onChange={(e) => setShowNote(e.target.checked)}
                  style={{
                    position: 'relative',
                    top: '0.05rem',
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Thêm ghi chú
                </Checkbox>
              </span>

              {showNote && (
                <div className={styles.inputNoteContainer}>
                  <Input.TextArea
                    style={{
                      borderRadius: 8,
                      width: '100%',
                    }}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    placeholder="Nhập yêu cầu bổ sung/cập nhật thông tin..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <Button
                className={styles.btnTuChoi}
                onClick={() => onStepClick(3)}
                disabled={loadingStep !== null && loadingStep !== 3}
                loading={loadingStep === 3}
              >
                Từ chối
              </Button>

              <Button
                className={styles.btnEdit}
                onClick={() => onStepClick(2)}
                disabled={loadingStep !== null && loadingStep !== 2}
                loading={loadingStep === 2}
              >
                Yêu cầu cập nhật
              </Button>

              <Button
                className={styles.btnChapNhan}
                onClick={() => onStepClick(4)}
                disabled={loadingStep !== null && loadingStep !== 4}
                loading={loadingStep === 4}
              >
                Chấp nhận
              </Button>
            </div>
          </>
        )}

        {currentStep === 2 && isRejected && (
          <Card
            title={
              <>
                <CloseCircleOutlined className={styles.TCIcon} />
                <Text style={{ color: '#ff4d4f' }}>Hồ sơ đã bị từ chối</Text>
              </>
            }
            style={{
              marginTop: 14,
              background: '#fff1f0',
              border: '1px solid #ff4d4f',
              borderRadius: 8,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            bodyStyle={{ paddingBottom: 0 }}
          >
            {formData?.adminMess?.startsWith('[') && (
              <Timeline>
                {JSON.parse(formData.adminMess)
                  .reverse()
                  .map((item: string, idx: number) => {
                    const step = item.split('-');
                    const date = step[1];
                    const note = step.slice(2).join('-');

                    return (
                      <Timeline.Item color="red" key={idx}>
                        <div>
                          <Text strong style={{ display: 'block' }}>
                            {date}
                          </Text>
                          <Text style={{ display: 'block', paddingLeft: 12 }}>{note}</Text>
                        </div>
                      </Timeline.Item>
                    );
                  })}
              </Timeline>
            )}
          </Card>
        )}

        {currentStep === 2 && !isRejected && actualStep !== 5 && isHandler && (
          <>
            <div style={{ marginTop: 14 }}>
              <span className={styles.noteCardContainer}>
                <Checkbox
                  checked={showNote}
                  onChange={(e) => setShowNote(e.target.checked)}
                  style={{
                    position: 'relative',
                    top: '0.05rem',
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Thêm ghi chú
                </Checkbox>
              </span>

              {showNote && (
                <div className={styles.inputNoteContainer}>
                  <Input.TextArea
                    style={{
                      borderRadius: 8,
                      width: '100%',
                    }}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    placeholder="Nhập yêu cầu bổ sung/cập nhật thông tin..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <Button
                className={styles.btnPheDuyet}
                onClick={() => onStepClick(5)}
                loading={loadingStep === 5}
              >
                Phê duyệt
              </Button>
            </div>
          </>
        )}
      </>
      {currentStep === 2 && actualStep === 5 && (
        <Card
          title={
            <>
              <CheckCircleOutlined className={styles.PDIcon} />
              <Text style={{ color: '#52c41a' }}>Hồ sơ đã được phê duyệt</Text>
            </>
          }
          style={{
            marginTop: 14,
            background: '#f6ffed',
            border: '1px solid #52c41a',
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          bodyStyle={{ paddingBottom: 0 }}
        >
          {formData?.adminMess?.startsWith('[') ? (
            <Timeline>
              {JSON.parse(formData.adminMess)
                .reverse()
                .map((item: string, idx: number) => {
                  const step = item.split('-');
                  const date = step[1];
                  const note = step.slice(2).join('-');

                  return (
                    <Timeline.Item color="green" key={idx}>
                      <div>
                        <Text strong style={{ display: 'block' }}>
                          {date}
                        </Text>
                        <Text style={{ display: 'block', paddingLeft: 12 }}>{note}</Text>
                      </div>
                    </Timeline.Item>
                  );
                })}
            </Timeline>
          ) : (
            <Text type="secondary">{formData.adminMess}</Text>
          )}
        </Card>
      )}
    </>
  );
};

export default EnrollmentDetail;
