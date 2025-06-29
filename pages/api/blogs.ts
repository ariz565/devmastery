import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("🔍 Fetching blogs from database...");

    const { topicSlug, subTopicSlug, category, tag, limit } = req.query;

    // Build where clause for filtering
    const where: any = { published: true };

    if (subTopicSlug) {
      where.subTopic = { slug: subTopicSlug };
    } else if (topicSlug) {
      where.topic = { slug: topicSlug };
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    // Get published blogs with all necessary data
    const blogs = await prisma.blog.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit ? parseInt(limit as string) : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        coverImage: true,
        category: true,
        subCategory: true,
        tags: true,
        published: true,
        readTime: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        subTopic: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    console.log(`✅ Found ${blogs.length} blogs`);

    // Transform blogs to match frontend expectations
    const transformedBlogs = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || blog.content.substring(0, 200) + "...",
      coverImage: blog.coverImage,
      category: blog.category,
      subCategory: blog.subCategory,
      tags: blog.tags || [],
      published: blog.published,
      status: blog.published ? "published" : "draft",
      readingTime: blog.readTime || 5,
      readTime: blog.readTime,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      publishedAt: blog.publishedAt,
      // Generate slug from title for compatibility
      slug: blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      // Author information - with null checks
      authorId: blog.author?.id || "anonymous",
      authorName: blog.author?.name || "Anonymous",
      authorEmail: blog.author?.email || "",
      authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        blog.author?.name || "Anonymous"
      )}&background=random`,
      // Generate demo engagement stats
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      // Topic information - with null checks
      topic: blog.topic
        ? {
            id: blog.topic.id,
            name: blog.topic.name,
            title: blog.topic.name,
            slug: blog.topic.slug,
            icon: blog.topic.icon || "Code",
          }
        : null,
      subTopic: blog.subTopic
        ? {
            id: blog.subTopic.id,
            name: blog.subTopic.name,
            title: blog.subTopic.name,
            slug: blog.subTopic.slug,
            icon: blog.subTopic.icon || "FileText",
          }
        : null,
    }));

    // Get additional stats
    const totalBlogs = await prisma.blog.count({ where: { published: true } });
    const categories = await prisma.blog.groupBy({
      by: ["category"],
      where: { published: true },
      _count: true,
    });

    res.status(200).json({
      success: true,
      blogs: transformedBlogs,
      total: totalBlogs,
      categories: categories.map((cat) => ({
        name: cat.category,
        count: cat._count,
      })),
      pagination: {
        total: totalBlogs,
        limit: limit ? parseInt(limit as string) : transformedBlogs.length,
        hasMore: limit ? totalBlogs > parseInt(limit as string) : false,
      },
      message: `Successfully fetched ${transformedBlogs.length} blogs`,
    });
  } catch (error) {
    console.error("💥 Blogs API error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: "Failed to fetch blogs from database",
      timestamp: new Date().toISOString(),
    });
  } finally {
    await prisma.$disconnect();
  }
}
