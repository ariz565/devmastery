import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("🔍 Fetching topics from database...");

    // Fetch topics using YOUR actual schema field names
    const topics = await prisma.topic.findMany({
      include: {
        subTopics: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
            order: true,
            _count: {
              select: {
                blogs: true,
                notes: true,
                leetcodeProblems: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            blogs: true,
            notes: true,
            leetcodeProblems: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    console.log(`✅ Found ${topics.length} topics`);

    // Calculate stats
    const totalTopics = topics.length;
    const totalSubtopics = topics.reduce(
      (sum, topic) => sum + (topic.subTopics?.length || 0),
      0
    );

    const [blogsCount, notesCount] = await Promise.all([
      prisma.blog.count({ where: { published: true } }),
      prisma.note.count(),
    ]);

    const stats = {
      totalTopics,
      totalSubtopics,
      totalBlogs: blogsCount,
      totalNotes: notesCount,
    };

    // Transform to match frontend expectations
    const transformedTopics = topics.map((topic) => ({
      id: topic.id,
      title: topic.name, // Map 'name' to 'title' for frontend compatibility
      name: topic.name,
      slug: topic.slug,
      description: topic.description || `Learn about ${topic.name}`,
      icon: topic.icon || "Code",
      color: getTopicColor(topic.order), // Assign colors based on order
      isPopular: topic.order <= 3, // Mark first 3 as popular
      order: topic.order,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      authorName: topic.author?.name || "DevMastery Team",
      // Ensure subTopics is always an array - this fixes the frontend error
      subTopics: (topic.subTopics || []).map((sub) => ({
        id: sub.id,
        title: sub.name, // Map 'name' to 'title'
        name: sub.name,
        slug: sub.slug,
        description: sub.description || `Learn about ${sub.name}`,
        icon: sub.icon || "FileText",
        difficulty: getDifficultyFromOrder(sub.order),
        estimatedTime: getEstimatedTime(sub.order),
        order: sub.order,
        // Use actual counts from database
        _count: {
          blogs: sub._count?.blogs || 0,
          notes: sub._count?.notes || 0,
          leetcodeProblems: sub._count?.leetcodeProblems || 0,
        },
        stats: {
          blogs: sub._count?.blogs || 0,
          notes: sub._count?.notes || 0,
          problems: sub._count?.leetcodeProblems || 0,
        },
      })),
      // Add _count for frontend compatibility
      _count: {
        blogs: topic._count?.blogs || 0,
        notes: topic._count?.notes || 0,
        leetcodeProblems: topic._count?.leetcodeProblems || 0,
      },
      stats: {
        blogs: topic._count?.blogs || 0,
        notes: topic._count?.notes || 0,
        problems: topic._count?.leetcodeProblems || 0,
      },
    }));

    // Also include the navigation structure for backward compatibility
    const navigationStructure = topics.reduce((acc, topic) => {
      acc[topic.slug] = {
        title: `${topic.icon || "📚"} ${topic.name}`,
        type: "page",
        href: `/topics/${topic.slug}`,
      };

      // Add subtopics - ensure subTopics is an array
      const subTopics = topic.subTopics || [];
      subTopics.forEach((subTopic) => {
        acc[`${topic.slug}/${subTopic.slug}`] = {
          title: `${subTopic.icon || "📄"} ${subTopic.name}`,
          type: "page",
          href: `/topics/${topic.slug}/${subTopic.slug}`,
        };
      });

      return acc;
    }, {} as any);

    res.status(200).json({
      success: true,
      topics: transformedTopics,
      stats,
      navigation: navigationStructure,
      message: `Successfully fetched ${topics.length} topics`,
    });
  } catch (error) {
    console.error("💥 Topics API error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: "Failed to fetch topics from database",
      timestamp: new Date().toISOString(),
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function getTopicColor(order: number): string {
  const colors = [
    "blue",
    "green",
    "purple",
    "orange",
    "red",
    "indigo",
    "pink",
    "teal",
  ];
  return colors[order % colors.length] || "blue";
}

function getDifficultyFromOrder(order: number): string {
  if (order <= 2) return "beginner";
  if (order <= 5) return "intermediate";
  return "advanced";
}

function getEstimatedTime(order: number): number {
  return Math.max(15, order * 10); // Minimum 15 minutes, increases with order
}
