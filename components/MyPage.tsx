import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Button } from './styled/Button';
import { Modal } from './styled/Modal';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { Badge } from './styled/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './styled/Tabs';
import { XIcon, AlertTriangleIcon, ThumbsDownIcon } from './styled/Icons';
import { getCurrentUser, getUserAvoidedFoods, saveUserAvoidedFoods } from '../utils/auth';
import { useToast } from './styled/Toast';
import { theme } from './styled/theme';
import type { FoodCategory } from '../App';

interface MyPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
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

const ModalContent = styled.div`
  max-width: 48rem;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

const ModalDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
`;

const UserInfoCard = styled(Card)`
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    background: ${theme.colors.primary}33;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.primary};
  }
  
  .user-details h3 {
    font-size: 1.125rem;
    margin: 0;
    color: ${theme.colors.text};
  }
  
  .user-details p {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    margin: 0;
  }
`;

const LoginCard = styled(Card)`
  text-align: center;
  
  .login-content {
    padding: 1.5rem;
  }
  
  .avatar-large {
    width: 4rem;
    height: 4rem;
    background: ${theme.colors.primary}33;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.primary};
    margin: 0 auto 1rem;
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
  
  .login-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #eff6ff;
  border-radius: ${theme.borderRadius.lg};
  
  .info-icon {
    color: #2563eb;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
  
  .info-text {
    font-size: 0.875rem;
    color: #1e40af;
    
    p {
      margin: 0 0 0.25rem 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const TabSection = styled.div`
  margin-top: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  h4 {
    font-size: 0.875rem;
    margin: 0;
    color: ${theme.colors.text};
  }
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  margin: 0 0 0.75rem 0;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const FoodButton = styled(Button)<{ isSelected: boolean; buttonType: 'cannot' | 'dislike' }>`
  height: auto;
  padding: 0.75rem;
  justify-content: flex-start;
  
  ${props => props.isSelected ? css`
    background: ${props.buttonType === 'cannot' ? theme.colors.error : theme.colors.primary};
    color: white;
    border-color: ${props.buttonType === 'cannot' ? theme.colors.error : theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${props.buttonType === 'cannot' ? '#dc2626' : theme.colors.primaryHover};
      border-color: ${props.buttonType === 'cannot' ? '#dc2626' : theme.colors.primaryHover};
    }
  ` : css`
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props.buttonType === 'cannot' ? '#fef2f2' : '#fff7ed'};
    }
  `}
`;

const SummarySection = styled.div`
  padding: 1rem;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  margin-top: 1.5rem;
  
  h4 {
    font-size: 0.875rem;
    margin: 0 0 0.75rem 0;
    color: ${theme.colors.text};
  }
  
  .summary-item {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }
    
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  }
  
  .cannot-eat .label {
    color: ${theme.colors.error};
  }
  
  .dislike .label {
    color: ${theme.colors.primary};
  }
`;

const SaveSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SaveButton = styled(Button)`
  background: ${theme.colors.primary};
  color: white;
  border: 1px solid ${theme.colors.primary};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
    border-color: ${theme.colors.primaryHover};
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

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function MyPage({ isOpen, onClose, onLogout }: MyPageProps) {
  const { showToast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [cannotEat, setCannotEat] = useState<FoodCategory[]>([]);
  const [dislike, setDislike] = useState<FoodCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const avoidedFoods = getUserAvoidedFoods(currentUser.id);
      setCannotEat(avoidedFoods.cannotEat || []);
      setDislike(avoidedFoods.dislike || []);
    }
  };

  const handleSave = async () => {
    if (!user) {
      showToast('로그인이 필요합니다', 'error');
      return;
    }

    setIsLoading(true);
    try {
      saveUserAvoidedFoods(user.id, {
        cannotEat,
        dislike
      });
      showToast('기피 음식이 저장되었습니다', 'success');
    } catch (error) {
      showToast('저장에 실패했습니다', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCannotEat = (category: FoodCategory) => {
    setCannotEat(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleDislike = (category: FoodCategory) => {
    setDislike(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLoginRedirect = () => {
    onClose();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <UserIcon />
            마이페이지
          </ModalTitle>
        </ModalHeader>
        <ModalDescription>
          사용자 정보를 확인하고 기피 음식을 설정할 수 있습니다.
        </ModalDescription>

        {!user ? (
          <div style={{ marginTop: '1.5rem' }}>
            <LoginCard>
              <div className="login-content">
                <div className="avatar-large">
                  <UserIcon />
                </div>
                <h3>로그인이 필요합니다</h3>
                <p>기피 음식을 설정하고 자동으로 적용받으려면 로그인해주세요.</p>
                <div className="login-buttons">
                  <Button onClick={handleLoginRedirect} variant="primary">
                    <LoginIcon />
                    로그인
                  </Button>
                  <Button variant="outline" onClick={handleLoginRedirect}>
                    <UserPlusIcon />
                    회원가입
                  </Button>
                </div>
              </div>
            </LoginCard>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 사용자 정보 */}
            <UserInfoCard>
              <div className="user-info">
                <div className="avatar">
                  <UserIcon />
                </div>
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            </UserInfoCard>

            {/* 기피 음식 설정 */}
            <Card>
              <CardHeader>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SettingsIcon />
                  기피 음식 설정
                </CardTitle>
                <InfoBox>
                  <InfoIcon className="info-icon" />
                  <div className="info-text">
                    <p>여기서 설정한 기피 음식은 그룹 참여 시 자동으로 선택됩니다.</p>
                    <p>언제든지 개별 그룹에서 수정할 수 있습니다.</p>
                  </div>
                </InfoBox>
              </CardHeader>
              <CardContent>
                <TabSection>
                  <Tabs defaultValue="cannot-eat">
                    <TabsList style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
                      <TabsTrigger value="cannot-eat" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangleIcon size={16} />
                        못 먹는 음식
                      </TabsTrigger>
                      <TabsTrigger value="dislike" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ThumbsDownIcon size={16} />
                        싫어하는 음식
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="cannot-eat">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <SectionHeader>
                          <AlertTriangleIcon size={16} color={theme.colors.error} />
                          <h4>못 먹는 음식 ({cannotEat.length}개)</h4>
                        </SectionHeader>
                        <SectionDescription>
                          알레르기나 종교적 이유 등으로 드실 수 없는 음식 종류를 선택해주세요.
                        </SectionDescription>
                        <FoodGrid>
                          {Object.entries(foodCategories).map(([key, category]) => (
                            <FoodButton
                              key={key}
                              isSelected={cannotEat.includes(key as FoodCategory)}
                              buttonType="cannot"
                              onClick={() => toggleCannotEat(key as FoodCategory)}
                            >
                              <span style={{ marginRight: '0.5rem' }}>{category.emoji}</span>
                              {category.name}
                            </FoodButton>
                          ))}
                        </FoodGrid>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="dislike">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <SectionHeader>
                          <ThumbsDownIcon size={16} color={theme.colors.primary} />
                          <h4>싫어하는 음식 ({dislike.length}개)</h4>
                        </SectionHeader>
                        <SectionDescription>
                          선호하지 않는 음식 종류를 선택해주세요.
                        </SectionDescription>
                        <FoodGrid>
                          {Object.entries(foodCategories).map(([key, category]) => (
                            <FoodButton
                              key={key}
                              isSelected={dislike.includes(key as FoodCategory)}
                              buttonType="dislike"
                              onClick={() => toggleDislike(key as FoodCategory)}
                            >
                              <span style={{ marginRight: '0.5rem' }}>{category.emoji}</span>
                              {category.name}
                            </FoodButton>
                          ))}
                        </FoodGrid>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* 선택된 기피 음식 요약 */}
                  {(cannotEat.length > 0 || dislike.length > 0) && (
                    <SummarySection>
                      <h4>선택된 기피 음식</h4>
                      <div>
                        {cannotEat.length > 0 && (
                          <div className="summary-item cannot-eat">
                            <div className="label">못 먹는 음식:</div>
                            <div className="badges">
                              {cannotEat.map(category => (
                                <Badge key={category} variant="outline" style={{ 
                                  background: '#fef2f2', 
                                  borderColor: '#fecaca', 
                                  color: '#b91c1c' 
                                }}>
                                  {foodCategories[category].emoji} {foodCategories[category].name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {dislike.length > 0 && (
                          <div className="summary-item dislike">
                            <div className="label">싫어하는 음식:</div>
                            <div className="badges">
                              {dislike.map(category => (
                                <Badge key={category} variant="outline" style={{ 
                                  background: '#fff7ed', 
                                  borderColor: '#fed7aa', 
                                  color: '#c2410c' 
                                }}>
                                  {foodCategories[category].emoji} {foodCategories[category].name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </SummarySection>
                  )}

                  {/* 저장 버튼 */}
                  <SaveSection>
                    <SaveButton onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon />
                      )}
                      저장하기
                    </SaveButton>
                  </SaveSection>
                </TabSection>
              </CardContent>
            </Card>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}