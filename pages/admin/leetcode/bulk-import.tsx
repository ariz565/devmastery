import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  FileSpreadsheet,
  Image,
  FileCode,
} from "lucide-react";
import toast from "react-hot-toast";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  imported: any[];
}

export default function BulkImport() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setImportResults(null);
    setPreviewData([]);
    setShowPreview(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    setImportResults(null);
    setPreviewData([]);
    setShowPreview(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  const previewFile = async (file: File) => {
    if (
      file.type.includes("excel") ||
      file.type.includes("spreadsheet") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".csv")
    ) {
      try {
        const text = await file.text();
        let data: any[] = [];

        if (file.name.endsWith(".csv")) {
          // Simple CSV parsing
          const lines = text.split("\n");
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i]
                .split(",")
                .map((v) => v.trim().replace(/"/g, ""));
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || "";
              });
              data.push(row);
            }
          }
        } else {
          // For Excel files, we'll need a library - for now, show error
          toast.error("Excel files not supported yet. Please use CSV format.");
          return;
        }

        setPreviewData(data);
        setShowPreview(true);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast.error("Failed to parse file");
      }
    } else {
      toast.error("Preview only available for CSV files");
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "EASY",
        category: "DSA",
        tags: "Array,Hash Table",
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
        problemNumber: 1,
        isPremium: false,
        acceptance: 49.5,
        frequency: "High",
        companies: "Amazon,Google,Microsoft",
        hints: "Try using a hash map to store previously seen numbers",
        followUp: "What if the array is sorted?",
        solutions: JSON.stringify([
          {
            language: "Python",
            approach: "Hash Map",
            code: "def twoSum(nums, target):\\n    seen = {}\\n    for i, num in enumerate(nums):\\n        complement = target - num\\n        if complement in seen:\\n            return [seen[complement], i]\\n        seen[num] = i",
            timeComplex: "O(n)",
            spaceComplex: "O(n)",
            explanation: "Use hash map to store seen numbers and their indices",
            isOptimal: true,
          },
        ]),
        resources: JSON.stringify([
          {
            title: "Two Sum Explanation",
            type: "VIDEO",
            url: "https://youtube.com/watch?v=example",
            description: "Detailed explanation of the two sum problem",
          },
        ]),
      },
    ];
    const csvContent = [
      Object.keys(template[0]).join(","),
      ...template.map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leetcode-problems-template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error("Please preview data before importing");
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      const response = await fetch("/api/admin/leetcode/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: previewData,
          format: "json",
        }),
      });

      if (response.ok) {
        const results = await response.json();
        setImportResults({
          success: results.imported || 0,
          failed: (results.total || 0) - (results.imported || 0),
          errors: results.errors || [],
          imported: [],
        });

        if (results.imported > 0) {
          toast.success(`Successfully imported ${results.imported} problems!`);
        }

        if (results.errors && results.errors.length > 0) {
          toast.error(
            `Failed to import some problems. Check the details below.`
          );
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Import failed");
      }
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error("Import failed");
    } finally {
      setImporting(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (
      file.type.includes("excel") ||
      file.type.includes("spreadsheet") ||
      file.name.endsWith(".xlsx")
    ) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    } else if (file.name.endsWith(".csv")) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else if (file.type.includes("image")) {
      return <Image className="w-8 h-8 text-purple-600" />;
    } else if (file.name.endsWith(".pdf")) {
      return <FileText className="w-8 h-8 text-red-600" />;
    } else {
      return <FileCode className="w-8 h-8 text-gray-600" />;
    }
  };

  if (!isLoaded) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bulk Import Problems
            </h1>
            <p className="text-gray-600 mt-1">
              Import problems from Excel, CSV, PDF, or image files
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            📋 Import Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h3 className="font-medium mb-2">📊 Excel/CSV Format:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use provided template for best results</li>
                <li>Include columns: title, description, difficulty</li>
                <li>Solutions as JSON string in 'solutions' column</li>
                <li>Tags as comma-separated values</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">🖼️ Images/PDFs:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>OCR will extract text automatically</li>
                <li>Clear, high-resolution images work best</li>
                <li>Review extracted data before importing</li>
                <li>Manual editing may be required</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Upload Files
          </h2>

          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supports: .xlsx, .csv, .pdf, .jpg, .png, .webp
            </p>{" "}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.csv,.pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select files for import"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </button>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => previewFile(file)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </button>{" "}
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                        title="Remove file"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Button */}
          {files.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleImport}
                disabled={importing}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Problems
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-6xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">File Preview</h2>{" "}
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close preview"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh]">
                {previewData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 10).map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate"
                              >
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 10 && (
                      <p className="mt-4 text-sm text-gray-600">
                        Showing first 10 rows of {previewData.length} total rows
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No data to preview</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Import Results */}
        {importResults && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Import Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    Successful Imports
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {importResults.success}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900">
                    Failed Imports
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  {importResults.failed}
                </p>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Errors:</h3>
                <ul className="space-y-1 text-sm text-red-700">
                  {importResults.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => router.push("/admin/leetcode")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Problems
              </button>
              <button
                onClick={() => {
                  setFiles([]);
                  setImportResults(null);
                }}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Import More
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
