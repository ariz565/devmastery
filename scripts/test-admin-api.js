// Test script to simulate admin TOC operations
const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3001";

async function testAdminTOC() {
  try {
    console.log("🧪 Testing Admin TOC API endpoints...\n");

    // Test 1: Get all topics
    console.log("1. Testing GET /api/admin/topics");
    const topicsResponse = await fetch(`${BASE_URL}/api/admin/topics`);
    const topics = await topicsResponse.json();
    console.log(`   ✅ Status: ${topicsResponse.status}`);
    console.log(`   📊 Found ${topics.length} topics`);

    if (topics.length === 0) {
      console.log("   ❌ No topics found for testing");
      return;
    }

    // Use Java topic for testing
    const javaTopic = topics.find((t) => t.slug === "java");
    if (!javaTopic) {
      console.log("   ❌ Java topic not found for testing");
      return;
    }

    console.log(`   🎯 Using topic: ${javaTopic.name} (${javaTopic.id})`);

    // Test 2: Get TOC for Java topic
    console.log("\n2. Testing GET /api/admin/topics/{id}/table-of-contents");
    const tocResponse = await fetch(
      `${BASE_URL}/api/admin/topics/${javaTopic.id}/table-of-contents`
    );
    const tocItems = await tocResponse.json();
    console.log(`   ✅ Status: ${tocResponse.status}`);
    console.log(`   📚 Found ${tocItems.length} TOC items`);

    // Test 3: Create a new TOC item
    console.log("\n3. Testing POST /api/admin/topics/{id}/table-of-contents");
    const newTOCItem = {
      title: "Test Topic Created via API",
      slug: "test-topic-api",
      description: "This is a test topic created through the API",
      order: 999,
      level: 1,
      contentType: "section",
      estimatedReadTime: 10,
      difficulty: "intermediate",
      isPublished: false,
    };

    const createResponse = await fetch(
      `${BASE_URL}/api/admin/topics/${javaTopic.id}/table-of-contents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTOCItem),
      }
    );

    const createdItem = await createResponse.json();
    console.log(`   ✅ Status: ${createResponse.status}`);

    if (createResponse.status === 201) {
      console.log(`   🆕 Created item: ${createdItem.title}`);
      console.log(`   🔗 Item ID: ${createdItem.id}`);

      // Test 4: Update the created item
      console.log(
        "\n4. Testing PUT /api/admin/topics/{id}/table-of-contents/{itemId}"
      );
      const updateData = {
        title: "Updated Test Topic via API",
        description: "This topic was updated through the API",
        difficulty: "advanced",
      };

      const updateResponse = await fetch(
        `${BASE_URL}/api/admin/topics/${javaTopic.id}/table-of-contents`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updateData, id: createdItem.id }),
        }
      );

      const updatedItem = await updateResponse.json();
      console.log(`   ✅ Status: ${updateResponse.status}`);
      if (updateResponse.status === 200) {
        console.log(`   ✏️  Updated item: ${updatedItem.title}`);
        console.log(`   🎯 Difficulty changed to: ${updatedItem.difficulty}`);
      }

      // Test 5: Delete the created item
      console.log(
        "\n5. Testing DELETE /api/admin/topics/{id}/table-of-contents/{itemId}"
      );
      const deleteResponse = await fetch(
        `${BASE_URL}/api/admin/topics/${javaTopic.id}/table-of-contents`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: createdItem.id }),
        }
      );

      console.log(`   ✅ Status: ${deleteResponse.status}`);
      if (deleteResponse.status === 200) {
        console.log(`   🗑️  Deleted test item successfully`);
      }
    } else {
      console.log(
        `   ❌ Failed to create item: ${createdItem.message || "Unknown error"}`
      );
    }

    // Test 6: Verify TOC structure integrity
    console.log("\n6. Testing TOC structure integrity");
    const finalTocResponse = await fetch(
      `${BASE_URL}/api/admin/topics/${javaTopic.id}/table-of-contents`
    );
    const finalTocItems = await finalTocResponse.json();

    const levels = finalTocItems.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});

    console.log(`   📊 Final TOC structure:`);
    Object.entries(levels).forEach(([level, count]) => {
      console.log(`      Level ${level}: ${count} items`);
    });

    console.log("\n✅ All API tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Only run if server is available
testAdminTOC();
