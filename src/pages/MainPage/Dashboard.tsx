import { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Table, Tag } from 'antd';
import { Pie, Column, Line } from '@ant-design/plots';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import styles from './index.less';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [expandedChart, setExpandedChart] = useState<null | 'pie' | 'column' | 'line'>(null);

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const phases = ['Giai đoạn 1', 'Giai đoạn 2'];

  // Gom nhóm đơn vị ngay từ đầu
  const unitGroups: Record<string, string[]> = {
    'Phòng - Trung tâm': [
      'Trung tâm Tư ván pháp luật & Phục vụ cộng đồng',
      'Trung tâm Học liệu',
      'Thư viện',
      'Phòng Tư vấn tuyển sinh',
      'Phòng Truyền thông & Quan hệ doanh nghiệp',
      'Phòng Tổ chức nhân sự',
      'Phòng Thanh tra - Pháp chế',
      'Phòng Tài chính - Kế toán',
      'Phòng Khoa học công nghệ & Hợp tác phát triển',
      'Phòng Hành chính - Tổng hợp',
      'Phòng Đào tạo Sau đại học',
      'Phòng Đào tạo Đại học',
      'Phòng Đảm bảo chất lượng & Khảo thí',
      'Phòng Công tác sinh viên',
      'Phòng Cơ sở vật chất',
      'Phòng Cơ sở dữ liệu & Công nghệ thông tin',
    ],
    Viện: [
      'Viện Sở hữu trí tuệ, Khởi nghiệp & Đổi mới sáng tạo',
      'Viện Luật so sánh',
      'Viện Đào tạo và Bồi dưỡng',
      'Viện Đào tạo quốc tế',
    ],
    'Văn phòng': ['Văn phòng Đảng Ủy - Hội đồng trường - Công đoàn'],
    Khoa: [
      'Khoa Luật Dân sự',
      'Khoa Luật Hình sự',
      'Khoa Luật Thương mại',
      'Khoa Luật Quốc tế',
      'Khoa Luật Hành chính - Nhà nước',
      'Khoa Quản trị',
      'Khoa Ngoại ngữ pháp lý',
      'Khoa Khoa học cơ bản',
    ],
  };

  // Fake data
  const unitStatus = useMemo(
    () =>
      years.flatMap((year) =>
        phases.flatMap((phase) =>
          Object.entries(unitGroups).flatMap(([category, names]) =>
            names.map((name) => ({
              key: `${name}-${year}-${phase}`,
              year,
              phase,
              name,
              category,
              status: Math.random() > 0.2 ? 'done' : 'pending',
            })),
          ),
        ),
      ),
    [],
  );

  // Filter
  const filtered = useMemo(() => {
    return unitStatus.filter((u) => {
      const matchYear = yearFilter === 'all' || u.year === yearFilter;
      const matchPhase = phaseFilter === 'all' || u.phase === phaseFilter;
      const matchCategory = categoryFilter === 'all' || u.category === categoryFilter;
      return matchYear && matchPhase && matchCategory;
    });
  }, [yearFilter, phaseFilter, categoryFilter, unitStatus]);

  // Stats
  useEffect(() => {
    const total = filtered.length;
    const completed = filtered.filter((u) => u.status === 'done').length;
    const pending = total - completed;
    setStats({ total, completed, pending });
  }, [filtered]);

  const currentYear = new Date().getFullYear();
  const lastThreeYears = [currentYear - 2, currentYear - 1, currentYear];

  // Gom data theo đơn vị
  const groupedData = useMemo(() => {
    const map = new Map<
      string,
      { name: string; category: string; total: number; done: number; pending: number }
    >();

    filtered.forEach((u) => {
      if (!map.has(u.name)) {
        map.set(u.name, { name: u.name, category: u.category, total: 0, done: 0, pending: 0 });
      }
      const item = map.get(u.name)!;
      item.total += 1;
      if (u.status === 'done') item.done += 1;
      else item.pending += 1;
    });

    return Array.from(map.values());
  }, [filtered]);

  // Pie chart
  // Pie chart (thu nhỏ: 1 pie, phóng to: nhiều pie)
  const pieData =
    expandedChart === 'pie'
      ? years.map((y) => {
          const yearData = filtered.filter((u) => u.year === y);
          return {
            year: y,
            data: [
              { type: 'Đã nhập', value: yearData.filter((u) => u.status === 'done').length },
              { type: 'Chưa nhập', value: yearData.filter((u) => u.status === 'pending').length },
            ],
          };
        })
      : [
          {
            year: currentYear,
            data: [
              {
                type: 'Đã nhập',
                value: filtered.filter((u) => u.year === currentYear && u.status === 'done').length,
              },
              {
                type: 'Chưa nhập',
                value: filtered.filter((u) => u.year === currentYear && u.status === 'pending')
                  .length,
              },
            ],
          },
        ];

  const pieConfig = (data: any[]) => ({
    data,
    angleField: 'value',
    colorField: 'type',
    seriesField: 'type',
    label: { text: 'value' },
    color: ['#52c41a', '#faad14'],
    height: 200,
    autoFit: true,
  });

  // Column chart (4 cột theo category)
  // Nếu đang fullscreen thì lấy data từ 2020 đến nay, còn bình thường thì chỉ lấy năm hiện tại
  const columnData =
    expandedChart === 'column'
      ? years.flatMap((year) =>
          Object.keys(unitGroups).map((category) => {
            const doneCount = unitStatus.filter(
              (u) => u.category === category && u.year === year && u.status === 'done',
            ).length;
            return { year: String(year), category, giaiDoanDone: doneCount };
          }),
        )
      : Object.keys(unitGroups).map((category) => {
          const doneCount = unitStatus.filter(
            (u) => u.category === category && u.year === currentYear && u.status === 'done',
          ).length;
          return { year: String(currentYear), category, giaiDoanDone: doneCount };
        });

  const columnConfig = {
    data: columnData,
    isGroup: true, // luôn group theo category
    xField: 'year', // trục ngang luôn là năm
    yField: 'giaiDoanDone',
    seriesField: 'category',
    colorField: 'category', // mỗi category 1 màu khác
    columnWidthRatio: 0.5,
    color: ({ category }: any) => {
      switch (category) {
        case 'Phòng - Trung tâm':
          return '#1890ff';
        case 'Khoa':
          return '#52c41a';
        case 'Viện':
          return '#faad14';
        case 'Văn phòng':
          return '#f5222d';
        default:
          return '#888';
      }
    },
  };

  // Line chart (4 lines theo category)
  const lineData = unitStatus
    .reduce((acc, cur) => {
      const exist = acc.find((a) => a.period === String(cur.year) && a.category === cur.category);
      if (exist) {
        exist.value += cur.status === 'done' ? 1 : 0;
      } else {
        acc.push({
          period: String(cur.year),
          category: cur.category,
          value: cur.status === 'done' ? 1 : 0,
        });
      }
      return acc;
    }, [] as { period: string; category: string; value: number }[])
    .filter(
      (d) =>
        expandedChart === 'line'
          ? true // fullscreen => giữ tất cả các năm
          : lastThreeYears.includes(Number(d.period)), // nhỏ => chỉ 2 năm gần nhất
    )
    .sort((a, b) => a.period.localeCompare(b.period));

  const lineConfig = {
    data: lineData,
    xField: 'period',
    yField: 'value',
    seriesField: 'category',
    colorField: 'category',
    smooth: true,
    point: { shapeField: 'circle' },
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
  };

  return (
    <div>
      <h2 className={styles.title}>Dashboard</h2>

      {/* Stats cards */}
      <Row gutter={16} className={styles.statsRow}>
        <Col span={6}>
          <Card>
            <h4>Tổng dữ liệu</h4>
            <div>{stats.total}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <h4>Đã nhập</h4>
            <div style={{ color: '#52c41a' }}>{stats.completed}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <h4>Chưa nhập</h4>
            <div style={{ color: '#faad14' }}>{stats.pending}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <h4>Tỉ lệ hoàn thành</h4>
            <div>{((stats.completed / (stats.total || 1)) * 100).toFixed(1)}%</div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginTop: 24 }} title="Bộ lọc">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <select
            className={styles.selectBox}
            value={yearFilter}
            onChange={(e) =>
              setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
          >
            <option value="all">Tất cả năm</option>
            {years.map((y) => (
              <option key={y} value={y}>{`Năm ${y}`}</option>
            ))}
          </select>

          <select
            className={styles.selectBox}
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
          >
            <option value="all">Tất cả giai đoạn</option>
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className={styles.selectBox}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả đơn vị</option>
            <option value="Phòng - Trung tâm">Phòng - Trung tâm</option>
            <option value="Khoa">Khoa</option>
            <option value="Viện">Viện</option>
            <option value="Văn phòng">Văn phòng</option>
          </select>
        </div>
      </Card>

      {/* Charts */}
      <Row gutter={16} className={styles.plotsRow}>
        {(expandedChart === null || expandedChart === 'pie') && (
          <Col span={expandedChart ? 24 : 8}>
            <Card
              title="Tỷ lệ nhập liệu"
              extra={
                <a onClick={() => setExpandedChart(expandedChart === 'pie' ? null : 'pie')}>
                  {expandedChart === 'pie' ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </a>
              }
            >
              <div className={styles.chartBox}>
                <Row gutter={16}>
                  {pieData.map((cfg) => (
                    <Col key={cfg.year} span={expandedChart === 'pie' ? 4 : 24}>
                      <Pie {...pieConfig(cfg.data)} />
                      <h4 style={{ textAlign: 'center' }}>Năm {cfg.year}</h4>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        )}

        {(expandedChart === null || expandedChart === 'column') && (
          <Col span={expandedChart ? 24 : 8}>
            <Card
              title="Số giai đoạn đã nhập theo đơn vị"
              extra={
                <a onClick={() => setExpandedChart(expandedChart === 'column' ? null : 'column')}>
                  {expandedChart === 'column' ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </a>
              }
            >
              <div className={styles.chartBox}>
                <Column {...columnConfig} />
              </div>
            </Card>
          </Col>
        )}

        {(expandedChart === null || expandedChart === 'line') && (
          <Col span={expandedChart ? 24 : 8}>
            <Card
              title="Theo loại đơn vị"
              extra={
                <a onClick={() => setExpandedChart(expandedChart === 'line' ? null : 'line')}>
                  {expandedChart === 'line' ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </a>
              }
            >
              <div className={styles.chartBox}>
                <Line {...lineConfig} />
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Card title="Chi tiết theo đơn vị" style={{ marginTop: 24 }}>
        <Table
          rowKey="name"
          dataSource={groupedData}
          pagination={false}
          size="small"
          tableLayout="fixed" // ép theo width
          columns={[
            {
              title: 'Đơn vị',
              dataIndex: 'name',
              key: 'name',
              className: 'col-name',
              width: '35%',
            },
            {
              title: 'Nhóm',
              dataIndex: 'category',
              key: 'category',
              className: 'col-category',
              width: '20%',
            },
            {
              title: 'Tổng',
              dataIndex: 'total',
              key: 'total',
              className: 'col-total',
              width: '10%',
            },
            {
              title: 'Đã nhập',
              dataIndex: 'done',
              key: 'done',
              className: 'col-done',
              width: '10%',
              render: (v) => <Tag color="green">{v}</Tag>,
            },
            {
              title: 'Chưa nhập',
              dataIndex: 'pending',
              key: 'pending',
              className: 'col-pending',
              width: '10%',
              render: (v) => <Tag color="red">{v}</Tag>,
            },
            {
              title: 'Tỉ lệ',
              key: 'ratio',
              className: 'col-ratio',
              width: '15%',
              render: (_, r) => `${((r.done / (r.total || 1)) * 100).toFixed(1)}%`,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
