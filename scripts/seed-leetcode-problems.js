const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const basicProblems = [
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "EASY",
    category: "Array",
    tags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Microsoft", "Facebook", "Apple"],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way would be to use a HashMap.",
      "The reason is that we need to search if the target minus the current number we are iterating over exists in the array.",
    ],
    followUp: "What if the same number appears multiple times in the array?",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    problemNumber: 1,
    frequency: "Very High",
    acceptance: 49.5,
    isPremium: false,
    timeComplex: "O(n)",
    spaceComplex: "O(n)",
    solutions: [
      {
        language: "Python",
        approach: "Hash Map",
        code: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        timeComplex: "O(n)",
        spaceComplex: "O(n)",
        explanation:
          "Use a hash map to store previously seen numbers and their indices. For each number, check if its complement (target - current number) exists in the hash map.",
        notes:
          "This is the optimal solution with single pass through the array.",
        isOptimal: true,
      },
      {
        language: "Java",
        approach: "Hash Map",
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    
    return new int[] {}; // Should never reach here given constraints
}`,
        timeComplex: "O(n)",
        spaceComplex: "O(n)",
        explanation:
          "Same approach as Python - use HashMap to store seen numbers and their indices.",
        notes: "HashMap operations are O(1) on average, making this efficient.",
        isOptimal: true,
      },
    ],
    resources: [
      {
        title: "Two Sum - LeetCode Official Solution",
        type: "ARTICLE",
        url: "https://leetcode.com/problems/two-sum/solution/",
        description: "Official explanation with multiple approaches",
      },
      {
        title: "Hash Tables Explained",
        type: "VIDEO",
        url: "https://www.youtube.com/watch?v=shs0KM3wKv8",
        description: "Understanding hash tables for solving array problems",
      },
    ],
  },
  {
    title: "Find Duplicates in Array",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false",
    difficulty: "EASY",
    category: "Array",
    tags: ["Array", "Hash Table", "Sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    hints: [
      "Use a Hash Set to keep track of seen elements",
      "Alternative: Sort the array and check adjacent elements",
      "Think about the time vs space trade-offs",
    ],
    followUp:
      "What if you can't use extra space? What if the array contains only integers in range [1,n]?",
    frequency: "High",
    acceptance: 59.8,
    isPremium: false,
    timeComplex: "O(n)",
    spaceComplex: "O(n)",
    solutions: [
      {
        language: "Python",
        approach: "Hash Set",
        code: `def containsDuplicate(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

# Alternative one-liner
def containsDuplicateOneLiner(nums):
    return len(nums) != len(set(nums))`,
        timeComplex: "O(n)",
        spaceComplex: "O(n)",
        explanation:
          "Use a set to track seen numbers. If we encounter a number already in the set, we found a duplicate.",
        notes:
          "The one-liner is more concise but creates the entire set at once.",
        isOptimal: true,
      },
      {
        language: "Java",
        approach: "Hash Set",
        code: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    
    for (int num : nums) {
        if (seen.contains(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}

// Alternative approach using sorting
public boolean containsDuplicateSort(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) {
            return true;
        }
    }
    return false;
}`,
        timeComplex: "O(n) for HashSet, O(n log n) for sorting",
        spaceComplex: "O(n) for HashSet, O(1) for sorting",
        explanation:
          "HashSet approach is optimal for time. Sorting approach saves space but takes more time.",
        notes: "Choose based on whether time or space is more important.",
        isOptimal: true,
      },
    ],
    resources: [
      {
        title: "Hash Set vs Array for Duplicate Detection",
        type: "ARTICLE",
        url: "https://leetcode.com/problems/contains-duplicate/discuss/",
        description: "Discussion of different approaches and their trade-offs",
      },
    ],
  },
  {
    title: "Count Vowels in String",
    description:
      "Given a string s, return the number of vowels in the string.\n\nVowels are 'a', 'e', 'i', 'o', 'u' and their uppercase versions.\n\nExample 1:\nInput: s = \"hello\"\nOutput: 2\nExplanation: The vowels are 'e' and 'o'.\n\nExample 2:\nInput: s = \"programming\"\nOutput: 3",
    difficulty: "EASY",
    category: "String",
    tags: ["String", "Counting"],
    companies: ["Google", "Amazon"],
    hints: [
      "Iterate through each character in the string",
      "Use a set or check against vowel characters",
      "Don't forget about uppercase vowels",
    ],
    followUp:
      "What if you need to count each vowel separately? What about handling Unicode characters?",
    frequency: "Medium",
    acceptance: 75.2,
    isPremium: false,
    timeComplex: "O(n)",
    spaceComplex: "O(1)",
    solutions: [
      {
        language: "Python",
        approach: "Set Lookup",
        code: `def countVowels(s):
    """
    :type s: str
    :rtype: int
    """
    vowels = set('aeiouAEIOU')
    count = 0
    
    for char in s:
        if char in vowels:
            count += 1
    
    return count

# One-liner approach
def countVowelsOneLiner(s):
    return sum(1 for char in s if char.lower() in 'aeiou')`,
        timeComplex: "O(n)",
        spaceComplex: "O(1)",
        explanation:
          "Use a set of vowels for O(1) lookup time. Iterate through string once.",
        notes:
          "Set lookup is faster than multiple comparisons for each character.",
        isOptimal: true,
      },
      {
        language: "Java",
        approach: "Set Lookup",
        code: `public int countVowels(String s) {
    Set<Character> vowels = Set.of('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U');
    int count = 0;
    
    for (char c : s.toCharArray()) {
        if (vowels.contains(c)) {
            count++;
        }
    }
    
    return count;
}

// Alternative using switch statement
public int countVowelsSwitch(String s) {
    int count = 0;
    
    for (char c : s.toCharArray()) {
        switch (Character.toLowerCase(c)) {
            case 'a':
            case 'e':
            case 'i':
            case 'o':
            case 'u':
                count++;
                break;
        }
    }
    
    return count;
}`,
        timeComplex: "O(n)",
        spaceComplex: "O(1)",
        explanation:
          "Set approach is clean and readable. Switch statement might be slightly faster but less maintainable.",
        notes: "Modern Java Set.of() creates an immutable set efficiently.",
        isOptimal: true,
      },
    ],
  },
  {
    title: "Find Most Frequent Character",
    description:
      "Given a string s, return the character that appears most frequently. If there are multiple characters with the same highest frequency, return any one of them.\n\nExample 1:\nInput: s = \"abcabc\"\nOutput: 'a' (or 'b' or 'c')\n\nExample 2:\nInput: s = \"hello\"\nOutput: 'l'",
    difficulty: "EASY",
    category: "String",
    tags: ["String", "Hash Table", "Counting"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Count the frequency of each character",
      "Use a HashMap to store character frequencies",
      "Track the maximum frequency as you build the map",
    ],
    followUp:
      "What if you need to return all characters with the highest frequency? What about case sensitivity?",
    frequency: "Medium",
    acceptance: 68.4,
    isPremium: false,
    timeComplex: "O(n)",
    spaceComplex: "O(k)",
    solutions: [
      {
        language: "Python",
        approach: "Hash Map",
        code: `def mostFrequentChar(s):
    """
    :type s: str
    :rtype: str
    """
    if not s:
        return ""
    
    char_count = {}
    max_count = 0
    result = s[0]
    
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
        if char_count[char] > max_count:
            max_count = char_count[char]
            result = char
    
    return result

# Using Counter from collections
from collections import Counter

def mostFrequentCharCounter(s):
    if not s:
        return ""
    
    counter = Counter(s)
    return counter.most_common(1)[0][0]`,
        timeComplex: "O(n)",
        spaceComplex: "O(k) where k is number of unique characters",
        explanation:
          "Count character frequencies and track the character with maximum count. Counter provides a cleaner solution.",
        notes:
          "Counter is more readable but manual counting gives more control.",
        isOptimal: true,
      },
      {
        language: "Java",
        approach: "Hash Map",
        code: `public char mostFrequentChar(String s) {
    if (s == null || s.isEmpty()) {
        throw new IllegalArgumentException("String cannot be empty");
    }
    
    Map<Character, Integer> charCount = new HashMap<>();
    char result = s.charAt(0);
    int maxCount = 0;
    
    for (char c : s.toCharArray()) {
        charCount.put(c, charCount.getOrDefault(c, 0) + 1);
        if (charCount.get(c) > maxCount) {
            maxCount = charCount.get(c);
            result = c;
        }
    }
    
    return result;
}

// Using Java 8 Streams
public char mostFrequentCharStream(String s) {
    return s.chars()
            .mapToObj(c -> (char) c)
            .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
            .entrySet()
            .stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse('\\0');
}`,
        timeComplex: "O(n)",
        spaceComplex: "O(k) where k is number of unique characters",
        explanation:
          "HashMap to count frequencies, track max during iteration. Streams approach is more functional but less efficient.",
        notes:
          "Manual tracking is more efficient than streams for this problem.",
        isOptimal: true,
      },
    ],
  },
  {
    title: "Check if Number is Prime",
    description:
      "Given an integer n, return true if n is a prime number, otherwise return false.\n\nA prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.\n\nExample 1:\nInput: n = 7\nOutput: true\n\nExample 2:\nInput: n = 15\nOutput: false",
    difficulty: "EASY",
    category: "Math",
    tags: ["Math", "Prime Numbers"],
    companies: ["Amazon", "Microsoft"],
    hints: [
      "Check divisibility only up to sqrt(n)",
      "Handle edge cases: numbers <= 1 are not prime",
      "2 is the only even prime number",
    ],
    followUp:
      "How would you find all prime numbers up to n? What about very large numbers?",
    frequency: "Medium",
    acceptance: 42.8,
    isPremium: false,
    timeComplex: "O(√n)",
    spaceComplex: "O(1)",
    solutions: [
      {
        language: "Python",
        approach: "Trial Division",
        code: `def isPrime(n):
    """
    :type n: int
    :rtype: bool
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Check for divisors from 5 to sqrt(n)
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    
    return True

# Simpler version
def isPrimeSimple(n):
    if n < 2:
        return False
    
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    
    return True`,
        timeComplex: "O(√n)",
        spaceComplex: "O(1)",
        explanation:
          "Check divisibility only up to sqrt(n). Optimize by checking 2, 3, then numbers of form 6k±1.",
        notes:
          "The optimized version skips many unnecessary checks by using the 6k±1 pattern.",
        isOptimal: true,
      },
      {
        language: "Java",
        approach: "Trial Division",
        code: `public boolean isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    // Check for divisors of the form 6k ± 1
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    
    return true;
}

// Simple version
public boolean isPrimeSimple(int n) {
    if (n < 2) return false;
    
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    
    return true;
}`,
        timeComplex: "O(√n)",
        spaceComplex: "O(1)",
        explanation:
          "Efficient trial division checking only potential divisors. The 6k±1 optimization reduces checks by ~2/3.",
        notes:
          "For very large numbers, consider probabilistic tests like Miller-Rabin.",
        isOptimal: true,
      },
    ],
  },
  {
    title: "Remove Array Duplicates",
    description:
      "Given a sorted array nums, remove the duplicates in-place such that each element appears only once and returns the new length.\n\nDo not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.\n\nExample:\nInput: nums = [1,1,2]\nOutput: 2, nums = [1,2,_]",
    difficulty: "EASY",
    category: "Array",
    tags: ["Array", "Two Pointers"],
    companies: ["Microsoft", "Amazon", "Google"],
    hints: [
      "Use two pointers technique",
      "Since array is sorted, duplicates are adjacent",
      "Keep track of the position for next unique element",
    ],
    followUp:
      "What if the array is not sorted? What if you can use extra space?",
    leetcodeUrl:
      "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    problemNumber: 26,
    frequency: "High",
    acceptance: 50.3,
    isPremium: false,
    timeComplex: "O(n)",
    spaceComplex: "O(1)",
    solutions: [
      {
        language: "Python",
        approach: "Two Pointers",
        code: `def removeDuplicates(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    if not nums:
        return 0
    
    # Slow pointer for position of next unique element
    slow = 0
    
    # Fast pointer to scan through array
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    
    return slow + 1`,
        timeComplex: "O(n)",
        spaceComplex: "O(1)",
        explanation:
          "Use two pointers: slow tracks position for next unique element, fast scans the array. When we find a new unique element, we place it at the slow pointer position.",
        notes:
          "This modifies the array in-place and maintains the relative order.",
        isOptimal: true,
      },
      {
        language: "Java",
        approach: "Two Pointers",
        code: `public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    
    int slow = 0;
    
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;
}`,
        timeComplex: "O(n)",
        spaceComplex: "O(1)",
        explanation:
          "Same two-pointer approach. The slow pointer maintains the boundary of unique elements.",
        notes:
          "Works efficiently because the array is sorted, so duplicates are consecutive.",
        isOptimal: true,
      },
    ],
    resources: [
      {
        title: "Two Pointers Technique",
        type: "ARTICLE",
        url: "https://leetcode.com/articles/two-pointer-technique/",
        description: "Comprehensive guide to two-pointer problems",
      },
    ],
  },
];

async function seedLeetCodeProblems() {
  try {
    console.log("🌱 Starting to seed LeetCode problems...");

    // First, we need to find or create a user
    let user = await prisma.user.findFirst({
      where: {
        email: {
          contains: "@",
        },
      },
    });

    if (!user) {
      // Create a default admin user for seeding
      user = await prisma.user.create({
        data: {
          clerkId: "seed_admin_user",
          email: "admin@example.com",
          name: "Admin User",
          role: "ADMIN",
        },
      });
      console.log("Created admin user for seeding");
    }

    console.log(`Using user: ${user.name} (${user.email})`);

    // Delete existing seeded problems (optional - remove if you want to keep existing)
    await prisma.problemSolution.deleteMany({
      where: {
        problem: {
          authorId: user.id,
        },
      },
    });
    await prisma.problemResource.deleteMany({
      where: {
        problem: {
          authorId: user.id,
        },
      },
    });
    await prisma.leetcodeProblem.deleteMany({
      where: {
        authorId: user.id,
      },
    });

    console.log("Cleared existing problems");

    // Create problems with solutions and resources
    for (const problemData of basicProblems) {
      const { solutions, resources, ...problemInfo } = problemData;

      const problem = await prisma.leetcodeProblem.create({
        data: {
          ...problemInfo,
          authorId: user.id,
          solution: solutions[0]?.code || "", // Keep for backward compatibility
          explanation: solutions[0]?.explanation || "",
          solutions: {
            create: solutions.map((sol) => ({
              language: sol.language,
              code: sol.code,
              approach: sol.approach,
              timeComplex: sol.timeComplex,
              spaceComplex: sol.spaceComplex,
              explanation: sol.explanation,
              notes: sol.notes,
              isOptimal: sol.isOptimal || false,
            })),
          },
          resources: {
            create: (resources || []).map((res) => ({
              title: res.title,
              type: res.type,
              url: res.url,
              description: res.description,
            })),
          },
        },
        include: {
          solutions: true,
          resources: true,
        },
      });

      console.log(`✅ Created problem: ${problem.title}`);
    }

    console.log(
      `🎉 Successfully seeded ${basicProblems.length} LeetCode problems!`
    );

    // Display summary
    const totalProblems = await prisma.leetcodeProblem.count();
    const totalSolutions = await prisma.problemSolution.count();
    const totalResources = await prisma.problemResource.count();

    console.log("\n📊 Database Summary:");
    console.log(`Total Problems: ${totalProblems}`);
    console.log(`Total Solutions: ${totalSolutions}`);
    console.log(`Total Resources: ${totalResources}`);
  } catch (error) {
    console.error("❌ Error seeding LeetCode problems:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedLeetCodeProblems();
}

module.exports = { seedLeetCodeProblems, basicProblems };
