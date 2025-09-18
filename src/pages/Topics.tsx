import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ExternalLink, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import StreakDisplay from '@/components/StreakDisplay';
import NotesDialog from '@/components/NotesDialog';

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
  const [notesDialog, setNotesDialog] = useState<{
    isOpen: boolean;
    problemId: string;
    problemName: string;
    topicId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>({
    isOpen: false,
    problemId: '',
    problemName: '',
    topicId: '',
    difficulty: 'Easy'
  });

  // Helper function to convert problem name to LeetCode URL
  const toLeetCodeUrl = (name: string) => {
    return `https://leetcode.com/problems/${name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    }/`;
  };

  const topics: Topic[] = [
    {
      id: 'arrays-hashing',
      name: 'Arrays & Hashing',
      problems: [
        { id: '1', name: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Contains Duplicate') },
        { id: '2', name: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Valid Anagram') },
        { id: '3', name: 'Two Sum', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Two Sum') },
        { id: '4', name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Remove Duplicates from Sorted Array') },
        { id: '5', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Best Time to Buy and Sell Stock') },
        { id: '6', name: 'Plus One', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Plus One') },
        { id: '7', name: 'Missing Number', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Missing Number') },
        { id: '8', name: 'Maximum Subarray', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Maximum Subarray') },
        { id: '9', name: 'Move Zeroes', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Move Zeroes') },
        { id: '10', name: 'Intersection of Two Arrays II', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Intersection of Two Arrays II') },
        { id: '11', name: 'Rotate Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Rotate Array') },
        { id: '12', name: 'Third Maximum Number', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Third Maximum Number') },
        { id: '13', name: 'Merge Sorted Array', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Merge Sorted Array') },
        { id: '14', name: 'Maximum Product Subarray', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Maximum Product Subarray') },
        { id: '15', name: 'Minimum Size Subarray Sum', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Minimum Size Subarray Sum') },
        { id: '16', name: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Group Anagrams') },
        { id: '17', name: 'Top K Frequent Elements', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Top K Frequent Elements') },
        { id: '18', name: 'Encode and Decode Strings', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Encode and Decode Strings') },
        { id: '19', name: 'Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Product of Array Except Self') },
        { id: '20', name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Container With Most Water') },
        { id: '21', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Search in Rotated Sorted Array') },
        { id: '22', name: 'Combination Sum', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Combination Sum') },
        { id: '23', name: 'Next Permutation', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Next Permutation') },
        { id: '24', name: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find First and Last Position of Element in Sorted Array') },
        { id: '25', name: '3Sum', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('3Sum') },
        { id: '26', name: 'Spiral Matrix', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Spiral Matrix') },
        { id: '27', name: 'Merge Intervals', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Merge Intervals') },
        { id: '28', name: 'Jump Game', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Jump Game') },
        { id: '29', name: 'Set Matrix Zeroes', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Set Matrix Zeroes') },
        { id: '30', name: 'Word Search', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Word Search') },
        { id: '31', name: 'Find Peak Element', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find Peak Element') },
        { id: '32', name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Trapping Rain Water') },
        { id: '33', name: 'Best Time to Buy and Sell Stock III', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Best Time to Buy and Sell Stock III') },
        { id: '34', name: 'First Missing Positive', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('First Missing Positive') },
        { id: '35', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Median of Two Sorted Arrays') },
        { id: '36', name: 'Jump Game II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Jump Game II') },
        { id: '37', name: 'Longest Consecutive Sequence', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Longest Consecutive Sequence') },
        { id: '38', name: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Minimum Window Substring') },
        { id: '39', name: 'Gas Station', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Gas Station') },
        { id: '40', name: 'Meeting Rooms II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Meeting Rooms II') },
        { id: '41', name: 'Best Time to Buy and Sell Stock IV', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Best Time to Buy and Sell Stock IV') },
      ]
    },
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      problems: [
        { id: '10', name: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Valid Palindrome') },
        { id: '11', name: 'Two Sum II', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Two Sum II Input Array Is Sorted') },
        { id: '12', name: '3Sum', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('3Sum') },
        { id: '13', name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Container With Most Water') },
        { id: '14', name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Trapping Rain Water') },
      ]
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      problems: [
        { id: '15', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Best Time to Buy and Sell Stock') },
        { id: '16', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Longest Substring Without Repeating Characters') },
        { id: '17', name: 'Longest Repeating Character Replacement', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Longest Repeating Character Replacement') },
        { id: '18', name: 'Permutation in String', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Permutation in String') },
        { id: '19', name: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Minimum Window Substring') },
      ]
    },
    {
      id: 'stack',
      name: 'Stack',
      problems: [
        { id: '42', name: 'Min Stack', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Min Stack') },
        { id: '43', name: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Valid Parentheses') },
        { id: '44', name: 'Remove Outermost Parentheses', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Remove Outermost Parentheses') },
        { id: '45', name: 'Implement Queue using Stacks', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Implement Queue using Stacks') },
        { id: '46', name: 'Implement Stack using Queues', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Implement Stack using Queues') },
        { id: '47', name: 'Remove K Digits', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Remove K Digits') },
        { id: '48', name: 'Baseball Game', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Baseball Game') },
        { id: '49', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Evaluate Reverse Polish Notation') },
        { id: '50', name: 'Basic Calculator II', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Basic Calculator II') },
        { id: '51', name: 'Daily Temperatures', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Daily Temperatures') },
        { id: '52', name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Trapping Rain Water') },
        { id: '53', name: 'Remove Duplicate Letters', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Remove Duplicate Letters') },
        { id: '54', name: 'Longest Valid Parentheses', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Longest Valid Parentheses') },
        { id: '55', name: 'Simplify Path', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Simplify Path') },
        { id: '56', name: 'Basic Calculator', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Basic Calculator') },
        { id: '57', name: 'Largest Rectangle in Histogram', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Largest Rectangle in Histogram') },
      ]
    },
    {
      id: 'queue',
      name: 'Queue',
      problems: [
        { id: '58', name: 'Implement Stack using Queues', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Implement Stack using Queues') },
        { id: '59', name: 'Design Circular Queue', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Design Circular Queue') },
        { id: '60', name: 'Design Circular Deque', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Design Circular Deque') },
        { id: '61', name: 'Implement Queue using Stacks', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Implement Queue using Stacks') },
        { id: '62', name: 'First Unique Character in a String', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('First Unique Character in a String') },
        { id: '63', name: 'Design HashSet', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Design HashSet') },
        { id: '64', name: 'Design HashMap', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Design HashMap') },
        { id: '65', name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Implement Trie Prefix Tree') },
        { id: '66', name: 'Sliding Window Maximum', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Sliding Window Maximum') },
        { id: '67', name: 'Shortest Subarray with Sum at Least K', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Shortest Subarray with Sum at Least K') },
        { id: '68', name: 'Find K Pairs with Smallest Sums', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find K Pairs with Smallest Sums') },
        { id: '69', name: 'Design Twitter', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Design Twitter') },
        { id: '70', name: 'Number of Recent Calls', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Number of Recent Calls') },
        { id: '71', name: 'First Unique Number', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('First Unique Number') },
        { id: '72', name: 'Sliding Window Median', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Sliding Window Median') },
        { id: '73', name: 'Task Scheduler', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Task Scheduler') },
        { id: '74', name: 'Find the Most Competitive Subsequence', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find the Most Competitive Subsequence') },
      ]
    },
    {
      id: 'recursion',
      name: 'Recursion',
      problems: [
        { id: '75', name: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Climbing Stairs') },
        { id: '76', name: 'Fibonacci Number', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Fibonacci Number') },
        { id: '77', name: 'Reverse String', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Reverse String') },
        { id: '78', name: 'Pow(x, n)', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Pow(x, n)') },
        { id: '79', name: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Merge Two Sorted Lists') },
        { id: '80', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Maximum Depth of Binary Tree') },
        { id: '81', name: 'Symmetric Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Symmetric Tree') },
        { id: '82', name: 'Path Sum', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Path Sum') },
        { id: '83', name: 'Subsets', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Subsets') },
        { id: '84', name: 'Generate Parentheses', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Generate Parentheses') },
        { id: '85', name: 'Permutations', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Permutations') },
        { id: '86', name: 'Combinations', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Combinations') },
        { id: '87', name: 'Palindrome Partitioning', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Palindrome Partitioning') },
        { id: '88', name: 'Expression Add Operators', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Expression Add Operators') },
        { id: '89', name: 'Word Search', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Word Search') },
        { id: '90', name: 'Unique Paths', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Unique Paths') },
        { id: '91', name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Letter Combinations of a Phone Number') },
        { id: '92', name: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Reverse Linked List') },
        { id: '93', name: 'Regular Expression Matching', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Regular Expression Matching') },
        { id: '94', name: 'Palindrome Partitioning II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Palindrome Partitioning II') },
        { id: '95', name: 'Word Search II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Word Search II') },
        { id: '96', name: 'Wildcard Matching', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Wildcard Matching') },
        { id: '97', name: 'Unique Paths III', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Unique Paths III') },
        { id: '98', name: 'Decode Ways', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Decode Ways') },
      ]
    },
    {
      id: 'string',
      name: 'String',
      problems: [
        { id: '115', name: 'Reverse String', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Reverse String') },
        { id: '116', name: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Valid Anagram') },
        { id: '117', name: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Valid Palindrome') },
        { id: '118', name: 'String to Integer (atoi)', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('String to Integer atoi') },
        { id: '119', name: 'Implement strStr()', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Implement strStr') },
        { id: '120', name: 'Count and Say', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Count and Say') },
        { id: '121', name: 'First Unique Character in a String', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('First Unique Character in a String') },
        { id: '122', name: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Valid Parentheses') },
        { id: '123', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Longest Substring Without Repeating Characters') },
        { id: '124', name: 'Longest Common Prefix', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Longest Common Prefix') },
        { id: '125', name: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Group Anagrams') },
        { id: '126', name: 'Longest Palindromic Substring', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Longest Palindromic Substring') },
        { id: '127', name: 'ZigZag Conversion', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('ZigZag Conversion') },
        { id: '128', name: 'Regular Expression Matching', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Regular Expression Matching') },
        { id: '129', name: 'Longest Valid Parentheses', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Longest Valid Parentheses') },
        { id: '130', name: 'Palindrome Partitioning', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Palindrome Partitioning') },
        { id: '131', name: 'Wildcard Matching', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Wildcard Matching') },
        { id: '132', name: 'Longest Substring with At Least K Repeating Characters', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Longest Substring with At Least K Repeating Characters') },
        { id: '133', name: 'Distinct Subsequences', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Distinct Subsequences') },
        { id: '134', name: 'Encode and Decode Strings', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Encode and Decode Strings') },
        { id: '135', name: 'Palindrome Partitioning II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Palindrome Partitioning II') },
        { id: '136', name: 'Text Justification', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Text Justification') },
        { id: '137', name: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Minimum Window Substring') },
      ]
    },
    {
      id: 'searching',
      name: 'Searching',
      problems: [
        { id: '100', name: 'First Bad Version', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('First Bad Version') },
        { id: '101', name: 'Search Insert Position', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Search Insert Position') },
        { id: '102', name: 'Guess Number Higher or Lower', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Guess Number Higher or Lower') },
        { id: '103', name: 'Peak Index in a Mountain Array', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Peak Index in a Mountain Array') },
        { id: '104', name: 'Search a 2D Matrix II', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Search a 2D Matrix II') },
        { id: '105', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find Minimum in Rotated Sorted Array') },
        { id: '106', name: 'Find K Closest Elements', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find K Closest Elements') },
        { id: '107', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Search in Rotated Sorted Array') },
        { id: '108', name: 'Search a 2D Matrix', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Search a 2D Matrix') },
        { id: '109', name: 'Divide Two Integers', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Divide Two Integers') },
        { id: '110', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Median of Two Sorted Arrays') },
        { id: '111', name: 'Find Peak Element', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Find Peak Element') },
        { id: '112', name: 'Find Kth Smallest Element in a Sorted Matrix', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Kth Smallest Element in a Sorted Matrix') },
        { id: '113', name: 'Search in Rotated Sorted Array II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Search in Rotated Sorted Array II') },
        { id: '114', name: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Find First and Last Position of Element in Sorted Array') },
      ]
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      problems: [
        { id: '27', name: 'Binary Search', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Binary Search') },
        { id: '28', name: 'Search a 2D Matrix', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Search a 2D Matrix') },
        { id: '29', name: 'Koko Eating Bananas', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Koko Eating Bananas') },
        { id: '30', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Find Minimum in Rotated Sorted Array') },
        { id: '31', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Search in Rotated Sorted Array') },
        { id: '32', name: 'Time Based Key-Value Store', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Time Based Key-Value Store') },
        { id: '33', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Median of Two Sorted Arrays') },
      ]
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      problems: [
        { id: '138', name: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Reverse Linked List') },
        { id: '139', name: 'Middle of the Linked List', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Middle of the Linked List') },
        { id: '140', name: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Merge Two Sorted Lists') },
        { id: '141', name: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Remove Nth Node From End of List') },
        { id: '142', name: 'Palindrome Linked List', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Palindrome Linked List') },
        { id: '143', name: 'Intersection of Two Linked Lists', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Intersection of Two Linked Lists') },
        { id: '144', name: 'Design Linked List', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Design Linked List') },
        { id: '145', name: 'Linked List Cycle', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Linked List Cycle') },
        { id: '146', name: 'Flatten a Multilevel Doubly Linked List', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Flatten a Multilevel Doubly Linked List') },
        { id: '147', name: 'Reverse Nodes in k-Group', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Reverse Nodes in k-Group') },
        { id: '148', name: 'Add Two Numbers', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Add Two Numbers') },
        { id: '149', name: 'Odd Even Linked List', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Odd Even Linked List') },
        { id: '150', name: 'Remove Linked List Elements', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Remove Linked List Elements') },
        { id: '151', name: 'Copy List with Random Pointer', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Copy List with Random Pointer') },
        { id: '152', name: 'Swap Nodes in Pairs', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Swap Nodes in Pairs') },
        { id: '153', name: 'Merge k Sorted Lists', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Merge k Sorted Lists') },
        { id: '154', name: 'LRU Cache', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('LRU Cache') },
        { id: '155', name: 'Split Linked List in Parts', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Split Linked List in Parts') },
        { id: '156', name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Serialize and Deserialize Binary Tree') },
      ]
    },
    {
      id: 'trees',
      name: 'Trees',
      problems: [
        { id: '157', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Maximum Depth of Binary Tree') },
        { id: '158', name: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Validate Binary Search Tree') },
        { id: '159', name: 'Symmetric Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Symmetric Tree') },
        { id: '160', name: 'Convert Sorted Array to Binary Search Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Convert Sorted Array to Binary Search Tree') },
        { id: '161', name: 'Minimum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Minimum Depth of Binary Tree') },
        { id: '162', name: 'Diameter of Binary Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Diameter of Binary Tree') },
        { id: '163', name: 'Same Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Same Tree') },
        { id: '164', name: 'Subtree of Another Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Subtree of Another Tree') },
        { id: '165', name: 'Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Invert Binary Tree') },
        { id: '166', name: 'Path Sum', difficulty: 'Easy', leetcodeUrl: toLeetCodeUrl('Path Sum') },
        { id: '167', name: 'Binary Tree Inorder Traversal', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Binary Tree Inorder Traversal') },
        { id: '168', name: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Construct Binary Tree from Preorder and Inorder Traversal') },
        { id: '169', name: 'Construct Binary Tree from Inorder and Postorder Traversal', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Construct Binary Tree from Inorder and Postorder Traversal') },
        { id: '170', name: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Lowest Common Ancestor of a Binary Tree') },
        { id: '171', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Binary Tree Level Order Traversal') },
        { id: '172', name: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Binary Tree Zigzag Level Order Traversal') },
        { id: '173', name: 'Path Sum II', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Path Sum II') },
        { id: '174', name: 'Count Complete Tree Nodes', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Count Complete Tree Nodes') },
        { id: '175', name: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Flatten Binary Tree to Linked List') },
        { id: '176', name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Binary Tree Maximum Path Sum') },
        { id: '177', name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Serialize and Deserialize Binary Tree') },
        { id: '178', name: 'Construct Binary Tree from String', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Construct Binary Tree from String') },
        { id: '179', name: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Populating Next Right Pointers in Each Node') },
        { id: '180', name: 'Populating Next Right Pointers in Each Node II', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Populating Next Right Pointers in Each Node II') },
        { id: '181', name: 'House Robber III', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('House Robber III') },
        { id: '182', name: 'Kth Smallest Element in a BST', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Kth Smallest Element in a BST') },
        { id: '183', name: 'Closest Binary Search Tree Value II', difficulty: 'Hard', leetcodeUrl: toLeetCodeUrl('Closest Binary Search Tree Value II') },
        { id: '184', name: 'Convert Sorted List to Binary Search Tree', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Convert Sorted List to Binary Search Tree') },
        { id: '185', name: 'Maximum Binary Tree', difficulty: 'Medium', leetcodeUrl: toLeetCodeUrl('Maximum Binary Tree') },
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
        { id: '186', name: 'Number of Islands', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '187', name: 'Valid Sudoku', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '188', name: 'Course Schedule', difficulty: 'Easy', leetcodeUrl: '#' },
        { id: '189', name: 'Is Graph Bipartite?', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '190', name: 'Friend Circles', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '191', name: 'Clone Graph', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '192', name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '193', name: 'Course Schedule II', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '194', name: 'Minimum Height Trees', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '195', name: 'Reconstruct Itinerary', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '196', name: 'Word Ladder', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '197', name: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '198', name: 'Graph Valid Tree', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '199', name: 'Course Schedule III', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '200', name: 'Alien Dictionary', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '201', name: 'Network Delay Time', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '202', name: 'Number of Islands II', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '203', name: 'Number of Islands III', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '204', name: 'Bus Routes', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '205', name: 'Critical Connections in a Network', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '206', name: 'Evaluate Division', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '207', name: 'Number of Restricted Paths From First to Last Node', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '208', name: 'Minimum Swaps to Group All 1s Together', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '209', name: 'Swim in Rising Water', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '210', name: 'Optimize Water Distribution in a Village', difficulty: 'Hard', leetcodeUrl: '#' },
        { id: '211', name: 'Regions Cut By Slashes', difficulty: 'Medium', leetcodeUrl: '#' },
        { id: '212', name: 'Most Stones Removed with Same Row or Column', difficulty: 'Medium', leetcodeUrl: '#' },
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
        }, {
          onConflict: 'user_id,problem_id'
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

  const openNotesDialog = (problem: Problem) => {
    setNotesDialog({
      isOpen: true,
      problemId: problem.id,
      problemName: problem.name,
      topicId: selectedTopic,
      difficulty: problem.difficulty
    });
  };

  const closeNotesDialog = () => {
    setNotesDialog(prev => ({ ...prev, isOpen: false }));
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
        {/* Streak Display - Only for authenticated users */}
        {isAuthenticated && <StreakDisplay />}
        
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
                      {isAuthenticated && (
                        <th className="text-left p-4 font-medium text-muted-foreground">Notes</th>
                      )}
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
                          {isAuthenticated && (
                            <td className="p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openNotesDialog(problem)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
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

      {/* Notes Dialog */}
      <NotesDialog
        isOpen={notesDialog.isOpen}
        onClose={closeNotesDialog}
        problemId={notesDialog.problemId}
        problemName={notesDialog.problemName}
        topicId={notesDialog.topicId}
        difficulty={notesDialog.difficulty}
      />
    </div>
  );
};

export default Topics;