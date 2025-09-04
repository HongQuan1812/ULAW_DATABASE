import React from 'react';
import { Card, Row, Col } from 'antd';
import { vienCards } from '@/constants/donvi';
import { history } from 'umi';
import styles from './index.less';

const VienCard: React.FC = () => {
  const handleCardClick = (path: string) => {
    history.push(path);
  };
  return (
    <Row gutter={[16, 16]}>
      {vienCards.map((card) => {
        const { IconComponent } = card;
        return (
          <Col key={card.id} xs={24} sm={12} md={8} lg={6}>
            <a href={card.path}>
              <Card
                className={styles.vienContainer}
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

export default VienCard;
