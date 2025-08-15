import { useState } from 'react';
import { Row, Col, Segmented } from 'antd';
import TrainingOptionCard from '@/components/TrainningCardOption';
import styles from './MainPage.less';
import { LaptopOutlined, ReadOutlined, BookOutlined, ContainerOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface TrainingCardData {
  key: string;
  subTitle: string;
  imageSrc: string;
  description: string[];
}

interface TrainingGroupData {
  id: string;
  groupTitle: string;
  iconType: 'remote' | 'work-study' | 'regular' | 'postgraduate';
  cards: TrainingCardData[];
}

const trainingGroups: TrainingGroupData[] = [
  {
    id: 'group_regular',
    groupTitle: 'CHÍNH QUY',
    iconType: 'regular',
    cards: [
      {
        key: 'regular_vb2',
        subTitle: 'Văn bằng 2',
        imageSrc: '/vb2.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Đại học'],
      },
      {
        key: 'regular_associate',
        subTitle: 'Liên thông',
        imageSrc: '/lt.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Trung cấp hoặc Cao đẳng'],
      },
    ],
  },
  {
    id: 'group_remote',
    groupTitle: 'ĐÀO TẠO TỪ XA',
    iconType: 'remote',
    cards: [
      {
        key: 'remote_university',
        subTitle: 'Đại học',
        imageSrc: '/dh.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo THPT'],
      },
      {
        key: 'remote_vb2',
        subTitle: 'Văn bằng 2',
        imageSrc: '/vb2.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Đại học'],
      },
      {
        key: 'remote_associate',
        subTitle: 'Liên thông',
        imageSrc: '/lt.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Trung cấp hoặc Cao đẳng'],
      },
    ],
  },
  {
    id: 'group_work_study',
    groupTitle: 'VỪA LÀM VỪA HỌC',
    iconType: 'work-study',
    cards: [
      {
        key: 'work_study_university',
        subTitle: 'Đại học',
        imageSrc: '/dh.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo THPT'],
      },
      {
        key: 'work_study_vb2',
        subTitle: 'Văn bằng 2',
        imageSrc: '/vb2.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Đại học'],
      },
      {
        key: 'work_study_associate',
        subTitle: 'Liên thông',
        imageSrc: '/lt.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Trung cấp hoặc Cao đẳng'],
      },
    ],
  },
  {
    id: 'group_postgraduate',
    groupTitle: 'SAU ĐẠI HỌC',
    iconType: 'postgraduate',
    cards: [
      {
        key: 'postgraduate',
        subTitle: 'Sau đại học',
        imageSrc: '/sdh.jpg',
        description: ['Dành cho người đã tốt nghiệp chương trình đào tạo Đại học trở lên'],
      },
    ],
  },
];

const MainPage = () => {
  const [selectedTrainingKey, setSelectedTrainingKey] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState(trainingGroups[0].id);

  const handleSelectTrainingType = (key: string) => {
    setSelectedTrainingKey(key);

    if (key === 'remote_university') {
      history.push('/daotao-tuxa/daihoc');
    } else if (key === 'remote_associate') {
      history.push('/daotao-tuxa/lienthong');
    } else if (key === 'remote_vb2') {
      history.push('/daotao-tuxa/vanbang2');
    } else if (key === 'work_study_university') {
      history.push('/vualam-vuahoc/daihoc');
    } else if (key === 'work_study_associate') {
      history.push('/vualam-vuahoc/lienthong');
    } else if (key === 'work_study_vb2') {
      history.push('/vualam-vuahoc/vanbang2');
    } else if (key === 'regular_vb2') {
      history.push('/chinhquy/vanbang2');
    } else if (key === 'postgraduate') {
      history.push('/saudaihoc');
    } else {
      history.push('/chinhquy/lienthong');
    }
  };

  const segmentedOptions = trainingGroups.map((group) => ({
    label: (
      <span>
        {group.iconType === 'remote' && <LaptopOutlined className={styles.trainingSegmentedIcon} />}
        {group.iconType === 'work-study' && (
          <ReadOutlined className={styles.trainingSegmentedIcon} />
        )}
        {group.iconType === 'postgraduate' && (
          <ContainerOutlined className={styles.trainingSegmentedIcon} />
        )}
        {group.iconType === 'regular' && <BookOutlined className={styles.trainingSegmentedIcon} />}
        {group.groupTitle}
      </span>
    ),
    value: group.id,
  }));

  const currentGroup = trainingGroups.find((g) => g.id === selectedGroupId);

  return (
    <div className={styles.selectionContainer}>
      <h2 className={styles.instructionText}>VUI LÒNG CHỌN HÌNH THỨC ĐÀO TẠO ĐỂ ĐĂNG KÝ</h2>
      <Segmented
        block
        options={segmentedOptions}
        value={selectedGroupId}
        onChange={(val) => setSelectedGroupId(val as string)}
        className={styles.trainingSegmented}
      />

      {currentGroup && (
        <Row
          gutter={[16, 16]}
          justify="center"
          className={styles.groupCardsRow}
          style={{ marginTop: 20 }}
        >
          {currentGroup.cards.map((card) => (
            <Col key={card.key} xs={24} sm={12} md={8} lg={6} className={styles.cardCol}>
              <TrainingOptionCard
                iconType={currentGroup.iconType}
                title={card.subTitle}
                imageSrc={card.imageSrc}
                description={card.description}
                isSelected={selectedTrainingKey === card.key}
                trainingKey={card.key}
                onClick={handleSelectTrainingType}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MainPage;
