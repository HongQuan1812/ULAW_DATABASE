import { useEffect, useState } from 'react';
import { Typography, Row, Col, Space, Card, Spin, Form, Table, Empty, Tag, Tooltip } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchUserInfo, UserInfoResponse } from '@/services/auth';
import {
  getProvinceNameByCode,
  ProvinceNameData,
  fetchUserRegisInfo,
  UserRegisInfo,
} from '@/services/user';
import { CustomMessageError } from '@/components/CustomMessage/CustomMessage';
import { getStepInfo } from '@/utils/enrollmentSteps';
import _ from 'lodash';
import styles from './UserInfo.less';
import moment from 'moment';
import { history } from 'umi';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import api from '@/apiEndpoint/index';

const endpoint = api.UMI_API_BASE_URL;

const { Text, Title } = Typography;

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userRegisInfo, setUserRegisInfo] = useState<any>(null);
  const [userProvinceInfo, setUserProvinceInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const usertoken = window.localStorage.getItem('token');

  const getUserProvinceInfo = async (currentUserData: UserInfoResponse['data']) => {
    try {
      const provinceCode = currentUserData.studentContactProvince;
      const wardCode = currentUserData.studentContactWard;

      if (provinceCode && wardCode) {
        const userProvinceInfoResponse: ProvinceNameData = await getProvinceNameByCode(
          provinceCode,
          wardCode,
        );
        if (userProvinceInfoResponse.code === 200 && userProvinceInfoResponse.data) {
          setUserProvinceInfo(userProvinceInfoResponse.data);
        } else {
          setUserProvinceInfo(null);
        }
      } else {
        setUserProvinceInfo(null);
      }
    } catch (err: any) {
      CustomMessageError({ content: 'Lỗi khi tải thông tin địa chỉ người dùng!' });
      setUserProvinceInfo(null);
    }
  };

  const getUserInfo = async () => {
    try {
      const response: UserInfoResponse = await fetchUserInfo(usertoken);
      if (response.code === 200 && response.data) {
        setUserInfo(response.data);
        await getUserProvinceInfo(response.data);
      } else {
        CustomMessageError({ content: 'Không thể tải thông tin cá nhân!' });
        setUserInfo(null);
      }
    } catch (err: any) {
      CustomMessageError({ content: 'Lỗi khi tải thông tin cá nhân!' });
      setUserInfo(null);
    }
  };

  const getUserRegisInfo = async () => {
    try {
      const response: UserRegisInfo = await fetchUserRegisInfo(usertoken);
      if (response.code === 200 && Array.isArray(response.data)) {
        const sortedData = response.data.sort((a, b) => {
          return new Date(b.regisDate).getTime() - new Date(a.regisDate).getTime();
        });
        setUserRegisInfo(sortedData);
      } else {
        setUserRegisInfo(null);
      }
    } catch (err: any) {
      CustomMessageError({ content: 'Không thể tải thông tin hồ sơ!' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataOnMount = async () => {
    setLoading(true);

    await Promise.all([getUserInfo(), getUserRegisInfo()]).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDataOnMount();
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
      fetchDataOnMount();
    });

    return () => {
      connection.off('enrollmentDetailDataChanged');
      connection.stop();
    };
  }, []);

  if (loading === true) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <Card
        title={
          <div className={styles.cardHeader}>
            <ArrowLeftOutlined
              className={styles.cardHeaderBackIcon}
              onClick={() => history.push('/trangchu')}
            />
            <Title level={3} className={styles.cardTitleText}>
              THÔNG TIN CÁ NHÂN
            </Title>
          </div>
        }
        className={styles.card}
      >
        <Row align="middle" gutter={[24, 24]}>
          {/* <Col xs={24} sm={24} md={8} lg={6} xl={5} className={styles.avatarColLeft}>
            <Avatar size={120} icon={<UserOutlined style={{ color: 'black' }} />} />
            <Title level={4} className={styles.titleColLeft}>
              {userInfo?.lastName} {userInfo?.firstName}
            </Title>
          </Col> */}
          <Col span={24}>
            <Form form={form} layout="vertical">
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Title
                    level={5}
                    className={styles.titleColRight}
                    style={{ marginBottom: '1rem' }}
                  >
                    Thông tin cơ bản
                  </Title>
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Row align="middle">
                      <Col span={10}>
                        <Text>{'Số CCCD/Mã định danh'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            {userInfo?.studentIdCard === null ? (
                              <Text style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.35)' }}>
                                Chưa cập nhật
                              </Text>
                            ) : (
                              <Text strong>{userInfo?.studentIdCard}</Text>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={10}>
                        <Text>{'Ngày, tháng, năm sinh'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            {userInfo?.studentDob === null ? (
                              <Text style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.35)' }}>
                                Chưa cập nhật
                              </Text>
                            ) : (
                              <Text strong>{userInfo?.studentDob}</Text>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={10}>
                        <Text>{'Dân tộc'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            {userInfo?.studentEthnicity === null ? (
                              <Text style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.35)' }}>
                                Chưa cập nhật
                              </Text>
                            ) : (
                              <Text strong>{userInfo?.studentEthnicity}</Text>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row align="middle" style={{ marginBottom: 16 }}>
                      <Col span={10}>
                        <Text>{'Giới tính'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            {userInfo?.studentGender === null ? (
                              <Text style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.35)' }}>
                                Chưa cập nhật
                              </Text>
                            ) : userInfo?.studentGender === '0' ? (
                              <Text strong>Nam</Text>
                            ) : (
                              <Text strong>Nữ</Text>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Space>
                </Col>
                <Col xs={24} lg={12}>
                  <Title
                    level={5}
                    className={styles.titleColRight}
                    style={{ marginBottom: '1rem' }}
                  >
                    Thông tin liên lạc
                  </Title>
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Row align="middle">
                      <Col span={10}>
                        <Text>{'Số điện thoại'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            <Text strong>{userInfo?.phoneNumber}</Text>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={10}>
                        <Text>{'Địa chỉ Email'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            <Text strong>{userInfo?.email}</Text>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={10}>
                        <Text>{'Địa chỉ liên hệ'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            {userInfo?.studentFullContactAddress === null ? (
                              <Text style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.35)' }}>
                                Chưa cập nhật
                              </Text>
                            ) : (
                              <Text strong>{userInfo?.studentFullContactAddress}</Text>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row align="middle" style={{ marginBottom: 16 }}>
                      <Col span={10}>
                        <Text>{'Địa chỉ thường trú'}</Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item noStyle>
                          <div style={{ textAlign: 'right' }}>
                            {userInfo?.studentContactAddress === null ? (
                              <Text style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.35)' }}>
                                Chưa cập nhật
                              </Text>
                            ) : (
                              <Text strong>
                                {userInfo?.studentContactAddress}
                                {''}
                                {userProvinceInfo?.wardName ? `, ${userProvinceInfo.wardName}` : ''}
                                {''}
                                {userProvinceInfo?.provinceName
                                  ? `, ${userProvinceInfo.provinceName}`
                                  : ''}
                                {''}
                              </Text>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Space>
                </Col>
                <Col xs={24} lg={24}>
                  <Title
                    level={5}
                    className={styles.titleColRight}
                    style={{ marginBottom: '1rem' }}
                  >
                    Thông tin hồ sơ
                  </Title>
                  {userRegisInfo !== null && userRegisInfo.length > 0 ? (
                    <Table
                      dataSource={userRegisInfo}
                      pagination={false}
                      rowKey="enrollmentCode"
                      bordered
                      scroll={{ x: 600 }}
                      className={styles.tableHeader}
                      columns={[
                        {
                          title: 'Mã hồ sơ',
                          dataIndex: 'enrollmentCode',
                          key: 'enrollmentCode',
                          width: 170,
                          align: 'center',
                          render: (text: string, record: any) => (
                            <Tooltip title={`Xem chi tiết Hồ sơ ${text}`}>
                              <a
                                className={styles.enrollmentCode}
                                onClick={() =>
                                  history.push(`/thongtin-canhan/${record.enrollmentCode}`)
                                }
                              >
                                {text}
                              </a>
                            </Tooltip>
                          ),
                        },
                        {
                          title: 'Hệ đào tạo',
                          dataIndex: 'trainingSystemType',
                          key: 'trainingSystemType',
                          width: 200,
                          align: 'center',
                          render: (value: string) => {
                            switch (value) {
                              case 'VuaLamVuaHoc':
                                return 'Vừa Làm Vừa Học';
                              case 'DaoTaoTuXa':
                                return 'Đào Tạo Từ Xa';
                              case 'ChinhQuy':
                                return 'Chính Quy';
                              case 'SauDaiHoc':
                                return 'Sau Đại Học';
                              default:
                                return 'Không xác định';
                            }
                          },
                        },
                        {
                          title: 'Ngày nộp',
                          dataIndex: 'regisDate',
                          key: 'regisDate',
                          width: 100,
                          align: 'center',
                          render: (date: string) => moment(date).format('DD/MM/YYYY'),
                        },
                        {
                          title: 'Trạng thái',
                          dataIndex: 'step',
                          key: 'step',
                          width: 100,
                          align: 'center',
                          render: (step) => {
                            const { label, color } = getStepInfo(step ?? 0);
                            return <Tag color={color}>{label}</Tag>;
                          },
                        },
                        {
                          title: 'Người xử lý',
                          dataIndex: 'adminName',
                          key: 'adminName',
                          width: 160,
                          align: 'center',
                          render: (text: string | undefined) => {
                            return text?.trim() ? text : '-';
                          },
                        },
                        {
                          title: 'Ghi chú',
                          dataIndex: 'adminMess',
                          key: 'adminMess',
                          width: 300,
                          align: 'center',
                          render: (text: string | undefined) => {
                            try {
                              const parsed = JSON.parse(text || '[]');
                              if (!Array.isArray(parsed) || parsed.length === 0)
                                return <span>-</span>;

                              return (
                                <div style={{ textAlign: 'left' }}>
                                  {parsed
                                    .slice()
                                    .reverse()
                                    .map((item: string, index: number) => {
                                      const parts = item.split('-');
                                      const rawContent = parts.slice(2).join('-') || '';
                                      const lines = rawContent.split('\n');

                                      const cleanedLines = lines
                                        .map((line) =>
                                          line.trim().replace(/^(\+\)|[-*•+_)\]])\s*/, ''),
                                        )
                                        .filter((line) => !!line);

                                      return (
                                        <div
                                          key={index}
                                          style={{
                                            marginBottom: index === parsed.length - 1 ? 0 : 8,
                                          }}
                                        >
                                          {cleanedLines.map((line, idx) => (
                                            <div key={idx}>• {line}</div>
                                          ))}
                                        </div>
                                      );
                                    })}
                                </div>
                              );
                            } catch (e) {
                              return null;
                            }
                          },
                        },
                      ]}
                    />
                  ) : (
                    <Table
                      locale={{
                        emptyText: <Empty description="Không có dữ liệu" />,
                      }}
                      className={styles.tableHeader}
                      columns={[
                        {
                          title: 'Mã hồ sơ',
                          dataIndex: 'enrollmentCode',
                          align: 'center',
                        },
                        {
                          title: 'Hệ đào tạo',
                          dataIndex: 'trainingSystemType',
                          align: 'center',
                        },
                        {
                          title: 'Ngày nộp',
                          dataIndex: 'regisDate',
                          align: 'center',
                        },
                        {
                          title: 'Trạng thái',
                          dataIndex: 'step',
                          align: 'center',
                        },
                        {
                          title: 'Người xử lý',
                          dataIndex: 'adminName',
                          align: 'center',
                        },
                        {
                          title: 'Ghi chú',
                          dataIndex: 'adminMess',
                          align: 'center',
                        },
                      ]}
                      dataSource={[]}
                      pagination={false}
                      bordered
                    />
                  )}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserInfo;
