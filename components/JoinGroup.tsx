import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button } from './styled/Button';
import { Input } from './styled/Input';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { ArrowLeftIcon } from './styled/Icons';
import { useToast } from './styled/Toast';
import { theme } from './styled/theme';
import type { GroupSession } from '../App';

interface JoinGroupProps {
  groupSession: GroupSession;
  onParticipantJoin: (name: string) => void;
  onSelectExisting: (participantId: string) => void;
  onBack: () => void;
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
`;

const GroupInfoCard = styled(Card)`
  background: #eff6ff;
  border-color: #93c5fd;
  
  .group-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #1e40af;
      margin: 0 0 0.75rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: #2563eb;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }
  }
`;

const NewParticipantCard = styled(Card)`
  .new-header {
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
  
  .new-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    
    label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: ${theme.colors.text};
      font-weight: 500;
    }
  }
  
  .join-button {
    width: 100%;
    background: ${theme.colors.success};
    color: white;
    border: 1px solid ${theme.colors.success};
    
    &:hover:not(:disabled) {
      background: #059669;
      border-color: #059669;
    }
    
    &:disabled {
      opacity: 0.7;
    }
  }
`;

const ExistingParticipantsCard = styled(Card)`
  .existing-header {
    padding: 1.5rem;
    
    .title {
      color: ${theme.colors.text};
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .description {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
      margin: 0;
    }
  }
  
  .existing-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ParticipantButton = styled(Button)<{ isCompleted: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${props => props.isCompleted ? `
    background: ${theme.colors.surface};
    color: ${theme.colors.textSecondary};
    border-color: ${theme.colors.border};
    opacity: 0.5;
    cursor: not-allowed;
  ` : `
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  `}
  
  .status {
    font-size: 0.75rem;
  }
`;

const GuideCard = styled(Card)`
  background: ${theme.colors.surface};
  border-color: ${theme.colors.border};
  
  .guide-content {
    padding: 1rem;
  }
  
  h3 {
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: ${theme.colors.text};
  }
  
  ul {
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};
    padding-left: 0;
    margin: 0;
    list-style: none;
    
    li {
      margin: 0.25rem 0;
      
      strong {
        color: ${theme.colors.text};
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
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

const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="17" y1="11" x2="23" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function JoinGroup({ groupSession, onParticipantJoin, onSelectExisting, onBack }: JoinGroupProps) {
  const { showToast } = useToast();
  const [participantName, setParticipantName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const completedCount = groupSession.participants.filter(p => p.completed).length;
  const totalCount = groupSession.participants.length;

  const handleJoinAsNew = () => {
    if (!participantName.trim()) {
      showToast('이름을 입력해주세요', 'error');
      return;
    }

    if (groupSession.participants.some(p => p.name.toLowerCase() === participantName.toLowerCase())) {
      showToast('이미 존재하는 이름입니다', 'error');
      return;
    }

    setIsJoining(true);
    setTimeout(() => {
      onParticipantJoin(participantName.trim());
      setIsJoining(false);
    }, 1000);
  };

  const handleSelectExisting = (participantId: string) => {
    const participant = groupSession.participants.find(p => p.id === participantId);
    if (participant?.completed) {
      showToast('이미 입력을 완료한 참여자입니다', 'error');
      return;
    }
    onSelectExisting(participantId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <Button variant="ghost" size="sm" onClick={onBack} className="back-button">
          <ArrowLeftIcon size={16} />
        </Button>
        <div className="header-content">
          <h2>그룹 참여</h2>
          <p>참여 방법을 선택하세요</p>
        </div>
      </Header>

      {/* 그룹 정보 */}
      <GroupInfoCard>
        <div className="group-header">
          <h3 className="title">
            <UsersIcon />
            {groupSession.title}
          </h3>
          <div className="meta">
            <div className="meta-item">
              <ClockIcon />
              {formatDate(groupSession.createdAt)}
            </div>
            <div>
              참여자: {totalCount}명 (완료: {completedCount}명)
            </div>
          </div>
        </div>
      </GroupInfoCard>

      {/* 새 참여자로 참여 */}
      <NewParticipantCard>
        <div className="new-header">
          <h3 className="title">
            <UserPlusIcon color={theme.colors.success} />
            새 참여자로 참여하기
          </h3>
        </div>
        <div className="new-content">
          <div className="form-group">
            <label>이름을 입력하세요</label>
            <Input
              placeholder="예: 홍길동"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinAsNew();
                }
              }}
              fullWidth
            />
          </div>
          <Button
            onClick={handleJoinAsNew}
            disabled={isJoining || !participantName.trim()}
            className="join-button"
          >
            {isJoining ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LoadingSpinner />
                참여 중...
              </div>
            ) : (
              <>
                <UserPlusIcon />
                그룹에 참여하기
              </>
            )}
          </Button>
        </div>
      </NewParticipantCard>

      {/* 기존 참여자로 선택 */}
      {groupSession.participants.length > 0 && (
        <ExistingParticipantsCard>
          <div className="existing-header">
            <h3 className="title">기존 참여자로 입력하기</h3>
            <p className="description">
              미리 등록된 참여자 중 본인을 선택하세요
            </p>
          </div>
          <div className="existing-content">
            {groupSession.participants.map(participant => (
              <ParticipantButton
                key={participant.id}
                isCompleted={participant.completed}
                onClick={() => handleSelectExisting(participant.id)}
                disabled={participant.completed}
              >
                <span>{participant.name}</span>
                <span className="status">
                  {participant.completed ? '✅ 완료' : '⏳ 대기중'}
                </span>
              </ParticipantButton>
            ))}
          </div>
        </ExistingParticipantsCard>
      )}

      {/* 안내 */}
      <GuideCard>
        <div className="guide-content">
          <h3>💡 참여 방법</h3>
          <ul>
            <li>• <strong>새 참여자:</strong> 이름을 입력하여 그룹에 새로 참여</li>
            <li>• <strong>기존 참여자:</strong> 미리 등록된 이름으로 입력</li>
            <li>• 한 번 입력을 완료하면 다시 수정할 수 없습니다</li>
          </ul>
        </div>
      </GuideCard>
    </Container>
  );
}