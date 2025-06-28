const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestBlog() {
  try {
    const blog = await prisma.blog.create({
      data: {
        title: "Data Structures Comparison Guide",
        content: `# Data Structures Comparison

This comprehensive guide compares different data structures and their performance characteristics.

## ArrayList vs LinkedList Performance

When choosing between ArrayList and LinkedList in Java, understanding their performance characteristics is crucial:

### Time Complexity Analysis

| Operation | ArrayList | LinkedList |
|-----------|-----------|------------|
| get(index) | O(1) | O(n) |
| add(element) | O(1) amortized | O(1) |
| add(index, element) | O(n) | O(n) |
| remove(index) | O(n) | O(n) |
| remove(element) | O(n) | O(n) |
| contains(element) | O(n) | O(n) |
| size() | O(1) | O(1) |

### Key Insights

\`\`\`java
// ArrayList - Random access is fast
List<String> arrayList = new ArrayList<>();
String element = arrayList.get(index); // O(1) - Very fast!

// LinkedList - Sequential access required
List<String> linkedList = new LinkedList<>();
String element = linkedList.get(index); // O(n) - Slower for large lists
\`\`\`

### When to Use Each

> **ArrayList**: Use when you need frequent random access to elements and the list size doesn't change much.

> **LinkedList**: Use when you frequently insert/delete at the beginning or middle of the list.

### Visual Comparison

![Data Structures](https://via.placeholder.com/600x300/4f46e5/ffffff?text=ArrayList+vs+LinkedList)

## Conclusion

Choose your data structure based on your specific use case and access patterns.`,
        excerpt:
          "A comprehensive comparison of ArrayList and LinkedList performance characteristics with detailed time complexity analysis.",
        category: "Data Structures",
        tags: ["Java", "Performance", "ArrayList", "LinkedList", "Big O"],
        readTime: 5,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: "author-1",
      },
    });

    console.log("Created blog with ID:", blog.id);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBlog();
