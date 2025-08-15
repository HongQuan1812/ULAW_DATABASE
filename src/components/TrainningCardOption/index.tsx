import React from 'react';
import { Card } from 'antd';
import styles from './index.less';

interface TrainingOptionCardProps {
  iconType: 'remote' | 'work-study' | 'regular' | 'postgraduate';
  title: string;
  description: string[];
  imageSrc: string;
  isSelected: boolean;
  trainingKey: string;
  onClick: (key: string) => void;
}

const TrainingOptionCard: React.FC<TrainingOptionCardProps> = ({
  title,
  description,
  imageSrc,
  trainingKey,
  onClick,
}) => {
  return (
    <Card
      className={styles.trainingCard}
      hoverable
      onClick={() => onClick(trainingKey)}
      style={
        trainingKey === 'regular_vb2' ||
        trainingKey === 'remote_vb2' ||
        trainingKey === 'work_study_vb2'
          ? { border: '2px solid #2C4F62' }
          : trainingKey === 'remote_university' || trainingKey === 'work_study_university'
          ? { border: '2px solid #1890ff' }
          : trainingKey === 'postgraduate'
          ? { border: '2px solid #dc5539' }
          : { border: '2px solid #722ed1' }
      }
    >
      <div className={styles.iconContainer}>
        <h3
          className={styles.cardTitle}
          style={
            trainingKey === 'regular_vb2' ||
            trainingKey === 'remote_vb2' ||
            trainingKey === 'work_study_vb2'
              ? { color: '#2C4F62' }
              : trainingKey === 'remote_university' || trainingKey === 'work_study_university'
              ? { color: '#1890ff' }
              : trainingKey === 'postgraduate'
              ? { color: '#dc5539' }
              : { color: '#722ed1' }
          }
        >
          {title}
        </h3>
      </div>
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={title} className={styles.cardImage} />
      </div>
      <div className={styles.description}>
        {description.map((line, index) => (
          <p
            key={index}
            style={
              trainingKey === 'regular_vb2' ||
              trainingKey === 'remote_vb2' ||
              trainingKey === 'work_study_vb2'
                ? { color: '#2C4F62' }
                : trainingKey === 'remote_university' || trainingKey === 'work_study_university'
                ? { color: '#1890ff' }
                : trainingKey === 'postgraduate'
                ? { color: '#dc5539' }
                : { color: '#722ed1' }
            }
          >
            {line}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default TrainingOptionCard;
