import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";

interface CodeExecutionRequest {
  code: string;
  language: string;
  input?: string;
}

interface CodeExecutionResponse {
  output: string;
  error?: string;
  executionTime: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CodeExecutionResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      output: "",
      error: "Method not allowed",
      executionTime: 0,
    });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        output: "",
        error: "Unauthorized",
        executionTime: 0,
      });
    }

    const { code, language, input = "" } = req.body as CodeExecutionRequest;

    if (!code || !language) {
      return res.status(400).json({
        output: "",
        error: "Code and language are required",
        executionTime: 0,
      });
    }

    const startTime = Date.now();
    let result: { output: string; error?: string };

    switch (language.toLowerCase()) {
      case "javascript":
        result = await executeJavaScript(code);
        break;
      case "python":
        result = await executePython(code, input);
        break;
      case "java":
        result = await executeJava(code, input);
        break;
      default:
        result = {
          output: "",
          error: `Execution for ${language} is not supported yet`,
        };
    }

    const executionTime = Date.now() - startTime;

    res.status(200).json({
      output: result.output,
      error: result.error,
      executionTime,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({
      output: "",
      error: error instanceof Error ? error.message : "Internal server error",
      executionTime: 0,
    });
  }
}

async function executeJavaScript(
  code: string
): Promise<{ output: string; error?: string }> {
  try {
    const logs: string[] = [];
    const mockConsole = {
      log: (...args: any[]) =>
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        ),
      error: (...args: any[]) => logs.push("Error: " + args.join(" ")),
      warn: (...args: any[]) => logs.push("Warning: " + args.join(" ")),
    };

    // Create a safe execution context
    const func = new Function("console", code);
    func(mockConsole);

    return {
      output:
        logs.length > 0
          ? logs.join("\n")
          : "Code executed successfully (no output)",
    };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function executePython(
  code: string,
  input: string
): Promise<{ output: string; error?: string }> {
  const tempDir = os.tmpdir();
  const fileId = uuidv4();
  const filePath = path.join(tempDir, `temp_${fileId}.py`);
  const inputPath = path.join(tempDir, `input_${fileId}.txt`);

  try {
    // Write code to temporary file
    await fs.writeFile(filePath, code);

    // Write input to temporary file if provided
    if (input) {
      await fs.writeFile(inputPath, input);
    }

    return new Promise((resolve) => {
      const pythonProcess = spawn("python", [filePath], {
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 10000, // 10 second timeout
      });

      let output = "";
      let error = "";

      // Send input if provided
      if (input) {
        pythonProcess.stdin.write(input);
        pythonProcess.stdin.end();
      }

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        // Clean up temporary files
        try {
          await fs.unlink(filePath);
          if (input) await fs.unlink(inputPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }

        if (code === 0) {
          resolve({
            output: output.trim() || "Code executed successfully (no output)",
          });
        } else {
          resolve({
            output: output.trim(),
            error: error.trim() || `Process exited with code ${code}`,
          });
        }
      });

      pythonProcess.on("error", async (err) => {
        // Clean up temporary files
        try {
          await fs.unlink(filePath);
          if (input) await fs.unlink(inputPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }

        resolve({
          output: "",
          error: `Python execution error: ${err.message}. Make sure Python is installed.`,
        });
      });
    });
  } catch (error) {
    // Clean up on error
    try {
      await fs.unlink(filePath);
      if (input) await fs.unlink(inputPath);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }

    return {
      output: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute Python code",
    };
  }
}

async function executeJava(
  code: string,
  input: string
): Promise<{ output: string; error?: string }> {
  const tempDir = os.tmpdir();
  const fileId = uuidv4();

  // Extract class name from code (simple extraction)
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classNameMatch ? classNameMatch[1] : "Main";

  const filePath = path.join(tempDir, `${className}.java`);
  const classPath = path.join(tempDir, `${className}.class`);

  try {
    // Write Java code to temporary file
    await fs.writeFile(filePath, code);

    // Compile Java code
    const compileResult = await new Promise<{
      success: boolean;
      error?: string;
    }>((resolve) => {
      const compileProcess = spawn("javac", [filePath], {
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 10000,
      });

      let compileError = "";

      compileProcess.stderr.on("data", (data) => {
        compileError += data.toString();
      });

      compileProcess.on("close", (code) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: compileError });
        }
      });

      compileProcess.on("error", (err) => {
        resolve({
          success: false,
          error: `Java compilation error: ${err.message}. Make sure Java JDK is installed.`,
        });
      });
    });

    if (!compileResult.success) {
      return {
        output: "",
        error: compileResult.error || "Compilation failed",
      };
    }

    // Run Java code
    return new Promise((resolve) => {
      const javaProcess = spawn("java", ["-cp", tempDir, className], {
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 10000,
      });

      let output = "";
      let error = "";

      // Send input if provided
      if (input) {
        javaProcess.stdin.write(input);
        javaProcess.stdin.end();
      }

      javaProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      javaProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      javaProcess.on("close", async (code) => {
        // Clean up temporary files
        try {
          await fs.unlink(filePath);
          await fs.unlink(classPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }

        if (code === 0) {
          resolve({
            output: output.trim() || "Code executed successfully (no output)",
          });
        } else {
          resolve({
            output: output.trim(),
            error: error.trim() || `Process exited with code ${code}`,
          });
        }
      });

      javaProcess.on("error", async (err) => {
        // Clean up temporary files
        try {
          await fs.unlink(filePath);
          await fs.unlink(classPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }

        resolve({
          output: "",
          error: `Java execution error: ${err.message}. Make sure Java is installed.`,
        });
      });
    });
  } catch (error) {
    // Clean up on error
    try {
      await fs.unlink(filePath);
      await fs.unlink(classPath);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }

    return {
      output: "",
      error:
        error instanceof Error ? error.message : "Failed to execute Java code",
    };
  }
}
