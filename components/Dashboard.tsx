import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Button } from './styled/Button';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { Badge } from './styled/Badge';
import { Input } from './styled/Input';
import { useToast } from './styled/Toast';
import { getCurrentUser, logoutUser, getUserGroupSessions } from '../utils/auth';
import { getAllSessions, getSession } from '../utils/storage';
import { theme } from './styled/theme';
import type { GroupSession } from '../App';

interface DashboardProps {
  onLogout: () => void;
  onCreateGroup: () => void;
  onJoinGroup: (sessionId: string) => void;
  onManageGroup: (group: GroupSession) => void;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%);
`;

const Content = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.875rem;
    color: ${theme.colors.text};
    margin: 0;
    font-weight: 700;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ActionCard = styled(Card)<{ gradient: string }>`
  background: ${props => props.gradient};
  color: white;
  border: none;
  
  .action-content {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .action-info h3 {
    font-size: 1.125rem;
    margin: 0 0 0.25rem 0;
    font-weight: 600;
  }
  
  .action-info p {
    font-size: 0.875rem;
    opacity: 0.9;
    margin: 0;
  }
`;

const ActionButton = styled(Button)`
  background: white;
  color: #ea580c;
  border: 1px solid white;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #f9fafb;
  }
  
  &.blue {
    color: #2563eb;
  }
`;

const SearchFilterCard = styled(Card)`
  margin-bottom: 1.5rem;
  
  .search-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }
  
  .search-container {
    position: relative;
    flex: 1;
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.textSecondary};
    pointer-events: none;
  }
  
  .search-input {
    width: 100%;
    padding-left: 2.5rem;
  }
  
  .filter-buttons {
    display: flex;
    gap: 0.5rem;
  }
`;

const GroupsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingCard = styled(Card)`
  text-align: center;
  
  .loading-content {
    padding: 2rem;
  }
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 4px solid ${theme.colors.primary};
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyCard = styled(Card)`
  text-align: center;
  
  .empty-content {
    padding: 2rem;
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.125rem;
    margin: 0 0 0.5rem 0;
    color: ${theme.colors.text};
  }
  
  p {
    color: ${theme.colors.textSecondary};
    margin: 0 0 1rem 0;
  }
`;

const GroupCard = styled(Card)`
  transition: box-shadow 0.2s ease-in-out;
  
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
  
  .group-content {
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .group-info {
    flex: 1;
  }
  
  .group-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    
    h3 {
      font-size: 1.125rem;
      margin: 0;
      color: ${theme.colors.text};
    }
  }
  
  .group-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    margin-bottom: 0.75rem;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
  
  .participants-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    
    .participants-label {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
    }
    
    .participants-badges {
      display: flex;
      gap: 0.5rem;
    }
  }
  
  .group-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled(Badge)<{ statusColor: string }>`
  background: ${props => props.statusColor};
  color: white;
  border-color: ${props => props.statusColor};
`;

const DebugCard = styled(Card)`
  margin-top: 2rem;
  background: ${theme.colors.surface};
  
  .debug-content {
    padding: 1rem;
  }
  
  h4 {
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: ${theme.colors.text};
  }
  
  .debug-info {
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};
    
    p {
      margin: 0.25rem 0;
    }
  }
`;

// Icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export function Dashboard({ onLogout, onCreateGroup, onJoinGroup, onManageGroup }: DashboardProps) {
  const { showToast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [userGroups, setUserGroups] = useState<GroupSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserGroups();
    }
  }, [user]);

  const loadUserGroups = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // 사용자별 저장된 그룹 가져오기
      const savedGroups = getUserGroupSessions(user.id);
      console.log('사용자 저장된 그룹:', savedGroups);
      
      // 저장된 그룹들의 최신 상태를 가져와서 업데이트
      const updatedGroups: GroupSession[] = [];
      
      for (const savedGroup of savedGroups) {
        const currentGroup = getSession(savedGroup.id);
        if (currentGroup) {
          // 최신 상태의 그룹을 사용
          updatedGroups.push(currentGroup);
        } else {
          // 그룹이 삭제되었거나 찾을 수 없는 경우, 저장된 것을 그대로 사용
          updatedGroups.push(savedGroup);
        }
      }
      
      console.log('업데이트된 사용자 그룹:', updatedGroups);
      setUserGroups(updatedGroups);
      
    } catch (error) {
      console.error('사용자 그룹 로드 실패:', error);
      showToast('그룹 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    showToast('로그아웃되었습니다', 'success');
    onLogout();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getGroupStatus = (group: GroupSession) => {
    const completedCount = group.participants.filter(p => p.completed).length;
    const totalCount = group.participants.length;
    
    if (completedCount === totalCount && totalCount > 0) {
      return { status: 'completed', text: '완료', color: theme.colors.success };
    } else if (completedCount > 0) {
      return { status: 'active', text: '진행중', color: theme.colors.primary };
    } else {
      return { status: 'waiting', text: '대기', color: theme.colors.secondary };
    }
  };

  const filteredGroups = userGroups.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    
    const groupStatus = getGroupStatus(group);
    if (filter === 'active') return matchesSearch && groupStatus.status !== 'completed';
    if (filter === 'completed') return matchesSearch && groupStatus.status === 'completed';
    
    return matchesSearch;
  });

  if (!user) {
    return (
      <Container>
        <Content>
          <Card>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: theme.colors.textSecondary }}>로그인이 필요합니다.</p>
              <Button onClick={onLogout} style={{ marginTop: '1rem' }}>
                로그인하기
              </Button>
            </div>
          </Card>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        {/* 헤더 */}
        <Header>
          <h1>안녕하세요, {user.name} 님! 👋</h1>
        </Header>

        {/* 액션 버튼 */}
        <ActionGrid>
          <ActionCard gradient="linear-gradient(135deg, #ea580c 0%, #dc2626 100%)">
            <div className="action-content">
              <div className="action-info">
                <h3>새 그룹 만들기</h3>
                <p>친구들과 메뉴를 정해보세요</p>
              </div>
              <ActionButton onClick={onCreateGroup}>
                <PlusIcon />
                만들기
              </ActionButton>
            </div>
          </ActionCard>

          <ActionCard gradient="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)">
            <div className="action-content">
              <div className="action-info">
                <h3>그룹 참여하기</h3>
                <p>초대받은 그룹에 참여하세요</p>
              </div>
              <ActionButton onClick={() => onJoinGroup('')} className="blue">
                <UsersIcon />
                참여하기
              </ActionButton>
            </div>
          </ActionCard>
        </ActionGrid>

        {/* 검색 및 필터 */}
        <SearchFilterCard>
          <div className="search-content">
            <div className="search-container">
              <SearchIcon className="search-icon" />
              <Input
                type="text"
                placeholder="그룹 이름 또는 참여자 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                fullWidth
              />
            </div>
            <div className="filter-buttons">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                전체
              </Button>
              <Button
                variant={filter === 'active' ? 'primary' : 'outline'}
                onClick={() => setFilter('active')}
                size="sm"
              >
                진행중
              </Button>
              <Button
                variant={filter === 'completed' ? 'primary' : 'outline'}
                onClick={() => setFilter('completed')}
                size="sm"
              >
                완료
              </Button>
            </div>
          </div>
        </SearchFilterCard>

        {/* 그룹 목록 */}
        <GroupsList>
          {isLoading ? (
            <LoadingCard>
              <div className="loading-content">
                <div className="spinner"></div>
                <p style={{ color: theme.colors.textSecondary }}>그룹 목록을 불러오는 중...</p>
              </div>
            </LoadingCard>
          ) : filteredGroups.length === 0 ? (
            <EmptyCard>
              <div className="empty-content">
                <div className="empty-icon">🍽️</div>
                <h3>
                  {userGroups.length === 0 ? '아직 참여한 그룹이 없어요' : '검색 결과가 없어요'}
                </h3>
                <p>
                  {userGroups.length === 0 
                    ? '새로운 그룹을 만들거나 친구들의 그룹에 참여해보세요!' 
                    : '검색 조건을 변경해보거나 새로운 그룹을 만들어보세요.'
                  }
                </p>
                <Button onClick={onCreateGroup} variant="primary">
                  <PlusIcon />
                  {userGroups.length === 0 ? '첫 번째 그룹 만들기' : '새 그룹 만들기'}
                </Button>
              </div>
            </EmptyCard>
          ) : (
            filteredGroups.map((group) => {
              const status = getGroupStatus(group);
              const completedCount = group.participants.filter(p => p.completed).length;
              const totalCount = group.participants.length;
              
              return (
                <GroupCard key={group.id}>
                  <div className="group-content">
                    <div className="group-info">
                      <div className="group-header">
                        <h3>{group.title}</h3>
                        <StatusBadge statusColor={status.color}>
                          {status.text}
                        </StatusBadge>
                      </div>
                      
                      <div className="group-meta">
                        <div className="meta-item">
                          <CalendarIcon />
                          {formatDate(group.createdAt)}
                        </div>
                        <div className="meta-item">
                          <UsersIcon />
                          {totalCount}명 참여
                        </div>
                        <div className="meta-item">
                          <TrophyIcon />
                          {completedCount}/{totalCount} 완료
                        </div>
                      </div>

                      <div className="participants-section">
                        <span className="participants-label">참여자:</span>
                        <div className="participants-badges">
                          {group.participants.slice(0, 3).map((participant, index) => (
                            <Badge key={index} variant="outline" size="sm">
                              {participant.name}
                              {participant.completed ? ' ✓' : ''}
                            </Badge>
                          ))}
                          {group.participants.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{group.participants.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="group-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onManageGroup(group)}
                      >
                        <SettingsIcon />
                        그룹 관리하기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onJoinGroup(group.id)}
                      >
                        참여
                      </Button>
                    </div>
                  </div>
                </GroupCard>
              );
            })
          )}
        </GroupsList>

        {/* 디버그 정보 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <DebugCard>
            <div className="debug-content">
              <h4>디버그 정보:</h4>
              <div className="debug-info">
                <p>사용자 ID: {user.id}</p>
                <p>로드된 그룹 수: {userGroups.length}</p>
                <p>필터링된 그룹 수: {filteredGroups.length}</p>
                <p>저장된 그룹 목록: {userGroups.map(g => g.title).join(', ')}</p>
              </div>
            </div>
          </DebugCard>
        )}
      </Content>
    </Container>
  );
}