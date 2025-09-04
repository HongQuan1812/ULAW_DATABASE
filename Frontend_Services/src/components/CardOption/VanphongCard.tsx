import React from 'react';
import { Card, Row, Col } from 'antd';
import { vanphongCard } from '@/constants/donvi';
import { history } from 'umi';
import styles from './index.less';

const VanphongCard: React.FC = () => {
  const handleCardClick = (path: string) => {
    history.push(path);
  };
  return (
    <Row gutter={[16, 16]}>
      {vanphongCard.map((card) => {
        const { IconComponent } = card;
        return (
          <Col key={card.id} xs={24} sm={12} md={8} lg={6}>
            <a href={card.path}>
              <Card
                className={styles.vanphongContainer}
                hoverable
                onClick={() => handleCardClick(card.path)}
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

export default VanphongCard;
