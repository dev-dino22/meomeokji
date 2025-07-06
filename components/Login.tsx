import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button } from './styled/Button';
import { Input } from './styled/Input';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { ArrowLeftIcon } from './styled/Icons';
import { useToast } from './styled/Toast';
import { loginUser, validateEmail } from '../utils/auth';
import { theme } from './styled/theme';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onRegister: () => void;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Content = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(Button)`
  background: transparent;
  border: 1px solid transparent;
  color: ${theme.colors.textSecondary};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  text-align: center;
  
  h1 {
    font-size: 1.5rem;
    color: ${theme.colors.primary};
    margin: 0 0 0.25rem 0;
    font-weight: 700;
  }
  
  p {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    margin: 0;
  }
`;

const MainCard = styled(Card)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border-color: ${theme.colors.primary}66;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    display: block;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: ${theme.colors.text};
    font-weight: 500;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  height: 2.5rem;
  padding: 0 0.75rem;
  background: transparent;
  border: none;
  color: ${theme.colors.textSecondary};
  
  &:hover:not(:disabled) {
    background: transparent;
    color: ${theme.colors.text};
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 3rem;
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
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RegisterCard = styled(Card)`
  background: ${theme.colors.surface};
  border-color: ${theme.colors.border};
`;

const RegisterContent = styled.div`
  padding: 1rem;
  text-align: center;
  
  p {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    margin: 0 0 0.75rem 0;
  }
`;

const RegisterButton = styled(Button)`
  width: 100%;
  background: transparent;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.primary}66;
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primary}11;
    border-color: ${theme.colors.primary};
  }
`;

const TestCard = styled(Card)`
  background: #eff6ff;
  border-color: #93c5fd;
`;

const TestContent = styled.div`
  padding: 1rem;
  
  h3 {
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: #1e40af;
    font-weight: 600;
  }
  
  .test-info {
    font-size: 0.75rem;
    color: #1d4ed8;
    
    p {
      margin: 0.25rem 0;
      
      &:last-child {
        color: #2563eb;
        margin-top: 0.5rem;
      }
    }
  }
`;

const LoginIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Login({ onBack, onLoginSuccess, onRegister }: LoginProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('이메일을 입력해주세요', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('올바른 이메일 형식을 입력해주세요', 'error');
      return;
    }

    if (!password.trim()) {
      showToast('비밀번호를 입력해주세요', 'error');
      return;
    }

    setIsLoading(true);

    // 로그인 시뮬레이션 (실제로는 즉시 처리)
    setTimeout(() => {
      const result = loginUser(email, password);
      
      if (result.success) {
        showToast(result.message, 'success');
        onLoginSuccess();
      } else {
        showToast(result.message, 'error');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Container>
      <Content>
        {/* 헤더 */}
        <HeaderSection>
          <BackButton variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon size={16} />
          </BackButton>
          <HeaderContent>
            <h1>🍽️ 함께메뉴</h1>
            <p>로그인</p>
          </HeaderContent>
        </HeaderSection>

        {/* 로그인 폼 */}
        <MainCard>
          <CardHeader style={{ textAlign: 'center' }}>
            <CardTitle>
              <LoginIcon />
              로그인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormContainer onSubmit={handleSubmit}>
              <FormGroup>
                <label>이메일</label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
              </FormGroup>

              <FormGroup>
                <label>비밀번호</label>
                <PasswordContainer>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </PasswordToggle>
                </PasswordContainer>
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LoadingSpinner />
                    로그인 중...
                  </div>
                ) : (
                  <>
                    <LoginIcon />
                    로그인
                  </>
                )}
              </SubmitButton>
            </FormContainer>
          </CardContent>
        </MainCard>

        {/* 회원가입 링크 */}
        <RegisterCard>
          <RegisterContent>
            <p>아직 계정이 없으신가요?</p>
            <RegisterButton onClick={onRegister}>
              회원가입하기
            </RegisterButton>
          </RegisterContent>
        </RegisterCard>

        {/* 테스트 계정 안내 */}
        <TestCard>
          <TestContent>
            <h3>🔍 테스트 계정</h3>
            <div className="test-info">
              <p>이메일: test@example.com</p>
              <p>비밀번호: 123456</p>
              <p>위 계정으로 로그인을 테스트해보세요!</p>
            </div>
          </TestContent>
        </TestCard>
      </Content>
    </Container>
  );
}