import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a test user (replace with your actual Clerk user ID)
  const testUser = await prisma.user.upsert({
    where: { clerkId: "test-user-id" },
    update: {},
    create: {
      clerkId: "test-user-id",
      email: "admin@devmastery.com",
      name: "DevMastery Admin",
      role: "ADMIN",
    },
  });

  // Create sample blogs
  const sampleBlogs = [
    {
      title: "Getting Started with React Hooks",
      content:
        "# React Hooks\n\nReact Hooks are a powerful way to manage state and lifecycle in functional components...",
      excerpt:
        "Learn the fundamentals of React Hooks and how to use them effectively in your applications.",
      category: "React",
      tags: ["React", "JavaScript", "Frontend"],
      published: true,
      readTime: 5,
      authorId: testUser.id,
    },
    {
      title: "Understanding TypeScript Generics",
      content:
        "# TypeScript Generics\n\nGenerics provide a way to create reusable components...",
      excerpt:
        "A comprehensive guide to TypeScript generics and their practical applications.",
      category: "TypeScript",
      tags: ["TypeScript", "JavaScript", "Types"],
      published: true,
      readTime: 8,
      authorId: testUser.id,
    },
    {
      title: "Next.js App Router Deep Dive",
      content:
        "# Next.js App Router\n\nThe new App Router in Next.js 13+ introduces powerful new features...",
      excerpt:
        "Explore the Next.js App Router and learn how to build modern web applications.",
      category: "Next.js",
      tags: ["Next.js", "React", "SSR"],
      published: false,
      readTime: 12,
      authorId: testUser.id,
    },
  ];

  for (const blog of sampleBlogs) {
    await prisma.blog.upsert({
      where: {
        title: blog.title,
      },
      update: {},
      create: {
        ...blog,
        publishedAt: blog.published ? new Date() : null,
      },
    });
  }

  // Create sample notes
  const sampleNotes = [
    {
      title: "Array Methods Cheat Sheet",
      category: "JavaScript",
      content:
        "# JavaScript Array Methods\n\n## map()\nTransforms each element...\n\n## filter()\nFilters elements based on condition...",
      tags: ["JavaScript", "Arrays", "Cheatsheet"],
      authorId: testUser.id,
    },
    {
      title: "SQL JOIN Types",
      category: "Database",
      content:
        "# SQL JOIN Types\n\n## INNER JOIN\nReturns matching records...\n\n## LEFT JOIN\nReturns all from left table...",
      tags: ["SQL", "Database", "Joins"],
      authorId: testUser.id,
    },
    {
      title: "Git Commands Reference",
      category: "DevOps",
      content:
        "# Essential Git Commands\n\n## Basic Commands\n- `git init`\n- `git add`\n- `git commit`...",
      tags: ["Git", "Version Control", "DevOps"],
      authorId: testUser.id,
    },
  ];

  for (const note of sampleNotes) {
    await prisma.note.upsert({
      where: {
        title: note.title,
      },
      update: {},
      create: note,
    });
  }

  // Create sample LeetCode problems
  const sampleProblems = [
    {
      title: "Two Sum",
      difficulty: "EASY" as const,
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      solution:
        "```python\ndef two_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []\n```",
      explanation:
        "Use a hash map to store numbers and their indices. For each number, check if its complement exists in the map.",
      tags: ["Array", "Hash Table", "Two Pointers"],
      authorId: testUser.id,
    },
    {
      title: "Valid Parentheses",
      difficulty: "EASY" as const,
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      solution:
        '```python\ndef is_valid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    \n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    \n    return not stack\n```',
      explanation:
        "Use a stack to keep track of opening brackets. When encountering a closing bracket, check if it matches the most recent opening bracket.",
      tags: ["String", "Stack"],
      authorId: testUser.id,
    },
  ];

  for (const problem of sampleProblems) {
    await prisma.leetcodeProblem.upsert({
      where: {
        title: problem.title,
      },
      update: {},
      create: problem,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
