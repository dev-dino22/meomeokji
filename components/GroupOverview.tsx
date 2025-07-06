import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  Trophy, 
  ThumbsUp, 
  ThumbsDown, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import { getRecommendation } from '../utils/storage';
import type { GroupSession, FoodCategory } from '../App';

interface GroupOverviewProps {
  groupSession: GroupSession;
  isOpen: boolean;
  onClose: () => void;
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

interface RecommendationItem {
  category: FoodCategory;
  score: number;
  likeCount: number;
  dislikeCount: number;
  satisfactionRate: number;
}

export function GroupOverview({ groupSession, isOpen, onClose }: GroupOverviewProps) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    if (isOpen && groupSession) {
      calculateCurrentRecommendations();
    }
  }, [isOpen, groupSession]);

  const calculateCurrentRecommendations = () => {
    // 캐시된 추천 결과 확인
    const cachedRecommendations = getRecommendation(groupSession.id, groupSession.participants);
    
    if (cachedRecommendations) {
      setRecommendations(cachedRecommendations);
      return;
    }

    // 실시간 계산
    const categoryScores = new Map<FoodCategory, { likes: number; dislikes: number }>();
    
    // 각 카테고리별 점수 계산
    Object.keys(foodCategories).forEach(category => {
      categoryScores.set(category as FoodCategory, { likes: 0, dislikes: 0 });
    });

    groupSession.participants.forEach(participant => {
      if (participant.completed) {
        participant.likes.forEach(category => {
          const current = categoryScores.get(category) || { likes: 0, dislikes: 0 };
          categoryScores.set(category, { ...current, likes: current.likes + 2 });
        });

        participant.dislikes.forEach(category => {
          const current = categoryScores.get(category) || { likes: 0, dislikes: 0 };
          categoryScores.set(category, { ...current, dislikes: current.dislikes + 3 });
        });
      }
    });

    // 추천 리스트 생성 및 정렬
    const results: RecommendationItem[] = Array.from(categoryScores.entries())
      .map(([category, scores]) => {
        const netScore = scores.likes - scores.dislikes;
        const satisfactionRate = scores.dislikes === 0 
          ? (scores.likes > 0 ? 100 : 80) 
          : Math.max(0, Math.round((scores.likes / (scores.likes + scores.dislikes)) * 100));
        
        return {
          category,
          score: netScore,
          likeCount: Math.round(scores.likes / 2),
          dislikeCount: Math.round(scores.dislikes / 3),
          satisfactionRate
        };
      })
      .sort((a, b) => {
        if (a.dislikeCount === 0 && b.dislikeCount > 0) return -1;
        if (b.dislikeCount === 0 && a.dislikeCount > 0) return 1;
        if (a.score !== b.score) return b.score - a.score;
        if (a.satisfactionRate !== b.satisfactionRate) return b.satisfactionRate - a.satisfactionRate;
        return a.category.localeCompare(b.category);
      });

    setRecommendations(results);
  };

  const getGroupStatus = () => {
    const completedCount = groupSession.participants.filter(p => p.completed).length;
    const totalCount = groupSession.participants.length;
    
    if (completedCount === totalCount && totalCount > 0) {
      return { status: 'completed', text: '완료', color: 'text-green-600', icon: CheckCircle };
    } else if (completedCount > 0) {
      return { status: 'active', text: '진행중', color: 'text-orange-600', icon: Clock };
    } else {
      return { status: 'waiting', text: '대기', color: 'text-gray-600', icon: AlertCircle };
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return '🏆';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${rank + 1}`;
    }
  };

  const completedParticipants = groupSession.participants.filter(p => p.completed);
  const groupStatus = getGroupStatus();
  const StatusIcon = groupStatus.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              {groupSession.title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            그룹의 상세 정보, 참여자별 선호도, 실시간 추천 순위를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 그룹 상태 요약 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${groupStatus.color}`} />
                  <div>
                    <div className="text-sm text-gray-600">상태</div>
                    <div className={`text-sm ${groupStatus.color}`}>{groupStatus.text}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">참여자</div>
                    <div className="text-sm">{groupSession.participants.length}명</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">완료</div>
                    <div className="text-sm">{completedParticipants.length}명</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-sm text-gray-600">진행률</div>
                    <div className="text-sm">
                      {Math.round((completedParticipants.length / groupSession.participants.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress 
                  value={(completedParticipants.length / groupSession.participants.length) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 참여자별 선호도 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  참여자별 선호도
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupSession.participants.map((participant, index) => (
                  <div key={participant.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{participant.name}</span>
                        {participant.completed ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            완료
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            대기중
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {participant.completed ? (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <ThumbsUp className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">좋아함 ({participant.likes.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {participant.likes.length > 0 ? (
                              participant.likes.map((category, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-green-50 border-green-200">
                                  {foodCategories[category].emoji} {foodCategories[category].name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-400">없음</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <ThumbsDown className="w-3 h-3 text-red-600" />
                            <span className="text-red-600">싫어함 ({participant.dislikes.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {participant.dislikes.length > 0 ? (
                              participant.dislikes.map((category, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-red-50 border-red-200">
                                  {foodCategories[category].emoji} {foodCategories[category].name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-400">없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 py-2">
                        아직 선호도를 입력하지 않았습니다.
                      </div>
                    )}
                    
                    {index < groupSession.participants.length - 1 && (
                      <hr className="border-gray-100" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 실시간 추천 순위 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  실시간 추천 순위
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedParticipants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">참여자들의 선호도 입력을 기다리고 있습니다.</p>
                  </div>
                ) : (
                  recommendations.slice(0, 5).map((rec, index) => (
                    <div key={rec.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getRankIcon(index)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{foodCategories[rec.category].emoji}</span>
                          <div>
                            <div className="text-sm">{foodCategories[rec.category].name}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="text-green-600">👍 {rec.likeCount}</span>
                              <span className="text-red-600">👎 {rec.dislikeCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm">{rec.satisfactionRate}%</div>
                        <div className="text-xs text-gray-500">만족도</div>
                      </div>
                    </div>
                  ))
                )}
                
                {completedParticipants.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                      * {completedParticipants.length}명의 선호도를 기반으로 계산된 결과입니다
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}