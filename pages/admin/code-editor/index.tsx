import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Play, Save, Download, Upload, Settings, Code } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
}

export default function CodeEditor() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [code, setCode] = useState(getDefaultCode("javascript"));
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState("");
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [snippetTitle, setSnippetTitle] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  function getDefaultCode(lang: string): string {
    switch (lang) {
      case "javascript":
        return `// Welcome to the JavaScript Code Editor
console.log("Hello, World!");

// Try some calculations
const sum = 5 + 3;
console.log("5 + 3 =", sum);

// Work with arrays
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);`;
      case "python":
        return `# Welcome to the Python Code Editor
print("Hello, World!")

# Try some calculations
sum_result = 5 + 3
print(f"5 + 3 = {sum_result}")

# Work with lists
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled numbers:", doubled)

# Read input (uncomment to test)
# name = input("Enter your name: ")
# print(f"Hello, {name}!")`;
      case "java":
        return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try some calculations
        int sum = 5 + 3;
        System.out.println("5 + 3 = " + sum);
        
        // Work with arrays
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Original numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Read input (uncomment to test)
        // Scanner scanner = new Scanner(System.in);
        // System.out.print("Enter your name: ");
        // String name = scanner.nextLine();
        // System.out.println("Hello, " + name + "!");
        // scanner.close();
    }
}`;
      default:
        return '// Welcome to the Code Editor\nconsole.log("Hello, World!");';
    }
  }

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/admin/auth");
      return;
    }
    loadSavedSnippets();
  }, [user, isLoaded, router]);

  const loadSavedSnippets = async () => {
    try {
      const response = await fetch("/api/admin/code-snippets");
      if (response.ok) {
        const data = await response.json();
        setSavedSnippets(data.snippets || []);
      }
    } catch (error) {
      console.error("Error loading snippets:", error);
    }
  };
  const runCode = async () => {
    // Check if language is supported
    if (
      language !== "javascript" &&
      language !== "python" &&
      language !== "java"
    ) {
      setOutput(
        `Error: ${language} execution is not supported yet. Only JavaScript, Python, and Java are currently supported.`
      );
      return;
    }

    setIsRunning(true);
    setOutput("Running...");
    setExecutionTime(null);

    try {
      const response = await fetch("/api/admin/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          input,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        let outputText =
          result.output || "Code executed successfully (no output)";
        if (result.error) {
          outputText += "\n\nError:\n" + result.error;
        }
        setOutput(outputText);
        setExecutionTime(result.executionTime);
      } else {
        setOutput(`Error: ${result.error || "Failed to execute code"}`);
      }
    } catch (error) {
      setOutput(
        `Network Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const saveSnippet = async () => {
    if (!snippetTitle.trim()) {
      toast.error("Please enter a title for the snippet");
      return;
    }

    try {
      const response = await fetch("/api/admin/code-snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: snippetTitle,
          language,
          code,
        }),
      });

      if (response.ok) {
        toast.success("Snippet saved successfully!");
        setShowSaveModal(false);
        setSnippetTitle("");
        loadSavedSnippets();
      } else {
        toast.error("Failed to save snippet");
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
      toast.error("Failed to save snippet");
    }
  };
  const loadSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setOutput("");
    setInput("");
    setExecutionTime(null);
    toast.success(`Loaded snippet: ${snippet.title}`);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (lang: string) => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      html: "html",
      css: "css",
      json: "json",
    };
    return extensions[lang] || "txt";
  };

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
  ];

  if (!isLoaded) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    router.push("/admin/auth");
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {" "}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Code Editor</h1>
            <p className="text-gray-600 mt-1">
              Write, test, and save code snippets • Supports JavaScript, Python,
              and Java execution
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={downloadCode}
              className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Download code"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>{" "}
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isRunning
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : language === "javascript" ||
                    language === "python" ||
                    language === "java"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
              title={
                language === "javascript" ||
                language === "python" ||
                language === "java"
                  ? `Execute ${language} code`
                  : `${language} execution not supported yet`
              }
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning
                ? "Running..."
                : language === "javascript" ||
                  language === "python" ||
                  language === "java"
                ? "Run Code"
                : "Not Supported"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Saved Snippets Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Saved Snippets
              </h3>
              <div className="space-y-2">
                {savedSnippets.length === 0 ? (
                  <p className="text-gray-500 text-sm">No saved snippets</p>
                ) : (
                  savedSnippets.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => loadSnippet(snippet)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {snippet.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {snippet.language}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-4">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Language
                  </label>{" "}
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setLanguage(newLang);
                      setCode(getDefaultCode(newLang));
                      setOutput("");
                      setInput("");
                      setExecutionTime(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-96">
                <MonacoEditor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>{" "}
            {/* Input Section */}
            {(language === "python" || language === "java") && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Input</h3>
                  <p className="text-sm text-gray-500">
                    Provide input for your program (if needed)
                  </p>
                </div>
                <div className="p-4">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter input for your program..."
                  />
                </div>
              </div>
            )}
            {/* Output */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Output</h3>
                {executionTime !== null && (
                  <span className="text-sm text-gray-500">
                    Executed in {executionTime}ms
                  </span>
                )}
              </div>
              <div className="p-4">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto min-h-[100px] whitespace-pre-wrap">
                  {output || 'Click "Run" to execute your code...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Save Code Snippet
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="snippetTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="snippetTitle"
                    value={snippetTitle}
                    onChange={(e) => setSnippetTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter snippet title"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSnippet}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
