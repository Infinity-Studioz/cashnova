// src/hooks/useGoals.ts

import { useState, useEffect, useCallback } from 'react';
import { GoalsService, Goal, GoalSummary, CreateGoalRequest, ContributeResponse } from '@/services/goalsService';
import { toast } from 'sonner';

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

interface FilterMap {
  [key: string]: {
    status: 'active' | 'completed' | 'all';
  };
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
        'behind_schedule': { status: 'active' },
      };

      const response = await GoalsService.getGoals(filterMap[filter] || { status: 'active' });
      
      let filteredGoals = response.goals;

      // Frontend filtering for complex cases
      if (filter === 'behind_schedule') {
        filteredGoals = response.goals.filter(goal => 
          goal.deadline &&
          !goal.isCompleted &&
          goal.daysUntilDeadline !== null &&
          goal.daysUntilDeadline !== undefined &&
          goal.daysUntilDeadline < 0 // Actually behind schedule
        );
      }

      setGoals(filteredGoals);
      setSummary(response.summary);
      setNigerianInsights(response.nigerianMarketInsights || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load goals';
      setError(errorMessage);
      toast.error(`Error loading goals: ${errorMessage}`);
      console.error('Goals fetch error:', err);
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
      setError(null);
      
      const response = await GoalsService.createGoal(goalData);
      
      // Optimistic update - add to current list
      setGoals(prevGoals => [response.goal, ...prevGoals]);
      
      // Show success with insights
      toast.success(response.message);
      
      // Show AI insights as additional toasts
      if (response.insights && response.insights.length > 0) {
        response.insights.forEach(insight => {
          toast.info(insight.message, { duration: 5000 });
        });
      }

      // Refresh to get updated summary
      await fetchGoals();
      
      return response.goal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      toast.error(`Error creating goal: ${errorMessage}`);
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
      // Optimistic update - find and update the goal immediately
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === id 
            ? { 
                ...goal, 
                currentAmount: goal.currentAmount + amount,
                progressPercentage: Math.min(((goal.currentAmount + amount) / goal.targetAmount) * 100, 100)
              }
            : goal
        )
      );

      const response = await GoalsService.contributeToGoal(id, amount, source, note);
      
      // Update with actual server response
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

      // Milestone celebrations
      if (response.achievements.milestones && response.achievements.milestones.length > 0) {
        response.achievements.milestones.forEach(milestone => {
          toast.success(
            `🎉 Milestone achieved! You've reached ${milestone.percentage}% of your goal!`,
            { duration: 8000 }
          );
        });
      }

      // Goal completion celebration
      if (response.achievements.completed) {
        toast.success(
          `🏆 Congratulations! "${response.goal.title}" completed!`,
          { duration: 10000 }
        );
      }

      // Show insights
      if (response.insights && response.insights.length > 0) {
        response.insights.forEach(insight => {
          toast.info(insight.message, { duration: 5000 });
        });
      }

      return response;
    } catch (err) {
      // Rollback optimistic update on error
      await fetchGoals();
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contribution';
      setError(errorMessage);
      toast.error(`Error adding contribution: ${errorMessage}`);
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    try {
      // Optimistic update
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === id ? { ...goal, ...updates } : goal
        )
      );

      const updatedGoal = await GoalsService.updateGoal(id, updates);
      
      // Update with server response
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === id ? { ...goal, ...updatedGoal } : goal
        )
      );

      toast.success('Goal updated successfully');
      return updatedGoal;
    } catch (err) {
      // Rollback optimistic update on error
      await fetchGoals();
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      setError(errorMessage);
      toast.error(`Error updating goal: ${errorMessage}`);
      throw err;
    }
  };

  const deleteGoal = async (id: string): Promise<void> => {
    try {
      // Store goal for potential rollback
      const goalToDelete = goals.find(goal => goal._id === id);
      
      // Optimistic update - remove from list
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== id));
      
      await GoalsService.deleteGoal(id);
      
      toast.success('Goal deleted successfully');
      
      // Refresh summary after deletion
      await fetchGoals();
    } catch (err) {
      // Rollback optimistic update on error
      await fetchGoals();
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(errorMessage);
      toast.error(`Error deleting goal: ${errorMessage}`);
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