import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button } from './styled/Button';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { Badge } from './styled/Badge';
import { ArrowLeftIcon, ChevronRightIcon } from './styled/Icons';
import { useToast } from './styled/Toast';
import { theme } from './styled/theme';
import * as storage from '../utils/storage';
import type { GroupSession, FoodCategory } from '../App';

interface RecommendationResultProps {
  groupSession: GroupSession;
  onBack: () => void;
  onSessionUpdate: (session: GroupSession) => void;
}

const foodCategories = {
  korean: { name: '한식', emoji: '🍚' },
  chinese: { name: '중식', emoji: '🥢' },
  japanese: { name: '일식', emoji: '🍣' },
  western: { name: '양식', emoji: '🍝' },
  fast: { name: '패스트푸드', emoji: '🍔' },
  cafe: { name: '카페/디저트', emoji: '☕' },
  asian: { name: '아시안', emoji: '🍜' },
  etc: { name: '기타', emoji: '🍽️' }
};

interface RecommendationItem {
  category: FoodCategory;
  score: number;
  likeCount: number;
  dislikeCount: number;
  satisfactionRate: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .back-button {
    background: transparent;
    border: 1px solid transparent;
    color: ${theme.colors.textSecondary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
      color: ${theme.colors.text};
    }
  }
  
  .header-content {
    flex: 1;
    
    h2 {
      color: ${theme.colors.primary};
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    p {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
      margin: 0;
    }
  }
  
  .refresh-button {
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 0;
  
  .loading-emoji {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    color: ${theme.colors.text};
  }
  
  .loading-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    
    .step {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
    }
  }
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 4px solid ${theme.colors.primary};
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RankingCard = styled(Card)`
  .ranking-header {
    padding: 1.5rem;
    
    .title {
      font-size: 0.875rem;
      margin: 0;
      color: ${theme.colors.text};
    }
  }
  
  .ranking-content {
    padding: 0 1.5rem 1.5rem;
    
    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;

const RankingItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  
  ${props => props.isActive ? `
    background: ${theme.colors.primary}22;
  ` : `
    &:hover {
      background: ${theme.colors.surface};
    }
  `}
  
  .rank-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .rank-icon {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .emoji {
      font-size: 1.125rem;
    }
    
    .name {
      font-size: 0.875rem;
      color: ${theme.colors.text};
    }
  }
  
  .satisfaction {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
  }
`;

const CurrentRecommendationCard = styled(Card)<{ isTop: boolean }>`
  ${props => props.isTop && `
    background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);
    border-color: #fcd34d;
  `}
  
  .recommendation-header {
    text-align: center;
    padding: 1.5rem;
    
    .rank-title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      
      .rank-icon {
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      h3 {
        font-size: 1.125rem;
        margin: 0;
        color: ${theme.colors.text};
      }
    }
    
    .food-emoji {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    
    .food-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${theme.colors.text};
      margin: 0;
    }
  }
  
  .recommendation-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .satisfaction-display {
    text-align: center;
    
    .percentage {
      font-size: 2rem;
      margin-bottom: 0.25rem;
      color: ${theme.colors.text};
    }
    
    .label {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
    }
  }
  
  .vote-summary {
    display: flex;
    justify-content: center;
    gap: 1rem;
    font-size: 0.875rem;
    
    .vote-item {
      text-align: center;
      
      .count {
        margin-bottom: 0.25rem;
        
        &.positive {
          color: ${theme.colors.success};
        }
        
        &.negative {
          color: ${theme.colors.error};
        }
      }
      
      .vote-label {
        font-size: 0.75rem;
        color: ${theme.colors.textSecondary};
      }
    }
  }
  
  .participants-reactions {
    .section-title {
      font-size: 0.875rem;
      margin: 0 0 0.5rem 0;
      color: ${theme.colors.text};
    }
    
    .reactions-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .reaction-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.875rem;
      
      .participant-name {
        color: ${theme.colors.text};
      }
    }
  }
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .nav-button {
    flex: 1;
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .nav-info {
    text-align: center;
    padding: 0 1rem;
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
  }
`;

const RestartButton = styled(Button)`
  width: 100%;
  background: transparent;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.surface};
  }
`;

// Icons
const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22h16" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" stroke="#eab308" strokeWidth="2" fill="#eab308" fillOpacity="0.2"/>
  </svg>
);

const MedalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="6" stroke="#9ca3af" strokeWidth="2" fill="#9ca3af" fillOpacity="0.2"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="6" stroke="#ea580c" strokeWidth="2" fill="#ea580c" fillOpacity="0.2"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RotateCcwIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function RecommendationResult({ groupSession, onBack, onSessionUpdate }: RecommendationResultProps) {
  const { showToast } = useToast();
  const [currentRank, setCurrentRank] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    loadOrCalculateRecommendations();
  }, [groupSession]);

  const loadOrCalculateRecommendations = () => {
    // 캐시된 추천 결과가 있는지 확인
    const cachedRecommendations = storage.getRecommendation(groupSession.id, groupSession.participants);
    
    if (cachedRecommendations) {
      // 캐시된 결과 사용
      setRecommendations(cachedRecommendations);
      setCurrentRank(0);
      return;
    }

    // 새로 계산
    calculateRecommendations();
  };

  const calculateRecommendations = () => {
    setIsCalculating(true);
    
    // 3초 후 결과 계산 (실제로는 즉시 계산되지만 UX를 위해 지연)
    setTimeout(() => {
      const categoryScores = new Map<FoodCategory, { likes: number; dislikes: number }>();
      
      // 각 카테고리별 점수 계산
      Object.keys(foodCategories).forEach(category => {
        categoryScores.set(category as FoodCategory, { likes: 0, dislikes: 0 });
      });

      groupSession.participants.forEach(participant => {
        participant.likes.forEach(category => {
          const current = categoryScores.get(category) || { likes: 0, dislikes: 0 };
          categoryScores.set(category, { ...current, likes: current.likes + 2 }); // 좋아하는 것은 2점
        });

        participant.dislikes.forEach(category => {
          const current = categoryScores.get(category) || { likes: 0, dislikes: 0 };
          categoryScores.set(category, { ...current, dislikes: current.dislikes + 3 }); // 싫어하는 것은 -3점
        });
      });

      // 추천 리스트 생성 및 정렬 (결정적 알고리즘 사용)
      const results: RecommendationItem[] = Array.from(categoryScores.entries())
        .map(([category, scores]) => {
          const netScore = scores.likes - scores.dislikes;
          const satisfactionRate = scores.dislikes === 0 
            ? (scores.likes > 0 ? 100 : 80) 
            : Math.max(0, Math.round((scores.likes / (scores.likes + scores.dislikes)) * 100));
          
          return {
            category,
            score: netScore,
            likeCount: Math.round(scores.likes / 2),
            dislikeCount: Math.round(scores.dislikes / 3),
            satisfactionRate
          };
        })
        .sort((a, b) => {
          // 1순위: 반대표가 없는 것들 중 찬성이 많은 것
          if (a.dislikeCount === 0 && b.dislikeCount > 0) return -1;
          if (b.dislikeCount === 0 && a.dislikeCount > 0) return 1;
          
          // 2순위: 전체적인 점수가 높은 것
          if (a.score !== b.score) return b.score - a.score;
          
          // 3순위: 만족도가 높은 것
          if (a.satisfactionRate !== b.satisfactionRate) return b.satisfactionRate - a.satisfactionRate;
          
          // 4순위: 카테고리 이름 순 (일관성을 위해)
          return a.category.localeCompare(b.category);
        });

      setRecommendations(results);
      setCurrentRank(0);
      setIsCalculating(false);
      
      // 추천 결과를 로컬 스토리지에 저장
      storage.saveRecommendation(groupSession.id, results, groupSession.participants);
      
      showToast('추천 결과가 계산되었습니다!', 'success');
    }, 3000);
  };

  const forceRecalculate = () => {
    // 기존 추천 결과 삭제
    storage.deleteRecommendation(groupSession.id);
    // 새로 계산
    calculateRecommendations();
    showToast('새로운 추천을 계산중입니다...', 'info');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <TrophyIcon />;
      case 1: return <MedalIcon />;
      case 2: return <AwardIcon />;
      default: return <span style={{ width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{rank + 1}</span>;
    }
  };

  const getRankTitle = (rank: number) => {
    switch (rank) {
      case 0: return '🏆 최고의 선택';
      case 1: return '🥈 차선책';
      case 2: return '🥉 3순위';
      default: return `${rank + 1}순위`;
    }
  };

  const getCurrentRecommendation = () => {
    return recommendations[currentRank];
  };

  const nextRecommendation = () => {
    if (currentRank < recommendations.length - 1 && currentRank < 2) {
      setCurrentRank(currentRank + 1);
    }
  };

  const prevRecommendation = () => {
    if (currentRank > 0) {
      setCurrentRank(currentRank - 1);
    }
  };

  if (isCalculating) {
    return (
      <LoadingContainer>
        <div className="loading-emoji">🤔</div>
        <h2>최적의 메뉴를 찾고 있어요...</h2>
        <div className="loading-steps">
          <div className="step">✨ 모든 참여자의 선호도 분석 중</div>
          <div className="step">🎯 최고의 만족도 조합 계산 중</div>
          <div className="step">🍽️ 추천 메뉴 준비 중</div>
        </div>
        <div className="spinner"></div>
      </LoadingContainer>
    );
  }

  const currentRec = getCurrentRecommendation();

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <Button variant="ghost" size="sm" onClick={onBack} className="back-button">
          <ArrowLeftIcon size={16} />
        </Button>
        <div className="header-content">
          <h2>{groupSession.title}</h2>
          <p>추천 결과</p>
        </div>
        <Button variant="outline" size="sm" onClick={forceRecalculate} className="refresh-button">
          <RotateCcwIcon />
        </Button>
      </Header>

      {/* 실시간 추천 순위 (3위까지) */}
      <RankingCard>
        <div className="ranking-header">
          <h3 className="title">실시간 추천 순위</h3>
        </div>
        <div className="ranking-content">
          <div className="ranking-list">
            {recommendations.slice(0, 3).map((rec, index) => (
              <RankingItem
                key={rec.category}
                isActive={index === currentRank}
                onClick={() => setCurrentRank(index)}
              >
                <div className="rank-info">
                  <div className="rank-icon">
                    {getRankIcon(index)}
                  </div>
                  <span className="emoji">{foodCategories[rec.category].emoji}</span>
                  <span className="name">{foodCategories[rec.category].name}</span>
                </div>
                <span className="satisfaction">{rec.satisfactionRate}%</span>
              </RankingItem>
            ))}
          </div>
        </div>
      </RankingCard>

      {/* 현재 추천 */}
      {currentRec && (
        <CurrentRecommendationCard isTop={currentRank === 0}>
          <div className="recommendation-header">
            <div className="rank-title-container">
              <div className="rank-icon">
                {getRankIcon(currentRank)}
              </div>
              <h3>{getRankTitle(currentRank)}</h3>
            </div>
            <div className="food-emoji">{foodCategories[currentRec.category].emoji}</div>
            <h2 className="food-name">
              {foodCategories[currentRec.category].name}
            </h2>
          </div>
          <div className="recommendation-content">
            {/* 만족도 */}
            <div className="satisfaction-display">
              <div className="percentage">{currentRec.satisfactionRate}%</div>
              <div className="label">예상 만족도</div>
            </div>

            {/* 상세 정보 */}
            <div className="vote-summary">
              <div className="vote-item">
                <div className="count positive">👍 {currentRec.likeCount}명</div>
                <div className="vote-label">찬성</div>
              </div>
              <div className="vote-item">
                <div className="count negative">👎 {currentRec.dislikeCount}명</div>
                <div className="vote-label">반대</div>
              </div>
            </div>

            {/* 참여자별 반응 */}
            <div className="participants-reactions">
              <h4 className="section-title">참여자별 반응</h4>
              <div className="reactions-list">
                {groupSession.participants.map(participant => {
                  const likes = participant.likes.includes(currentRec.category);
                  const dislikes = participant.dislikes.includes(currentRec.category);
                  
                  return (
                    <div key={participant.id} className="reaction-item">
                      <span className="participant-name">{participant.name}</span>
                      <Badge 
                        variant={likes ? 'default' : dislikes ? 'destructive' : 'secondary'}
                      >
                        {likes ? '👍 좋아함' : dislikes ? '👎 싫어함' : '😐 보통'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CurrentRecommendationCard>
      )}

      {/* 네비게이션 */}
      <Navigation>
        <Button
          onClick={prevRecommendation}
          disabled={currentRank === 0}
          className="nav-button"
        >
          이전 추천
        </Button>
        
        <div className="nav-info">
          {currentRank + 1} / {Math.min(recommendations.length, 3)}
        </div>
        
        <Button
          onClick={nextRecommendation}
          disabled={currentRank === 2 || currentRank === recommendations.length - 1}
          className="nav-button"
        >
          다음 추천
          <ChevronRightIcon size={16} style={{ marginLeft: '0.25rem' }} />
        </Button>
      </Navigation>

      {/* 다시 시작하기 */}
      <RestartButton onClick={onBack}>
        새로운 그룹 만들기
      </RestartButton>
    </Container>
  );
}