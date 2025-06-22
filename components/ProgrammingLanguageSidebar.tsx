import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  StickyNote,
  Book,
  Code,
  Settings,
  Database,
  Layers,
  Zap,
  Brain,
} from "lucide-react";

interface SidebarSection {
  name: string;
  slug: string;
  description: string;
  icon: any;
  order: number;
  items: string[];
}

interface ProgrammingLanguageSidebarProps {
  topicSlug: string;
  subTopicSlug: string;
  currentSection?: string;
}

// Define the sidebar structure for different programming languages
const programmingLanguageSections: Record<string, SidebarSection[]> = {
  java: [
    {
      name: "Java Fundamentals",
      slug: "fundamentals",
      description: "Core Java concepts and basics",
      icon: Settings,
      order: 1,
      items: [
        "JVM, JRE, and JDK",
        "Variables and Data Types",
        "Keywords and Identifiers",
        "Operators and Expressions",
        "Control Flow Statements",
        "Input/Output Basics",
      ],
    },
    {
      name: "Object-Oriented Programming",
      slug: "oop",
      description: "OOP concepts in Java",
      icon: Layers,
      order: 2,
      items: [
        "Classes and Objects",
        "Inheritance",
        "Polymorphism",
        "Encapsulation",
        "Abstraction",
        "Interfaces vs Abstract Classes",
        "this and super Keywords",
      ],
    },
    {
      name: "Advanced Java Features",
      slug: "advanced",
      description: "Advanced Java programming concepts",
      icon: Code,
      order: 3,
      items: [
        "Exception Handling",
        "Collections Framework",
        "Generics",
        "Lambda Expressions",
        "Stream API",
        "Annotations",
        "Reflection API",
      ],
    },
    {
      name: "Concurrency & Multithreading",
      slug: "concurrency",
      description: "Concurrent programming in Java",
      icon: Zap,
      order: 4,
      items: [
        "Thread Fundamentals",
        "Synchronization",
        "Thread Pool",
        "Concurrent Collections",
        "CompletableFuture",
        "Parallel Streams",
        "Atomic Variables",
      ],
    },
    {
      name: "Memory Management",
      slug: "memory",
      description: "Java memory model and garbage collection",
      icon: Brain,
      order: 5,
      items: [
        "Heap and Stack Memory",
        "Garbage Collection",
        "Memory Leaks",
        "JVM Tuning",
        "Static vs Instance",
        "WeakReference & SoftReference",
      ],
    },
    {
      name: "Java Ecosystem",
      slug: "ecosystem",
      description: "Frameworks and tools",
      icon: Database,
      order: 6,
      items: [
        "Spring Framework",
        "Spring Boot",
        "Maven & Gradle",
        "JUnit Testing",
        "JDBC & JPA",
        "Design Patterns",
      ],
    },
  ],
  python: [
    {
      name: "Python Basics",
      slug: "basics",
      description: "Python fundamentals",
      icon: Book,
      order: 1,
      items: [
        "Variables and Data Types",
        "Control Flow",
        "Functions",
        "Modules and Packages",
        "File Handling",
        "Error Handling",
      ],
    },
    {
      name: "Object-Oriented Python",
      slug: "oop",
      description: "OOP in Python",
      icon: Layers,
      order: 2,
      items: [
        "Classes and Objects",
        "Inheritance",
        "Polymorphism",
        "Encapsulation",
        "Magic Methods",
        "Decorators",
      ],
    },
    {
      name: "Advanced Python",
      slug: "advanced",
      description: "Advanced concepts",
      icon: Code,
      order: 3,
      items: [
        "Generators and Iterators",
        "Context Managers",
        "Metaclasses",
        "Asyncio",
        "Threading & Multiprocessing",
        "Type Hints",
      ],
    },
  ],
  javascript: [
    {
      name: "JavaScript Fundamentals",
      slug: "fundamentals",
      description: "Core JavaScript concepts",
      icon: Settings,
      order: 1,
      items: [
        "Variables and Scope",
        "Data Types",
        "Functions",
        "Objects and Arrays",
        "DOM Manipulation",
        "Event Handling",
      ],
    },
    {
      name: "ES6+ Features",
      slug: "es6-plus",
      description: "Modern JavaScript features",
      icon: Code,
      order: 2,
      items: [
        "Arrow Functions",
        "Destructuring",
        "Modules",
        "Promises and Async/Await",
        "Classes",
        "Template Literals",
      ],
    },
    {
      name: "Advanced JavaScript",
      slug: "advanced",
      description: "Advanced concepts",
      icon: Brain,
      order: 3,
      items: [
        "Closures",
        "Prototypes",
        "Event Loop",
        "Hoisting",
        "Call, Apply, Bind",
        "Web APIs",
      ],
    },
  ],
};

export default function ProgrammingLanguageSidebar({
  topicSlug,
  subTopicSlug,
  currentSection,
}: ProgrammingLanguageSidebarProps) {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    currentSection || null
  );

  const sections = programmingLanguageSections[subTopicSlug] || [];

  if (sections.length === 0) {
    return null;
  }

  const toggleSection = (sectionSlug: string) => {
    setExpandedSection(expandedSection === sectionSlug ? null : sectionSlug);
  };

  const createSlug = (item: string) => {
    return item
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {subTopicSlug.charAt(0).toUpperCase() + subTopicSlug.slice(1)} Guide
        </h2>
        <p className="text-sm text-gray-600">
          Navigate through comprehensive {subTopicSlug} topics and concepts
        </p>
      </div>

      <nav className="space-y-2">
        {sections.map((section) => {
          const IconComponent = section.icon;
          const isExpanded = expandedSection === section.slug;

          return (
            <div
              key={section.slug}
              className="border-b border-gray-100 last:border-b-0"
            >
              <button
                onClick={() => toggleSection(section.slug)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {section.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {section.items.length} topics
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="pl-8 pb-3 space-y-1">
                  {section.items.map((item, index) => {
                    const itemSlug = createSlug(item);
                    const isActive = router.asPath.includes(itemSlug);

                    return (
                      <Link
                        key={index}
                        href={`/topics/${topicSlug}/${subTopicSlug}/${section.slug}/${itemSlug}`}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {item.includes("JVM") ||
                          item.includes("Exception") ? (
                            <FileText className="w-3 h-3" />
                          ) : (
                            <StickyNote className="w-3 h-3" />
                          )}
                          <span>{item}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-3">Quick Navigation</div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/topics/${topicSlug}/${subTopicSlug}`}
            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-3 h-3 mr-1" />
            All Blogs
          </Link>
          <Link
            href={`/notes?subtopic=${subTopicSlug}`}
            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
          >
            <StickyNote className="w-3 h-3 mr-1" />
            All Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
