const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Function to read all MDX files recursively
function getAllMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMdxFiles(filePath, fileList);
    } else if (file.endsWith(".mdx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to extract metadata from MDX content
function extractMetadata(content, filePath) {
  const lines = content.split("\n");
  const title =
    lines
      .find((line) => line.startsWith("# "))
      ?.replace("# ", "")
      .trim() || path.basename(filePath, ".mdx").replace(/-/g, " ");

  // Extract first paragraph as excerpt
  const contentLines = lines.filter(
    (line) => !line.startsWith("#") && line.trim() !== ""
  );
  const excerpt = contentLines.slice(0, 2).join(" ").substring(0, 200) + "...";

  // Determine category based on file path
  let category = "General";
  if (filePath.includes("Data-Structures-And-Algorithms")) {
    category = "Data Structures & Algorithms";
  } else if (filePath.includes("Web-Development")) {
    if (filePath.includes("Javascript")) {
      category = "JavaScript";
    } else if (filePath.includes("CSS")) {
      category = "CSS";
    } else {
      category = "Web Development";
    }
  }

  // Extract tags based on content and path
  const tags = [];
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes("algorithm") || filePath.includes("Algorithms"))
    tags.push("Algorithms");
  if (
    lowerContent.includes("data structure") ||
    filePath.includes("Data-Structures")
  )
    tags.push("Data Structures");
  if (lowerContent.includes("javascript") || filePath.includes("Javascript"))
    tags.push("JavaScript");
  if (lowerContent.includes("css") || filePath.includes("CSS"))
    tags.push("CSS");
  if (lowerContent.includes("binary search")) tags.push("Binary Search");
  if (
    lowerContent.includes("time complexity") ||
    lowerContent.includes("space complexity")
  )
    tags.push("Complexity Analysis");
  if (lowerContent.includes("grid") && filePath.includes("CSS"))
    tags.push("CSS Grid");
  if (lowerContent.includes("compiled") || lowerContent.includes("interpreted"))
    tags.push("Programming Languages");

  if (tags.length === 0) tags.push(category);

  // Estimate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title,
    excerpt,
    category,
    tags,
    readTime,
  };
}

async function migrateContent() {
  try {
    console.log("🚀 Starting content migration...");

    // Get or create admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      console.log("Creating admin user...");
      adminUser = await prisma.user.create({
        data: {
          clerkId: "migration-admin",
          email: "admin@devmastery.com",
          name: "DevMastery Admin",
          role: "ADMIN",
        },
      });
    }

    const pagesDir = path.join(__dirname, "..", "pages");
    const mdxFiles = getAllMdxFiles(pagesDir);

    console.log(`📁 Found ${mdxFiles.length} MDX files to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const filePath of mdxFiles) {
      try {
        // Skip index.mdx as it's the homepage
        if (filePath.includes("index.mdx")) {
          console.log(`⏭️  Skipping homepage: ${path.basename(filePath)}`);
          skippedCount++;
          continue;
        }

        const content = fs.readFileSync(filePath, "utf-8");
        const metadata = extractMetadata(content, filePath);

        // Check if content already exists
        const existingBlog = await prisma.blog.findFirst({
          where: {
            title: metadata.title,
            authorId: adminUser.id,
          },
        });

        if (existingBlog) {
          console.log(`⚠️  Blog already exists: ${metadata.title}`);
          skippedCount++;
          continue;
        }

        // Create blog entry
        const blog = await prisma.blog.create({
          data: {
            title: metadata.title,
            content: content,
            excerpt: metadata.excerpt,
            category: metadata.category,
            tags: metadata.tags,
            published: true,
            readTime: metadata.readTime,
            authorId: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log(`✅ Migrated: ${metadata.title} (${metadata.category})`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
      }
    }

    // Also create some sample notes and leetcode problems
    console.log("\n📝 Creating sample notes...");

    const sampleNotes = [
      {
        title: "Array Traversal Techniques",
        content:
          "# Array Traversal Techniques\n\n## Forward Traversal\n```javascript\nfor(let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}\n```\n\n## Backward Traversal\n```javascript\nfor(let i = arr.length - 1; i >= 0; i--) {\n  console.log(arr[i]);\n}\n```",
        category: "Data Structures",
        tags: ["Arrays", "Traversal", "JavaScript"],
      },
      {
        title: "React Performance Optimization",
        content:
          "# React Performance Tips\n\n1. Use React.memo for component memoization\n2. Implement useMemo for expensive calculations\n3. Use useCallback for function memoization\n4. Avoid inline object creation in JSX\n5. Use React.lazy for code splitting",
        category: "React",
        tags: ["React", "Performance", "Optimization"],
      },
      {
        title: "CSS Flexbox Cheatsheet",
        content:
          "# Flexbox Properties\n\n## Container Properties\n- display: flex\n- flex-direction: row | column\n- justify-content: flex-start | center | flex-end | space-between\n- align-items: stretch | center | flex-start | flex-end\n\n## Item Properties\n- flex: 1\n- align-self: auto | center | flex-start | flex-end",
        category: "CSS",
        tags: ["CSS", "Flexbox", "Layout"],
      },
    ];

    for (const noteData of sampleNotes) {
      const existingNote = await prisma.note.findFirst({
        where: {
          title: noteData.title,
          authorId: adminUser.id,
        },
      });

      if (!existingNote) {
        await prisma.note.create({
          data: {
            ...noteData,
            authorId: adminUser.id,
          },
        });
        console.log(`✅ Created note: ${noteData.title}`);
      }
    }

    // Create sample LeetCode problems
    console.log("\n🧩 Creating sample LeetCode problems...");
    const sampleProblems = [
      {
        title: "Two Sum",
        difficulty: "EASY",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        solution:
          "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
        timeComplex: "O(n)",
        spaceComplex: "O(n)",
        tags: ["Array", "Hash Table"],
      },
      {
        title: "Binary Search",
        difficulty: "EASY",
        description:
          "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
        solution:
          "function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
        timeComplex: "O(log n)",
        spaceComplex: "O(1)",
        tags: ["Array", "Binary Search"],
      },
      {
        title: "Valid Parentheses",
        difficulty: "EASY",
        description:
          'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
        solution:
          'function isValid(s) {\n    const stack = [];\n    const map = { ")": "(", "}": "{", "]": "[" };\n    for (let char of s) {\n        if (char in map) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}',
        timeComplex: "O(n)",
        spaceComplex: "O(n)",
        tags: ["String", "Stack"],
      },
    ];

    for (const problemData of sampleProblems) {
      const existingProblem = await prisma.leetcodeProblem.findFirst({
        where: {
          title: problemData.title,
          authorId: adminUser.id,
        },
      });

      if (!existingProblem) {
        await prisma.leetcodeProblem.create({
          data: {
            ...problemData,
            authorId: adminUser.id,
          },
        });
        console.log(`✅ Created LeetCode problem: ${problemData.title}`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Summary:`);
    console.log(`   - Migrated: ${migratedCount} blogs`);
    console.log(`   - Skipped: ${skippedCount} files`);
    console.log(`   - Created: 3 sample notes`);
    console.log(`   - Created: 3 sample LeetCode problems`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateContent();
