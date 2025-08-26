import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Problem {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeUrl: string;
}

interface Topic {
  id: string;
  name: string;
  problems: Problem[];
}

const Topics = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<string>('arrays-hashing');
  const [loading, setLoading] = useState(false);

  const topics: Topic[] = [
    {
      id: 'arrays-hashing',
      name: 'Arrays & Hashing',
      problems: [
        { id: '1', name: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '2', name: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '3', name: 'Two Sum', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '4', name: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '5', name: 'Top K Frequent Elements', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '6', name: 'Encode and Decode Strings', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '7', name: 'Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '8', name: 'Valid Sudoku', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '9', name: 'Longest Consecutive Sequence', difficulty: 'Medium', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      problems: [
        { id: '10', name: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '11', name: 'Two Sum II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '12', name: '3Sum', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '13', name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '14', name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      problems: [
        { id: '15', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '16', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '17', name: 'Longest Repeating Character Replacement', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '18', name: 'Permutation in String', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '19', name: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'stack',
      name: 'Stack',
      problems: [
        { id: '20', name: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '21', name: 'Min Stack', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '22', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '23', name: 'Generate Parentheses', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '24', name: 'Daily Temperatures', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '25', name: 'Car Fleet', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '26', name: 'Largest Rectangle in Histogram', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      problems: [
        { id: '27', name: 'Binary Search', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '28', name: 'Search a 2D Matrix', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '29', name: 'Koko Eating Bananas', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '30', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '31', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '32', name: 'Time Based Key-Value Store', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '33', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      problems: [
        { id: '34', name: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '35', name: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '36', name: 'Reorder List', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '37', name: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '38', name: 'Copy List with Random Pointer', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '39', name: 'Add Two Numbers', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '40', name: 'Linked List Cycle', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '41', name: 'Find the Duplicate Number', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '42', name: 'LRU Cache', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '43', name: 'Merge k Sorted Lists', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '44', name: 'Reverse Nodes in k-Group', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'trees',
      name: 'Trees',
      problems: [
        { id: '45', name: 'Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '46', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '47', name: 'Diameter of Binary Tree', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '48', name: 'Balanced Binary Tree', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '49', name: 'Same Tree', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '50', name: 'Subtree of Another Tree', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '51', name: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '52', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '53', name: 'Binary Tree Right Side View', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '54', name: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '55', name: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '56', name: 'Kth Smallest Element in a BST', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '57', name: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '58', name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '59', name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'heap-priority-queue',
      name: 'Heap / Priority Queue',
      problems: [
        { id: '60', name: 'Kth Largest Element in a Stream', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '61', name: 'Last Stone Weight', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '62', name: 'K Closest Points to Origin', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '63', name: 'Kth Largest Element in an Array', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '64', name: 'Task Scheduler', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '65', name: 'Design Twitter', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '66', name: 'Find Median from Data Stream', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'backtracking',
      name: 'Backtracking',
      problems: [
        { id: '67', name: 'Subsets', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '68', name: 'Combination Sum', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '69', name: 'Permutations', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '70', name: 'Subsets II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '71', name: 'Combination Sum II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '72', name: 'Word Search', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '73', name: 'Palindrome Partitioning', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '74', name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '75', name: 'N-Queens', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'tries',
      name: 'Tries',
      problems: [
        { id: '76', name: 'Implement Trie', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '77', name: 'Design Add and Search Words Data Structure', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '78', name: 'Word Search II', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'graphs',
      name: 'Graphs',
      problems: [
        { id: '79', name: 'Number of Islands', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '80', name: 'Clone Graph', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '81', name: 'Max Area of Island', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '82', name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '83', name: 'Surrounded Regions', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '84', name: 'Rotting Oranges', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '85', name: 'Walls and Gates', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '86', name: 'Course Schedule', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '87', name: 'Course Schedule II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '88', name: 'Redundant Connection', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '89', name: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '90', name: 'Graph Valid Tree', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '91', name: 'Word Ladder', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'advanced-graphs',
      name: 'Advanced Graphs',
      problems: [
        { id: '92', name: 'Reconstruct Itinerary', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '93', name: 'Min Cost to Connect All Points', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '94', name: 'Network Delay Time', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '95', name: 'Swim in Rising Water', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '96', name: 'Alien Dictionary', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '97', name: 'Cheapest Flights Within K Stops', difficulty: 'Medium', leetcodeUrl: '#' },
      ]
    },
    {
      id: '1d-dynamic-programming',
      name: '1-D Dynamic Programming',
      problems: [
        { id: '98', name: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '99', name: 'Min Cost Climbing Stairs', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '100', name: 'House Robber', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '101', name: 'House Robber II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '102', name: 'Longest Palindromic Substring', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '103', name: 'Palindromic Substrings', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '104', name: 'Decode Ways', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '105', name: 'Coin Change', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '106', name: 'Maximum Product Subarray', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '107', name: 'Word Break', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '108', name: 'Longest Increasing Subsequence', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '109', name: 'Partition Equal Subset Sum', difficulty: 'Medium', leetcodeUrl: '#' },
      ]
    },
    {
      id: '2d-dynamic-programming',
      name: '2-D Dynamic Programming',
      problems: [
        { id: '110', name: 'Unique Paths', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '111', name: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '112', name: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '113', name: 'Coin Change II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '114', name: 'Target Sum', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '115', name: 'Interleaving String', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '116', name: 'Longest Increasing Path in a Matrix', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '117', name: 'Distinct Subsequences', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '118', name: 'Edit Distance', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '119', name: 'Burst Balloons', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '120', name: 'Regular Expression Matching', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'greedy',
      name: 'Greedy',
      problems: [
        { id: '121', name: 'Maximum Subarray', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '122', name: 'Jump Game', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '123', name: 'Jump Game II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '124', name: 'Gas Station', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '125', name: 'Hand of Straights', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '126', name: 'Merge Triplets to Form Target Triplet', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '127', name: 'Partition Labels', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '128', name: 'Valid Parenthesis String', difficulty: 'Medium', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'intervals',
      name: 'Intervals',
      problems: [
        { id: '129', name: 'Insert Interval', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '130', name: 'Merge Intervals', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '131', name: 'Non-overlapping Intervals', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '132', name: 'Meeting Rooms', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '133', name: 'Meeting Rooms II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '134', name: 'Minimum Interval to Include Each Query', difficulty: 'Hard', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'math-geometry',
      name: 'Math & Geometry',
      problems: [
        { id: '135', name: 'Rotate Image', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '136', name: 'Spiral Matrix', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '137', name: 'Set Matrix Zeroes', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '138', name: 'Happy Number', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '139', name: 'Plus One', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '140', name: 'Pow(x, n)', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '141', name: 'Multiply Strings', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '142', name: 'Detect Squares', difficulty: 'Medium', leetcodeUrl: '#' },
      ]
    },
    {
      id: 'bit-manipulation',
      name: 'Bit Manipulation',
      problems: [
        { id: '143', name: 'Single Number', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '144', name: 'Number of 1 Bits', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '145', name: 'Counting Bits', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '146', name: 'Reverse Bits', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '147', name: 'Missing Number', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '148', name: 'Sum of Two Integers', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '149', name: 'Reverse Integer', difficulty: 'Medium', leetcodeUrl: '#' },
      ]
    }
  ];

  // Load user progress from Supabase
  const loadProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_progress')
        .select('problem_id, completed')
        .eq('user_id', user.id);

      if (error) throw error;

      const completed = new Set(
        data?.filter(p => p.completed).map(p => p.problem_id) || []
      );
      setCompletedProblems(completed);
    } catch (error) {
      console.error('Error loading progress:', error);
      toast({
        title: "Error loading progress",
        description: "Failed to load your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save progress to Supabase
  const saveProgress = async (problemId: string, completed: boolean, topicId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          problem_id: problemId,
          topic_id: topicId,
          completed,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error saving progress",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load progress only for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress();
    }
  }, [user, isAuthenticated]);

  const currentTopic = topics.find(topic => topic.id === selectedTopic);
  const completedCount = isAuthenticated ? currentTopic?.problems.filter(problem => completedProblems.has(problem.id)).length || 0 : 0;
  const totalCount = currentTopic?.problems.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleProblem = async (problemId: string) => {
    if (!isAuthenticated) return;
    
    const newCompleted = new Set(completedProblems);
    const isCompleted = completedProblems.has(problemId);
    
    if (isCompleted) {
      newCompleted.delete(problemId);
    } else {
      newCompleted.add(problemId);
    }
    
    setCompletedProblems(newCompleted);
    await saveProgress(problemId, !isCompleted, selectedTopic);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">DSA Topics</h1>
                <p className="text-muted-foreground text-sm">
                  {isAuthenticated ? 'Practice problems by topic' : 'Browse DSA problems by topic'}
                </p>
              </div>
            </div>
            {!isAuthenticated && (
              <Button onClick={() => navigate('/auth')} variant="outline">
                Sign In to Track Progress
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Topic List */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Topics</h2>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const topicCompleted = isAuthenticated ? topic.problems.filter(p => completedProblems.has(p.id)).length : 0;
                  const topicTotal = topic.problems.length;
                  const isActive = selectedTopic === topic.id;
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-primary/10 border border-primary/20 text-primary' 
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{topic.name}</span>
                        {isAuthenticated && (
                          <span className="text-xs">{topicCompleted}/{topicTotal}</span>
                        )}
                      </div>
                      {isAuthenticated && (
                        <Progress 
                          value={topicTotal > 0 ? (topicCompleted / topicTotal) * 100 : 0} 
                          className="h-1"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Problems Table */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card overflow-hidden"
            >
              {/* Topic Header */}
              <div className="p-6 border-b border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{currentTopic?.name}</h2>
                  {isAuthenticated && (
                    <div className="text-sm text-muted-foreground">
                      ({completedCount} / {totalCount})
                    </div>
                  )}
                </div>
                {isAuthenticated && (
                  <Progress value={progressPercentage} className="h-2" />
                )}
              </div>

              {/* Problems Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      {isAuthenticated && (
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      )}
                      <th className="text-left p-4 font-medium text-muted-foreground">Star</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Problem</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTopic?.problems.map((problem, index) => {
                      const isCompleted = isAuthenticated && completedProblems.has(problem.id);
                      
                      return (
                        <motion.tr
                          key={problem.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                        >
                          {isAuthenticated && (
                            <td className="p-4">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleProblem(problem.id)}
                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              />
                            </td>
                          )}
                          <td className="p-4">
                            <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                              <Star className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                {problem.name}
                              </span>
                              <a
                                href={problem.leetcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Completion Stats - Only show for authenticated users */}
              {isAuthenticated && completedCount === totalCount && totalCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-green-500/5 border-t border-green-500/20"
                >
                  <div className="flex items-center space-x-3 text-green-400">
                    <CheckCircle2 className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">Topic Completed!</h3>
                      <p className="text-sm text-muted-foreground">
                        Great job! You've completed all problems in {currentTopic?.name}.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topics;