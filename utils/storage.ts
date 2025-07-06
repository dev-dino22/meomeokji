import type { GroupSession, Participant, FoodCategory, FoodSelection } from '../App';

const STORAGE_KEY = 'group-menu-sessions';

export interface StorageData {
  sessions: GroupSession[];
  lastUpdated: string;
}

export interface RecommendationItem {
  category: FoodCategory;
  score: number;
  likeCount: number;
  dislikeCount: number;
  satisfactionRate: number;
}

export interface SessionRecommendation {
  sessionId: string;
  recommendations: RecommendationItem[];
  calculatedAt: string;
  participantHash: string; // 참여자 입력 상태의 해시값
}

const RECOMMENDATIONS_KEY = 'group-menu-recommendations';

// 로컬 스토리지에서 모든 세션 가져오기
export const getAllSessions = (): GroupSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed: StorageData = JSON.parse(data);
    return parsed.sessions.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt)
    }));
  } catch (error) {
    console.error('세션 로드 실패:', error);
    return [];
  }
};

// 특정 세션 가져오기
export const getSession = (sessionId: string): GroupSession | null => {
  const sessions = getAllSessions();
  return sessions.find(session => session.id === sessionId) || null;
};

// 세션 저장
export const saveSession = (session: GroupSession): void => {
  try {
    const sessions = getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    const data: StorageData = {
      sessions,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('세션 저장 실패:', error);
  }
};

// 세션 업데이트 (참여자 정보 등)
export const updateSession = (sessionId: string, updates: Partial<GroupSession>): GroupSession | null => {
  try {
    const session = getSession(sessionId);
    if (!session) return null;
    
    const updatedSession = { ...session, ...updates };
    saveSession(updatedSession);
    return updatedSession;
  } catch (error) {
    console.error('세션 업데이트 실패:', error);
    return null;
  }
};

// 참여자 정보 업데이트
export const updateParticipant = (sessionId: string, participantId: string, updates: Partial<Participant>): GroupSession | null => {
  try {
    const session = getSession(sessionId);
    if (!session) return null;
    
    const updatedParticipants = session.participants.map(p => 
      p.id === participantId ? { ...p, ...updates } : p
    );
    
    const updatedSession = { ...session, participants: updatedParticipants };
    saveSession(updatedSession);
    return updatedSession;
  } catch (error) {
    console.error('참여자 업데이트 실패:', error);
    return null;
  }
};

// 새 참여자 추가 (링크로 참여한 경우)
export const addParticipant = (sessionId: string, name: string): { session: GroupSession; participantId: string } | null => {
  try {
    const session = getSession(sessionId);
    if (!session) return null;
    
    const participantId = `joined-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newParticipant: Participant = {
      id: participantId,
      name: name,
      notCravingFoods: [],      // 새로운 필드 추가
      allergies: [],            // 새로운 필드 추가
      cravingFoods: [],         // 새로운 필드 추가
      completed: false,
      // 기존 호환성을 위해 유지
      dislikes: [],
      likes: []
    };
    
    const updatedSession = {
      ...session,
      participants: [...session.participants, newParticipant]
    };
    
    saveSession(updatedSession);
    return { session: updatedSession, participantId };
  } catch (error) {
    console.error('참여자 추가 실패:', error);
    return null;
  }
};

// 세션 삭제
export const deleteSession = (sessionId: string): boolean => {
  try {
    const sessions = getAllSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    const data: StorageData = {
      sessions: filteredSessions,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // 해당 세션의 추천 결과도 삭제
    deleteRecommendation(sessionId);
    return true;
  } catch (error) {
    console.error('세션 삭제 실패:', error);
    return false;
  }
};

// 참여자 입력 상태의 해시값 생성 (추천 결과 캐싱용)
const generateParticipantHash = (participants: Participant[]): string => {
  const participantData = participants
    .filter(p => p.completed)
    .map(p => ({
      id: p.id,
      likes: [...(p.likes || [])].sort(),
      dislikes: [...(p.dislikes || [])].sort(),
      // 새로운 필드들도 포함
      notCravingFoods: [...(p.notCravingFoods || [])].map(f => f.id).sort(),
      allergies: [...(p.allergies || [])].sort(),
      cravingFoods: [...(p.cravingFoods || [])].map(f => f.id).sort()
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
    
  return btoa(JSON.stringify(participantData));
};

// 추천 결과 저장
export const saveRecommendation = (sessionId: string, recommendations: RecommendationItem[], participants: Participant[]): void => {
  try {
    const existingRecommendations = getAllRecommendations();
    const participantHash = generateParticipantHash(participants);
    
    const newRecommendation: SessionRecommendation = {
      sessionId,
      recommendations,
      calculatedAt: new Date().toISOString(),
      participantHash
    };
    
    const filteredRecommendations = existingRecommendations.filter(r => r.sessionId !== sessionId);
    filteredRecommendations.push(newRecommendation);
    
    localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(filteredRecommendations));
  } catch (error) {
    console.error('추천 결과 저장 실패:', error);
  }
};

// 추천 결과 가져오기
export const getRecommendation = (sessionId: string, participants: Participant[]): RecommendationItem[] | null => {
  try {
    const recommendations = getAllRecommendations();
    const sessionRecommendation = recommendations.find(r => r.sessionId === sessionId);
    
    if (!sessionRecommendation) return null;
    
    // 참여자 입력 상태가 변경되었는지 확인
    const currentHash = generateParticipantHash(participants);
    if (sessionRecommendation.participantHash !== currentHash) {
      // 입력 상태가 변경되었으면 기존 추천 결과 삭제
      deleteRecommendation(sessionId);
      return null;
    }
    
    return sessionRecommendation.recommendations;
  } catch (error) {
    console.error('추천 결과 로드 실패:', error);
    return null;
  }
};

// 모든 추천 결과 가져오기
const getAllRecommendations = (): SessionRecommendation[] => {
  try {
    const data = localStorage.getItem(RECOMMENDATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('추천 결과 로드 실패:', error);
    return [];
  }
};

// 추천 결과 삭제
export const deleteRecommendation = (sessionId: string): void => {
  try {
    const recommendations = getAllRecommendations();
    const filteredRecommendations = recommendations.filter(r => r.sessionId !== sessionId);
    localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(filteredRecommendations));
  } catch (error) {
    console.error('추천 결과 삭제 실패:', error);
  }
};

// URL에서 참여 코드 가져오기
export const getJoinCodeFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('join');
};

// URL 정리
export const clearJoinCodeFromURL = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('join');
  window.history.replaceState({}, '', url.toString());
};