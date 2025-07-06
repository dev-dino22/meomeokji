export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}

const USERS_KEY = 'menu-app-users';
const SESSION_KEY = 'menu-app-session';

// 사용자 등록 (테스트 계정 자동 생성 포함)
export const registerUser = (email: string, name: string, password: string): { success: boolean; message: string; user?: User } => {
  try {
    const users = getAllUsers();
    
    // 이미 존재하는 이메일인지 확인
    if (users.some(user => user.email === email)) {
      return { success: false, message: '이미 가입된 이메일입니다.' };
    }

    // 새 사용자 생성
    const newUser: User = {
      id: generateUserId(),
      email,
      name,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    // 사용자 목록에 추가
    users.push(newUser);
    saveUsers(users);

    // 비밀번호 저장 (실제 앱에서는 해시화 필요)
    saveUserPassword(newUser.id, password);

    return { success: true, message: '회원가입이 완료되었습니다.', user: newUser };
  } catch (error) {
    console.error('회원가입 실패:', error);
    return { success: false, message: '회원가입에 실패했습니다.' };
  }
};

// 사용자 로그인 (테스트 계정 자동 생성 포함)
export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  try {
    let users = getAllUsers();
    
    // 테스트 계정이 없으면 자동 생성
    if (email === 'test@example.com' && password === '123456') {
      const existingTestUser = users.find(u => u.email === 'test@example.com');
      if (!existingTestUser) {
        const testUser: User = {
          id: 'test-user-001',
          email: 'test@example.com',
          name: '테스트 사용자',
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        users.push(testUser);
        saveUsers(users);
        saveUserPassword(testUser.id, '123456');
      }
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: '등록되지 않은 이메일입니다.' };
    }

    // 비밀번호 확인
    const storedPassword = getUserPassword(user.id);
    if (storedPassword !== password) {
      return { success: false, message: '비밀번호가 틀렸습니다.' };
    }

    // 마지막 로그인 시간 업데이트
    user.lastLoginAt = new Date();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    saveUsers(updatedUsers);

    // 세션 생성
    const session: UserSession = {
      user,
      token: generateToken(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7일 후 만료
    };

    saveSession(session);

    return { success: true, message: '로그인되었습니다.', user };
  } catch (error) {
    console.error('로그인 실패:', error);
    return { success: false, message: '로그인에 실패했습니다.' };
  }
};

// 현재 로그인된 사용자 가져오기
export const getCurrentUser = (): User | null => {
  try {
    const session = getSession();
    
    if (!session) return null;
    
    // 세션 만료 확인
    if (new Date() > new Date(session.expiresAt)) {
      clearSession();
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('현재 사용자 가져오기 실패:', error);
    return null;
  }
};

// 로그아웃
export const logoutUser = (): void => {
  clearSession();
};

// 사용자가 로그인되어 있는지 확인
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

// 사용자의 그룹 세션 가져오기
export const getUserGroupSessions = (userId: string): any[] => {
  try {
    const userGroupsKey = `user-groups-${userId}`;
    const data = localStorage.getItem(userGroupsKey);
    
    if (!data) return [];
    
    return JSON.parse(data).map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt)
    }));
  } catch (error) {
    console.error('사용자 그룹 세션 가져오기 실패:', error);
    return [];
  }
};

// 사용자의 그룹 세션에 추가
export const addUserGroupSession = (userId: string, groupSession: any): void => {
  try {
    console.log('사용자 그룹 세션 추가:', { userId, groupSessionId: groupSession.id, title: groupSession.title });
    
    const userGroups = getUserGroupSessions(userId);
    const existingIndex = userGroups.findIndex(g => g.id === groupSession.id);
    
    if (existingIndex >= 0) {
      userGroups[existingIndex] = groupSession;
      console.log('기존 그룹 업데이트:', groupSession.title);
    } else {
      userGroups.push(groupSession);
      console.log('새 그룹 추가:', groupSession.title);
    }
    
    const userGroupsKey = `user-groups-${userId}`;
    localStorage.setItem(userGroupsKey, JSON.stringify(userGroups));
    
    console.log('사용자 그룹 저장 완료. 총 그룹 수:', userGroups.length);
  } catch (error) {
    console.error('사용자 그룹 세션 추가 실패:', error);
  }
};

// 사용자의 그룹 세션에서 제거
export const removeUserGroupSession = (userId: string, groupSessionId: string): void => {
  try {
    const userGroups = getUserGroupSessions(userId);
    const filteredGroups = userGroups.filter(g => g.id !== groupSessionId);
    
    const userGroupsKey = `user-groups-${userId}`;
    localStorage.setItem(userGroupsKey, JSON.stringify(filteredGroups));
    
    console.log('사용자 그룹 삭제 완료:', groupSessionId);
  } catch (error) {
    console.error('사용자 그룹 세션 삭제 실패:', error);
  }
};

// 내부 함수들
const getAllUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLoginAt: new Date(user.lastLoginAt)
    }));
  } catch (error) {
    console.error('사용자 목록 가져오기 실패:', error);
    return [];
  }
};

const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('사용자 목록 저장 실패:', error);
  }
};

const saveUserPassword = (userId: string, password: string): void => {
  try {
    localStorage.setItem(`password-${userId}`, password);
  } catch (error) {
    console.error('비밀번호 저장 실패:', error);
  }
};

const getUserPassword = (userId: string): string | null => {
  try {
    return localStorage.getItem(`password-${userId}`);
  } catch (error) {
    console.error('비밀번호 가져오기 실패:', error);
    return null;
  }
};

const getSession = (): UserSession | null => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    
    const session = JSON.parse(data);
    return {
      ...session,
      user: {
        ...session.user,
        createdAt: new Date(session.user.createdAt),
        lastLoginAt: new Date(session.user.lastLoginAt)
      },
      expiresAt: new Date(session.expiresAt)
    };
  } catch (error) {
    console.error('세션 가져오기 실패:', error);
    return null;
  }
};

const saveSession = (session: UserSession): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('세션 저장 실패:', error);
  }
};

const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('세션 삭제 실패:', error);
  }
};

const generateUserId = (): string => {
  return 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: '비밀번호는 6자 이상이어야 합니다.' };
  }
  
  return { valid: true, message: '' };
};

// 사용자 기피 음식 관련 타입 및 함수
export interface UserAvoidedFoods {
  cannotEat: string[]; // 못 먹는 음식 (알레르기 등)
  dislike: string[]; // 싫어하는 음식
}

// 사용자 기피 음식 저장
export const saveUserAvoidedFoods = (userId: string, avoidedFoods: UserAvoidedFoods): void => {
  try {
    const key = `avoided-foods-${userId}`;
    localStorage.setItem(key, JSON.stringify(avoidedFoods));
    console.log('사용자 기피 음식 저장:', { userId, avoidedFoods });
  } catch (error) {
    console.error('사용자 기피 음식 저장 실패:', error);
  }
};

// 사용자 기피 음식 불러오기
export const getUserAvoidedFoods = (userId: string): UserAvoidedFoods => {
  try {
    const key = `avoided-foods-${userId}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      return { cannotEat: [], dislike: [] };
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('사용자 기피 음식 불러오기 실패:', error);
    return { cannotEat: [], dislike: [] };
  }
};