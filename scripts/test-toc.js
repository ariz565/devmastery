const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testTOC() {
  try {
    console.log("Testing Table of Contents functionality...\n");

    // Get all topics
    const topics = await prisma.topic.findMany({
      include: {
        tableOfContents: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    console.log(`Found ${topics.length} topics:`);

    for (const topic of topics) {
      console.log(`\n📁 Topic: ${topic.name} (${topic.slug})`);
      console.log(`   Description: ${topic.description}`);
      console.log(`   TOC Items: ${topic.tableOfContents.length}`);

      // Show hierarchical structure
      const rootItems = topic.tableOfContents.filter((item) => !item.parentId);

      const printHierarchy = (items, indent = "   ") => {
        for (const item of items) {
          console.log(`${indent}└─ ${item.title} (Level ${item.level})`);
          if (item.children && item.children.length > 0) {
            printHierarchy(item.children, indent + "   ");
          }
        }
      };

      printHierarchy(rootItems);
    }

    // Test API simulation
    console.log("\n🔗 Testing API endpoints simulation...");

    for (const topic of topics) {
      console.log(`\nTesting API for topic: ${topic.name}`);

      // Simulate GET request
      const tocItems = await prisma.tableOfContents.findMany({
        where: {
          topicId: topic.id,
        },
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      console.log(`   GET /api/admin/topics/${topic.id}/table-of-contents`);
      console.log(`   Returns: ${tocItems.length} items`);

      // Show a sample of the nested structure
      const rootItems = tocItems.filter((item) => !item.parentId);
      console.log(`   Root items: ${rootItems.length}`);

      let totalSubItems = 0;
      rootItems.forEach((root) => {
        if (root.children) {
          totalSubItems += root.children.length;
          root.children.forEach((child) => {
            if (child.children) {
              totalSubItems += child.children.length;
            }
          });
        }
      });

      console.log(`   Sub-items: ${totalSubItems}`);
    }
  } catch (error) {
    console.error("Error testing TOC:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testTOC();
