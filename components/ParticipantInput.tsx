import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Button } from './styled/Button';
import { Card, CardContent, CardHeader, CardTitle } from './styled/Card';
import { Badge } from './styled/Badge';
import { Input } from './styled/Input';
import { Tabs, TabsList, TabsContent, TabsTrigger } from './styled/Tabs';
import { ArrowLeftIcon, CheckIcon, XIcon } from './styled/Icons';
import { useToast } from './styled/Toast';
import { getCurrentUser, getUserAvoidedFoods } from '../utils/auth';
import { foodCategories, commonAllergies, searchFoods, getAllFoods } from '../utils/foodData';
import { theme } from './styled/theme';
import type { GroupSession, Participant, FoodSelection } from '../App';

interface ParticipantInputProps {
  groupSession: GroupSession;
  currentParticipantId: string;
  onInputComplete: (session: GroupSession) => void;
  onBack: () => void;
}

type InputStep = 'not-craving' | 'allergies' | 'craving';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 8rem;
`;

const HeaderCard = styled(Card)`
  .header-content {
    padding: 1rem;
  }
  
  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .back-button {
    background: transparent;
    border: 1px solid transparent;
    color: ${theme.colors.textSecondary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
      color: ${theme.colors.text};
    }
  }
  
  .header-info {
    text-align: center;
    
    h2 {
      font-size: 1.125rem;
      margin: 0 0 0.25rem 0;
      color: ${theme.colors.text};
    }
    
    p {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
      margin: 0;
    }
  }
  
  .progress-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .progress-bar {
    width: 2rem;
    height: 0.5rem;
    border-radius: ${theme.borderRadius.full};
    
    &.active {
      background: ${theme.colors.primary};
    }
    
    &.inactive {
      background: ${theme.colors.primary}55;
    }
  }
`;

const StepCard = styled(Card)`
  .step-header {
    padding: 1.5rem;
    
    .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${theme.colors.text};
    }
    
    .description {
      font-size: 0.875rem;
      color: ${theme.colors.textSecondary};
      margin: 0;
    }
  }
  
  .step-content {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const AllergyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const AllergyButton = styled(Button)<{ isSelected: boolean }>`
  height: auto;
  padding: 0.75rem;
  justify-content: flex-start;
  
  ${props => props.isSelected ? css`
    background: ${theme.colors.error};
    color: white;
    border-color: ${theme.colors.error};
    
    &:hover:not(:disabled) {
      background: #dc2626;
      border-color: #dc2626;
    }
  ` : css`
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: #fef2f2;
    }
  `}
`;

const SelectedAllergies = styled.div`
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: ${theme.borderRadius.lg};
  
  h4 {
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: ${theme.colors.text};
  }
  
  .allergies-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
`;

const CategoryContainer = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  
  .category-header {
    display: flex;
  }
  
  .category-button {
    flex: 1;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    
    &:hover {
      background: ${theme.colors.surface};
    }
    
    .category-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .emoji {
        font-size: 1.125rem;
      }
    }
  }
  
  .add-all-button {
    margin: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  }
  
  .subcategories {
    border-top: 1px solid ${theme.colors.border};
    background: ${theme.colors.surface};
  }
  
  .subcategory-item {
    .subcategory-header {
      display: flex;
    }
    
    .subcategory-button {
      flex: 1;
      padding: 0.5rem 0.5rem 0.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      
      &:hover {
        background: #f3f4f6;
      }
      
      span {
        font-size: 0.875rem;
      }
    }
    
    .subcategory-add-button {
      margin: 0.25rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      background: transparent;
      color: ${theme.colors.text};
      border: 1px solid ${theme.colors.border};
      
      &:hover:not(:disabled) {
        background: white;
      }
    }
    
    .foods-list {
      padding: 0.5rem 0.5rem 0.5rem 3rem;
      border-top: 1px solid ${theme.colors.border};
      background: white;
      
      .foods-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.25rem;
      }
      
      .food-button {
        justify-content: flex-start;
        height: auto;
        padding: 0.5rem;
        font-size: 0.75rem;
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid transparent;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.surface};
        }
      }
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  .search-input-container {
    position: relative;
    
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: ${theme.colors.textSecondary};
      pointer-events: none;
    }
    
    .search-input {
      padding-left: 2.5rem;
    }
  }
  
  .search-results {
    max-height: 10rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .search-result-button {
    justify-content: flex-start;
    width: 100%;
    height: auto;
    padding: 0.5rem;
    font-size: 0.875rem;
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  }
  
  .custom-input-container {
    display: flex;
    gap: 0.5rem;
    
    .custom-input {
      flex: 1;
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  
  .nav-left {
    
  }
  
  .nav-right {
    display: flex;
    gap: 0.5rem;
  }
  
  .skip-button {
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  }
  
  .next-button, .complete-button {
    background: ${theme.colors.primary};
    color: white;
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  }
`;

const FixedSelections = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid ${theme.colors.border};
  padding: 1rem;
  box-shadow: ${theme.shadows.lg};
  
  .selections-container {
    max-width: 28rem;
    margin: 0 auto;
  }
  
  .selections-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    h4 {
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
      color: ${theme.colors.text};
    }
    
    .clear-button {
      background: transparent;
      border: 1px solid transparent;
      font-size: 0.75rem;
      color: ${theme.colors.textSecondary};
      
      &:hover:not(:disabled) {
        color: ${theme.colors.error};
      }
    }
  }
  
  .selections-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    max-height: 5rem;
    overflow-y: auto;
  }
`;

const LoadingCard = styled(Card)`
  text-align: center;
  
  .loading-content {
    padding: 2rem;
  }
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid ${theme.colors.primary};
    border-top: 2px solid transparent;
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

const ErrorCard = styled(Card)`
  text-align: center;
  
  .error-content {
    padding: 2rem;
  }
  
  .error-details {
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};
    margin: 1rem 0;
    
    ul {
      text-align: left;
      margin-top: 0.5rem;
      padding-left: 1rem;
      
      li {
        margin: 0.25rem 0;
      }
    }
  }
`;

// Icons
const ThumbsDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17 14V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SkipForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polygon points="5,4 15,12 5,20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
    <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function ParticipantInput({ groupSession, currentParticipantId, onInputComplete, onBack }: ParticipantInputProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<InputStep>('not-craving');
  const [participant, setParticipant] = useState<Participant | null>(null);
  
  // 선택된 음식들
  const [notCravingFoods, setNotCravingFoods] = useState<FoodSelection[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [cravingFoods, setCravingFoods] = useState<FoodSelection[]>([]);
  
  // UI 상태
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  
  // 초기화 완료 여부 추적
  const [isInitialized, setIsInitialized] = useState(false);
  const initializedParticipantId = useRef<string>('');

  // 참여자 초기 로드 (한 번만)
  useEffect(() => {
    console.log('ParticipantInput 초기화:', { 
      currentParticipantId, 
      groupSessionId: groupSession.id,
      participantCount: groupSession.participants.length,
      participants: groupSession.participants.map(p => ({ id: p.id, name: p.name }))
    });

    // 참여자 ID가 변경되거나 처음 로드할 때만 초기화
    if (currentParticipantId && currentParticipantId !== initializedParticipantId.current) {
      const foundParticipant = groupSession.participants.find(p => p.id === currentParticipantId);
      console.log('참여자 검색 결과:', { currentParticipantId, foundParticipant: foundParticipant?.name });
      
      if (foundParticipant) {
        setParticipant(foundParticipant);
        initializedParticipantId.current = currentParticipantId;
        
        // 기존 데이터 불러오기
        if (foundParticipant.notCravingFoods) {
          setNotCravingFoods(foundParticipant.notCravingFoods);
        }
        if (foundParticipant.allergies) {
          setAllergies(foundParticipant.allergies);
        }
        if (foundParticipant.cravingFoods) {
          setCravingFoods(foundParticipant.cravingFoods);
        }
        
        // 로그인한 사용자의 저장된 기피 음식 자동 적용 (완료되지 않은 경우에만)
        const currentUser = getCurrentUser();
        if (currentUser && !foundParticipant.completed && !foundParticipant.notCravingFoods?.length) {
          const avoidedFoods = getUserAvoidedFoods(currentUser.id);
          if (avoidedFoods.cannotEat?.length > 0 || avoidedFoods.dislike?.length > 0) {
            // 알러지 정보 자동 적용
            const autoAllergies = [...avoidedFoods.cannotEat || []];
            setAllergies(autoAllergies);
            
            // 싫어하는 음식을 "안 땡기는 음식"으로 자동 적용
            const autoNotCraving: FoodSelection[] = (avoidedFoods.dislike || []).map(category => ({
              id: category,
              name: foodCategories.find(cat => cat.id === category)?.name || category,
              category: category,
              subcategory: 'auto'
            }));
            setNotCravingFoods(autoNotCraving);
            
            showToast('저장된 기피 음식이 자동으로 적용되었습니다', 'info');
          }
        }
        
        setIsInitialized(true);
      } else {
        console.error('참여자를 찾을 수 없습니다. 사용 가능한 참여자 목록:', groupSession.participants);
        setIsInitialized(true);
      }
    } else if (!currentParticipantId) {
      console.log('currentParticipantId가 비어있습니다');
      setIsInitialized(true);
    }
  }, [currentParticipantId]); // groupSession 의존성 제거

  // 참여자 정보만 업데이트 (선택 상태는 유지)
  useEffect(() => {
    if (isInitialized && currentParticipantId) {
      const foundParticipant = groupSession.participants.find(p => p.id === currentParticipantId);
      if (foundParticipant && foundParticipant !== participant) {
        setParticipant(foundParticipant);
      }
    }
  }, [groupSession.participants, currentParticipantId, isInitialized, participant]);

  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategoryExpanded = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  // 대분류 선택 함수
  const addCategorySelection = (category: any, type: 'not-craving' | 'craving') => {
    const categoryFood: FoodSelection = {
      id: `category_${category.id}`,
      name: `${category.emoji} ${category.name} (전체)`,
      category: category.id,
      subcategory: 'all',
      isCategory: true
    };
    addFoodSelection(categoryFood, type);
  };

  // 중분류 선택 함수
  const addSubcategorySelection = (category: any, subcategory: any, type: 'not-craving' | 'craving') => {
    const subcategoryFood: FoodSelection = {
      id: `subcategory_${category.id}_${subcategory.id}`,
      name: `${subcategory.name} (${category.name})`,
      category: category.id,
      subcategory: subcategory.id,
      isSubcategory: true
    };
    addFoodSelection(subcategoryFood, type);
  };

  const addFoodSelection = (food: FoodSelection, type: 'not-craving' | 'craving') => {
    if (type === 'not-craving') {
      if (!notCravingFoods.find(f => f.id === food.id)) {
        setNotCravingFoods(prev => [...prev, food]);
      }
    } else {
      if (!cravingFoods.find(f => f.id === food.id)) {
        setCravingFoods(prev => [...prev, food]);
      }
    }
  };

  const removeFoodSelection = (foodId: string, type: 'not-craving' | 'craving') => {
    if (type === 'not-craving') {
      setNotCravingFoods(prev => prev.filter(f => f.id !== foodId));
    } else {
      setCravingFoods(prev => prev.filter(f => f.id !== foodId));
    }
  };

  const addCustomFood = (name: string, type: 'not-craving' | 'craving') => {
    if (!name.trim()) return;
    
    const customFood: FoodSelection = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      category: 'custom',
      subcategory: 'custom',
      isCustom: true
    };
    
    addFoodSelection(customFood, type);
    setCustomInput('');
  };

  const toggleAllergy = (allergyId: string) => {
    setAllergies(prev => {
      if (prev.includes(allergyId)) {
        return prev.filter(a => a !== allergyId);
      } else {
        return [...prev, allergyId];
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep === 'not-craving') {
      if (notCravingFoods.length === 0) {
        showToast('오늘 안 땡기는 음식을 최소 1개 이상 선택해주세요', 'error');
        return;
      }
      setCurrentStep('allergies');
    } else if (currentStep === 'allergies') {
      setCurrentStep('craving');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'craving') {
      setCurrentStep('allergies');
    } else if (currentStep === 'allergies') {
      setCurrentStep('not-craving');
    }
  };

  const handleSkipStep = () => {
    if (currentStep === 'allergies') {
      setCurrentStep('craving');
    } else if (currentStep === 'craving') {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!participant) return;

    // 기존 호환성을 위한 변환
    const legacyDislikes = notCravingFoods
      .filter(food => !food.isCustom && food.category !== 'custom')
      .map(food => food.category as any);
    
    const legacyLikes = cravingFoods
      .filter(food => !food.isCustom && food.category !== 'custom')
      .map(food => food.category as any);

    const updatedParticipant: Participant = {
      ...participant,
      notCravingFoods,
      allergies,
      cravingFoods,
      completed: true,
      // 기존 호환성 유지
      dislikes: legacyDislikes,
      likes: legacyLikes
    };

    const updatedSession = {
      ...groupSession,
      participants: groupSession.participants.map(p =>
        p.id === participant.id ? updatedParticipant : p
      )
    };

    onInputComplete(updatedSession);
    showToast(`${participant.name}님의 선호도가 저장되었습니다!`, 'success');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'not-craving':
        return '오늘 안 땡기는 음식은?';
      case 'allergies':
        return '못 먹거나 알러지가 있는 음식은?';
      case 'craving':
        return '땡기는 음식은?';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'not-craving':
        return '오늘 먹고 싶지 않은 음식을 선택해주세요';
      case 'allergies':
        return '알러지가 있거나 못 먹는 음식이 있다면 선택해주세요 (선택사항)';
      case 'craving':
        return '오늘 특별히 땡기는 음식이 있다면 선택해주세요 (선택사항)';
      default:
        return '';
    }
  };

  const getCurrentSelections = () => {
    switch (currentStep) {
      case 'not-craving':
        return notCravingFoods;
      case 'craving':
        return cravingFoods;
      default:
        return [];
    }
  };

  const getCurrentType = (): 'not-craving' | 'craving' => {
    return currentStep === 'not-craving' ? 'not-craving' : 'craving';
  };

  const filteredFoods = searchQuery ? searchFoods(searchQuery) : getAllFoods();

  // 참여자 ID가 없는 경우 처리
  if (!currentParticipantId) {
    return (
      <ErrorCard>
        <div className="error-content">
          <p style={{ color: theme.colors.textSecondary, marginBottom: '1rem' }}>참여자가 선택되지 않았습니다.</p>
          <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginBottom: '1rem' }}>참여자를 먼저 선택해주세요.</p>
          <Button onClick={onBack}>
            돌아가기
          </Button>
        </div>
      </ErrorCard>
    );
  }

  // 참여자를 찾을 수 없는 경우 처리
  if (!participant && isInitialized) {
    return (
      <ErrorCard>
        <div className="error-content">
          <p style={{ color: theme.colors.textSecondary, marginBottom: '1rem' }}>참여자를 찾을 수 없습니다.</p>
          <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginBottom: '1rem' }}>
            참여자 ID: {currentParticipantId}
          </p>
          <div className="error-details">
            <p>사용 가능한 참여자:</p>
            <ul>
              {groupSession.participants.map(p => (
                <li key={p.id}>• {p.name} (ID: {p.id})</li>
              ))}
            </ul>
          </div>
          <Button onClick={onBack}>
            돌아가기
          </Button>
        </div>
      </ErrorCard>
    );
  }

  // 로딩 중
  if (!isInitialized) {
    return (
      <LoadingCard>
        <div className="loading-content">
          <div className="spinner"></div>
          <p style={{ color: theme.colors.textSecondary }}>참여자 정보를 불러오는 중...</p>
        </div>
      </LoadingCard>
    );
  }

  return (
    <Container>
      {/* 헤더 */}
      <HeaderCard>
        <div className="header-content">
          <div className="header-top">
            <Button variant="ghost" size="sm" onClick={onBack} className="back-button">
              <ArrowLeftIcon size={16} />
            </Button>
            <div className="header-info">
              <h2>{participant?.name}님</h2>
              <p>{groupSession.title}</p>
            </div>
            <div style={{ width: '2rem' }} /> {/* 균형 맞추기 */}
          </div>
          
          {/* 진행 표시 */}
          <div className="progress-container">
            <div className={`progress-bar ${currentStep === 'not-craving' ? 'active' : 'inactive'}`} />
            <div className={`progress-bar ${currentStep === 'allergies' ? 'active' : 'inactive'}`} />
            <div className={`progress-bar ${currentStep === 'craving' ? 'active' : 'inactive'}`} />
          </div>
        </div>
      </HeaderCard>

      {/* 단계별 입력 */}
      <StepCard>
        <div className="step-header">
          <h2 className="title">
            {currentStep === 'not-craving' && <ThumbsDownIcon color="#dc2626" />}
            {currentStep === 'allergies' && <AlertTriangleIcon color="#d97706" />}
            {currentStep === 'craving' && <HeartIcon color="#ec4899" />}
            {getStepTitle()}
          </h2>
          <p className="description">{getStepDescription()}</p>
        </div>
        <div className="step-content">
          {/* 알러지 단계 */}
          {currentStep === 'allergies' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AllergyGrid>
                {commonAllergies.map(allergy => (
                  <AllergyButton
                    key={allergy.id}
                    isSelected={allergies.includes(allergy.id)}
                    onClick={() => toggleAllergy(allergy.id)}
                  >
                    <span style={{ marginRight: '0.5rem' }}>{allergy.emoji}</span>
                    {allergy.name}
                  </AllergyButton>
                ))}
              </AllergyGrid>
              
              {allergies.length > 0 && (
                <SelectedAllergies>
                  <h4>선택된 알러지:</h4>
                  <div className="allergies-list">
                    {allergies.map(allergyId => {
                      const allergy = commonAllergies.find(a => a.id === allergyId);
                      return allergy ? (
                        <Badge 
                          key={allergyId} 
                          variant="outline" 
                          style={{ 
                            background: '#fef2f2', 
                            borderColor: '#fecaca', 
                            color: '#b91c1c' 
                          }}
                        >
                          {allergy.emoji} {allergy.name}
                          <XIcon 
                            size={12} 
                            style={{ marginLeft: '0.25rem', cursor: 'pointer' }}
                            onClick={() => toggleAllergy(allergyId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </SelectedAllergies>
              )}
            </div>
          ) : (
            /* 음식 선택 단계 */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
                  <TabsTrigger value="categories">카테고리별</TabsTrigger>
                  <TabsTrigger value="search">검색</TabsTrigger>
                </TabsList>
                
                <TabsContent value="categories">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {foodCategories.map(category => (
                      <CategoryContainer key={category.id}>
                        {/* 대분류 헤더 */}
                        <div className="category-header">
                          <button
                            className="category-button"
                            onClick={() => toggleCategoryExpanded(category.id)}
                          >
                            <div className="category-info">
                              <span className="emoji">{category.emoji}</span>
                              <span>{category.name}</span>
                            </div>
                            {expandedCategories.has(category.id) ? 
                              <ChevronDownIcon /> : 
                              <ChevronRightIcon />
                            }
                          </button>
                          {/* 대분류 추가 버튼 */}
                          <Button
                            size="sm"
                            className="add-all-button"
                            onClick={() => addCategorySelection(category, getCurrentType())}
                          >
                            <PlusIcon />
                            전체
                          </Button>
                        </div>
                        
                        {expandedCategories.has(category.id) && (
                          <div className="subcategories">
                            {category.subcategories.map(subcategory => (
                              <div key={subcategory.id} className="subcategory-item">
                                {/* 중분류 헤더 */}
                                <div className="subcategory-header">
                                  <button
                                    className="subcategory-button"
                                    onClick={() => toggleSubcategoryExpanded(`${category.id}_${subcategory.id}`)}
                                  >
                                    <span>{subcategory.name}</span>
                                    {expandedSubcategories.has(`${category.id}_${subcategory.id}`) ? 
                                      <ChevronDownIcon /> : 
                                      <ChevronRightIcon />
                                    }
                                  </button>
                                  {/* 중분류 추가 버튼 */}
                                  <Button
                                    size="sm"
                                    className="subcategory-add-button"
                                    onClick={() => addSubcategorySelection(category, subcategory, getCurrentType())}
                                  >
                                    <PlusIcon />
                                  </Button>
                                </div>
                                
                                {/* 소분류 (개별 음식들) */}
                                {expandedSubcategories.has(`${category.id}_${subcategory.id}`) && (
                                  <div className="foods-list">
                                    <div className="foods-grid">
                                      {subcategory.foods.map(food => (
                                        <Button
                                          key={food.id}
                                          size="sm"
                                          className="food-button"
                                          onClick={() => addFoodSelection(food, getCurrentType())}
                                        >
                                          <PlusIcon />
                                          {food.name}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CategoryContainer>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="search">
                  <SearchContainer>
                    <div className="search-input-container">
                      <SearchIcon className="search-icon" />
                      <Input
                        placeholder="음식 이름을 검색해보세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        fullWidth
                      />
                    </div>
                    
                    {searchQuery && (
                      <div className="search-results">
                        {filteredFoods.slice(0, 10).map(food => (
                          <Button
                            key={food.id}
                            size="sm"
                            className="search-result-button"
                            onClick={() => addFoodSelection(food, getCurrentType())}
                          >
                            <PlusIcon />
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="custom-input-container">
                      <Input
                        placeholder="직접 입력..."
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomFood(customInput, getCurrentType())}
                        className="custom-input"
                        fullWidth
                      />
                      <Button onClick={() => addCustomFood(customInput, getCurrentType())}>
                        추가
                      </Button>
                    </div>
                  </SearchContainer>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </StepCard>

      {/* 하단 버튼 */}
      <NavigationButtons>
        <div className="nav-left">
          <Button 
            variant="outline" 
            onClick={handlePrevStep} 
            disabled={currentStep === 'not-craving'}
          >
            <ArrowLeftIcon size={16} />
            이전
          </Button>
        </div>
        
        <div className="nav-right">
          {(currentStep === 'allergies' || currentStep === 'craving') && (
            <Button className="skip-button" onClick={handleSkipStep}>
              <SkipForwardIcon />
              건너뛰기
            </Button>
          )}
          
          {currentStep === 'craving' ? (
            <Button onClick={handleComplete} className="complete-button">
              <CheckIcon size={16} />
              완료
            </Button>
          ) : (
            <Button onClick={handleNextStep} className="next-button">
              다음
              <ArrowRightIcon />
            </Button>
          )}
        </div>
      </NavigationButtons>

      {/* 하단 고정 선택된 음식 태그들 */}
      {getCurrentSelections().length > 0 && (
        <FixedSelections>
          <div className="selections-container">
            <div className="selections-header">
              <h4>
                {currentStep === 'not-craving' ? '안 땡기는 음식' : '땡기는 음식'} ({getCurrentSelections().length}개)
              </h4>
              <Button
                className="clear-button"
                onClick={() => {
                  if (currentStep === 'not-craving') {
                    setNotCravingFoods([]);
                  } else {
                    setCravingFoods([]);
                  }
                }}
              >
                전체 삭제
              </Button>
            </div>
            <div className="selections-list">
              {getCurrentSelections().map(food => (
                <Badge 
                  key={food.id} 
                  variant="outline" 
                  style={{
                    background: 'white',
                    borderColor: currentStep === 'not-craving' ? '#fecaca' : '#fbcfe8',
                    color: currentStep === 'not-craving' ? '#b91c1c' : '#be185d'
                  }}
                >
                  {food.name}
                  <XIcon 
                    size={12} 
                    style={{ marginLeft: '0.25rem', cursor: 'pointer' }}
                    onClick={() => removeFoodSelection(food.id, getCurrentType())}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </FixedSelections>
      )}
    </Container>
  );
}