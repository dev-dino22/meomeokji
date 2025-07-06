import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button } from './styled/Button';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { Badge } from './styled/Badge';
import { Input } from './styled/Input';
import { Modal } from './styled/Modal';
import { ArrowLeftIcon, CheckIcon, XIcon } from './styled/Icons';
import { useToast } from './styled/Toast';
import { getRecommendation, saveSession } from '../utils/storage';
import { theme } from './styled/theme';
import type { GroupSession, FoodCategory, Participant } from '../App';

interface GroupManagementProps {
  groupSession: GroupSession;
  onBack: () => void;
  onSessionUpdate: (session: GroupSession) => void;
  onGetRecommendation: (session: GroupSession) => void;
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
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%);
`;

const Content = styled.div`
  max-width: 96rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
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
    
    h1 {
      font-size: 1.5rem;
      color: ${theme.colors.primary};
      margin: 0 0 0.25rem 0;
      font-weight: 700;
    }
    
    p {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
      margin: 0;
    }
  }
`;

const StatusCard = styled(Card)`
  margin-bottom: 2rem;
  
  .status-content {
    padding: 1.5rem;
  }
  
  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .status-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
    
    .status-info {
      .label {
        font-size: 0.875rem;
        color: ${theme.colors.textSecondary};
        margin: 0;
      }
      
      .value {
        font-size: 0.875rem;
        margin: 0.125rem 0 0 0;
      }
      
      &.completed .value {
        color: ${theme.colors.success};
      }
      
      &.active .value {
        color: ${theme.colors.primary};
      }
      
      &.waiting .value {
        color: ${theme.colors.textSecondary};
      }
    }
  }
  
  .progress-bar {
    width: 100%;
    height: 0.5rem;
    background: ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: ${theme.colors.primary};
      transition: width 0.3s ease-in-out;
    }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ParticipantsCard = styled(Card)`
  .participants-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${theme.colors.text};
    }
  }
  
  .participants-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .add-participant-form {
    display: flex;
    gap: 0.5rem;
    
    .input-container {
      flex: 1;
    }
  }
  
  .add-participant-button {
    width: 100%;
    background: ${theme.colors.primary};
    color: white;
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  }
  
  .participants-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  
  .participant-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .name {
      font-size: 0.875rem;
      color: ${theme.colors.text};
    }
  }
  
  .remove-button {
    background: transparent;
    border: 1px solid transparent;
    color: ${theme.colors.error};
    
    &:hover:not(:disabled) {
      background: #fef2f2;
      border-color: ${theme.colors.error};
    }
  }
`;

const InviteCard = styled(Card)`
  .invite-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${theme.colors.text};
    }
  }
  
  .invite-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .description {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    margin: 0;
  }
  
  .link-container {
    display: flex;
    gap: 0.5rem;
    
    .link-input {
      flex: 1;
      font-size: 0.875rem;
    }
  }
`;

const RestrictionsCard = styled(Card)`
  .restrictions-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${theme.colors.text};
    }
  }
  
  .restrictions-content {
    padding: 0 1.5rem 1.5rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem 0;
    color: ${theme.colors.textSecondary};
    
    .empty-icon {
      width: 2rem;
      height: 2rem;
      margin: 0 auto 0.5rem;
      color: ${theme.colors.textSecondary};
    }
    
    p {
      font-size: 0.875rem;
      margin: 0;
    }
  }
  
  .restrictions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .restriction-section {
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      
      .section-title {
        font-size: 0.875rem;
        margin: 0;
        
        &.cannot-eat {
          color: ${theme.colors.error};
        }
        
        &.dislike {
          color: ${theme.colors.primary};
        }
      }
    }
    
    .badges-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  }
  
  .perfect-state {
    text-align: center;
    padding: 1rem 0;
    color: ${theme.colors.textSecondary};
    
    .perfect-icon {
      width: 2rem;
      height: 2rem;
      margin: 0 auto 0.5rem;
      color: ${theme.colors.textSecondary};
    }
    
    p {
      font-size: 0.875rem;
      margin: 0;
    }
  }
`;

const RecommendationsCard = styled(Card)`
  .recommendations-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${theme.colors.text};
    }
  }
  
  .recommendations-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .view-details-button {
    width: 100%;
    background: ${theme.colors.primary};
    color: white;
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  }
  
  .note {
    padding-top: 0.75rem;
    border-top: 1px solid ${theme.colors.border};
    text-align: center;
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};
  }
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  
  .rec-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .rank {
      font-size: 1.125rem;
    }
    
    .food-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .emoji {
        font-size: 1.5rem;
      }
      
      .details {
        .name {
          font-size: 0.875rem;
          color: ${theme.colors.text};
          margin: 0;
        }
        
        .votes {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          
          .positive {
            color: ${theme.colors.success};
          }
          
          .negative {
            color: ${theme.colors.error};
          }
        }
      }
    }
  }
  
  .rec-right {
    text-align: right;
    
    .percentage {
      font-size: 0.875rem;
      color: ${theme.colors.text};
      margin: 0;
    }
    
    .label {
      font-size: 0.75rem;
      color: ${theme.colors.textSecondary};
      margin: 0;
    }
  }
`;

// Icons
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="17" y1="11" x2="23" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserMinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <line x1="17" y1="11" x2="23" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Share2Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ThumbsDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17 14V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0L9.937 15.5Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 3v4" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 5h-4" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 17v2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 18H3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// 안전한 카테고리 정보 가져오기 함수
const getFoodCategoryInfo = (category: string) => {
  const categoryInfo = foodCategories[category as keyof typeof foodCategories];
  return categoryInfo || { name: category, emoji: '🍽️' };
};

export function GroupManagement({ groupSession, onBack, onSessionUpdate, onGetRecommendation }: GroupManagementProps) {
  const { showToast } = useToast();
  const [newParticipantName, setNewParticipantName] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    calculateCurrentRecommendations();
  }, [groupSession]);

  const calculateCurrentRecommendations = () => {
    // 캐시된 추천 결과 확인
    const cachedRecommendations = getRecommendation(groupSession.id, groupSession.participants);
    
    if (cachedRecommendations) {
      setRecommendations(cachedRecommendations);
      return;
    }

    // 진행 중인 실시간 계산
    const categoryScores = new Map<FoodCategory, { likes: number; dislikes: number }>();
    
    // 각 카테고리별 점수 계산
    Object.keys(foodCategories).forEach(category => {
      categoryScores.set(category as FoodCategory, { likes: 0, dislikes: 0 });
    });

    groupSession.participants.forEach(participant => {
      if (participant.completed) {
        // 기존 likes/dislikes 처리
        participant.likes?.forEach(category => {
          const current = categoryScores.get(category) || { likes: 0, dislikes: 0 };
          categoryScores.set(category, { ...current, likes: current.likes + 2 });
        });

        participant.dislikes?.forEach(category => {
          const current = categoryScores.get(category) || { likes: 0, dislikes: 0 };
          categoryScores.set(category, { ...current, dislikes: current.dislikes + 3 });
        });

        // 새로운 FoodSelection 구조 처리
        participant.cravingFoods?.forEach(food => {
          if (food.category && foodCategories[food.category as keyof typeof foodCategories]) {
            const current = categoryScores.get(food.category as FoodCategory) || { likes: 0, dislikes: 0 };
            categoryScores.set(food.category as FoodCategory, { ...current, likes: current.likes + 2 });
          }
        });

        participant.notCravingFoods?.forEach(food => {
          if (food.category && foodCategories[food.category as keyof typeof foodCategories]) {
            const current = categoryScores.get(food.category as FoodCategory) || { likes: 0, dislikes: 0 };
            categoryScores.set(food.category as FoodCategory, { ...current, dislikes: current.dislikes + 3 });
          }
        });
      }
    });

    // 추천 리스트 생성 및 정렬
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
        if (a.dislikeCount === 0 && b.dislikeCount > 0) return -1;
        if (b.dislikeCount === 0 && a.dislikeCount > 0) return 1;
        if (a.score !== b.score) return b.score - a.score;
        if (a.satisfactionRate !== b.satisfactionRate) return b.satisfactionRate - a.satisfactionRate;
        return a.category.localeCompare(b.category);
      });

    setRecommendations(results);
  };

  const getGroupStatus = () => {
    const completedCount = groupSession.participants.filter(p => p.completed).length;
    const totalCount = groupSession.participants.length;
    
    if (completedCount === totalCount && totalCount > 0) {
      return { status: 'completed', text: '완료', color: 'completed', icon: CheckCircleIcon };
    } else if (completedCount > 0) {
      return { status: 'active', text: '진행중', color: 'active', icon: ClockIcon };
    } else {
      return { status: 'waiting', text: '대기', color: 'waiting', icon: AlertCircleIcon };
    }
  };

  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) {
      showToast('참여자 이름을 입력해주세요', 'error');
      return;
    }

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: newParticipantName.trim(),
      notCravingFoods: [],      // 새로운 필드 추가
      allergies: [],            // 새로운 필드 추가
      cravingFoods: [],         // 새로운 필드 추가
      completed: false,
      // 기존 호환성을 위해 유지
      likes: [],
      dislikes: []
    };

    const updatedSession = {
      ...groupSession,
      participants: [...groupSession.participants, newParticipant]
    };

    // 로컬 스토리지에 저장
    saveSession(updatedSession);
    
    onSessionUpdate(updatedSession);
    setNewParticipantName('');
    setIsAddingParticipant(false);
    showToast(`${newParticipantName.trim()} 님이 추가되었습니다`, 'success');
  };

  const handleRemoveParticipant = (participantId: string) => {
    const participant = groupSession.participants.find(p => p.id === participantId);
    if (!participant) return;

    const updatedSession = {
      ...groupSession,
      participants: groupSession.participants.filter(p => p.id !== participantId)
    };

    // 로컬 스토리지에 저장
    saveSession(updatedSession);
    
    onSessionUpdate(updatedSession);
    setShowDeleteConfirm(null);
    showToast(`${participant.name} 님이 제거되었습니다`, 'success');
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}?join=${groupSession.id}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      showToast('초대 링크가 복사되었습니다!', 'success');
    }).catch(() => {
      showToast('링크 복사에 실패했습니다', 'error');
    });
  };

  const handleGetRecommendation = () => {
    const completedCount = groupSession.participants.filter(p => p.completed).length;
    
    if (completedCount === 0) {
      showToast('아직 선호도를 입력한 참여자가 없습니다', 'error');
      return;
    }

    onGetRecommendation(groupSession);
    showToast('추천 결과 페이지로 이동합니다', 'info');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return '🏆';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${rank + 1}`;
    }
  };

  const completedParticipants = groupSession.participants.filter(p => p.completed);
  const groupStatus = getGroupStatus();
  const StatusIcon = groupStatus.icon;

  // 팀원의 제한사항 종합 (새로운 구조와 기존 구조 모두 지원)
  const getAllRestrictions = () => {
    const allCannotEat = new Set<string>();
    const allDislike = new Set<string>();

    completedParticipants.forEach(participant => {
      // 기존 구조 처리
      participant.dislikes?.forEach(category => {
        if (participant.likes?.includes(category)) {
          allCannotEat.add(category);
        } else {
          allDislike.add(category);
        }
      });

      // 새로운 구조 처리
      participant.notCravingFoods?.forEach(food => {
        if (food.category && foodCategories[food.category as keyof typeof foodCategories]) {
          allDislike.add(food.category);
        }
      });

      // 알러지는 못 먹는 음식으로 분류
      participant.allergies?.forEach(allergy => {
        if (foodCategories[allergy as keyof typeof foodCategories]) {
          allCannotEat.add(allergy);
        }
      });
    });

    return { allCannotEat: Array.from(allCannotEat), allDislike: Array.from(allDislike) };
  };

  const restrictions = getAllRestrictions();

  return (
    <Container>
      <Content>
        {/* 헤더 */}
        <Header>
          <Button variant="ghost" size="sm" onClick={onBack} className="back-button">
            <ArrowLeftIcon size={16} />
          </Button>
          <div className="header-content">
            <h1>{groupSession.title}</h1>
            <p>그룹 관리</p>
          </div>
        </Header>

        {/* 그룹 상태 요약 */}
        <StatusCard>
          <div className="status-content">
            <div className="status-grid">
              <div className="status-item">
                <StatusIcon className="status-icon" />
                <div className={`status-info ${groupStatus.color}`}>
                  <div className="label">상태</div>
                  <div className="value">{groupStatus.text}</div>
                </div>
              </div>
              
              <div className="status-item">
                <UsersIcon className="status-icon" />
                <div className="status-info">
                  <div className="label">참여자</div>
                  <div className="value">{groupSession.participants.length}명</div>
                </div>
              </div>
              
              <div className="status-item">
                <CheckCircleIcon className="status-icon" />
                <div className="status-info completed">
                  <div className="label">완료</div>
                  <div className="value">{completedParticipants.length}명</div>
                </div>
              </div>

              <div className="status-item">
                <TrophyIcon className="status-icon" />
                <div className="status-info">
                  <div className="label">진행률</div>
                  <div className="value">
                    {Math.round((completedParticipants.length / groupSession.participants.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(completedParticipants.length / groupSession.participants.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </StatusCard>

        <MainGrid>
          {/* 참여자 관리 */}
          <SectionContainer>
            <ParticipantsCard>
              <div className="participants-header">
                <h3 className="title">
                  <UsersIcon />
                  참여자 관리
                </h3>
              </div>
              <div className="participants-content">
                {/* 참여자 추가 */}
                <div>
                  {isAddingParticipant ? (
                    <div className="add-participant-form">
                      <Input
                        placeholder="참여자 이름 입력"
                        value={newParticipantName}
                        onChange={(e) => setNewParticipantName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                        className="input-container"
                        fullWidth
                      />
                      <Button onClick={handleAddParticipant} size="sm">
                        추가
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingParticipant(false);
                          setNewParticipantName('');
                        }}
                        size="sm"
                      >
                        취소
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsAddingParticipant(true)} className="add-participant-button">
                      <UserPlusIcon />
                      참여자 추가
                    </Button>
                  )}
                </div>

                {/* 참여자 목록 */}
                <div className="participants-list">
                  {groupSession.participants.map((participant) => (
                    <ParticipantItem key={participant.id}>
                      <div className="participant-info">
                        <span className="name">{participant.name}</span>
                        {participant.completed ? (
                          <Badge variant="secondary" style={{ 
                            background: '#f0fdf4', 
                            color: '#166534',
                            fontSize: '0.75rem'
                          }}>
                            완료
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm">
                            대기중
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="remove-button"
                        onClick={() => setShowDeleteConfirm(participant.id)}
                      >
                        <UserMinusIcon />
                      </Button>
                    </ParticipantItem>
                  ))}
                </div>
              </div>
            </ParticipantsCard>

            {/* 팀원 초대하기 */}
            <InviteCard>
              <div className="invite-header">
                <h3 className="title">
                  <Share2Icon />
                  팀원 초대하기
                </h3>
              </div>
              <div className="invite-content">
                <p className="description">
                  아래 링크를 복사해서 친구들에게 공유하세요
                </p>
                <div className="link-container">
                  <Input
                    value={`${window.location.origin}?join=${groupSession.id}`}
                    readOnly
                    className="link-input"
                    fullWidth
                  />
                  <Button onClick={handleCopyInviteLink} size="sm">
                    <CopyIcon />
                    복사
                  </Button>
                </div>
              </div>
            </InviteCard>
          </SectionContainer>

          {/* 제한사항 & 추천 */}
          <SectionContainer>
            {/* 팀원의 제한사항 종합 */}
            <RestrictionsCard>
              <div className="restrictions-header">
                <h3 className="title">
                  <FileTextIcon />
                  팀원의 제한사항 종합
                </h3>
              </div>
              <div className="restrictions-content">
                {completedParticipants.length === 0 ? (
                  <div className="empty-state">
                    <ClockIcon className="empty-icon" />
                    <p>참여자들의 선호도 입력을 기다리고 있습니다.</p>
                  </div>
                ) : (
                  <div className="restrictions-list">
                    {restrictions.allCannotEat.length > 0 && (
                      <div className="restriction-section">
                        <div className="section-header">
                          <AlertTriangleIcon />
                          <span className="section-title cannot-eat">피해야 할 음식</span>
                        </div>
                        <div className="badges-container">
                          {restrictions.allCannotEat.map(category => {
                            const categoryInfo = getFoodCategoryInfo(category);
                            return (
                              <Badge 
                                key={category} 
                                variant="outline" 
                                style={{ 
                                  background: '#fef2f2', 
                                  borderColor: '#fecaca', 
                                  color: '#b91c1c' 
                                }}
                              >
                                {categoryInfo.emoji} {categoryInfo.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {restrictions.allDislike.length > 0 && (
                      <div className="restriction-section">
                        <div className="section-header">
                          <ThumbsDownIcon />
                          <span className="section-title dislike">선호하지 않는 음식</span>
                        </div>
                        <div className="badges-container">
                          {restrictions.allDislike.map(category => {
                            const categoryInfo = getFoodCategoryInfo(category);
                            return (
                              <Badge 
                                key={category} 
                                variant="outline" 
                                style={{ 
                                  background: '#fff7ed', 
                                  borderColor: '#fed7aa', 
                                  color: '#c2410c' 
                                }}
                              >
                                {categoryInfo.emoji} {categoryInfo.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {restrictions.allCannotEat.length === 0 && restrictions.allDislike.length === 0 && (
                      <div className="perfect-state">
                        <TrophyIcon className="perfect-icon" />
                        <p>모든 참여자가 만족할 수 있는 상황입니다!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </RestrictionsCard>

            {/* 현재 기준 최선의 메뉴 추천 */}
            <RecommendationsCard>
              <div className="recommendations-header">
                <h3 className="title">
                  <TrophyIcon />
                  실시간 추천 순위
                </h3>
              </div>
              <div className="recommendations-content">
                {completedParticipants.length === 0 ? (
                  <div className="empty-state">
                    <ClockIcon className="empty-icon" />
                    <p>참여자들의 선호도 입력을 기다리고 있습니다.</p>
                  </div>
                ) : (
                  <>
                    <div className="recommendations-list">
                      {recommendations.slice(0, 3).map((rec, index) => {
                        const categoryInfo = getFoodCategoryInfo(rec.category);
                        return (
                          <RecommendationItem key={rec.category}>
                            <div className="rec-left">
                              <span className="rank">{getRankIcon(index)}</span>
                              <div className="food-info">
                                <span className="emoji">{categoryInfo.emoji}</span>
                                <div className="details">
                                  <div className="name">{categoryInfo.name}</div>
                                  <div className="votes">
                                    <span className="positive">👍 {rec.likeCount}</span>
                                    <span className="negative">👎 {rec.dislikeCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="rec-right">
                              <div className="percentage">{rec.satisfactionRate}%</div>
                              <div className="label">만족도</div>
                            </div>
                          </RecommendationItem>
                        );
                      })}
                    </div>

                    <Button onClick={handleGetRecommendation} className="view-details-button">
                      <SparklesIcon />
                      상세 추천 결과 보기
                    </Button>
                  </>
                )}
                
                {completedParticipants.length > 0 && (
                  <div className="note">
                    * {completedParticipants.length}명의 선호도를 기반으로 계산된 결과입니다
                  </div>
                )}
              </div>
            </RecommendationsCard>
          </SectionContainer>
        </MainGrid>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <Modal
            isOpen={!!showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)}
            title="참여자 제거"
          >
            <div style={{ marginBottom: '1rem' }}>
              {groupSession.participants.find(p => p.id === showDeleteConfirm)?.name} 님을 그룹에서 제거하시겠습니까?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                취소
              </Button>
              <Button variant="destructive" onClick={() => handleRemoveParticipant(showDeleteConfirm)}>
                제거
              </Button>
            </div>
          </Modal>
        )}
      </Content>
    </Container>
  );
}