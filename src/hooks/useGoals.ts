// src/hooks/useGoals.ts
import { useState, useEffect, useCallback } from 'react';
import { GoalsService, Goal, GoalSummary, CreateGoalRequest, ContributeResponse } from '@/services/goalsService';
import { IGoalTemplate } from '@/models/Goal';
import { toast } from 'sonner';

// Define proper filter map type
interface FilterMap {
  [key: string]: {
    status: 'active' | 'completed' | 'all';
  };
}

interface UseGoalsReturn {
  goals: Goal[];
  summary: GoalSummary | null;
  nigerianInsights: string[];
  loading: boolean;
  error: string | null;
  createGoal: (goalData: CreateGoalRequest) => Promise<Goal>;
  contributeToGoal: (id: string, amount: number, source?: string, note?: string) => Promise<ContributeResponse>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<Goal>;
  deleteGoal: (id: string) => Promise<void>;
  refreshGoals: () => Promise<void>;
  setFilter: (filter: string) => void;
  filter: string;
}

export function useGoals(initialFilter: string = 'active'): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [nigerianInsights, setNigerianInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialFilter);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterMap: FilterMap = {
        'active': { status: 'active' },
        'completed': { status: 'completed' },
        'all': { status: 'all' },
        'behind_schedule': { status: 'active' }, // We'll filter on frontend
      };

      const response = await GoalsService.getGoals(filterMap[filter] || { status: 'active' });
      
      let filteredGoals = response.goals;

      // Additional frontend filtering for complex cases
      if (filter === 'behind_schedule') {
        filteredGoals = response.goals.filter(goal => 
          goal.deadline && 
          !goal.isCompleted && 
          goal.insights.projectedCompletionDate &&
          new Date(goal.insights.projectedCompletionDate) > new Date(goal.deadline)
        );
      }

      setGoals(filteredGoals);
      setSummary(response.summary);
      setNigerianInsights(response.nigerianMarketInsights || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load goals';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = async (goalData: CreateGoalRequest): Promise<Goal> => {
    try {
      setLoading(true);
      const response = await GoalsService.createGoal(goalData);
      
      // Add the new goal to the current list
      setGoals(prevGoals => [response.goal, ...prevGoals]);
      
      // Show success message with insights
      toast.success(response.message);
      
      // Show insights as separate notifications
      response.insights.forEach(insight => {
        toast.info(insight.message, { duration: 5000 });
      });

      // Update summary by refetching (or optimistically update)
      await fetchGoals();
      
      return response.goal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contributeToGoal = async (
    id: string, 
    amount: number, 
    source: string = 'manual', 
    note?: string
  ): Promise<ContributeResponse> => {
    try {
      const response = await GoalsService.contributeToGoal(id, amount, source, note);
      
      // Update the specific goal in the state
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === id 
            ? { 
                ...goal, 
                currentAmount: response.goal.currentAmount,
                progressPercentage: response.goal.progress,
                remainingAmount: response.goal.remaining,
                isCompleted: response.goal.isCompleted,
                formattedCurrentAmount: response.goal.formattedCurrentAmount
              }
            : goal
        )
      );

      // Show success message
      toast.success(response.message);

      // Show milestone achievements with celebration
      response.achievements.milestones.forEach(milestone => {
        toast.success(
          `🎉 Milestone achieved! You've reached ${milestone.percentage}% of your goal!`,
          { duration: 7000 }
        );
      });

      // Show insights
      response.insights.forEach(insight => {
        toast.info(insight.message, { duration: 5000 });
      });

      // Show recommendations
      response.recommendations.forEach(rec => {
        if (rec.priority === 'high') {
          toast.info(rec.message, { duration: 6000 });
        }
      });

      // If goal completed, show special celebration
      if (response.achievements.completed) {
        toast.success(
          `🏆 Goal "${response.goal.title}" completed! Congratulations!`,
          { duration: 10000 }
        );
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contribution';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    try {
      const updatedGoal = await GoalsService.updateGoal(id, updates);
      
      // Update the specific goal in the state
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === id ? { ...goal, ...updatedGoal } : goal
        )
      );

      toast.success('Goal updated successfully');
      return updatedGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteGoal = async (id: string): Promise<void> => {
    try {
      await GoalsService.deleteGoal(id);
      
      // Remove the goal from the state
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== id));
      
      toast.success('Goal deleted successfully');
      
      // Refresh summary
      await fetchGoals();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const refreshGoals = async (): Promise<void> => {
    await fetchGoals();
  };

  return {
    goals,
    summary,
    nigerianInsights,
    loading,
    error,
    createGoal,
    contributeToGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
    setFilter,
    filter
  };
}

// Define types for AI suggestions
interface AISuggestion {
  category: string;
  title: string;
  description: string;
  targetAmount: number;
  timeframe: string;
  badge: string;
}

interface UseGoalTemplatesReturn {
  templates: IGoalTemplate[];
  aiSuggestions: AISuggestion[];
  loading: boolean;
  refreshTemplates: () => Promise<void>;
}

// Additional hook for goal templates and suggestions
export function useGoalTemplates(): UseGoalTemplatesReturn {
  const [templates, setTemplates] = useState<IGoalTemplate[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // Get static Nigerian templates
      const nigerianTemplates = GoalsService.getNigerianTemplates();
      setTemplates(nigerianTemplates);

      // Fallback to static AI suggestions
      const staticSuggestions: AISuggestion[] = [
        {
          category: 'emergency_fund',
          title: 'Emergency Fund',
          description: '3 months of expenses',
          targetAmount: 600000,
          timeframe: '12 months',
          badge: 'Recommended'
        },
        {
          category: 'vacation',
          title: 'Vacation Fund',
          description: 'Trip to Dubai',
          targetAmount: 350000,
          timeframe: '6 months',
          badge: 'New'
        },
        {
          category: 'car_purchase',
          title: 'Car Down Payment',
          description: 'Toyota Camry 2023',
          targetAmount: 1200000,
          timeframe: '18 months',
          badge: 'Adjustment'
        }
      ];
      
      setAiSuggestions(staticSuggestions);

    } catch (err) {
      toast.error('Failed to load goal templates');
      console.log(err)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    aiSuggestions,
    loading,
    refreshTemplates: fetchTemplates
  };
}