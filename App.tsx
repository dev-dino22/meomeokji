import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AuthCheck } from './components/AuthCheck';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { GroupCreation } from './components/GroupCreation';
import { ParticipantInput } from './components/ParticipantInput';
import { RecommendationResult } from './components/RecommendationResult';
import { JoinGroup } from './components/JoinGroup';
import { GroupManagement } from './components/GroupManagement';
import { Header } from './components/Header';
import { ToastProvider, useToast } from './components/styled/Toast';
import { theme } from './components/styled/theme';
import { getCurrentUser, addUserGroupSession } from './utils/auth';
import * as storage from './utils/storage';

export type FoodCategory = 'korean' | 'chinese' | 'japanese' | 'western' | 'fast' | 'cafe' | 'asian' | 'etc';

export interface FoodSelection {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  isCustom?: boolean;
  isCategory?: boolean;     // 대분류 선택 여부
  isSubcategory?: boolean;  // 중분류 선택 여부
}

export interface Participant {
  id: string;
  name: string;
  notCravingFoods: FoodSelection[];    // 오늘 안 땡기는 음식
  allergies: string[];                  // 알러지/못 먹는 음식
  cravingFoods: FoodSelection[];       // 땡기는 음식
  completed: boolean;
  // 기존 호환성을 위해 유지
  dislikes: FoodCategory[];
  likes: FoodCategory[];
}

export interface GroupSession {
  id: string;
  title: string;
  participants: Participant[];
  createdAt: Date;
  isActive: boolean;
}

type AppView = 'auth' | 'login' | 'register' | 'dashboard' | 'guest-create' | 'guest-join' | 'input' | 'result' | 'group-management';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
`;

const GuestContainer = styled.div`
  background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const WelcomeText = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.875rem;
    margin: 0;
  }
`;

const LoginPrompt = styled.div`
  margin-top: 0.5rem;
  
  button {
    font-size: 0.75rem;
    color: ${theme.colors.blue};
    background: none;
    border: none;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function AppContent() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [groupSession, setGroupSession] = useState<GroupSession | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const user = getCurrentUser();
    
    // URL에서 참여 코드 먼저 확인 (로그인 상태와 무관하게)
    const joinCode = storage.getJoinCodeFromURL();
    if (joinCode) {
      const session = storage.getSession(joinCode);
      if (session) {
        setCurrentUser(user);
        setGroupSession(session);
        setCurrentView('guest-join');
        storage.clearJoinCodeFromURL();
        return; // 여기서 return하여 아래 로직 실행 방지
      } else {
        showToast('유효하지 않은 참여 링크입니다.', 'error');
        storage.clearJoinCodeFromURL();
      }
    }
    
    // 참여 링크가 없는 경우에만 로그인 상태에 따라 결정
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    } else {
      setCurrentView('auth');
    }
  }, [showToast]);

  // 세션 상태 동기화 (input 화면에서는 동기화 중단)
  useEffect(() => {
    // input 화면에서는 동기화하지 않음 (사용자 입력 중 방해 방지)
    if (!groupSession || currentView === 'result' || currentView === 'input' || !currentUser) return;

    const interval = setInterval(() => {
      const updatedSession = storage.getSession(groupSession.id);
      if (updatedSession) {
        setGroupSession(updatedSession);
        
        // 모든 참여자가 완료했는지 확인 (input 화면이 아닐 때만)
        const allCompleted = updatedSession.participants.every(p => p.completed);
        if (allCompleted && currentView !== 'input') {
          showToast('모든 참여자의 입력이 완료되었습니다!', 'info');
          setTimeout(() => {
            setCurrentView('result');
          }, 1000);
        }
      }
    }, 10000); // 10초로 간격 증가

    return () => clearInterval(interval);
  }, [groupSession, currentView, currentUser, showToast]);

  // 인증 관련 핸들러
  const handleLoginSuccess = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    // 로그인 후 그룹 세션이 있으면 해당 그룹으로, 없으면 대시보드로
    if (groupSession) {
      setCurrentView('guest-join');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleRegisterSuccess = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('auth');
    setGroupSession(null);
    setCurrentParticipantId('');
  };

  const handleGuestStart = () => {
    setCurrentView('guest-create');
  };

  // 그룹 관련 핸들러
  const handleGroupCreated = (session: GroupSession) => {
    console.log('그룹 생성됨:', { sessionId: session.id, title: session.title, currentUser: currentUser?.name });
    
    storage.saveSession(session);
    setGroupSession(session);
    
    // 로그인한 사용자의 경우 그룹 히스토리에 추가
    if (currentUser) {
      console.log('사용자 그룹 히스토리에 추가 중:', currentUser.id);
      addUserGroupSession(currentUser.id, session);
    } else {
      console.log('비회원 모드 - 그룹 히스토리에 저장하지 않음');
    }
    
    // 그룹 생성 후 참여자 선택 화면으로 이동
    setCurrentView('guest-join');
    showToast('그룹이 생성되었습니다!', 'success');
  };

  const handleJoinGroup = (sessionId: string, participantName?: string) => {
    if (!sessionId) {
      // 대시보드에서 참여하기 버튼 클릭 시
      setCurrentView('guest-join');
      return;
    }

    const session = storage.getSession(sessionId);
    if (!session) {
      showToast('존재하지 않는 그룹입니다.', 'error');
      return;
    }

    if (participantName) {
      // 새 참여자 추가
      const result = storage.addParticipant(sessionId, participantName);
      if (result) {
        setGroupSession(result.session);
        setCurrentParticipantId(result.participantId);
        
        // 로그인한 사용자의 경우 그룹 히스토리에 추가
        if (currentUser) {
          addUserGroupSession(currentUser.id, result.session);
        }
        
        setCurrentView('input');
        showToast(`${participantName}님, 그룹에 참여했습니다!`, 'success');
      } else {
        showToast('그룹 참여에 실패했습니다.', 'error');
      }
    } else {
      // 기존 참여자로 입장 - 참여자 선택 화면으로 이동
      setGroupSession(session);
      
      // 로그인한 사용자의 경우 그룹 히스토리에 추가
      if (currentUser) {
        addUserGroupSession(currentUser.id, session);
      }
      
      setCurrentView('guest-join');
    }
  };

  const handleManageGroup = (group: GroupSession) => {
    setGroupSession(group);
    setCurrentView('group-management');
  };

  const handleParticipantJoin = (participantName: string) => {
    if (groupSession) {
      const result = storage.addParticipant(groupSession.id, participantName);
      if (result) {
        setGroupSession(result.session);
        setCurrentParticipantId(result.participantId);
        
        // 로그인한 사용자의 경우 그룹 히스토리에 추가
        if (currentUser) {
          addUserGroupSession(currentUser.id, result.session);
        }
        
        setCurrentView('input');
        showToast(`${participantName}님, 환영합니다!`, 'success');
      }
    }
  };

  const handleInputComplete = (updatedSession: GroupSession) => {
    storage.saveSession(updatedSession);
    setGroupSession(updatedSession);
    
    // 로그인한 사용자의 경우 그룹 히스토리 업데이트
    if (currentUser) {
      addUserGroupSession(currentUser.id, updatedSession);
    }
    
    // 모든 참여자가 입력을 완료했는지 확인
    const allCompleted = updatedSession.participants.every(p => p.completed);
    if (allCompleted) {
      showToast('모든 참여자의 입력이 완료되었습니다!', 'success');
      setTimeout(() => {
        setCurrentView('result');
      }, 1500);
    } else {
      // 입력 완료 후 참여자 선택 화면으로 돌아가기
      setCurrentParticipantId('');
      setCurrentView('guest-join');
    }
  };

  const handleSessionUpdate = (updatedSession: GroupSession) => {
    setGroupSession(updatedSession);
    storage.saveSession(updatedSession);
    
    // 로그인한 사용자의 경우 그룹 히스토리 업데이트
    if (currentUser) {
      addUserGroupSession(currentUser.id, updatedSession);
    }
  };

  const handleBackToMain = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('guest-create');
    }
    setGroupSession(null);
    setCurrentParticipantId('');
  };

  const handleGoHome = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('auth');
    }
    setGroupSession(null);
    setCurrentParticipantId('');
  };

  const handleGetRecommendation = (session: GroupSession) => {
    setGroupSession(session);
    setCurrentView('result');
  };

  return (
    <AppContainer>
      {/* 인증 화면 */}
      {currentView === 'auth' && (
        <AuthCheck
          onLogin={() => setCurrentView('login')}
          onRegister={() => setCurrentView('register')}
          onGuestStart={handleGuestStart}
        />
      )}

      {/* 로그인 화면 */}
      {currentView === 'login' && (
        <Login
          onBack={() => setCurrentView('auth')}
          onLoginSuccess={handleLoginSuccess}
          onRegister={() => setCurrentView('register')}
        />
      )}

      {/* 회원가입 화면 */}
      {currentView === 'register' && (
        <Register
          onBack={() => setCurrentView('auth')}
          onRegisterSuccess={handleRegisterSuccess}
          onLogin={() => setCurrentView('login')}
        />
      )}

      {/* 대시보드 (로그인 후) */}
      {currentView === 'dashboard' && (
        <div>
          <Header onLogout={handleLogout} onGoHome={handleGoHome} />
          <Dashboard
            onLogout={handleLogout}
            onCreateGroup={() => setCurrentView('guest-create')}
            onJoinGroup={handleJoinGroup}
            onManageGroup={handleManageGroup}
          />
        </div>
      )}

      {/* 그룹 관리 */}
      {currentView === 'group-management' && groupSession && (
        <div>
          <Header onLogout={handleLogout} onGoHome={handleGoHome} />
          <GroupManagement
            groupSession={groupSession}
            onBack={() => setCurrentView('dashboard')}
            onSessionUpdate={handleSessionUpdate}
            onGetRecommendation={handleGetRecommendation}
          />
        </div>
      )}

      {/* 게스트 모드 - 그룹 생성 */}
      {currentView === 'guest-create' && (
        <GuestContainer>
          <Header onLogout={handleLogout} onGoHome={handleGoHome} />
          <Container>
            <WelcomeText>
              <p>우리 모두가 만족하는 메뉴를 찾아보세요</p>
              {!currentUser && (
                <LoginPrompt>
                  <button onClick={() => setCurrentView('auth')}>
                    로그인하여 그룹 히스토리 저장하기
                  </button>
                </LoginPrompt>
              )}
            </WelcomeText>
            <GroupCreation 
              onGroupCreated={handleGroupCreated}
              onJoinGroup={handleJoinGroup}
            />
          </Container>
        </GuestContainer>
      )}

      {/* 그룹 참여 */}
      {currentView === 'guest-join' && groupSession && (
        <GuestContainer>
          <Header onLogout={handleLogout} onGoHome={handleGoHome} />
          <Container>
            <JoinGroup
              groupSession={groupSession}
              onParticipantJoin={handleParticipantJoin}
              onSelectExisting={(participantId) => {
                setCurrentParticipantId(participantId);
                setCurrentView('input');
              }}
              onBack={handleBackToMain}
            />
          </Container>
        </GuestContainer>
      )}

      {/* 참여자 입력 */}
      {currentView === 'input' && groupSession && (
        <GuestContainer>
          <Header onLogout={handleLogout} onGoHome={handleGoHome} />
          <Container>
            <ParticipantInput
              groupSession={groupSession}
              currentParticipantId={currentParticipantId}
              onInputComplete={handleInputComplete}
              onBack={handleBackToMain}
            />
          </Container>
        </GuestContainer>
      )}

      {/* 추천 결과 */}
      {currentView === 'result' && groupSession && (
        <GuestContainer>
          <Header onLogout={handleLogout} onGoHome={handleGoHome} />
          <Container>
            <RecommendationResult
              groupSession={groupSession}
              onBack={handleBackToMain}
              onSessionUpdate={handleSessionUpdate}
            />
          </Container>
        </GuestContainer>
      )}
    </AppContainer>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;