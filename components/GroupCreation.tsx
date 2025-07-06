import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Button } from './styled/Button';
import { Input } from './styled/Input';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { useToast } from './styled/Toast';
import { theme } from './styled/theme';
import * as storage from '../utils/storage';
import type { GroupSession, Participant } from '../App';

interface GroupCreationProps {
  onGroupCreated: (session: GroupSession) => void;
  onJoinGroup: (sessionId: string, participantName?: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SuccessCard = styled(Card)`
  background: #f0fdf4;
  border-color: #bbf7d0;
  
  .success-header {
    text-align: center;
    padding: 1.5rem 1.5rem 0;
  }
  
  .success-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  
  .group-info {
    margin-bottom: 1rem;
    
    label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: ${theme.colors.text};
      font-weight: 500;
    }
    
    .info-box {
      background: white;
      padding: 0.75rem;
      border-radius: ${theme.borderRadius.md};
      border: 1px solid ${theme.colors.border};
      
      .info-item {
        font-size: 0.875rem;
        margin: 0.25rem 0;
        
        .label {
          font-weight: 500;
          display: inline;
        }
        
        .code {
          font-family: monospace;
          background: ${theme.colors.surface};
          padding: 0.125rem 0.5rem;
          border-radius: ${theme.borderRadius.sm};
          margin-left: 0.25rem;
        }
      }
    }
  }
  
  .link-section {
    margin-bottom: 1rem;
    
    label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: ${theme.colors.text};
      font-weight: 500;
    }
    
    .link-input-container {
      display: flex;
      gap: 0.5rem;
    }
    
    .link-input {
      flex: 1;
      font-size: 0.75rem;
      cursor: pointer;
    }
    
    .copy-button {
      padding: 0 0.75rem;
    }
    
    .hint {
      font-size: 0.75rem;
      color: ${theme.colors.textSecondary};
      margin-top: 0.25rem;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .start-button {
    width: 100%;
    background: ${theme.colors.primary};
    color: white;
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  }
`;

const ParticipantsList = styled(Card)`
  .participants-content {
    padding: 1rem;
  }
  
  h3 {
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: ${theme.colors.text};
  }
  
  .participant-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    margin: 0.25rem 0;
    
    .status {
      color: ${theme.colors.textSecondary};
    }
  }
`;

const CreateCard = styled(Card)`
  .create-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${theme.colors.primary};
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
  }
  
  .create-content {
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
  
  .participants-section {
    .participants-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .participant-row {
      display: flex;
      gap: 0.5rem;
    }
    
    .participant-input {
      flex: 1;
    }
    
    .remove-button {
      padding: 0 0.75rem;
      color: ${theme.colors.error};
      border-color: ${theme.colors.error};
      
      &:hover:not(:disabled) {
        background: #fef2f2;
        border-color: ${theme.colors.error};
      }
    }
    
    .add-button {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
  
  .create-button {
    width: 100%;
    background: ${theme.colors.primary};
    color: white;
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
    
    &:disabled {
      opacity: 0.7;
    }
  }
`;

const JoinCard = styled(Card)`
  .join-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${theme.colors.text};
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
  }
  
  .join-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .join-button {
    width: 100%;
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  }
`;

const GuideCard = styled(Card)`
  background: #fff7ed;
  border-color: #fed7aa;
  
  .guide-content {
    padding: 1rem;
  }
  
  h3 {
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: #c2410c;
  }
  
  ol {
    font-size: 0.75rem;
    color: #9a3412;
    padding-left: 1rem;
    margin: 0;
    
    li {
      margin: 0.25rem 0;
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

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 개선된 클립보드 복사 유틸리티 함수
const copyToClipboard = async (text: string): Promise<boolean> => {
  // 1. 최신 Clipboard API 시도
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.log('Clipboard API 실패, 폴백 시도:', err);
  }

  // 2. document.execCommand 폴백
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 화면에서 숨기지만 접근 가능하게 설정
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    
    // iOS Safari 지원
    textArea.contentEditable = 'true';
    textArea.readOnly = false;
    
    textArea.focus();
    textArea.select();
    
    // 텍스트 범위 선택 (모바일 지원)
    if (textArea.setSelectionRange) {
      textArea.setSelectionRange(0, text.length);
    }
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('execCommand 폴백도 실패:', err);
    return false;
  }
};

// 수동 복사 안내 함수
const showManualCopyDialog = (text: string, showToast: any) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 모바일에서는 길게 누르기 안내
    showToast('링크를 길게 눌러 복사해주세요', 'error', 5000);
  } else {
    // 데스크톱에서는 Ctrl+C 안내
    showToast('Ctrl+C를 눌러 복사해주세요', 'error', 5000);
  }
};

export function GroupCreation({ onGroupCreated, onJoinGroup }: GroupCreationProps) {
  const { showToast } = useToast();
  const [groupTitle, setGroupTitle] = useState('');
  const [participantNames, setParticipantNames] = useState(['']);
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdSession, setCreatedSession] = useState<GroupSession | null>(null);
  const [shareLink, setShareLink] = useState('');

  const addParticipant = () => {
    if (participantNames.length < 8) {
      setParticipantNames([...participantNames, '']);
    }
  };

  const updateParticipantName = (index: number, name: string) => {
    const updated = [...participantNames];
    updated[index] = name;
    setParticipantNames(updated);
  };

  const removeParticipant = (index: number) => {
    if (participantNames.length > 1) {
      const updated = participantNames.filter((_, i) => i !== index);
      setParticipantNames(updated);
    }
  };

  const createGroup = async () => {
    if (!groupTitle.trim()) {
      showToast('그룹 이름을 입력해주세요', 'error');
      return;
    }

    const validNames = participantNames.filter(name => name.trim());
    if (validNames.length < 2) {
      showToast('최소 2명의 참여자가 필요합니다', 'error');
      return;
    }

    setIsCreating(true);

    // 유니크한 세션 ID 생성
    let sessionId: string;
    do {
      sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (storage.getSession(sessionId)); // 중복 확인

    const participants: Participant[] = validNames.map((name, index) => ({
      id: `p${index + 1}`,
      name: name.trim(),
      notCravingFoods: [],      // 새로운 필드 추가
      allergies: [],            // 새로운 필드 추가
      cravingFoods: [],         // 새로운 필드 추가
      completed: false,
      // 기존 호환성을 위해 유지
      dislikes: [],
      likes: []
    }));

    const session: GroupSession = {
      id: sessionId,
      title: groupTitle.trim(),
      participants,
      createdAt: new Date(),
      isActive: true
    };

    // 로컬 스토리지에 저장
    storage.saveSession(session);

    // 링크 생성
    const link = `${window.location.origin}?join=${sessionId}`;
    setShareLink(link);
    setCreatedSession(session);
    
    setTimeout(() => {
      setIsCreating(false);
      showToast('그룹이 생성되고 저장되었습니다!', 'success');
    }, 1500);
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;

    const success = await copyToClipboard(shareLink);
    if (success) {
      showToast('링크가 복사되었습니다! 📋', 'success');
    } else {
      // 복사 실패 시 수동 복사 안내
      showManualCopyDialog(shareLink, showToast);
    }
  };

  const handleShareNative = async () => {
    if (!shareLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${createdSession?.title} - 함께메뉴`,
          text: '메뉴 선택에 참여해주세요!',
          url: shareLink,
        });
        showToast('공유되었습니다!', 'success');
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          // 공유 실패 시 클립보드 복사 시도
          handleCopyLink();
        }
      }
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드 복사
      handleCopyLink();
    }
  };

  const startGroupSession = () => {
    if (createdSession) {
      onGroupCreated(createdSession);
    }
  };

  const joinGroup = () => {
    if (!joinCode.trim()) {
      showToast('참여 코드를 입력해주세요', 'error');
      return;
    }

    const sessionId = joinCode.toUpperCase();
    const session = storage.getSession(sessionId);
    
    if (!session) {
      showToast('존재하지 않는 그룹입니다.', 'error');
      return;
    }

    if (!session.isActive) {
      showToast('비활성화된 그룹입니다.', 'error');
      return;
    }

    showToast('그룹을 찾았습니다!', 'success');
    onJoinGroup(sessionId);
  };

  // 그룹 생성 완료 후 링크 공유 화면
  if (createdSession && shareLink) {
    return (
      <Container>
        <SuccessCard>
          <div className="success-header">
            <div className="success-icon">✅</div>
            <CardTitle style={{ color: '#166534' }}>그룹이 생성되었습니다!</CardTitle>
            <p style={{ color: '#059669', fontSize: '0.875rem' }}>
              링크를 공유하여 참여자들을 초대하세요
            </p>
          </div>
          <CardContent>
            <div className="group-info">
              <label>그룹 정보</label>
              <div className="info-box">
                <div className="info-item">
                  <span className="label">그룹명:</span> {createdSession.title}
                </div>
                <div className="info-item">
                  <span className="label">참여자:</span> {createdSession.participants.length}명
                </div>
                <div className="info-item">
                  <span className="label">참여 코드:</span>
                  <span className="code">{createdSession.id}</span>
                </div>
              </div>
            </div>

            <div className="link-section">
              <label>공유 링크</label>
              <div className="link-input-container">
                <Input
                  value={shareLink}
                  readOnly
                  className="link-input"
                  onClick={(e) => {
                    e.currentTarget.select();
                    // 선택 후 자동 복사 시도
                    copyToClipboard(shareLink).then(success => {
                      if (success) {
                        showToast('링크가 선택되고 복사되었습니다!', 'success');
                      }
                    });
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="copy-button"
                >
                  <CopyIcon />
                </Button>
              </div>
              <p className="hint">
                💡 링크를 클릭하면 자동 선택됩니다
              </p>
            </div>

            <div className="action-buttons">
              <Button
                onClick={handleShareNative}
                style={{ 
                  flex: 1, 
                  background: '#3b82f6', 
                  color: 'white',
                  border: '1px solid #3b82f6'
                }}
              >
                <ShareIcon />
                공유하기
              </Button>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                style={{ flex: 1 }}
              >
                <LinkIcon />
                링크 복사
              </Button>
            </div>

            <Button
              onClick={startGroupSession}
              className="start-button"
            >
              입력 시작하기
            </Button>
          </CardContent>
        </SuccessCard>

        <ParticipantsList>
          <div className="participants-content">
            <h3>📋 참여자 목록</h3>
            <div>
              {createdSession.participants.map((participant, index) => (
                <div key={participant.id} className="participant-item">
                  <span>{index + 1}. {participant.name}</span>
                  <span className="status">대기중</span>
                </div>
              ))}
            </div>
          </div>
        </ParticipantsList>
      </Container>
    );
  }

  return (
    <Container>
      {/* 새 그룹 생성 */}
      <CreateCard>
        <div className="create-header">
          <h2 className="title">
            <UsersIcon />
            새 그룹 만들기
          </h2>
        </div>
        <div className="create-content">
          <div className="form-group">
            <label>그룹 이름</label>
            <Input
              placeholder="예: 점심 메뉴 정하기"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              fullWidth
            />
          </div>

          <div className="form-group participants-section">
            <label>참여자 ({participantNames.length}명)</label>
            <div className="participants-list">
              {participantNames.map((name, index) => (
                <div key={index} className="participant-row">
                  <Input
                    placeholder={`참여자 ${index + 1}`}
                    value={name}
                    onChange={(e) => updateParticipantName(index, e.target.value)}
                    className="participant-input"
                    fullWidth
                  />
                  {participantNames.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeParticipant(index)}
                      className="remove-button"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              
              {participantNames.length < 8 && (
                <Button
                  variant="outline"
                  onClick={addParticipant}
                  className="add-button"
                  size="sm"
                >
                  <PlusIcon />
                  참여자 추가
                </Button>
              )}
            </div>
          </div>

          <Button
            onClick={createGroup}
            disabled={isCreating}
            className="create-button"
          >
            {isCreating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LoadingSpinner />
                그룹 생성중...
              </div>
            ) : (
              <>
                <UsersIcon />
                그룹 만들기
              </>
            )}
          </Button>
        </div>
      </CreateCard>

      {/* 그룹 참여 */}
      <JoinCard>
        <div className="join-header">
          <h2 className="title">
            <SearchIcon />
            기존 그룹 참여하기
          </h2>
        </div>
        <div className="join-content">
          <div className="form-group">
            <label>참여 코드</label>
            <Input
              placeholder="6자리 코드 입력 (예: A1B2C3)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  joinGroup();
                }
              }}
              fullWidth
            />
          </div>
          <Button
            onClick={joinGroup}
            className="join-button"
          >
            <SearchIcon />
            그룹 찾기
          </Button>
        </div>
      </JoinCard>

      {/* 사용법 안내 */}
      <GuideCard>
        <div className="guide-content">
          <h3>🎯 사용법</h3>
          <ol>
            <li>1. 그룹을 만들고 링크를 친구들에게 공유하세요</li>
            <li>2. 각자 못 먹는 음식과 땡기는 음식을 선택하세요</li>
            <li>3. 모두가 만족할 최적의 메뉴를 추천받으세요!</li>
          </ol>
        </div>
      </GuideCard>
    </Container>
  );
}