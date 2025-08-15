import React from 'react';
import { Card, Row, Col } from 'antd';
import { khoaCard } from '@/constants/donvi';
import { history } from 'umi';
import styles from './index.less';

const KhoaCard: React.FC = () => {
  const handleCardClick = (path: string) => {
    history.push(path);
  };
  return (
    <Row gutter={[16, 16]}>
      {khoaCard.map((card) => {
        const { IconComponent } = card;
        return (
          <Col key={card.id} xs={24} sm={12} md={8} lg={6}>
            <a href={card.path}>
              <Card
                className={styles.khoaContainer}
                onClick={() => handleCardClick(card.path)}
                hoverable
              >
                {<IconComponent />} {card.title}
              </Card>
            </a>
          </Col>
        );
      })}
    </Row>
  );
};

export default KhoaCard;
