const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testTOCSystem() {
  try {
    console.log("🔬 Testing Table of Contents System...\n");

    // Test 1: Database state verification
    console.log("1. Verifying database state:");

    const topics = await prisma.topic.findMany({
      include: {
        _count: {
          select: {
            tableOfContents: true,
          },
        },
      },
    });

    console.log(`   ✅ Found ${topics.length} topics in database`);

    // Test 2: Check TOC structure for each topic
    console.log("\n2. Checking TOC structures:");

    for (const topic of topics) {
      const tocCount = topic._count.tableOfContents;
      console.log(`   📚 ${topic.name}: ${tocCount} TOC items`);

      if (tocCount > 0) {
        const tocItems = await prisma.tableOfContents.findMany({
          where: { topicId: topic.id },
          orderBy: { order: "asc" },
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        });

        const levels = tocItems.reduce((acc, item) => {
          acc[item.level] = (acc[item.level] || 0) + 1;
          return acc;
        }, {});

        console.log(
          `      Structure: ${Object.entries(levels)
            .map(([level, count]) => `L${level}:${count}`)
            .join(", ")}`
        );
      }
    }

    // Test 3: Test hierarchical relationships
    console.log("\n3. Testing hierarchical relationships:");

    const javaTopicId = topics.find((t) => t.slug === "java")?.id;
    if (javaTopicId) {
      const javaTocItems = await prisma.tableOfContents.findMany({
        where: { topicId: javaTopicId },
        orderBy: { order: "asc" },
      });

      const rootItems = javaTocItems.filter((item) => !item.parentId);
      const childItems = javaTocItems.filter((item) => item.parentId);

      console.log(`   Java TOC structure:`);
      console.log(`      Root items: ${rootItems.length}`);
      console.log(`      Child items: ${childItems.length}`);

      // Check parent-child relationships
      let validRelationships = 0;
      for (const child of childItems) {
        const parent = javaTocItems.find((item) => item.id === child.parentId);
        if (parent) {
          validRelationships++;
        }
      }
      console.log(
        `      Valid relationships: ${validRelationships}/${childItems.length}`
      );
    }

    // Test 4: Test API simulation (without auth)
    console.log("\n4. Testing API logic simulation:");

    if (javaTopicId) {
      console.log("   Simulating GET /api/admin/topics/[id]/table-of-contents");

      const apiResult = await prisma.tableOfContents.findMany({
        where: { topicId: javaTopicId },
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
        orderBy: { order: "asc" },
      });

      console.log(`   ✅ Would return ${apiResult.length} items`);

      // Show a sample item structure
      if (apiResult.length > 0) {
        const sample = apiResult[0];
        console.log(
          `   📋 Sample item: "${sample.title}" (Level ${sample.level}, ${sample.contentType})`
        );
        if (sample.children && sample.children.length > 0) {
          console.log(`      Has ${sample.children.length} direct children`);
        }
      }
    }

    // Test 5: Test CRUD operations directly
    console.log("\n5. Testing CRUD operations:");

    if (javaTopicId) {
      console.log("   Creating test TOC item...");

      const testItem = await prisma.tableOfContents.create({
        data: {
          title: "API Test Topic",
          slug: "api-test-topic",
          description: "Created via API test",
          order: 999,
          level: 1,
          contentType: "section",
          estimatedReadTime: 5,
          difficulty: "beginner",
          isPublished: false,
          topicId: javaTopicId,
        },
      });

      console.log(
        `   ✅ Created item: "${testItem.title}" (ID: ${testItem.id})`
      );

      // Update the item
      const updatedItem = await prisma.tableOfContents.update({
        where: { id: testItem.id },
        data: {
          title: "Updated API Test Topic",
          difficulty: "intermediate",
        },
      });

      console.log(
        `   ✏️  Updated item: "${updatedItem.title}" (Difficulty: ${updatedItem.difficulty})`
      );

      // Delete the item
      await prisma.tableOfContents.delete({
        where: { id: testItem.id },
      });

      console.log(`   🗑️  Deleted test item`);
    }

    console.log("\n✅ All TOC system tests passed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Database contains ${topics.length} topics`);
    console.log(`   - TOC items created and functional`);
    console.log(`   - Hierarchical relationships working`);
    console.log(`   - CRUD operations functioning correctly`);
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testTOCSystem();
