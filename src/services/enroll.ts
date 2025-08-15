import api from '../apiEndpoint/index';
import request from '@/utils/request';
import { CustomMessageError, CustomMessageSuccess } from '@/components/CustomMessage/CustomMessage';

export const endpoint = api.UMI_API_BASE_URL;

const token = localStorage.getItem('token');

export interface StudentInforBackend {
  studentIdCard: string;
  studentDob: string;
  studentEthnicity: string;
  studentFirstName: string;
  studentLastName: string;
  studentGender: string;
  studentPhone: string;
  studentEmail: string;
  studentAvatar: string;
}

export interface HighSchoolInforBackend {
  highSchoolProvince: string;
  highSchoolWard: string;
  highSchool: string;
  highSchoolAcademicPerformance: string;
  highSchoolConduct: string;
  highSchoolGraduationYear: number;
}

export interface UniversityInforBackend {
  universityMajor: string;
  universityGpa: number;
  universityGraduationYear: string;
  universityTrainingMode: string;
  universitySignDate: string;
  universityDegreeNumber: string;
  universityRegistrationNumber: string;
  universityName: string;
  universityGraduateDegree?: string;
  universityDegree: string;
  universityScoreType?: string;
}

export interface ContactInforBackend {
  studentContactProvince: string;
  studentContactWard: string;
  studentContactAddress: string;
  studentFullContactAddress: string;
  fatherName?: string | null;
  fatherPhone?: string | null;
  fatherOccupation: string | null;
  motherName?: string | null;
  motherPhone?: string | null;
  motherOccupation?: string | null;
}

export interface HighStudyInforBackEnd {
  highStudyDegree?: number;
  highStudyGraduateMajor?: string;
  highStudyUniversity?: string;
  highStudyDate?: string;
  highStudyTrainingMajor?: number;
  highStudyDegreeFile?: string;
  highStudyTranscript?: string;
  highStudyApplication?: string;
  highStudyBackground?: string;
  highStudyReseachExperience?: string;
  highStudyReseachProposal?: string;
  highStudyPlan?: string;
  highStudyRecommendationLetter?: string;
  highStudyLetterForStudy?: string;
}

export interface EnglishCertificateBackend {
  englishCertificateName?: string;
  englishCertificateNumber?: string;
  englishCertificateDate?: string;
  englishCertificateLevel?: string;
  englishCertificateFilePath?: string;
  englishCertificateListeningScore: number;
  englishCertificateReadingScore: number;
  englishCertificateWritingScore: number;
  englishCertificateSpeakingScore: number;
  englishCertificateTotalScore: number;
}

export interface FranceCertificateBackend {
  franceCertificateName?: string;
  franceCertificateDate?: string;
  franceCertificateListeningScore: number;
  franceCertificateReadingScore: number;
  franceCertificateWritingScore: number;
  franceCertificateSpeakingScore: number;
  franceCertificateTotalScore: number;
  franceCertificateLevel: string;
  franceCertificateFilePath: string;
}

export interface JapanCertificateBackend {
  japanCertificateName?: string;
  japanCertificateDate?: string;
  japanCertificateListeningScore: number;
  japanCertificateReadingScore: number;
  japanCertificateVocabularyScore: number;
  japanCertificateTotalScore: number;
  japanCertificateLevel: string;
  japanCertificateFilePath: string;
}

export interface EnrollmentPayload {
  studentInfor: StudentInforBackend;
  highSchoolInfor?: HighSchoolInforBackend;
  contactInfor: ContactInforBackend;
  universityInfor?: UniversityInforBackend;
  highStudyInfor?: HighStudyInforBackEnd;
  englishCertificate?: EnglishCertificateBackend;
  franceCertificate?: FranceCertificateBackend;
  japanCertificate?: JapanCertificateBackend;
  aspirationMajor: string;
  aspirationExamGroup?: string;
  aspirationAdmissionMethod?: string;
  aspirationSubject1Score?: number;
  aspirationSubject2Score?: number;
  aspirationSubject3Score?: number;
  aspirationConfirmation: boolean;
  trainingSystemType: string;
  educationType?: string;
  feeFile?: string;
  workplace?: string;
}

export interface EthnicGroupItem {
  id: number;
  name: string;
}

export interface WardData {
  name: string;
  code: string;
  codename: string;
}

export interface ProvinceData {
  name: string;
  code: string;
  codename: string;
  wards?: WardData[];
}

export interface MajorData {
  name: string;
  code: number;
  codename: string;
  subjectGroup?: SubjectGroupData[];
}

export interface SubjectGroupData {
  name: string;
  code: string;
  codename: string;
}

export interface AdminInfo {
  firstName: string;
  lastName: string;
  username: string;
}

export async function enrollDH(payloadData: EnrollmentPayload): Promise<any> {
  if (!token) {
    throw new Error('Người dùng chưa được xác thực!');
  }
  try {
    const response = await fetch(`${endpoint}/api/enrollment/daihoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    CustomMessageError({ content: 'Phản hồi không hợp lệ!' });
  }
}

export async function enrollLT(payloadData: EnrollmentPayload): Promise<any> {
  if (!token) {
    throw new Error('Người dùng chưa được xác thực!');
  }
  try {
    const response = await fetch(`${endpoint}/api/enrollment/lienthong`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    CustomMessageError({ content: 'Phản hồi không hợp lệ!' });
  }
}

export async function enrollVB2(payloadData: EnrollmentPayload): Promise<any> {
  if (!token) {
    throw new Error('Người dùng chưa được xác thực!');
  }
  try {
    const response = await fetch(`${endpoint}/api/enrollment/vanbang2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    CustomMessageError({ content: 'Phản hồi không hợp lệ!' });
  }
}

export async function enrollSDH(payloadData: EnrollmentPayload): Promise<any> {
  if (!token) {
    throw new Error('Người dùng chưa được xác thực!');
  }
  try {
    const response = await fetch(`${endpoint}/api/enrollment/saudaihoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    CustomMessageError({ content: 'Phản hồi không hợp lệ!' });
  }
}

export async function formInfor(formtoken: string): Promise<any> {
  try {
    const response = await fetch(`${endpoint}/api/enrollment/form-info?code=${formtoken}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${formtoken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Lỗi từ server: ${response.status} ${response.statusText}!`,
      );
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    CustomMessageError({ content: 'Phản hồi không hợp lệ!' });
    throw error;
  }
}

export async function getAllMajor(majorCode: number, options?: { [key: string]: any }) {
  return request(`${endpoint}/api/major`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getSubjectGroup(
  majorCode: number,
  subjectCode: string,
  options?: { [key: string]: any },
) {
  return request(`${endpoint}/api/major`, {
    method: 'GET',
    params: {
      majorCode,
    },
    ...(options || {}),
  });
}

export async function getAllEthnicGroups(): Promise<{ data: EthnicGroupItem[]; success: boolean }> {
  return request(`${endpoint}/api/ethnic`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProvinceDetails(provinceCode: string, options?: { [key: string]: any }) {
  return request(`${endpoint}/api/province`, {
    method: 'GET',
    params: {
      provinceCode,
    },
    ...(options || {}),
  });
}

export async function getWardDetails(
  provinceCode: string,
  wardCode: string,
  options?: { [key: string]: any },
) {
  return request(`${endpoint}/api/province`, {
    method: 'GET',
    params: {
      provinceCode,
      wardCode,
    },
    ...(options || {}),
  });
}

export interface AdminEnrollManagementDto {
  adminRole?: string;
  adminMess?: string;
  editDate?: string;
  step?: number;
  enrollmentCode: string;
  appUserId: string;
  trainingSystemType: string;
  educationType: string;
  regisDate: string;
  adminName: string;
  adminUsername: string;
  adminProcessTime: string;
  studentFirstName: string;
  studentLastName: string;
  studentPhone: string;
  studentEmail: string;
  studentInfor: StudentInforBackend;
  studentAvatar: string;
  highSchoolInfor: HighSchoolInforBackend;
  universityInfor?: UniversityInforBackend;
  contactInfor: ContactInforBackend;
  englishCertificate?: EnglishCertificateBackend;
  franceCertificate?: FranceCertificateBackend;
  japanCertificate?: JapanCertificateBackend;
  highStudyInfor?: HighStudyInforBackEnd;
  feeFile?: string;
  workPlace?: string;
  aspirationMajor: string;
  aspirationExamGroup?: string;
  aspirationAdmissionMethod?: string;
  aspirationSubject1Score?: number | null;
  aspirationSubject2Score?: number | null;
  aspirationSubject3Score?: number | null;
}

export interface ApiRespones<T> {
  code: number;
  message: string;
  data: T;
  pagination?: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPage: number;
  };
}

export interface GetAdminEnrollmentParams {
  pageNumber: number;
  pageSize: number;
  searchQuery?: string;
  trainingSystemType?: string;
  educationType?: string;
  sortOrder?: 'asc' | 'desc';
  sortColumn?: string;
  startDate?: string;
  endDate?: string;
  step?: number;
  adminName?: string;
  adminRole?: string;
}

export async function getAdminEnrollments(
  params: GetAdminEnrollmentParams,
): Promise<ApiRespones<AdminEnrollManagementDto[]>> {
  if (!token) {
    throw new Error('Người dùng chưa được xác thực!');
  }

  const queryParams = new URLSearchParams();
  queryParams.append('pageNumber', params.pageNumber.toString());
  queryParams.append('pageSize', params.pageSize.toString());
  if (params.searchQuery) {
    queryParams.append('searchQuery', params.searchQuery);
  }
  if (params.trainingSystemType) {
    queryParams.append('trainingSystemType', params.trainingSystemType);
  }
  if (params.educationType) {
    queryParams.append('educationType', params.educationType);
  }
  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }

  const effectiveSortOrder = params.sortOrder || 'desc';
  const effectiveSortColumn = params.sortColumn || 'regisDate';

  if (effectiveSortOrder && effectiveSortColumn) {
    queryParams.append('sortOrder', effectiveSortOrder);
    queryParams.append('sortColumn', effectiveSortColumn);
  }
  if (params.step !== undefined) {
    queryParams.append('step', params.step.toString());
  }
  if (params.adminRole) {
    queryParams.append('adminRole', params.adminRole);
  }
  if (params.adminName) {
    queryParams.append('adminName', params.adminName);
  }

  const url = `${endpoint}/api/enrollment/admin-search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message) || `Lỗi API: ${response.status} ${response.statusText}!`;
    }

    if (result && result.data !== undefined) {
      const dataWithId = result.data.map((item: AdminEnrollManagementDto) => ({
        ...item,
        id: item.enrollmentCode,
      }));
      result.data = dataWithId;
      return result;
    } else {
      throw new Error('Phản hồi API không chứa thông tin hợp lệ!');
    }
  } catch (error: any) {
    CustomMessageError({ content: 'Không tìm thấy hồ sơ!' });
    throw error;
  }
}

export interface LocationNameData {
  provinceName: string;
  wardName: string;
}

export async function getLocationNameByCode(
  provinceCode: string,
  wardCode?: string,
  option?: { [key: string]: any },
): Promise<{ code: number; data: LocationNameData | null; message: string }> {
  return request(`${endpoint}/api/province/name-by-code`, {
    method: 'GET',
    params: {
      provinceCode,
      wardCode,
    },
    ...(option || {}),
  });
}

interface ExportEnrollmentsToExcelParams {
  searchQuery?: string;
  trainingSystemType?: string;
  educationType?: string;
  sortOrder?: 'asc' | 'desc';
  sortColumn?: string;
  startDate?: string;
  endDate?: string;
  step?: number;
  adminName?: string;
  adminRole?: string;
}

export async function exportEnrollmentsToExcel(
  params?: ExportEnrollmentsToExcelParams,
): Promise<void> {
  if (!token) {
    CustomMessageError({ content: 'Bạn cần đăng nhập để tải file!' });
    throw new Error('Người dùng chưa được xác thực.');
  }

  try {
    let url = `${endpoint}/api/enrollment/export-excel`;
    const queryParams = new URLSearchParams();

    if (params?.searchQuery) {
      queryParams.append('searchQuery', params.searchQuery);
    }
    if (params?.trainingSystemType) {
      queryParams.append('trainingSystemType', params.trainingSystemType);
    }
    if (params?.educationType) {
      queryParams.append('educationType', params.educationType);
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    if (params?.sortColumn) {
      queryParams.append('sortColumn', params.sortColumn);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.step !== undefined) {
      queryParams.append('step', params.step.toString());
    }
    if (params?.adminRole) {
      queryParams.append('adminRole', params.adminRole);
    }
    if (params?.adminName) {
      queryParams.append('adminName', params.adminName);
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi API: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

    a.download = `DanhSachHoSo_${formattedDateTime}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    CustomMessageSuccess({ content: 'Tải xuống file Excel thành công!' });
  } catch (error: any) {
    CustomMessageError({ content: 'Lỗi khi tải xuống file Excel!' });
    throw error;
  }
}

export async function getEnrollmentForm(enrollmentCode: string) {
  return request(`${endpoint}/api/enrollment/get-form`, {
    method: 'GET',
    params: {
      code: enrollmentCode,
    },
  });
}

export async function updateEnrollmentAsAdmin(
  educationType: 'daihoc' | 'lienthong' | 'vanbang2' | 'saudaihoc',
  payload: {
    EnrollmentCode: string;
    step: number;
    adminMess?: string;
    AdminName?: string;
    AdminUsername?: string;
  },
) {
  const url = `${endpoint}/api/enrollment/${educationType}/admin-update`;

  return request(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });
}

export async function getAdminsByRole(role: string) {
  return request(`${endpoint}/api/account/admin-list-by-role`, {
    method: 'GET',
    params: { role },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
