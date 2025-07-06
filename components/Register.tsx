import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Button } from './styled/Button';
import { Input } from './styled/Input';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { ArrowLeftIcon, CheckIcon } from './styled/Icons';
import { useToast } from './styled/Toast';
import { registerUser, validateEmail, validatePassword } from '../utils/auth';
import { theme } from './styled/theme';

interface RegisterProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  onLogin: () => void;
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

const PasswordStrengthContainer = styled.div`
  margin-top: 0.5rem;
`;

const PasswordStrengthBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const StrengthBarContainer = styled.div`
  flex: 1;
  height: 0.5rem;
  background: ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const StrengthBar = styled.div<{ strength: number }>`
  height: 100%;
  transition: all 0.3s ease-in-out;
  
  ${props => {
    if (props.strength === 1) {
      return css`
        width: 33.33%;
        background: #f87171;
      `;
    } else if (props.strength === 2) {
      return css`
        width: 66.66%;
        background: #fbbf24;
      `;
    } else if (props.strength === 3) {
      return css`
        width: 100%;
        background: #10b981;
      `;
    }
    return css`width: 0;`;
  }}
`;

const StrengthText = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
`;

const PasswordMatchContainer = styled.div`
  margin-top: 0.5rem;
`;

const PasswordMatch = styled.div<{ isMatch: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.isMatch ? theme.colors.success : theme.colors.error};
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

const LoginCard = styled(Card)`
  background: ${theme.colors.surface};
  border-color: ${theme.colors.border};
`;

const LoginContent = styled.div`
  padding: 1rem;
  text-align: center;
  
  p {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    margin: 0 0 0.75rem 0;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  background: transparent;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.primary}66;
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primary}11;
    border-color: ${theme.colors.primary};
  }
`;

const UserPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="17" y1="11" x2="23" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export function Register({ onBack, onRegisterSuccess, onLogin }: RegisterProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('이름을 입력해주세요', 'error');
      return false;
    }

    if (!formData.email.trim()) {
      showToast('이메일을 입력해주세요', 'error');
      return false;
    }

    if (!validateEmail(formData.email)) {
      showToast('올바른 이메일 형식을 입력해주세요', 'error');
      return false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      showToast(passwordValidation.message, 'error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('비밀번호가 일치하지 않습니다', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // 회원가입 시뮬레이션 (실제로는 즉시 처리)
    setTimeout(() => {
      const result = registerUser(formData.email, formData.name, formData.password);
      
      if (result.success) {
        showToast(result.message, 'success');
        onRegisterSuccess();
      } else {
        showToast(result.message, 'error');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: '약함' };
    if (password.length < 10) return { strength: 2, text: '보통' };
    return { strength: 3, text: '강함' };
  };

  const passwordStrength = getPasswordStrength();

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
            <p>회원가입</p>
          </HeaderContent>
        </HeaderSection>

        {/* 회원가입 폼 */}
        <MainCard>
          <CardHeader style={{ textAlign: 'center' }}>
            <CardTitle>
              <UserPlusIcon />
              회원가입
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormContainer onSubmit={handleSubmit}>
              <FormGroup>
                <label>이름</label>
                <Input
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  fullWidth
                />
              </FormGroup>

              <FormGroup>
                <label>이메일</label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  fullWidth
                />
              </FormGroup>

              <FormGroup>
                <label>비밀번호</label>
                <PasswordContainer>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요 (6자 이상)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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
                
                {/* 비밀번호 강도 표시 */}
                {formData.password && (
                  <PasswordStrengthContainer>
                    <PasswordStrengthBar>
                      <StrengthBarContainer>
                        <StrengthBar strength={passwordStrength.strength} />
                      </StrengthBarContainer>
                      <StrengthText>{passwordStrength.text}</StrengthText>
                    </PasswordStrengthBar>
                  </PasswordStrengthContainer>
                )}
              </FormGroup>

              <FormGroup>
                <label>비밀번호 확인</label>
                <PasswordContainer>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    fullWidth
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </PasswordToggle>
                </PasswordContainer>

                {/* 비밀번호 일치 확인 */}
                {formData.confirmPassword && (
                  <PasswordMatchContainer>
                    <PasswordMatch isMatch={formData.password === formData.confirmPassword}>
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckIcon size={16} />
                          <span>비밀번호가 일치합니다</span>
                        </>
                      ) : (
                        <span>비밀번호가 일치하지 않습니다</span>
                      )}
                    </PasswordMatch>
                  </PasswordMatchContainer>
                )}
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LoadingSpinner />
                    가입 중...
                  </div>
                ) : (
                  <>
                    <UserPlusIcon />
                    회원가입
                  </>
                )}
              </SubmitButton>
            </FormContainer>
          </CardContent>
        </MainCard>

        {/* 로그인 링크 */}
        <LoginCard>
          <LoginContent>
            <p>이미 계정이 있으신가요?</p>
            <LoginButton onClick={onLogin}>
              로그인하기
            </LoginButton>
          </LoginContent>
        </LoginCard>
      </Content>
    </Container>
  );
}