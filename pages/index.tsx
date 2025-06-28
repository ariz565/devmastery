import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Code,
  FolderTree,
  Target,
  ArrowRight,
  Star,
  Users,
  Zap,
  CheckCircle,
  Github,
  ExternalLink,
} from "lucide-react";
import { PointerHighlight } from "../components/ui/pointer-highlight";
import { AuthButton } from "../components/AuthButton";
import { cn } from "@/lib/utils";
import Layout from "../components/Layout";

function HomePage() {
  const services = [
    {
      icon: FolderTree,
      title: "Topics",
      description: "Explore comprehensive programming topics and concepts",
      href: "/topics",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: BookOpen,
      title: "Blogs",
      description:
        "In-depth articles on software development and best practices",
      href: "/blogs",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FileText,
      title: "Notes",
      description: "Curated study notes and quick reference materials",
      href: "/notes",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Code,
      title: "LeetCode",
      description: "Coding challenges and solutions for interview preparation",
      href: "/leetcode",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Target,
      title: "Interviews",
      description: "Technical interview questions and preparation guides",
      href: "/interviews",
      color: "from-red-500 to-red-600",
    },
  ];

  const features = [
    {
      icon: Star,
      title: "Quality Content",
      description:
        "Carefully curated articles, tutorials, and coding challenges from industry experts",
    },
    {
      icon: Zap,
      title: "Fast Learning",
      description:
        "Structured learning paths and bite-sized content for efficient skill development",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Learn alongside a community of passionate developers and share your knowledge",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Enhanced Dark Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary dark gradient - deeper blacks */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-gray-900"></div>

        {/* Secondary color overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-purple-950/20 to-indigo-950/30"></div>

        {/* Enhanced dot pattern - much more visible */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIvPgo8L3N2Zz4=')] opacity-80"></div>

        {/* Additional medium dots for variation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjE1KSIvPgo8L3N2Zz4=')] opacity-60"></div>

        {/* Large sparse dots for depth */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNCIgY3k9IjQiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz4KPC9zdmc+')] opacity-50"></div>

        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Headline */}
            <PointerHighlight
              containerClassName="inline-block mb-6"
              rectangleClassName="border-blue-500/50"
              pointerClassName="text-blue-400"
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  DevMastery
                </span>
              </h1>
            </PointerHighlight>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Your ultimate platform for mastering software engineering skills
              through comprehensive tutorials, coding challenges, and interview
              preparation resources.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blogs"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Articles
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <AuthButton
                variant="primary"
                redirectTo="/topics"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25 px-8 py-4"
              >
                Get Started
              </AuthButton>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <PointerHighlight
              containerClassName="inline-block mb-4"
              rectangleClassName="border-green-500/50"
              pointerClassName="text-green-400"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                Master Development with Our{" "}
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Services
                </span>
              </h2>
            </PointerHighlight>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Comprehensive learning platform designed to take you from beginner
              to expert. Everything you need to master software development and
              ace your technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 block w-full"
              >
                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  <div className="flex items-center text-blue-300 font-semibold group-hover:translate-x-2 transition-transform duration-300 text-sm">
                    <span>Explore {service.title}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <PointerHighlight
              containerClassName="inline-block mb-4"
              rectangleClassName="border-purple-500/50"
              pointerClassName="text-purple-400"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DevMastery?
                </span>
              </h2>
            </PointerHighlight>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Comprehensive learning platform built by developers, for
              developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <PointerHighlight
                key={index}
                containerClassName="w-full"
                rectangleClassName={cn(
                  "border-opacity-50",
                  index === 0 && "border-purple-500",
                  index === 1 && "border-pink-500",
                  index === 2 && "border-violet-500"
                )}
                pointerClassName={cn(
                  index === 0 && "text-purple-400",
                  index === 1 && "text-pink-400",
                  index === 2 && "text-violet-400"
                )}
              >
                <div className="group text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </PointerHighlight>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Terminal Code Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Experience DevMastery like never before
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Built with modern web technologies for the ultimate learning
              experience
            </p>
          </div>

          {/* Terminal Window */}
          <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-400 font-mono">
                devmastery-terminal.js
              </div>
              <div className="w-16"></div>
            </div>

            {/* Terminal Content */}
            <div className="p-8">
              {/* Command Prompt */}
              <div className="text-green-400 text-sm font-mono mb-4 flex items-center">
                <span className="text-blue-400">$</span>
                <span className="ml-2">npm install @devmastery/skills</span>
                <span className="ml-2 animate-pulse">|</span>
              </div>

              {/* Code Block */}
              <div className="text-left font-mono text-sm space-y-2">
                <div className="text-blue-400">
                  <span className="text-purple-400">import</span>
                  <span className="text-white"> {"{ "}</span>
                  <span className="text-yellow-300">React</span>
                  <span className="text-white">, </span>
                  <span className="text-yellow-300">NextJS</span>
                  <span className="text-white">, </span>
                  <span className="text-yellow-300">TypeScript</span>
                  <span className="text-white"> {"}"} </span>
                  <span className="text-purple-400">from</span>
                  <span className="text-green-300"> 'modern-web'</span>
                  <span className="text-white">;</span>
                </div>

                <div className="mt-4">
                  <span className="text-purple-400">const</span>
                  <span className="text-white"> </span>
                  <span className="text-yellow-300">DevMastery</span>
                  <span className="text-white"> = () =&gt; &#123;</span>
                </div>

                <div className="ml-4 text-gray-400">
                  // Your coding journey starts here
                </div>

                <div className="ml-4">
                  <span className="text-purple-400">const</span>
                  <span className="text-white"> </span>
                  <span className="text-blue-300">skills</span>
                  <span className="text-white"> = [</span>
                  <span className="text-green-300">'React'</span>
                  <span className="text-white">, </span>
                  <span className="text-green-300">'Node.js'</span>
                  <span className="text-white">, </span>
                  <span className="text-green-300">'Python'</span>
                  <span className="text-white">];</span>
                </div>

                <div className="ml-4 mt-2">
                  <span className="text-purple-400">return</span>
                  <span className="text-white"> </span>
                  <span className="text-blue-400">&lt;</span>
                  <span className="text-red-400">Success</span>
                  <span className="text-white"> </span>
                  <span className="text-yellow-300">skills</span>
                  <span className="text-white">=&#123;</span>
                  <span className="text-blue-300">skills</span>
                  <span className="text-white">&#125;</span>
                  <span className="text-blue-400"> /&gt;</span>
                  <span className="text-white">;</span>
                </div>

                <div className="text-white">&#125;</div>

                <div className="mt-4 text-green-400">
                  <span className="text-blue-400">$</span>
                  <span className="ml-2">npm start</span>
                </div>

                <div className="text-gray-400 text-xs mt-2">
                  ✓ Server running on http://localhost:3000
                </div>
                <div className="text-gray-400 text-xs">
                  ✓ Ready for development mastery!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 pb-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <PointerHighlight
            containerClassName="inline-block mb-6"
            rectangleClassName="border-yellow-500/50"
            pointerClassName="text-yellow-400"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Ready to Level Up Your{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Skills?
              </span>
            </h2>
          </PointerHighlight>
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            Join thousands of developers who are already mastering their craft
            with DevMastery
          </p>

          <PointerHighlight
            containerClassName="inline-block"
            rectangleClassName="border-orange-500/50"
            pointerClassName="text-orange-400"
          >
            <AuthButton
              variant="primary"
              redirectTo="/topics"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 hover:shadow-yellow-500/25 px-10 py-5 text-lg min-w-[250px]"
            >
              Get Started Today
            </AuthButton>
          </PointerHighlight>
        </div>
      </section>
    </div>
  );
}

// Use the Layout component with AuthNavbar for consistent styling
HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default HomePage;
