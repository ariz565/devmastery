import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    console.log('🔍 Starting database debug...');
    
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
    };
    
    console.log('🔧 Environment check:', envCheck);
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test raw query
    const rawResult = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('🔍 Raw query test:', rawResult);
    
    // Check if tables exist and count records
    const counts = {
      topics: 0,
      blogs: 0,
      notes: 0,
      users: 0,
      interviewResources: 0,
    };
    
    try {
      counts.topics = await prisma.topic.count();
      counts.blogs = await prisma.blog.count();
      counts.notes = await prisma.note.count();
      counts.users = await prisma.user.count();
      counts.interviewResources = await prisma.interviewResource.count();
    } catch (e) {
      console.error('Error counting records:', e);
    }
    
    // Get sample data
    let sampleTopic: any = null;
    let sampleBlog: any = null;
    
    try {
      sampleTopic = await prisma.topic.findFirst({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          order: true,
        },
      });
      
      sampleBlog = await prisma.blog.findFirst({
        where: { published: true },
        select: {
          id: true,
          title: true,
          excerpt: true,
          published: true,
        },
      });
    } catch (e) {
      console.error('Error fetching samples:', e);
    }
    
    res.status(200).json({
      success: true,
      message: 'Database debug successful!',
      environment: envCheck,
      rawQuery: rawResult,
      counts,
      samples: {
        topic: sampleTopic,
        blog: sampleBlog,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('💥 Database debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Error disconnecting:', e);
    }
  }
}
