import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button } from './styled/Button';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { MyPage } from './MyPage';
import { theme } from './styled/theme';

interface HeaderProps {
  onLogout?: () => void;
  onGoHome?: () => void;
}

const HeaderContainer = styled.header`
  background: ${theme.colors.background};
  box-shadow: ${theme.shadows.sm};
  border-bottom: 1px solid ${theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: ${theme.borderRadius.lg};
  padding: 0.5rem;
  cursor: pointer;
  background: none;
  border: none;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${theme.colors.surface};
  }
  
  .emoji {
    font-size: 2rem;
    line-height: 1;
  }
  
  h1 {
    font-size: 1.25rem;
    color: ${theme.colors.primary};
    margin: 0;
    font-weight: 700;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MenuButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export function Header({ onLogout, onGoHome }: HeaderProps) {
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    if (onLogout) {
      onLogout();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          {/* 로고 - 클릭 가능 */}
          <LogoButton onClick={handleGoHome}>
            <span className="emoji">🍽️</span>
            <h1>뭐먹지</h1>
          </LogoButton>

          {/* 우측 메뉴 */}
          <MenuContainer>
            {user ? (
              <>
                <MenuButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMyPageOpen(true)}
                >
                  <SettingsIcon />
                  프로필 수정
                </MenuButton>
                <MenuButton
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  로그아웃
                </MenuButton>
              </>
            ) : (
              <MenuButton
                variant="outline"
                size="sm"
                onClick={() => setIsMyPageOpen(true)}
              >
                <UserIcon />
                프로필 수정
              </MenuButton>
            )}
          </MenuContainer>
        </HeaderContent>
      </HeaderContainer>

      {/* 마이페이지 다이얼로그 */}
      <MyPage
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        onLogout={onLogout}
      />
    </>
  );
}