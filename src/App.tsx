import React, { useState, useEffect } from 'react';
import { AuthCheck } from './components/AuthCheck';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GroupCreation } from './components/GroupCreation';
import { JoinGroup } from './components/JoinGroup';
import { ParticipantInput } from './components/ParticipantInput';
import { RecommendationResult } from './components/RecommendationResult';
import { GroupManagement } from './components/GroupManagement';
import { ToastProvider } from './components/styled/Toast';
import { getCurrentUser, saveUserGroupSession } from './utils/auth';
import * as storage from './utils/storage';

export type FoodCategory = 'korean' | 'chinese' | 'japanese' | 'western' | 'fast' | 'cafe' | 'asian' | 'etc';

export interface FoodSelection {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  isCategory?: boolean;
  isSubcategory?: boolean;
  isCustom?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  // 새로운 구조
  notCravingFoods: FoodSelection[];
  allergies: string[];
  cravingFoods: FoodSelection[];
  completed: boolean;
  // 기존 호환성 유지
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

type AppState = 
  | 'auth'
  | 'dashboard' 
  | 'createGroup'
  | 'joinGroup'
  | 'participantInput'
  | 'recommendation'
  | 'groupManagement';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('auth');
  const [currentSession, setCurrentSession] = useState<GroupSession | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('');
  const [user, setUser] = useState(getCurrentUser());

  // URL에서 join 파라미터 확인 (초대 링크)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinSessionId = urlParams.get('join');
    
    if (joinSessionId) {
      const session = storage.getSession(joinSessionId);
      if (session) {
        setCurrentSession(session);
        setCurrentState('joinGroup');
        // URL 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
    }

    // 로그인 상태에 따라 초기 상태 설정
    if (user) {
      setCurrentState('dashboard');
    } else {
      setCurrentState('auth');
    }
  }, [user]);

  const handleLogin = () => {
    setUser(getCurrentUser());
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentState('auth');
    setCurrentSession(null);
    setCurrentParticipantId('');
  };

  const handleGroupCreated = (session: GroupSession) => {
    console.log('새 그룹 생성됨:', session);
    setCurrentSession(session);
    
    // 현재 사용자를 그룹 세션에 저장
    if (user) {
      saveUserGroupSession(user.id, session);
    }
    
    setCurrentState('dashboard');
  };

  const handleJoinGroup = (sessionId: string, participantName?: string) => {
    const session = storage.getSession(sessionId);
    if (!session) {
      console.error('세션을 찾을 수 없습니다:', sessionId);
      return;
    }

    console.log('그룹 참여:', { sessionId, participantName, session });
    setCurrentSession(session);

    if (participantName) {
      // 새 참여자로 추가
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: participantName,
        notCravingFoods: [],
        allergies: [],
        cravingFoods: [],
        completed: false,
        dislikes: [],
        likes: []
      };

      const updatedSession = {
        ...session,
        participants: [...session.participants, newParticipant]
      };

      storage.saveSession(updatedSession);
      setCurrentSession(updatedSession);
      setCurrentParticipantId(newParticipant.id);
      
      // 현재 사용자를 그룹 세션에 저장
      if (user) {
        saveUserGroupSession(user.id, updatedSession);
      }
      
      setCurrentState('participantInput');
    } else {
      setCurrentState('joinGroup');
    }
  };

  const handleParticipantSelect = (participantId: string) => {
    console.log('참여자 선택됨:', participantId);
    setCurrentParticipantId(participantId);
    setCurrentState('participantInput');
  };

  const handleInputComplete = (updatedSession: GroupSession) => {
    console.log('입력 완료:', updatedSession);
    storage.saveSession(updatedSession);
    setCurrentSession(updatedSession);
    
    // 현재 사용자를 그룹 세션에 저장
    if (user) {
      saveUserGroupSession(user.id, updatedSession);
    }
    
    setCurrentState('recommendation');
  };

  const handleSessionUpdate = (updatedSession: GroupSession) => {
    console.log('세션 업데이트:', updatedSession);
    storage.saveSession(updatedSession);
    setCurrentSession(updatedSession);
    
    // 현재 사용자를 그룹 세션에 저장
    if (user) {
      saveUserGroupSession(user.id, updatedSession);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
    setCurrentSession(null);
    setCurrentParticipantId('');
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'auth':
        return <AuthCheck onLogin={handleLogin} />;

      case 'dashboard':
        return (
          <Dashboard
            onLogout={handleLogout}
            onCreateGroup={() => setCurrentState('createGroup')}
            onJoinGroup={handleJoinGroup}
            onManageGroup={(group) => {
              setCurrentSession(group);
              setCurrentState('groupManagement');
            }}
          />
        );

      case 'createGroup':
        return (
          <GroupCreation
            onGroupCreated={handleGroupCreated}
            onJoinGroup={handleJoinGroup}
          />
        );

      case 'joinGroup':
        if (!currentSession) {
          setCurrentState('dashboard');
          return null;
        }
        return (
          <JoinGroup
            groupSession={currentSession}
            onParticipantJoin={(name) => handleJoinGroup(currentSession.id, name)}
            onSelectExisting={handleParticipantSelect}
            onBack={handleBackToDashboard}
          />
        );

      case 'participantInput':
        if (!currentSession || !currentParticipantId) {
          setCurrentState('dashboard');
          return null;
        }
        return (
          <ParticipantInput
            groupSession={currentSession}
            currentParticipantId={currentParticipantId}
            onInputComplete={handleInputComplete}
            onBack={() => setCurrentState('joinGroup')}
          />
        );

      case 'recommendation':
        if (!currentSession) {
          setCurrentState('dashboard');
          return null;
        }
        return (
          <RecommendationResult
            groupSession={currentSession}
            onBack={handleBackToDashboard}
            onSessionUpdate={handleSessionUpdate}
          />
        );

      case 'groupManagement':
        if (!currentSession) {
          setCurrentState('dashboard');
          return null;
        }
        return (
          <GroupManagement
            groupSession={currentSession}
            onBack={handleBackToDashboard}
            onSessionUpdate={handleSessionUpdate}
            onGetRecommendation={(session) => {
              setCurrentSession(session);
              setCurrentState('recommendation');
            }}
          />
        );

      default:
        return <AuthCheck onLogin={handleLogin} />;
    }
  };

  return (
    <ToastProvider>
      <div className="app">
        {user && currentState !== 'auth' && (
          <Header 
            onLogout={handleLogout}
            onGoHome={handleBackToDashboard}
          />
        )}
        <main>
          {renderCurrentState()}
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;