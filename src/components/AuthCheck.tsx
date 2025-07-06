import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button } from './styled/Button';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { Login } from './Login';
import { Register } from './Register';
import { theme } from './styled/theme';

interface AuthCheckProps {
  onLogin: () => void;
}

type AuthMode = 'auth' | 'login' | 'register';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LogoSection = styled.div`
  text-align: center;
`;

const Logo = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  line-height: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.primary};
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
  font-size: 1rem;
`;

const MainCard = styled(Card)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border-color: ${theme.colors.primary}66;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 3rem;
  background: ${theme.colors.primary};
  color: white;
  border: 1px solid ${theme.colors.primary};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
    border-color: ${theme.colors.primaryHover};
  }
`;

const RegisterButton = styled(Button)`
  width: 100%;
  height: 3rem;
  background: transparent;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.primary}66;
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primary}11;
    border-color: ${theme.colors.primary};
  }
`;

const Divider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme.colors.border};
  }
  
  span {
    padding: 0 0.75rem;
    background: white;
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};
    text-transform: uppercase;
  }
`;

const GuestButton = styled(Button)`
  width: 100%;
  height: 3rem;
  background: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid transparent;
  
  &:hover:not(:disabled) {
    color: ${theme.colors.primary};
    background: ${theme.colors.primary}11;
  }
`;

const InfoCard = styled(Card)`
  background: #eff6ff;
  border-color: #93c5fd;
`;

const InfoTitle = styled.h3`
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  color: #1e40af;
  font-weight: 600;
`;

const InfoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;
  color: #1d4ed8;
  
  li {
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Features = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .check {
    color: ${theme.colors.success};
    font-weight: bold;
  }
`;

const BackButton = styled(Button)`
  width: 100%;
  margin-bottom: 1rem;
  background: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.surface};
  }
`;

// Icons
const LoginIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="17" y1="11" x2="23" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '0.5rem' }}>
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
    <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="12,19 5,12 12,5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function AuthCheck({ onLogin }: AuthCheckProps) {
  const [currentMode, setCurrentMode] = useState<AuthMode>('auth');

  const handleLoginSuccess = () => {
    onLogin();
  };

  const handleBackToAuth = () => {
    setCurrentMode('auth');
  };

  const handleGuestStart = () => {
    onLogin(); // 비회원도 동일하게 처리
  };

  if (currentMode === 'login') {
    return (
      <Container>
        <MainContent>
          <BackButton onClick={handleBackToAuth}>
            <ArrowLeftIcon />
            뒤로 가기
          </BackButton>
          <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentMode('register')} />
        </MainContent>
      </Container>
    );
  }

  if (currentMode === 'register') {
    return (
      <Container>
        <MainContent>
          <BackButton onClick={handleBackToAuth}>
            <ArrowLeftIcon />
            뒤로 가기
          </BackButton>
          <Register onRegisterSuccess={handleLoginSuccess} onSwitchToLogin={() => setCurrentMode('login')} />
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <MainContent>
        {/* 로고 및 타이틀 */}
        <LogoSection>
          <Logo>🍽️</Logo>
          <Title>함께메뉴</Title>
          <Subtitle>우리 모두가 만족하는 메뉴를 찾아보세요</Subtitle>
        </LogoSection>

        {/* 메인 카드 */}
        <MainCard>
          <CardHeader style={{ textAlign: 'center' }}>
            <CardTitle>회원이신가요?</CardTitle>
            <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, margin: 0 }}>
              계정이 있으면 그룹 히스토리를 확인할 수 있어요
            </p>
          </CardHeader>
          <CardContent>
            <ButtonContainer>
              {/* 로그인 */}
              <LoginButton onClick={() => setCurrentMode('login')}>
                <LoginIcon />
                로그인하기
              </LoginButton>

              {/* 회원가입 */}
              <RegisterButton onClick={() => setCurrentMode('register')}>
                <UserPlusIcon />
                회원가입하기
              </RegisterButton>

              {/* 구분선 */}
              <Divider>
                <span>또는</span>
              </Divider>

              {/* 비회원 시작 */}
              <GuestButton onClick={handleGuestStart}>
                <UsersIcon />
                비회원으로 시작하기
                <ArrowRightIcon />
              </GuestButton>
            </ButtonContainer>
          </CardContent>
        </MainCard>

        {/* 비회원 이용 안내 */}
        <InfoCard>
          <CardContent>
            <InfoTitle>💡 비회원 이용 안내</InfoTitle>
            <InfoList>
              <li>• 그룹 생성 및 메뉴 추천 기능 모두 이용 가능</li>
              <li>• 그룹 히스토리는 저장되지 않음</li>
              <li>• 회원가입 시 더 많은 기능 이용 가능</li>
            </InfoList>
          </CardContent>
        </InfoCard>

        {/* 서비스 특징 */}
        <Features>
          <Feature>
            <span className="check">✓</span>
            <span>빠른 메뉴 결정</span>
          </Feature>
          <Feature>
            <span className="check">✓</span>
            <span>모두가 만족</span>
          </Feature>
          <Feature>
            <span className="check">✓</span>
            <span>간편한 공유</span>
          </Feature>
        </Features>
      </MainContent>
    </Container>
  );
}