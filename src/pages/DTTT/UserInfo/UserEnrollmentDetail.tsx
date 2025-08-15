import React, { useEffect, useState } from 'react';
import {
  Steps,
  Card,
  Typography,
  Button,
  Collapse,
  Descriptions,
  Input,
  Form,
  Select,
  DatePicker,
  Upload,
  Spin,
  Timeline,
} from 'antd';
import {
  InfoCircleOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  CaretDownOutlined,
  BellOutlined,
  PlusCircleOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import { CustomMessageError, CustomMessageSuccess } from '@/components/CustomMessage/CustomMessage';
import { getEnrollmentForm, AdminEnrollManagementDto, MajorData } from '@/services/enroll';
import { getProvinceNameByCode, ProvinceNameData } from '@/services/user';
import { ProvinceData } from '@/services/enroll';
import { history, useParams } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import NoFoundPage from '@/pages/404';
import moment from 'moment';
import styles from './UserInfo.less';
import request from '@/utils/request';
import api from '@/apiEndpoint/index';
import type { UploadFile } from 'antd/es/upload/interface';
import merge from 'lodash/merge';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const endpoint = api.UMI_API_BASE_URL;

const { Text } = Typography;
const { Panel } = Collapse;

const UserEnrollmentDetail: React.FC = () => {
  const { enrollmentCode }: any = useParams();
  const [isLoadingFormData, setIsLoadingFormData] = useState(true);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [formData, setFormData] = useState<AdminEnrollManagementDto | null>(null);
  const [userProvinceInfo, setUserProvinceInfo] = useState<any>(null);
  const [majorData, setMajorData] = useState<MajorData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<string | undefined>(formData?.aspirationMajor);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | undefined>(
    formData?.highSchoolInfor?.highSchoolProvince,
  );
  const [universityDegreeFileList, setUniversityDegreeFileList] = useState<any[]>([]);
  const [englishCertificateFileList, setEnglishCertificateFileList] = useState<any[]>([]);
  const [franceCertificateFileList, setFranceCertificateFileList] = useState<any[]>([]);
  const [japanCertificateFileList, setJapanCertificateFileList] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [highStudyDegreeFileList, setHighStudyDegreeFileList] = useState<any[]>([]);
  const [highStudyTranscriptFileList, setHighStudyTranscriptFileList] = useState<any[]>([]);
  const [highStudyApplicationFileList, setHighStudyApplicationFileList] = useState<any[]>([]);
  const [highStudyBackgroundFileList, setHighStudyBackgroundFileList] = useState<any[]>([]);
  const [highStudyReseachProposalFileList, setHighStudyReseachProposalFileList] = useState<any[]>(
    [],
  );
  const [highStudyReseachExperienceFileList, setHighStudyReseachExperienceFileList] = useState<
    any[]
  >([]);
  const [highStudyRecommendationLetterFileList, setHighStudyRecommendationLetterFileList] =
    useState<any[]>([]);
  const [highStudyLetterForStudyFileList, setHighStudyLetterForStudyFileList] = useState<any[]>([]);
  const [highStudyPlan, setHighStudyPlan] = useState<any[]>([]);
  const [afterUniMajors, setAfterUniMajors] = useState<any[]>([]);
  const userToken = window.localStorage.getItem('token');

  const [form] = Form.useForm();

  const toggleEdit = () => {
    setIsEditing(true);
  };

  const toggleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (enrollmentCode) {
      fetchEnrollmentFormData();
      fetchAllMajorFromLocalJson();
      fetchAllProvincesFromLocalJson();
      fetchAfterUniMajors();
    }
  }, [enrollmentCode]);

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const msg = args[0]?.toString?.() ?? '';
      if (
        typeof msg === 'string' &&
        msg.includes('[antd: Form.Item] `defaultValue` will not work on controlled Field')
      ) {
        return;
      }
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

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
      fetchEnrollmentFormData();
    });

    return () => {
      connection.off('enrollmentDetailDataChanged');
      connection.stop();
    };
  }, []);

  const buildFileFromUrl = (url: string | undefined | null): UploadFile[] => {
    if (!url) return [];
    const name = url.split('/').pop() || 'uploaded-file.pdf';
    return [
      {
        uid: '-1',
        name,
        status: 'done',
        url,
      },
    ];
  };

  const fetchEnrollmentFormData = async () => {
    try {
      const response = await getEnrollmentForm(enrollmentCode);
      if (response?.data) {
        setFormData((prev): any => merge({}, prev, response.data));
        setUniversityDegreeFileList(
          buildFileFromUrl(response.data?.universityInfor?.universityDegree),
        );
        setJapanCertificateFileList(
          buildFileFromUrl(response.data?.japanCertificate?.japanCertificateFilePath),
        );
        setFranceCertificateFileList(
          buildFileFromUrl(response.data?.franceCertificate?.franceCertificateFilePath),
        );
        setEnglishCertificateFileList(
          buildFileFromUrl(response.data?.englishCertificate?.englishCertificateFilePath),
        );
        setHighStudyDegreeFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyDegreeFile),
        );
        setHighStudyTranscriptFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyTranscript),
        );
        setHighStudyApplicationFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyApplication),
        );
        setHighStudyBackgroundFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyBackground),
        );
        setHighStudyReseachProposalFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyReseachProposal),
        );
        setHighStudyReseachExperienceFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyReseachExperience),
        );
        setHighStudyRecommendationLetterFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyRecommendationLetter),
        );
        setHighStudyLetterForStudyFileList(
          buildFileFromUrl(response.data?.highStudyInfor?.highStudyLetterForStudy),
        );
        setHighStudyPlan(buildFileFromUrl(response.data?.highStudyInfor?.highStudyPlan));
        await getUserProvinceInfo(response.data);
      }
    } catch (err) {
      CustomMessageError({ content: 'Lỗi khi tải dữ liệu!' });
    } finally {
      setIsLoadingFormData(false);
    }
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
            //form.setFieldsValue(updateObject);
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

  const normalizeFormValues = (values: any) => {
    const normalized = {
      ...values,
      contactInfor: {
        ...values.contactInfor,
        studentContactAddress: formData?.contactInfor?.studentContactAddress,
        studentContactProvince: formData?.contactInfor?.studentContactProvince,
        studentContactWard: formData?.contactInfor?.studentContactWard,
        studentFullContactAddress: formData?.contactInfor?.studentFullContactAddress,
      },
      englishCertificate: {
        ...values.englishCertificate,
        englishCertificateListeningScore:
          values.englishCertificate?.englishCertificateListeningScore || 0,
        englishCertificateReadingScore:
          values.englishCertificate?.englishCertificateReadingScore || 0,
        englishCertificateWritingScore:
          values.englishCertificate?.englishCertificateWritingScore || 0,
        englishCertificateSpeakingScore:
          values.englishCertificate?.englishCertificateSpeakingScore || 0,
      },
      franceCertificate: {
        ...values.franceCertificate,
        franceCertificateListeningScore:
          values.franceCertificate?.franceCertificateListeningScore || 0,
        franceCertificateReadingScore: values.franceCertificate?.franceCertificateReadingScore || 0,
        franceCertificateWritingScore: values.franceCertificate?.franceCertificateWritingScore || 0,
        franceCertificateSpeakingScore:
          values.franceCertificate?.franceCertificateSpeakingScore || 0,
      },
    };

    if (normalized.universityInfor?.universitySignDate?._isAMomentObject) {
      normalized.universityInfor.universitySignDate = moment(
        normalized.universityInfor.universitySignDate,
      ).format('DD/MM/YYYY');
    }

    if (normalized.englishCertificate?.englishCertificateDate?._isAMomentObject) {
      normalized.englishCertificate.englishCertificateDate = moment(
        normalized.englishCertificate.englishCertificateDate,
      ).format('DD/MM/YYYY');
    }

    if (normalized.franceCertificate?.franceCertificateDate?._isAMomentObject) {
      normalized.franceCertificate.franceCertificateDate = moment(
        normalized.franceCertificate.franceCertificateDate,
      ).format('DD/MM/YYYY');
    }

    if (normalized.japanCertificate?.japanCertificateDate?._isAMomentObject) {
      normalized.japanCertificate.japanCertificateDate = moment(
        normalized.japanCertificate.japanCertificateDate,
      ).format('DD/MM/YYYY');
    }

    if (normalized.highStudyInfor?.highStudyDate?._isAMomentObject) {
      normalized.highStudyInfor.highStudyDate = moment(
        normalized.highStudyInfor.highStudyDate,
      ).format('DD/MM/YYY');
    }

    return normalized;
  };

  const submitEnrollmentByType = async (
    enrollmentCode: string,
    formValues: AdminEnrollManagementDto,
  ) => {
    const codeType = enrollmentCode?.split('-')[1]?.toLowerCase();
    const { enrollmentCode: _ignored, ...rest } = formValues;

    try {
      let url = '';

      switch (codeType) {
        case 'vb2':
          url = `${endpoint}/api/enrollment/vanbang2/update`;
          break;
        case 'dh':
          url = `${endpoint}/api/enrollment/daihoc/update`;
          break;
        case 'lt':
          url = `${endpoint}/api/enrollment/lienthong/update`;
          break;
        case 'm':
          url = `${endpoint}/api/enrollment/saudaihoc/update`;
          break;
        case 'p':
          url = `${endpoint}/api/enrollment/saudaihoc/update`;
          break;
        case 'r':
          url = `${endpoint}/api/enrollment/saudaihoc/update`;
          break;
        default:
          throw new Error(`Loại hồ sơ không hỗ trợ: ${codeType}`);
      }

      await request(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          enrollmentCode,
          ...rest,
        },
      });

      CustomMessageSuccess({ content: 'Cập nhật hồ sơ thành công!' });
    } catch (error: any) {
      CustomMessageError({ content: 'Lỗi khi cập nhật hồ sơ!' });
    }
  };

  const onFinish = async (values: AdminEnrollManagementDto) => {
    setIsLoadingSave(true);
    const normalizedValues = normalizeFormValues(values);

    try {
      await submitEnrollmentByType(enrollmentCode, normalizedValues);
      setFormData((prev) => merge({}, prev, normalizedValues));
      setIsEditing(false);
    } catch (error) {
      return;
    } finally {
      setIsLoadingSave(false);
    }
  };

  const fetchAllMajorFromLocalJson = async () => {
    try {
      const response = await fetch('/dataMajor.json');
      if (!response.ok) {
        throw new Error(`Lỗi khi tải file: ${response.status}`);
      }

      const data: MajorData[] = await response.json();
      setMajorData(data);
    } catch (error) {
      return;
    }
  };

  const fetchAfterUniMajors = async () => {
    try {
      const res = await fetch('/after_uni_major.json');
      if (!res.ok) throw new Error('Failed to load JSON');
      const data = await res.json();
      setAfterUniMajors(data);
    } catch (error) {
      return;
    }
  };

  const fetchAllProvincesFromLocalJson = async () => {
    try {
      const response = await fetch('/cities_and_wards.json');
      if (!response.ok) {
        throw new Error(`Lỗi khi tải file: ${response.status}`);
      }

      const data: ProvinceData[] = await response.json();
      setProvinces(data);
    } catch (error) {
      return;
    }
  };

  const getUserProvinceInfo = async (currentUserData: AdminEnrollManagementDto) => {
    try {
      const provinceCode = currentUserData?.highSchoolInfor?.highSchoolProvince;
      const wardCode = currentUserData?.highSchoolInfor?.highSchoolWard;

      if (!provinceCode) {
        setUserProvinceInfo(null);
        return;
      }

      const userProvinceInfoResponse: ProvinceNameData = await getProvinceNameByCode(
        provinceCode,
        wardCode,
      );
      if (
        userProvinceInfoResponse &&
        userProvinceInfoResponse?.code === 200 &&
        userProvinceInfoResponse?.data
      ) {
        setUserProvinceInfo(userProvinceInfoResponse.data);
      } else {
        setUserProvinceInfo(null);
      }
    } catch (err: any) {
      setUserProvinceInfo(null);
    }
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

  const getMajorNameByCode = (code: number | undefined | null): string | undefined => {
    if (code == null) {
      return undefined;
    }
    const foundMajor = majorData.find((item) => item.code === code);
    return foundMajor ? foundMajor.name : String(code);
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

  const renderEditableField = (name: any, value: any, onChange: (val: string) => void) => {
    const getValidationRules = (name: any) => {
      const key = Array.isArray(name) ? name.join('.') : name;

      switch (key) {
        case 'highSchoolInfor.highSchool':
          return [{ required: true, message: 'Vui lòng nhập Trường THPT' }];
        case 'highSchoolInfor.highSchoolGraduationYear':
          return [{ required: true, message: 'Vui lòng nhập Năm tốt nghiệp THPT' }];
        case 'universityInfor.universityName':
          return [{ required: true, message: 'Vui lòng nhập Tên trường' }];
        case 'universityInfor.universityMajor':
          return [{ required: true, message: 'Vui lòng nhập Ngành tốt nghiệp' }];
        case 'universityInfor.universityGpa':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) {
                  return Promise.reject('Vui lòng nhập ĐTB tích lũy');
                }
                const pattern = /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/;
                if (!pattern.test(value)) {
                  return Promise.reject('Điểm phải từ 0 đến 10 và tối đa 2 chữ số thập phân');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'universityInfor.universityGraduationYear':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) {
                  return Promise.reject('Vui lòng nhập Năm tốt nghiệp');
                }
                if (!/^\d{4}$/.test(value)) {
                  return Promise.reject('Chỉ được nhập năm có 4 chữ số');
                }
                const year = parseInt(value, 10);
                const currentYear = new Date().getFullYear();
                if (year < 1900 || year > currentYear) {
                  return Promise.reject(`Năm tốt nghiệp phải từ 1900 đến ${currentYear}`);
                }
                return Promise.resolve();
              },
            },
          ];
        case 'universityInfor.universityTrainingMode':
          return [{ required: true, message: 'Vui lòng nhập Hình thức đào tạo' }];
        case 'universityInfor.universityDegreeNumber':
          return [{ required: true, message: 'Vui lòng nhập Số hiệu văn bằng' }];
        case 'universityInfor.universityRegistrationNumber':
          return [{ required: true, message: 'Vui lòng nhập Số vào sổ' }];
        case 'contactInfor.fatherName':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.resolve();
                const pattern = /^[a-zA-ZÀ-ỹ\s]+$/;
                if (!pattern.test(value)) {
                  return Promise.reject('Chỉ được nhập chữ cái');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'contactInfor.fatherOccupation':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.resolve();
                const pattern = /^[a-zA-ZÀ-ỹ\s]+$/;
                if (!pattern.test(value)) {
                  return Promise.reject('Chỉ được nhập chữ cái');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'contactInfor.fatherPhone':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.resolve();
                if (!/^\d+$/.test(value)) {
                  return Promise.reject('Chỉ được nhập số');
                }
                if (value.length !== 10) {
                  return Promise.reject('Số điện thoại phải đủ 10 chữ số');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'contactInfor.motherName':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.resolve();
                const pattern = /^[a-zA-ZÀ-ỹ\s]+$/;
                if (!pattern.test(value)) {
                  return Promise.reject('Chỉ được nhập chữ cái');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'contactInfor.motherOccupation':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.resolve();
                const pattern = /^[a-zA-ZÀ-ỹ\s]+$/;
                if (!pattern.test(value)) {
                  return Promise.reject('Chỉ được nhập chữ cái');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'contactInfor.motherPhone':
          return [
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.resolve();
                if (!/^\d+$/.test(value)) {
                  return Promise.reject('Chỉ được nhập số');
                }
                if (value.length !== 10) {
                  return Promise.reject('Số điện thoại phải đủ 10 chữ số');
                }
                return Promise.resolve();
              },
            },
          ];
        case 'aspirationSubject1Score':
          return [
            { required: true, message: 'Vui lòng nhập Điểm môn 1' },
            {
              pattern: /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/,
              message: 'Điểm phải từ 0 đến 10 và tối đa 2 chữ số thập phân',
            },
          ];
        case 'aspirationSubject2Score':
          return [
            { required: true, message: 'Vui lòng nhập Điểm môn 2' },
            {
              pattern: /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/,
              message: 'Điểm phải từ 0 đến 10 và tối đa 2 chữ số thập phân',
            },
          ];
        case 'aspirationSubject3Score':
          return [
            { required: true, message: 'Vui lòng nhập Điểm môn 3' },
            {
              pattern: /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/,
              message: 'Điểm phải từ 0 đến 10 và tối đa 2 chữ số thập phân',
            },
          ];
        case 'englishCertificate.englishCertificateListeningScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'englishCertificate.englishCertificateReadingScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'englishCertificate.englishCertificateWritingScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'englishCertificate.englishCertificateSpeakingScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'englishCertificate.englishCertificateTotalScore':
          return [
            {
              required: true,
              message: 'Vui lòng nhập Tổng điểm chứng chỉ tiếng Anh',
            },
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'franceCertificate.franceCertificateListeningScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'franceCertificate.franceCertificateReadingScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'franceCertificate.franceCertificateWritingScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'franceCertificate.franceCertificateSpeakingScore':
          return [
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'franceCertificate.franceCertificateTotalScore':
          return [
            {
              required: true,
              message: 'Vui lòng nhập Tổng điểm chứng chỉ tiếng Pháp',
            },
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'japanCertificate.japanCertificateListeningScore':
          return [
            {
              required: true,
              message: 'Vui lòng nhập Điểm nghe hiểu tiếng Nhật',
            },
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'japanCertificate.japanCertificateReadingScore':
          return [
            {
              required: true,
              message: 'Vui lòng nhập Điểm đọc hiểu tiếng Nhật',
            },
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'japanCertificate.japanCertificateVocabularyScore':
          return [
            {
              required: true,
              message: 'Vui lòng nhập Điểm từ vựng tiếng Nhật',
            },
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        case 'japanCertificate.japanCertificateTotalScore':
          return [
            {
              required: true,
              message: 'Vui lòng nhập Tổng điểm chứng chỉ tiếng Nhật',
            },
            {
              pattern: /^(?:\d{1,3})(?:\.\d+)?$/,
              message: 'Chỉ được nhập số nhỏ hơn 1000 và có thể là số thập phân',
            },
          ];
        default:
          return [];
      }
    };

    const isDisabled =
      (Array.isArray(name) ? name.join('.') : name) === 'universityInfor.universityGraduateDegree';

    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        initialValue={value}
        rules={getValidationRules(name)}
      >
        <Input disabled={isDisabled} style={{ borderRadius: '8px' }} />
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );
  };

  const renderEditableSelectMajor1 = (name: any, value: any, onChange: (val: string) => void) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }}>
        <Select
          defaultValue={value}
          showSearch
          placeholder="Chọn Ngành"
          value={value}
          onChange={(val) => {
            setSelectedMajor(val);
            onChange(val);
            form.setFieldsValue({ aspirationExamGroup: undefined });
          }}
          options={majorData.map((major) => ({
            label: major.name,
            value: major.code,
          }))}
          filterOption={(input: any, option: any) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectMajor2 = (name: any, value: any, onChange: (val: string) => void) => {
    const selected = majorData.find((major: any) => major.code === selectedMajor);
    const examGroupOptions = selected?.subjectGroup || [];

    return isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select
          showSearch
          placeholder="Chọn Tổ hợp môn"
          disabled={!selectedMajor}
          value={value}
          onChange={(val) => onChange(val)}
          options={examGroupOptions.map((group) => ({
            label: group.name,
            value: group.code,
          }))}
          filterOption={(input: any, option: any) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
        />
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );
  };

  const renderEditableSelectTHPTProvince = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0, minWidth: 200 }}
        initialValue={formData?.highSchoolInfor?.highSchoolProvince}
      >
        <Select
          showSearch
          placeholder="Chọn Tỉnh/TP THPT"
          value={value}
          onChange={(val) => {
            setSelectedProvinceCode(val);
            onChange(val);
            form.setFieldsValue({
              highSchoolInfor: {
                highSchoolProvince: val,
                highSchoolWard: undefined,
              },
            });
          }}
          options={provinces.map((province) => ({
            label: province.name,
            value: province.code,
          }))}
          filterOption={(input: any, option: any) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectTHPTWard = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) => {
    const provinceCodeToUse = selectedProvinceCode || formData?.highSchoolInfor?.highSchoolProvince;
    const selectedProvince = provinces.find((p) => p.code === provinceCodeToUse);
    const wardOptions = selectedProvince?.wards || [];

    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0, minWidth: 200 }}
        initialValue={formData?.highSchoolInfor?.highSchoolWard}
      >
        <Select
          showSearch
          placeholder="Chọn Phường/Xã THPT"
          value={value}
          onChange={(val) =>
            form.setFieldsValue({
              highSchoolInfor: {
                highSchoolWard: val,
              },
            })
          }
          disabled={!selectedProvinceCode}
          options={wardOptions.map((ward) => ({
            label: ward.name,
            value: ward.code,
          }))}
          filterOption={(input: any, option: any) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
        />
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );
  };

  const renderEditableSelectHS = (name: any, value: any, onChange: (val: string) => void) => {
    return isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select style={{ borderRadius: 8 }}>
          <Select.Option value="hs4">Hệ số 4</Select.Option>
          <Select.Option value="hs10">Hệ số 10</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );
  };

  const renderEditableSelectHL = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="Gioi">Giỏi</Select.Option>
          <Select.Option value="Kha">Khá</Select.Option>
          <Select.Option value="TB">Trung Bình</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectHK = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="Tot">Tốt</Select.Option>
          <Select.Option value="Kha">Khá</Select.Option>
          <Select.Option value="TB">Trung Bình</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectEnglishTD = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="A1">A1</Select.Option>
          <Select.Option value="A2">A2</Select.Option>
          <Select.Option value="B1">B1</Select.Option>
          <Select.Option value="B2">B2</Select.Option>
          <Select.Option value="C1">C1</Select.Option>
          <Select.Option value="C2">C2</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectFranceTD = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="A1">A1</Select.Option>
          <Select.Option value="A2">A2</Select.Option>
          <Select.Option value="B1">B1</Select.Option>
          <Select.Option value="B2">B2</Select.Option>
          <Select.Option value="C1">C1</Select.Option>
          <Select.Option value="C2">C2</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectJapanTD = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="N5">N5</Select.Option>
          <Select.Option value="N4">N4</Select.Option>
          <Select.Option value="N3">N3</Select.Option>
          <Select.Option value="N2">N2</Select.Option>
          <Select.Option value="N1">N1</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectEnglishCC = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="IELTS">IELTS</Select.Option>
          <Select.Option value="TOEFL">TOEFL</Select.Option>
          <Select.Option value="TOEIC">TOEIC</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectFranceCC = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="DELF">DELF</Select.Option>
          <Select.Option value="DALF">DALF</Select.Option>
          <Select.Option value="TCF">TCF</Select.Option>
          <Select.Option value="TEF">TEF</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableSelectJapanCC = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="JLPT">JLPT</Select.Option>
          <Select.Option value="JTEST">JTEST</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const getHighStudyDegreeName = (type: number | undefined): string => {
    if (!type) return '';
    switch (type) {
      case 1:
        return 'Thạc sĩ';
      case 2:
        return 'Cử nhân loại Giỏi';
      default:
        return 'Không xác định';
    }
  };

  const getAfterUniMajorNameByCode = (code: number | undefined | null): string => {
    if (code == null) return '';
    const found = afterUniMajors.find((item) => item.code === code);
    return found ? found.name : String(code);
  };

  const renderEditableSelectAfterUniMajor = (
    name: any,
    value: number | undefined,
    onChange: (val: number) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select
          showSearch
          placeholder="Chọn chuyên ngành"
          value={value}
          onChange={onChange}
          options={afterUniMajors.map((major) => ({
            label: major.name,
            value: major.code,
          }))}
          filterOption={(input, option) =>
            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    ) : (
      <Text strong>{getAfterUniMajorNameByCode(value)}</Text>
    );

  const renderEditableSelectPT = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) =>
    isEditing ? (
      <Form.Item name={name} style={{ marginBottom: 0, minWidth: 200 }} initialValue={value}>
        <Select>
          <Select.Option value="HocBa">Học Bạ</Select.Option>
          <Select.Option value="THPTQG">Kết quả thi THPT Quốc gia</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );

  const renderEditableDatePickerSignDate = (
    name: any,
    value: string | undefined,
    onChange: (val: string) => void,
  ) => {
    const parsedDate = value ? moment(value, 'DD/MM/YYYY') : undefined;
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        initialValue={parsedDate?.isValid() ? parsedDate : undefined}
      >
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          placeholder="Chọn Ngày"
          allowClear={false}
        />
      </Form.Item>
    ) : (
      <Text strong>{value}</Text>
    );
  };

  const renderEditableUploadDegree = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={universityDegreeFileList}
          onChange={onUploadChange(name, setUniversityDegreeFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadEngCer = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={englishCertificateFileList}
          onChange={onUploadChange(name, setEnglishCertificateFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadFraCer = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={franceCertificateFileList}
          onChange={onUploadChange(name, setFranceCertificateFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadJapCer = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={japanCertificateFileList}
          onChange={onUploadChange(name, setJapanCertificateFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSDegree = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyDegreeFileList}
          onChange={onUploadChange(name, setHighStudyDegreeFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSTrans = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyTranscriptFileList}
          onChange={onUploadChange(name, setHighStudyTranscriptFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSApp = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyApplicationFileList}
          onChange={onUploadChange(name, setHighStudyApplicationFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSBack = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyBackgroundFileList}
          onChange={onUploadChange(name, setHighStudyBackgroundFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSPropo = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyReseachProposalFileList}
          onChange={onUploadChange(name, setHighStudyReseachProposalFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSExp = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyReseachExperienceFileList}
          onChange={onUploadChange(name, setHighStudyReseachExperienceFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSRec = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyRecommendationLetterFileList}
          onChange={onUploadChange(name, setHighStudyRecommendationLetterFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSLetter = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyLetterForStudyFileList}
          onChange={onUploadChange(name, setHighStudyLetterForStudyFileList)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
  };

  const renderEditableUploadHSPlan = (name: any, value: any, onChange: (val: any) => void) => {
    return isEditing ? (
      <Form.Item
        name={name}
        style={{ marginBottom: 0 }}
        getValueFromEvent={(e) => {
          const file = e?.fileList?.[0];
          if (file?.response?.url) {
            return file.response.url;
          }
          if (file?.url) {
            const relativePath = file.url.replace(endpoint, '');
            return relativePath;
          }
          return '';
        }}
      >
        <Upload
          name="file"
          action={`${endpoint}/api/upload/file`}
          maxCount={1}
          accept=".pdf"
          listType="text"
          beforeUpload={beforeUploadFile}
          fileList={highStudyPlan}
          onChange={onUploadChange(name, setHighStudyPlan)}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
      </Form.Item>
    ) : (
      <Text strong>ok</Text>
    );
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
        return '';
    }
  };

  let isDaiHoc = false;
  if (formData && formData?.enrollmentCode) {
    const codeParts = formData?.enrollmentCode.split('-');
    if (codeParts.length > 1 && codeParts[1].toUpperCase() === 'DH') {
      isDaiHoc = true;
    }
  }

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

  if (isLoadingFormData) {
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
    <Form form={form} onFinish={onFinish}>
      <div style={{ marginBottom: 20 }}>
        <ArrowLeftOutlined
          onClick={() => history.push('/thongtin-canhan')}
          style={{ fontSize: '20px' }}
        />
        <Text className={styles.enrollmentCodeHeader}>Hồ sơ {enrollmentCode}</Text>
      </div>
      <div className={styles.stepCard}>
        <Steps
          current={
            formData?.step == null
              ? -1
              : formData.step === 3
              ? 3
              : formData.step === 4
              ? 2
              : formData.step - 1
          }
          items={[
            { title: 'Tiếp nhận hồ sơ' },
            { title: 'Xử lý hồ sơ' },
            { title: 'Kết quả hồ sơ' },
          ]}
        ></Steps>
      </div>
      {formData?.adminMess && (
        <Card
          title={
            <div className={styles.cardTitle1}>
              <BellOutlined style={{ color: '#f98c5d', marginRight: 8 }} />
              <Text style={{ color: '#f98c5d' }}>Thông báo từ Người xử lý</Text>
            </div>
          }
          className={styles.cardStyle}
          style={{ border: '1px solid #f98c5d' }}
          bodyStyle={{ paddingBottom: 0 }}
        >
          <Timeline>
            {JSON.parse(formData.adminMess || '[]')
              .reverse()
              .map((item: string, idx: number) => {
                const parts = item.split('-');
                const step = Number(parts[0]);
                const date = parts[1];
                const note = parts.slice(2).join('-');

                let dotIcon;
                let dotColor = 'orange';

                switch (step) {
                  case 1:
                    dotIcon = <PlusCircleOutlined style={{ fontSize: 16, color: '#1890ff' }} />;
                    break;
                  case 2:
                    dotIcon = <ClockCircleOutlined style={{ fontSize: 16, color: '#faad14' }} />;
                    break;
                  case 3:
                    dotIcon = <CloseCircleOutlined style={{ fontSize: 16, color: '#ff4d4f' }} />;
                    break;
                  case 4:
                    dotIcon = <IssuesCloseOutlined style={{ fontSize: 16, color: '#389e0d' }} />;
                    dotColor = '#389e0d';
                    break;
                  case 5:
                    dotIcon = <CheckCircleOutlined style={{ fontSize: 16, color: '#237804' }} />;
                    dotColor = '#237804';
                    break;
                  default:
                    dotIcon = <PlusCircleOutlined style={{ fontSize: 16, color: '#1890ff' }} />;
                }

                return (
                  <Timeline.Item dot={dotIcon} color={dotColor} key={idx}>
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
      <Card
        title={
          <div className={styles.cardTitle2}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <InfoCircleOutlined className={styles.infoIcon} />
              <Text style={{ color: '#1890ff' }}>Thông tin chi tiết hồ sơ </Text>
            </div>
            <Text
              className={styles.statusText}
              style={{
                background:
                  formData?.step === 0
                    ? '#f5f5f5'
                    : formData?.step === 1
                    ? '#e6f7ff'
                    : formData?.step === 2
                    ? '#fff7e6'
                    : formData?.step === 3
                    ? '#fff1f0'
                    : formData?.step === 4
                    ? '#f6ffed'
                    : formData?.step === 5
                    ? '#d9f7be'
                    : '#ffffff',
                border:
                  formData?.step === 0
                    ? '1px solid #d9d9d9'
                    : formData?.step === 1
                    ? '1px solid #91d5ff'
                    : formData?.step === 2
                    ? '1px solid #ffd591'
                    : formData?.step === 3
                    ? '1px solid #ffa39e'
                    : formData?.step === 4
                    ? '1px solid #b7eb8f'
                    : formData?.step === 5
                    ? '1px solid #73d13d'
                    : '1px solid #d9d9d9',
                color:
                  formData?.step === 0
                    ? '#595959'
                    : formData?.step === 1
                    ? '#096dd9'
                    : formData?.step === 2
                    ? '#d46b08'
                    : formData?.step === 3
                    ? '#cf1322'
                    : formData?.step === 4
                    ? '#389e0d'
                    : formData?.step === 5
                    ? '#237804'
                    : '#000000',
              }}
            >
              {formData?.step === 0 ? (
                <QuestionCircleOutlined className={styles.statusHS} />
              ) : formData?.step === 1 ? (
                <PlusCircleOutlined className={styles.statusHS} />
              ) : formData?.step === 2 ? (
                <ClockCircleOutlined className={styles.statusHS} />
              ) : formData?.step === 3 ? (
                <CloseCircleOutlined className={styles.statusHS} />
              ) : formData?.step === 4 ? (
                <IssuesCloseOutlined className={styles.statusHS} />
              ) : formData?.step === 5 ? (
                <CheckCircleOutlined className={styles.statusHS} />
              ) : null}
              {formData?.step === 0
                ? 'Hồ sơ chưa được tiếp nhận'
                : formData?.step === 1
                ? 'Hồ sơ đã được tiếp nhận'
                : formData?.step === 2
                ? 'Yêu cầu cập nhật'
                : formData?.step === 3
                ? 'Hồ sơ đã bị từ chối'
                : formData?.step === 4
                ? 'Hồ sơ đã được chấp nhận'
                : formData?.step === 5
                ? 'Hồ sơ đã được phê duyệt'
                : '-'}
            </Text>
          </div>
        }
        className={styles.cardStyle}
      >
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
              <Descriptions.Item label="Mã hồ sơ">
                <Text strong>{formData?.enrollmentCode}</Text>{' '}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày nộp">
                <Text strong>
                  {formData?.regisDate && !isNaN(new Date(formData.regisDate).getTime())
                    ? new Date(formData.regisDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : 'Không xác định'}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ đào tạo">
                <Text strong>{getTrainingSystemDisplayName(formData?.trainingSystemType)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Chương trình đào tạo">
                <Text strong>{getProgramName(formData?.enrollmentCode)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Panel>

          {!isSDH && (
            <Panel header="Thông tin THPT" key="20">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Địa chỉ Tỉnh/Thành phố THPT">
                  {renderEditableSelectTHPTProvince(
                    ['highSchoolInfor', 'highSchoolProvince'],
                    userProvinceInfo?.provinceName,
                    (val) =>
                      setFormData((prev) => ({
                        ...prev!,
                        highSchoolInfor: {
                          ...prev!.highSchoolInfor,
                          highSchoolProvince: val,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ Phường/Xã THPT">
                  {renderEditableSelectTHPTWard(
                    ['highSchoolInfor', 'highSchoolWard'],
                    userProvinceInfo?.wardName,
                    (val) =>
                      setFormData((prev) => ({
                        ...prev!,
                        highSchoolInfor: {
                          ...prev!.highSchoolInfor,
                          highSchoolWard: val,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trường THPT">
                  {renderEditableField(
                    ['highSchoolInfor', 'highSchool'],
                    formData?.highSchoolInfor?.highSchool,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        highSchoolInfor: {
                          ...prev!.highSchoolInfor,
                          highSchool: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Học lực THPT">
                  {renderEditableSelectHL(
                    ['highSchoolInfor', 'highSchoolAcademicPerformance'],
                    getAcademicPeformanceDisplayName(
                      formData?.highSchoolInfor?.highSchoolAcademicPerformance,
                    ),
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        highSchoolInfor: {
                          ...prev!.highSchoolInfor,
                          highSchoolAcademicPerformance: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Hạnh kiểm THPT">
                  {renderEditableSelectHK(
                    ['highSchoolInfor', 'highSchoolConduct'],
                    getConductDisplayName(formData?.highSchoolInfor?.highSchoolConduct),
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        highSchoolInfor: {
                          ...prev!.highSchoolInfor,
                          highSchoolConduct: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Năm tốt nghiệp THPT">
                  {renderEditableField(
                    ['highSchoolInfor', 'highSchoolGraduationYear'],
                    formData?.highSchoolInfor?.highSchoolGraduationYear,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        highSchoolInfor: {
                          ...prev!.highSchoolInfor,
                          highSchoolGraduationYear: Number(v),
                        },
                      })),
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          )}
          {formData?.universityInfor && (
            <Panel
              header={isVanBang2 || isSDH ? 'Thông tin Đại học' : 'Thông tin Cao đẳng/Trung cấp'}
              key="2"
            >
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Tên trường">
                  {renderEditableField(
                    ['universityInfor', 'universityName'],
                    formData?.universityInfor?.universityName,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityName: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành tốt nghiệp">
                  {renderEditableField(
                    ['universityInfor', 'universityMajor'],
                    formData.universityInfor.universityMajor,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityMajor: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="ĐTB tích lũy">
                  {renderEditableField(
                    ['universityInfor', 'universityGpa'],
                    formData?.universityInfor?.universityGpa,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityGpa: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Hệ số điểm">
                  {renderEditableSelectHS(
                    ['universityInfor', 'universityScoreType'],
                    getScoreTypeName(formData?.universityInfor?.universityScoreType),
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityScoreType: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Năm tốt nghiệp">
                  {renderEditableField(
                    ['universityInfor', 'universityGraduationYear'],
                    formData?.universityInfor?.universityGraduationYear,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityGraduationYear: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Hình thức đào tạo">
                  {renderEditableField(
                    ['universityInfor', 'universityTrainingMode'],
                    formData?.universityInfor?.universityTrainingMode,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityTrainingMode: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày ký">
                  {renderEditableDatePickerSignDate(
                    ['universityInfor', 'universitySignDate'],
                    formData?.universityInfor?.universitySignDate,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universitySignDate: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Số hiệu văn bằng">
                  {renderEditableField(
                    ['universityInfor', 'universityDegreeNumber'],
                    formData?.universityInfor?.universityDegreeNumber,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityDegreeNumber: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Số vào sổ">
                  {renderEditableField(
                    ['universityInfor', 'universityRegistrationNumber'],
                    formData?.universityInfor?.universityRegistrationNumber,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityRegistrationNumber: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Bậc tốt nghiệp">
                  {renderEditableField(
                    ['universityInfor', 'universityGraduateDegree'],
                    getUniDegree(formData?.universityInfor?.universityGraduateDegree),
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        universityInfor: {
                          ...prev!.universityInfor,
                          universityGraduateDegree: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData?.universityInfor?.universityDegree) && (
                  <Descriptions.Item label="File bằng tốt nghiệp">
                    {isEditing ? (
                      renderEditableUploadDegree(
                        ['universityInfor', 'universityDegree'],
                        formData?.universityInfor?.universityDegree,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            universityInfor: {
                              ...prev!.universityInfor,
                              universityDegree: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.universityInfor?.universityDegree}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Panel>
          )}

          {isSDH && formData?.highStudyInfor?.highStudyUniversity != '' && (
            <Panel header="Thông tin Cao học" key="3">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ background: '#e6e6e6' }}
              >
                <Descriptions.Item label="Tên trường">
                  {renderEditableField(
                    ['highStudyInfor', 'highStudyUniversity'],
                    formData?.highStudyInfor?.highStudyUniversity,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        highStudyInfor: {
                          ...prev!.highStudyInfor,
                          highStudyUniversity: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Loại bằng">
                  {isEditing ? (
                    <Form.Item
                      name={['highStudyInfor', 'highStudyDegree']}
                      style={{ marginBottom: 0, minWidth: 200 }}
                      initialValue={formData?.highStudyInfor?.highStudyDegree}
                    >
                      <Select
                        disabled
                        style={{ borderRadius: 10 }}
                        value={formData?.highStudyInfor?.highStudyDegree}
                      >
                        <Select.Option value={1}>Thạc sĩ</Select.Option>
                        <Select.Option value={2}>Cử nhân loại Giỏi</Select.Option>
                      </Select>
                    </Form.Item>
                  ) : (
                    <Text strong>
                      {getHighStudyDegreeName(formData?.highStudyInfor?.highStudyDegree)}
                    </Text>
                  )}
                </Descriptions.Item>
                {formData?.highStudyInfor?.highStudyGraduateMajor != '' && (
                  <>
                    <Descriptions.Item label="Ngành tốt nghiệp">
                      {renderEditableField(
                        ['highStudyInfor', 'highStudyGraduateMajor'],
                        formData?.highStudyInfor?.highStudyGraduateMajor,
                        (v) =>
                          setFormData((prev) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyGraduateMajor: v,
                            },
                          })),
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày ký">
                      {renderEditableDatePickerSignDate(
                        ['highStudyInfor', 'highStudyDate'],
                        formData?.highStudyInfor?.highStudyDate,
                        (v) =>
                          setFormData((prev) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyDate: v,
                            },
                          })),
                      )}
                    </Descriptions.Item>
                  </>
                )}
                <Descriptions.Item label="Chuyên ngành tốt nghiệp">
                  {renderEditableSelectAfterUniMajor(
                    ['highStudyInfor', 'highStudyTrainingMajor'],
                    formData?.highStudyInfor?.highStudyTrainingMajor,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        highStudyInfor: {
                          ...prev!.highStudyInfor,
                          highStudyTrainingMajor: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData?.highStudyInfor?.highStudyDegreeFile) && (
                  <Descriptions.Item label="File bằng tốt nghiệp">
                    {isEditing ? (
                      renderEditableUploadHSDegree(
                        ['highStudyInfor', 'highStudyDegreeFile'],
                        formData?.highStudyInfor?.highStudyDegreeFile,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyDegreeFile: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyDegreeFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyTranscript) && (
                  <Descriptions.Item label="File bảng điểm">
                    {isEditing ? (
                      renderEditableUploadHSTrans(
                        ['highStudyInfor', 'highStudyTranscript'],
                        formData?.highStudyInfor?.highStudyTranscript,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyTranscript: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyTranscript}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyApplication) && (
                  <Descriptions.Item label="File hồ sơ dự tuyển">
                    {isEditing ? (
                      renderEditableUploadHSApp(
                        ['highStudyInfor', 'highStudyApplication'],
                        formData?.highStudyInfor?.highStudyApplication,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyApplication: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyApplication}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyBackground) && (
                  <Descriptions.Item label="File lý lịch khoa học">
                    {isEditing ? (
                      renderEditableUploadHSBack(
                        ['highStudyInfor', 'highStudyBackground'],
                        formData?.highStudyInfor?.highStudyBackground,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyBackground: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyBackground}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyReseachExperience) && (
                  <Descriptions.Item label="File kinh nghiệm nghiên cứu">
                    {isEditing ? (
                      renderEditableUploadHSExp(
                        ['highStudyInfor', 'highStudyReseachExperience'],
                        formData?.highStudyInfor?.highStudyReseachExperience,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyReseachExperience: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyReseachExperience}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyReseachProposal) && (
                  <Descriptions.Item label="File dự thảo đề án nghiên cứu">
                    {isEditing ? (
                      renderEditableUploadHSPropo(
                        ['highStudyInfor', 'highStudyReseachProposal'],
                        formData?.highStudyInfor?.highStudyReseachProposal,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyReseachProposal: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyReseachProposal}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyPlan) && (
                  <Descriptions.Item label="File kế hoạch học tập">
                    {isEditing ? (
                      renderEditableUploadHSPlan(
                        ['highStudyInfor', 'highStudyPlan'],
                        formData?.highStudyInfor?.highStudyPlan,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyPlan: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyPlan}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyRecommendationLetter) && (
                  <Descriptions.Item label="File thư giới thiệu">
                    {isEditing ? (
                      renderEditableUploadHSRec(
                        ['highStudyInfor', 'highStudyRecommendationLetter'],
                        formData?.highStudyInfor?.highStudyRecommendationLetter,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyRecommendationLetter: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyRecommendationLetter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.highStudyInfor?.highStudyLetterForStudy) && (
                  <Descriptions.Item label="File công văn cử đi học">
                    {isEditing ? (
                      renderEditableUploadHSLetter(
                        ['highStudyInfor', 'highStudyLetterForStudy'],
                        formData?.highStudyInfor?.highStudyLetterForStudy,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            highStudyInfor: {
                              ...prev!.highStudyInfor,
                              highStudyLetterForStudy: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.highStudyInfor?.highStudyLetterForStudy}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Panel>
          )}

          {!isSDH && (
            <Panel header="Thông tin liên hệ" key="4">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Họ và tên cha">
                  {renderEditableField(
                    ['contactInfor', 'fatherName'],
                    formData?.contactInfor?.fatherName,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        contactInfor: {
                          ...prev!.contactInfor,
                          fatherName: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên mẹ">
                  {renderEditableField(
                    ['contactInfor', 'motherName'],
                    formData?.contactInfor?.motherName,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        contactInfor: {
                          ...prev!.contactInfor,
                          motherName: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT cha">
                  {renderEditableField(
                    ['contactInfor', 'fatherPhone'],
                    formData?.contactInfor?.fatherPhone,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        contactInfor: {
                          ...prev!.contactInfor,
                          fatherPhone: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT mẹ">
                  {renderEditableField(
                    ['contactInfor', 'motherPhone'],
                    formData?.contactInfor?.motherPhone,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        contactInfor: {
                          ...prev!.contactInfor,
                          motherPhone: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Nghề nghiệp cha">
                  {renderEditableField(
                    ['contactInfor', 'fatherOccupation'],
                    formData?.contactInfor?.fatherOccupation,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        contactInfor: {
                          ...prev!.contactInfor,
                          fatherOccupation: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Nghề nghiệp mẹ">
                  {renderEditableField(
                    ['contactInfor', 'motherOccupation'],
                    formData?.contactInfor?.motherOccupation,
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        contactInfor: {
                          ...prev!.contactInfor,
                          motherOccupation: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          )}

          {isSDH && (
            <Panel header="Nguyện vọng đăng ký" key="5">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Ngành đăng ký">
                  {renderEditableSelectAfterUniMajor(
                    'aspirationMajor',
                    Number(formData?.aspirationMajor),
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        aspirationMajor: String(v),
                      })),
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          )}

          {!isSDH && (
            <Panel header="Nguyện vọng đăng ký" key="5">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Ngành đăng ký">
                  {renderEditableSelectMajor1(
                    'aspirationMajor',
                    getMajorNameByCode(Number(formData?.aspirationMajor)),
                    (v) =>
                      setFormData((prev) => ({
                        ...prev!,
                        aspirationMajor: v,
                      })),
                  )}
                </Descriptions.Item>
                {isDaiHoc && (
                  <>
                    {formData?.aspirationExamGroup !== null && (
                      <Descriptions.Item label="Tổ hợp môn">
                        {renderEditableSelectMajor2(
                          'aspirationExamGroup',
                          getSubjectGroupNameByCodeAndMajorCode(
                            formData?.aspirationExamGroup,
                            Number(formData?.aspirationMajor),
                          ),
                          (v) =>
                            setFormData((prev) => ({
                              ...prev!,
                              aspirationExamGroup: v,
                            })),
                        )}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Phương thức xét tuyển">
                      {renderEditableSelectPT(
                        'aspirationAdmissionMethod',
                        getAdmissionMethodDisplayName(formData?.aspirationAdmissionMethod),
                        (v) =>
                          setFormData((prev) => ({
                            ...prev!,
                            aspirationAdmissionMethod: v,
                          })),
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Điểm môn 1">
                      {renderEditableField(
                        'aspirationSubject1Score',
                        formData?.aspirationSubject1Score,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            aspirationSubject1Score: v,
                          })),
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Điểm môn 2">
                      {renderEditableField(
                        'aspirationSubject2Score',
                        formData?.aspirationSubject2Score,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            aspirationSubject2Score: v,
                          })),
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Điểm môn 3">
                      {renderEditableField(
                        'aspirationSubject3Score',
                        formData?.aspirationSubject3Score,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            aspirationSubject3Score: v,
                          })),
                      )}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Panel>
          )}

          {formData?.englishCertificate?.englishCertificateName && (
            <Panel header="Thông tin Chứng chỉ Tiếng Anh" key="6">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Tên chứng chỉ">
                  {renderEditableSelectEnglishCC(
                    ['englishCertificate', 'englishCertificateName'],
                    formData?.englishCertificate?.englishCertificateName,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        englishCertificate: {
                          ...prev!.englishCertificate,
                          englishCertificateName: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cấp">
                  {renderEditableDatePickerSignDate(
                    ['englishCertificate', 'englishCertificateDate'],
                    formData?.englishCertificate?.englishCertificateDate,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        englishCertificate: {
                          ...prev!.englishCertificate,
                          englishCertificateDate: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trình độ">
                  {renderEditableSelectEnglishTD(
                    ['englishCertificate', 'englishCertificateLevel'],
                    formData?.englishCertificate?.englishCertificateLevel,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        englishCertificate: {
                          ...prev!.englishCertificate,
                          englishCertificateLevel: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData?.englishCertificate?.englishCertificateListeningScore) && (
                  <Descriptions.Item label="Điểm Nghe">
                    {renderEditableField(
                      ['englishCertificate', 'englishCertificateListeningScore'],
                      formData?.englishCertificate?.englishCertificateListeningScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          englishCertificate: {
                            ...prev!.englishCertificate,
                            englishCertificateListeningScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.englishCertificate?.englishCertificateReadingScore) && (
                  <Descriptions.Item label="Điểm Đọc">
                    {renderEditableField(
                      ['englishCertificate', 'englishCertificateReadingScore'],
                      formData?.englishCertificate?.englishCertificateReadingScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          englishCertificate: {
                            ...prev!.englishCertificate,
                            englishCertificateReadingScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData.englishCertificate?.englishCertificateWritingScore) && (
                  <Descriptions.Item label="Điểm Viết">
                    {renderEditableField(
                      ['englishCertificate', 'englishCertificateWritingScore'],
                      formData.englishCertificate?.englishCertificateWritingScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          englishCertificate: {
                            ...prev!.englishCertificate,
                            englishCertificateWritingScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData.englishCertificate?.englishCertificateSpeakingScore) && (
                  <Descriptions.Item label="Điểm Nói">
                    {renderEditableField(
                      ['englishCertificate', 'englishCertificateSpeakingScore'],
                      formData.englishCertificate?.englishCertificateSpeakingScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          englishCertificate: {
                            ...prev!.englishCertificate,
                            englishCertificateSpeakingScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Tổng điểm">
                  {renderEditableField(
                    ['englishCertificate', 'englishCertificateTotalScore'],
                    formData.englishCertificate?.englishCertificateTotalScore,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        englishCertificate: {
                          ...prev!.englishCertificate,
                          englishCertificateTotalScore: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData.englishCertificate?.englishCertificateNumber) && (
                  <Descriptions.Item label="Số hiệu">
                    {renderEditableField(
                      ['englishCertificate', 'englishCertificateNumber'],
                      formData.englishCertificate?.englishCertificateNumber,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          englishCertificate: {
                            ...prev!.englishCertificate,
                            englishCertificateNumber: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData.englishCertificate?.englishCertificateFilePath) && (
                  <Descriptions.Item label="File chứng chỉ">
                    {isEditing ? (
                      renderEditableUploadEngCer(
                        ['englishCertificate', 'englishCertificateFilePath'],
                        formData?.englishCertificate?.englishCertificateFilePath,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            englishCertificate: {
                              ...prev!.englishCertificate,
                              englishCertificateFilePath: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.englishCertificate?.englishCertificateFilePath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Panel>
          )}

          {formData?.franceCertificate?.franceCertificateName && (
            <Panel header="Thông tin Chứng chỉ Tiếng Pháp" key="7">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Tên chứng chỉ">
                  {renderEditableSelectFranceCC(
                    ['franceCertificate', 'franceCertificateName'],
                    formData?.franceCertificate?.franceCertificateName,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        franceCertificate: {
                          ...prev!.franceCertificate,
                          franceCertificateName: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cấp">
                  {renderEditableDatePickerSignDate(
                    ['franceCertificate', 'franceCertificateDate'],
                    formData?.franceCertificate?.franceCertificateDate,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        franceCertificate: {
                          ...prev!.franceCertificate,
                          franceCertificateDate: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trình độ">
                  {renderEditableSelectFranceTD(
                    ['franceCertificate', 'franceCertificateLevel'],
                    formData?.franceCertificate?.franceCertificateLevel,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        franceCertificate: {
                          ...prev!.franceCertificate,
                          franceCertificateLevel: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData?.franceCertificate?.franceCertificateListeningScore) && (
                  <Descriptions.Item label="Điểm Nghe">
                    {renderEditableField(
                      ['franceCertificate', 'franceCertificateListeningScore'],
                      formData?.franceCertificate?.franceCertificateListeningScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          franceCertificate: {
                            ...prev!.franceCertificate,
                            franceCertificateListeningScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.franceCertificate?.franceCertificateReadingScore) && (
                  <Descriptions.Item label="Điểm Đọc">
                    {renderEditableField(
                      ['franceCertificate', 'franceCertificateReadingScore'],
                      formData?.franceCertificate?.franceCertificateReadingScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          franceCertificate: {
                            ...prev!.franceCertificate,
                            franceCertificateReadingScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.franceCertificate?.franceCertificateWritingScore) && (
                  <Descriptions.Item label="Điểm Viết">
                    {renderEditableField(
                      ['franceCertificate', 'franceCertificateWritingScore'],
                      formData?.franceCertificate?.franceCertificateWritingScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          franceCertificate: {
                            ...prev!.franceCertificate,
                            franceCertificateWritingScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                {(isEditing || formData?.franceCertificate?.franceCertificateSpeakingScore) && (
                  <Descriptions.Item label="Điểm Nói">
                    {renderEditableField(
                      ['franceCertificate', 'franceCertificateSpeakingScore'],
                      formData?.franceCertificate?.franceCertificateSpeakingScore,
                      (v) =>
                        setFormData((prev: any) => ({
                          ...prev!,
                          franceCertificate: {
                            ...prev!.franceCertificate,
                            franceCertificateSpeakingScore: v,
                          },
                        })),
                    )}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Tổng điểm">
                  {renderEditableField(
                    ['franceCertificate', 'franceCertificateTotalScore'],
                    formData?.franceCertificate?.franceCertificateTotalScore,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        franceCertificate: {
                          ...prev!.franceCertificate,
                          franceCertificateTotalScore: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData.franceCertificate?.franceCertificateFilePath) && (
                  <Descriptions.Item label="File chứng chỉ">
                    {isEditing ? (
                      renderEditableUploadFraCer(
                        ['franceCertificate', 'franceCertificateFilePath'],
                        formData?.franceCertificate?.franceCertificateFilePath,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            franceCertificate: {
                              ...prev!.franceCertificate,
                              franceCertificateFilePath: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.franceCertificate?.franceCertificateFilePath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Panel>
          )}

          {formData?.japanCertificate?.japanCertificateName && (
            <Panel header="Thông tin Chứng chỉ Tiếng Nhật" key="8">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="Tên chứng chỉ">
                  {renderEditableSelectJapanCC(
                    ['japanCertificate', 'japanCertificateName'],
                    formData?.japanCertificate?.japanCertificateName,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateName: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cấp">
                  {renderEditableDatePickerSignDate(
                    ['japanCertificate', 'japanCertificateDate'],
                    formData?.japanCertificate?.japanCertificateDate,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateDate: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trình độ">
                  {renderEditableSelectJapanTD(
                    ['japanCertificate', 'japanCertificateLevel'],
                    formData?.japanCertificate?.japanCertificateLevel,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateLevel: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm Nghe">
                  {renderEditableField(
                    ['japanCertificate', 'japanCertificateListeningScore'],
                    formData?.japanCertificate?.japanCertificateListeningScore,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateListeningScore: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm Đọc">
                  {renderEditableField(
                    ['japanCertificate', 'japanCertificateReadingScore'],
                    formData?.japanCertificate?.japanCertificateReadingScore,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateReadingScore: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm Từ vựng">
                  {renderEditableField(
                    ['japanCertificate', 'japanCertificateVocabularyScore'],
                    formData?.japanCertificate?.japanCertificateVocabularyScore,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateVocabularyScore: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng điểm">
                  {renderEditableField(
                    ['japanCertificate', 'japanCertificateTotalScore'],
                    formData?.japanCertificate?.japanCertificateTotalScore,
                    (v) =>
                      setFormData((prev: any) => ({
                        ...prev!,
                        japanCertificate: {
                          ...prev!.japanCertificate,
                          japanCertificateTotalScore: v,
                        },
                      })),
                  )}
                </Descriptions.Item>
                {(isEditing || formData?.japanCertificate?.japanCertificateFilePath) && (
                  <Descriptions.Item label="File chứng chỉ">
                    {isEditing ? (
                      renderEditableUploadJapCer(
                        ['japanCertificate', 'japanCertificateFilePath'],
                        formData?.japanCertificate?.japanCertificateFilePath,
                        (v) =>
                          setFormData((prev: any) => ({
                            ...prev!,
                            japanCertificate: {
                              ...prev!.japanCertificate,
                              japanCertificateFilePath: v,
                            },
                          })),
                      )
                    ) : (
                      <Text strong>
                        <a
                          href={formData?.japanCertificate?.japanCertificateFilePath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem/Tải xuống
                        </a>
                      </Text>
                    )}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Panel>
          )}
          {isSDH && (
            <Panel header="Minh chứng đóng lệ phí" key="9">
              <Descriptions
                bordered
                column={{ xs: 1, md: 2 }}
                size="small"
                labelStyle={{ backgroundColor: '#e6e6e6' }}
              >
                <Descriptions.Item label="File minh chứng đóng lệ phí">
                  {formData?.feeFile ? (
                    <Text strong>
                      <a href={formData.feeFile} target="_blank" rel="noopener noreferrer">
                        Xem/Tải xuống
                      </a>
                    </Text>
                  ) : null}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          )}
        </Collapse>

        {formData?.step === 2 ? (
          <div className={styles.buttonGroup}>
            {isEditing ? (
              <>
                <Button onClick={toggleCancel} disabled={isLoadingSave}>
                  Hủy bỏ
                </Button>
                <Button type="primary" onClick={() => form.submit()} loading={isLoadingSave}>
                  Lưu
                </Button>
              </>
            ) : (
              <Button onClick={toggleEdit} className={styles.editButton}>
                Cập nhật
              </Button>
            )}
          </div>
        ) : null}
      </Card>
    </Form>
  );
};

export default UserEnrollmentDetail;
