import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Select,
  Pagination,
  Empty,
  Space,
  Typography,
  Button,
  DatePicker,
  ConfigProvider,
  Tag,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { DownloadOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import {
  getAdminEnrollments,
  AdminEnrollManagementDto,
  exportEnrollmentsToExcel,
  getAdminsByRole,
} from '@/services/enroll';
import moment from 'moment';
import viVN from 'antd/lib/locale/vi_VN';
import 'moment/locale/vi';
import { history } from 'umi';
import { getStepInfo } from '@/utils/enrollmentSteps';
import { CustomMessageError, CustomMessageWarning } from '@/components/CustomMessage/CustomMessage';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import api from '@/apiEndpoint/index';

const endpoint = api.UMI_API_BASE_URL;

const { Option } = Select;
const { RangePicker } = DatePicker;
moment.locale('vi');

type DataType = AdminEnrollManagementDto;

const EnrollmentControl: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [enrollments, setEnrollments] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [trainingFilter, setTrainingFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(
    null,
  );
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [stepFilter, setStepFilter] = useState<number | undefined>(undefined);
  const [adminRoleFilter, setAdminRoleFilter] = useState<string | undefined>(undefined);
  const [adminFilter, setAdminFilter] = useState<string | undefined>(undefined);
  const [adminOptions, setAdminOptions] = useState<{ label: string; value: string }[]>([]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response: { code: number; data: DataType[]; pagination?: { totalCount: number } } =
        await getAdminEnrollments({
          pageNumber,
          pageSize,
          searchQuery,
          trainingSystemType: trainingFilter,
          startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
          endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
          sortColumn: 'regisDate',
          step: stepFilter,
          adminName: adminFilter,
          adminRole: adminRoleFilter,
        });

      if (response.code === 200 && response.data) {
        setEnrollments(response.data);
        setTotal(response.pagination?.totalCount || 0);
      } else {
        setEnrollments([]);
        setTotal(0);
      }
    } catch (error: any) {
      setEnrollments([]);
      setTotal(0);
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      await exportEnrollmentsToExcel({
        searchQuery: searchText,
        trainingSystemType: trainingFilter,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        sortColumn: 'regisDate',
        step: stepFilter,
        adminName: adminFilter,
        adminRole: adminRoleFilter,
      });
    } catch (error) {
    } finally {
      setDownloading(false);
    }
  };

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

    connection.on('enrollmentDataChanged', () => {
      fetchEnrollments();
    });

    connection.on('enrollmentDetailDataChanged', () => {
      fetchEnrollments();
    });

    return () => {
      connection.off('enrollmentDataChanged');
      connection.off('enrollmentDetailDataChanged');
      connection.stop();
    };
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [
    pageNumber,
    pageSize,
    trainingFilter,
    searchQuery,
    dateRange,
    stepFilter,
    adminFilter,
    adminRoleFilter,
  ]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchText?.trim() !== searchQuery) {
        setSearchQuery(searchText?.trim() || undefined);
        setPageNumber(1);
      }
    }, 800);

    return () => clearTimeout(debounce);
  }, [searchText]);

  useEffect(() => {
    if (adminRoleFilter) {
      getAdminsByRole(adminRoleFilter)
        .then((res) => {
          if (Array.isArray(res)) {
            const options = res.map((name) => ({ label: name, value: name }));
            setAdminOptions(options);
          } else {
            setAdminOptions([]);
          }
        })
        .catch(() => {
          CustomMessageError({ content: 'Không thể tải danh sách Người xử lý!' });
          setAdminOptions([]);
        });
    } else {
      setAdminOptions([]);
      setAdminFilter(undefined);
    }
  }, [adminRoleFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== searchQuery) {
      setSearchQuery(trimmedValue || undefined);
      setPageNumber(1);
    }
  };

  const handleDateRangeChange = (
    dates: [moment.Moment | null, moment.Moment | null] | null,
    dateStrings: [string, string],
  ) => {
    if (dates && (dates[0] === null || dates[1] === null)) {
      CustomMessageWarning({ content: 'Vui lòng chọn cả Ngày bắt đầu và Ngày kết thúc để lọc!' });
      return;
    } else {
      setDateRange(dates);
      setPageNumber(1);
    }
  };

  const getTrainingSystemDisplayName = (type: string | undefined): string => {
    if (!type) {
      return '';
    }
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
        return type;
    }
  };

  const handleClearAllFilters = () => {
    setSearchText(undefined);
    setSearchQuery(undefined);
    setTrainingFilter(undefined);
    setStepFilter(undefined);
    setAdminRoleFilter(undefined);
    setAdminFilter(undefined);
    setDateRange(null);
    setPageNumber(1);
  };

  const getProgramTagInfo = (code?: string): string => {
    if (!code) return '';
    const parts = code.split('-');
    const mid = parts[1]?.toUpperCase();

    switch (mid) {
      case 'LT':
        return 'Liên thông';
      case 'VB2':
        return 'Văn bằng 2';
      case 'DH':
        return 'Đại học';
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

  const columns: ColumnsType<DataType> = [
    {
      title: '#',
      key: 'stt',
      align: 'center',
      render: (text, record, index) => {
        return (pageNumber - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'enrollmentCode',
      key: 'enrollmentCode',
    },
    {
      title: 'Hệ đào tạo',
      dataIndex: 'trainingSystemType',
      key: 'trainingSystemType',
      render: (type: string | undefined) => {
        const displayName = getTrainingSystemDisplayName(type);
        let color = 'default';
        switch (type) {
          case 'VuaLamVuaHoc':
            color = 'gold';
            break;
          case 'DaoTaoTuXa':
            color = 'cyan';
            break;
          case 'ChinhQuy':
            color = 'magenta';
            break;
          case 'SauDaiHoc':
            color = 'purple';
            break;
        }
        return <Tag color={color}>{displayName}</Tag>;
      },
    },
    {
      title: 'Chương trình',
      key: 'programType',
      render: (_, record) => {
        const label = getProgramTagInfo(record.enrollmentCode);
        return label || null;
      },
    },
    {
      title: 'Họ và tên đệm người nộp',
      dataIndex: 'studentLastName',
      key: 'studentLastName',
    },
    {
      title: 'Tên người nộp',
      dataIndex: 'studentFirstName',
      key: 'studentFirstName',
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'regisDate',
      key: 'regisDate',
      render: (text: string) => {
        try {
          const date = new Date(text);
          return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        } catch (e) {
          return text;
        }
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'step',
      key: 'step',
      render: (step) => {
        const { label, color } = getStepInfo(step ?? 0);

        if (label === 'Chưa tiếp nhận') {
          return (
            <Badge dot className={styles.blinkBadge}>
              <Tag color={color}>{label}</Tag>
            </Badge>
          );
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Đơn vị',
      dataIndex: 'adminRole',
      key: 'adminRole',
      render: (role: string) => (role === 'adminPdt' ? 'Phòng ĐT - ĐH' : 'Phòng ĐT - SĐH'),
    },
    {
      title: 'Người xử lý',
      dataIndex: 'adminName',
      key: 'adminName',
      render: (text: string | undefined, record: any) => {
        return text ? text : <span style={{ color: '#aaa' }}>-</span>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '110px',
      render: (text, record) => (
        <Space size="middle">
          <a
            className={styles.detailText}
            onClick={() => {
              history.push(`/quanly-hoso/${record.enrollmentCode}`);
            }}
          >
            Xem chi tiết
          </a>
        </Space>
      ),
    },
  ];

  const isFilterEmpty =
    !trainingFilter &&
    stepFilter === undefined &&
    !adminFilter &&
    !adminRoleFilter &&
    !searchText &&
    (!dateRange || !dateRange[0] || !dateRange[1]);

  return (
    <>
      <h1 style={{ color: 'rgba(0,0,0,1)' }}>Quản lý Hồ sơ đăng ký</h1>
      <div className={styles.filterBar}>
        <div className={styles.filterGroupLeft}>
          <Select
            placeholder="Đơn vị"
            style={{ minWidth: 140 }}
            value={adminRoleFilter}
            onChange={(value) => {
              setAdminRoleFilter(value);
              setAdminFilter(undefined);
              setPageNumber(1);
            }}
            allowClear
            options={[
              { label: 'Phòng ĐT - ĐH', value: 'adminPdt' },
              { label: 'Phòng ĐT - SĐH', value: 'adminSdh' },
            ]}
          />
          <Select
            placeholder="Người xử lý"
            style={{ minWidth: 140 }}
            value={adminFilter}
            onChange={(value) => {
              setAdminFilter(value);
              setPageNumber(1);
            }}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
                imageStyle={{ height: 30 }}
                style={{ margin: 0 }}
              />
            }
            allowClear
            disabled={!adminRoleFilter}
            options={adminOptions}
          />
          <Select
            placeholder="Hệ đào tạo"
            style={{ minWidth: 140 }}
            value={trainingFilter}
            onChange={(value) => {
              setTrainingFilter(value);
              setPageNumber(1);
            }}
            allowClear
          >
            <Option value="ChinhQuy">Chính Quy</Option>
            <Option value="DaoTaoTuXa">Đào Tạo Từ Xa</Option>
            <Option value="VuaLamVuaHoc">Vừa Làm Vừa Học</Option>
            <Option value="SauDaiHoc">Sau Đại Học</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            style={{ minWidth: 140 }}
            value={stepFilter}
            onChange={(value) => {
              setStepFilter(value);
              setPageNumber(1);
            }}
            allowClear
          >
            <Option value={0}>Chưa tiếp nhận</Option>
            <Option value={1}>Tiếp nhận</Option>
            <Option value={2}>Yêu cầu cập nhật</Option>
            <Option value={3}>Từ chối</Option>
            <Option value={4}>Chấp nhận</Option>
            <Option value={5}>Phê duyệt</Option>
          </Select>
          <ConfigProvider locale={viVN}>
            <RangePicker
              className={styles.antRangePicker}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={handleDateRangeChange}
              value={dateRange}
              format="DD/MM/YYYY"
              popupClassName={styles.antRangePickerPopup}
              separator={
                <span
                  style={{
                    fontSize: 18,
                    color: isDateFocused ? '#40a9ff' : 'rgba(0,0,0,0.25)',
                  }}
                >
                  ⟶
                </span>
              }
              onFocus={() => setIsDateFocused(true)}
              onBlur={() => setIsDateFocused(false)}
              style={{ width: 230 }}
            />
          </ConfigProvider>
        </div>

        <div className={styles.filterGroupRight}>
          <Input
            placeholder="Tìm theo Mã hồ sơ, Họ và tên đệm, Tên"
            value={searchText}
            onChange={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onPressEnter={() => handleSearch(searchText || '')}
            prefix={
              <SearchOutlined
                className={isInputFocused ? styles.searchIconFocus : styles.searchIconDefault}
              />
            }
            allowClear
            style={{ width: 320 }}
          />
          <Button
            icon={<ClearOutlined />}
            onClick={handleClearAllFilters}
            className={styles.clearFilterBtn}
            disabled={isFilterEmpty}
          >
            Xóa bộ lọc
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownloadExcel}
            loading={downloading}
            disabled={!hasFetched || enrollments.length === 0}
            className={styles.exportButton}
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <div className={styles.table}>
        <Table
          columns={columns}
          dataSource={enrollments}
          rowKey="enrollmentCode"
          loading={loading}
          pagination={false}
          className={styles.tableHeader}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: hasFetched ? <Empty description="Không có dữ liệu" /> : <></>,
          }}
        />
        {enrollments.length > 0 && (
          <Pagination
            current={pageNumber}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showTotal={(t) => (
              <Typography.Text>
                Tổng{' '}
                <Typography.Text style={{ color: 'rgba(0,0,0,1)' }} strong>
                  {t}
                </Typography.Text>{' '}
                hồ sơ
              </Typography.Text>
            )}
            onChange={(page, size) => {
              setPageNumber(page);
              setPageSize(size);
            }}
            locale={{
              items_per_page: '/ trang',
              jump_to: 'Đến trang',
              next_page: 'Trang sau',
              prev_page: 'Trang trước',
              next_3: '3 trang sau',
              next_5: '5 trang sau',
              prev_3: '3 trang trước',
              prev_5: '5 trang trước',
            }}
            className={styles.pagination}
          />
        )}
      </div>
    </>
  );
};

export default EnrollmentControl;
