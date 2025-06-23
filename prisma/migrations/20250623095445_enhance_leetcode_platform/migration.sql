-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ARTICLE', 'VIDEO', 'PDF', 'IMAGE', 'CODE', 'WEBSITE', 'BOOK', 'COURSE');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'JAVA', 'CPP', 'C', 'CSHARP', 'GO', 'RUST', 'SWIFT', 'KOTLIN', 'PHP', 'RUBY', 'SCALA', 'DART', 'R', 'MATLAB', 'SQL');

-- AlterTable
ALTER TABLE "leetcode_problems" ADD COLUMN     "acceptance" DOUBLE PRECISION,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'DSA',
ADD COLUMN     "companies" TEXT[],
ADD COLUMN     "followUp" TEXT,
ADD COLUMN     "frequency" TEXT,
ADD COLUMN     "hints" TEXT[],
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leetcodeUrl" TEXT,
ADD COLUMN     "problemNumber" INTEGER;

-- CreateTable
CREATE TABLE "problem_solutions" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "approach" TEXT NOT NULL,
    "timeComplex" TEXT,
    "spaceComplex" TEXT,
    "explanation" TEXT,
    "notes" TEXT,
    "isOptimal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "problem_solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "url" TEXT,
    "filePath" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "problem_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "resource_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_collection_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "url" TEXT,
    "filePath" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "resource_collection_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "problem_solutions" ADD CONSTRAINT "problem_solutions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "leetcode_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_resources" ADD CONSTRAINT "problem_resources_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "leetcode_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_collections" ADD CONSTRAINT "resource_collections_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_collection_items" ADD CONSTRAINT "resource_collection_items_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "resource_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
