import React, { useState, useEffect } from 'react';
import { getUsersListByRole } from '@/services/user';
import { AllUserInfo } from '@/services/user';
import { Table, Input, Select, Pagination, Empty, Tag, Typography, Button } from 'antd';
import styles from './AccountControl.less';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import api from '@/apiEndpoint/index';

const endpoint = api.UMI_API_BASE_URL;

const { Option } = Select;

const AccountControl: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [users, setUsers] = useState<AllUserInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersListByRole({
        role: roleFilter,
        pageNumber,
        pageSize,
        sortOrder,
        searchQuery,
      });

      if (response.code === 200 && response.data) {
        setUsers(response.data);
        setTotal(response.pagination?.totalCount || 0);
      } else {
        CustomMessageError({ content: 'Không tìm thấy tài khoản!' });
        setUsers([]);
        setTotal(0);
      }
    } catch (error: any) {
      CustomMessageError({ content: 'Lỗi kết nối đến server!' });
      setUsers([]);
      setTotal(0);
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, pageSize, roleFilter, sortOrder, searchQuery]);

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
    const token = localStorage.getItem('token');
    const connection = new HubConnectionBuilder()
      .withUrl(`${endpoint}/userhub`, {
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

    connection.on('userDataChanged', () => {
      fetchUsers();
    });

    return () => {
      connection.off('userDataChanged');
      connection.stop();
    };
  }, []);

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

  const handleClearAllFilters = () => {
    setSearchText(undefined);
    setSearchQuery(undefined);
    setRoleFilter(undefined);
    setPageNumber(1);
  };

  const isFilterEmpty = [roleFilter, searchText].every(
    (filter: any) => !filter || (Array.isArray(filter) && filter.length === 0),
  );

  const columns = [
    {
      title: '#',
      key: 'stt',
      align: 'center' as const,
      render: (text: any, record: AllUserInfo, index: number) => {
        return (pageNumber - 1) * pageSize + index + 1;
      },
    },
    { title: 'Họ và tên đệm', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Tên', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => {
        if (!text) return '';

        const role = text.toLowerCase();
        let label = '';
        let color: string = 'default';

        switch (role) {
          case 'adminsdh':
            label = 'Phòng ĐT - SĐH';
            color = 'volcano';
            break;
          case 'adminpdt':
            label = 'Phòng ĐT - ĐH';
            color = 'purple';
            break;
          case 'user':
            label = 'Người dùng';
            color = 'geekblue';
            break;
          default:
            label = role;
            color = 'default';
            break;
        }

        return (
          <Tag color={color} style={{ borderRadius: '4px' }}>
            {label}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <h1 style={{ color: 'rgba(0,0,0,1)' }}>Quản lý Tài khoản</h1>
      <div className={styles.filterBar}>
        <div className={styles.filterGroupLeft}>
          <Select
            style={{ minWidth: 180 }}
            onChange={(value: 'ascending' | 'descending') => {
              setSortOrder(value);
              setPageNumber(1);
            }}
            value={sortOrder}
          >
            <Option value="ascending"> Sắp xếp theo Tên (A-Z)</Option>
            <Option value="descending">Sắp xếp theo Tên (Z-A)</Option>
          </Select>
          <Select
            value={roleFilter}
            placeholder="Vai trò"
            style={{ minWidth: 180 }}
            onChange={(value: string) => {
              setRoleFilter(value);
              setPageNumber(1);
            }}
            allowClear
          >
            <Option value="user">Người dùng</Option>
            <Option value="adminPdt">Phòng ĐT - ĐH</Option>
            <Option value="adminSdh">Phòng ĐT - SĐH</Option>
          </Select>
        </div>

        <div className={styles.filterGroupRight}>
          <Input
            placeholder="Tìm theo Tên, Email"
            value={searchText}
            onChange={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onPressEnter={() => handleSearch(searchText || '')}
            allowClear
            prefix={
              <SearchOutlined
                className={isInputFocused ? styles.searchIconFocus : styles.searchIconDefault}
              />
            }
            style={{ minWidth: 240 }}
          />
          <Button
            icon={<ClearOutlined />}
            onClick={handleClearAllFilters}
            onMouseUp={(e) => e.currentTarget.blur()}
            className={styles.clearFilterBtn}
            disabled={isFilterEmpty}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      <div className={styles.table}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="username"
          loading={loading}
          pagination={false}
          className={styles.tableHeader}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: hasFetched ? <Empty description="Không có dữ liệu" /> : <></>,
          }}
        />
        {users.length > 0 && (
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
                tài khoản
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

export default AccountControl;
