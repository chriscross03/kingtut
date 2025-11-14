import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { QuestionType } from "@/generated/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GenerateQuestionsRequest {
  topic: string;
  difficulty: string;
  count: number;
  questionType: QuestionType;
  additionalContext?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface SuccessResponse {
  success: true;
  questions: any[];
  count: number;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check
    // if (session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const body: GenerateQuestionsRequest = await request.json();
    const { topic, difficulty, count, questionType, additionalContext } = body;

    // Validate required fields
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (!difficulty) {
      return NextResponse.json(
        { error: "Difficulty level is required" },
        { status: 400 }
      );
    }

    if (!count) {
      return NextResponse.json(
        { error: "Question count is required" },
        { status: 400 }
      );
    }

    if (!questionType) {
      return NextResponse.json(
        { error: "Question type is required" },
        { status: 400 }
      );
    }

    if (count < 1 || count > 50) {
      return NextResponse.json(
        { error: "Count must be between 1 and 50" },
        { status: 400 }
      );
    }

    // Validate question type
    const validQuestionTypes: QuestionType[] = [
      "MULTIPLE_CHOICE",
      "TRUE_FALSE",
      "SHORT_ANSWER",
    ];
    if (!validQuestionTypes.includes(questionType)) {
      return NextResponse.json(
        { error: "Invalid question type" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Create prompt based on question type
    let prompt = "";

    if (questionType === "MULTIPLE_CHOICE") {
      prompt = `Generate ${count} ${difficulty} level multiple-choice questions about "${topic}".
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Requirements:
- Each question should be clear and unambiguous
- Provide exactly 4 answer options
- Only ONE option should be correct
- Include a brief explanation for why the answer is correct
- Questions should be educational and appropriate for ${difficulty} difficulty level

Return ONLY a valid JSON array with this EXACT structure (no markdown, no backticks, no preamble):
[
  {
    "questionText": "The actual question text here?",
    "options": [
      { "optionText": "First option", "isCorrect": false },
      { "optionText": "Second option", "isCorrect": true },
      { "optionText": "Third option", "isCorrect": false },
      { "optionText": "Fourth option", "isCorrect": false }
    ],
    "explanation": "Brief explanation of why the correct answer is correct"
  }
]

IMPORTANT: Only one option per question should have "isCorrect": true`;
    } else if (questionType === "TRUE_FALSE") {
      prompt = `Generate ${count} ${difficulty} level true/false questions about "${topic}".
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Requirements:
- Each statement should be clear and unambiguous
- Include a brief explanation
- Questions should be educational and appropriate for ${difficulty} difficulty level

Return ONLY a valid JSON array with this EXACT structure (no markdown, no backticks, no preamble):
[
  {
    "questionText": "The statement to evaluate",
    "options": [
      { "optionText": "True", "isCorrect": true },
      { "optionText": "False", "isCorrect": false }
    ],
    "explanation": "Brief explanation"
  }
]

IMPORTANT: Only one option should have "isCorrect": true`;
    } else if (questionType === "SHORT_ANSWER") {
      prompt = `Generate ${count} ${difficulty} level short-answer questions about "${topic}".
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Requirements:
- Questions should have clear, specific answers
- Provide multiple acceptable answer variations
- Include a brief explanation
- Questions should be educational and appropriate for ${difficulty} difficulty level

Return ONLY a valid JSON array with this EXACT structure (no markdown, no backticks, no preamble):
[
  {
    "questionText": "The question text here?",
    "options": [
      { "optionText": "answer1", "isCorrect": true },
      { "optionText": "answer 1", "isCorrect": true },
      { "optionText": "Answer One", "isCorrect": true }
    ],
    "explanation": "Brief explanation"
  }
]

IMPORTANT: All options should have "isCorrect": true for short answer questions`;
    }

    console.log("Generating questions with Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Raw Gemini response:", text);

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\n?/, "")
        .replace(/\n?```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    // Parse JSON
    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", cleanedText);
      return NextResponse.json(
        {
          error: "Failed to parse generated questions",
          details: "The AI returned invalid JSON format",
        },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Generated questions is not an array" },
        { status: 500 }
      );
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions were generated" },
        { status: 500 }
      );
    }

    // Validate each question structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText) {
        return NextResponse.json(
          { error: `Question ${i + 1}: Missing question text` },
          { status: 500 }
        );
      }

      if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
        return NextResponse.json(
          { error: `Question ${i + 1}: Missing or invalid options` },
          { status: 500 }
        );
      }

      // Validate each option has required fields
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.optionText) {
          return NextResponse.json(
            {
              error: `Question ${i + 1}, Option ${j + 1}: Missing option text`,
            },
            { status: 500 }
          );
        }
        if (typeof opt.isCorrect !== "boolean") {
          return NextResponse.json(
            {
              error: `Question ${i + 1}, Option ${
                j + 1
              }: isCorrect must be a boolean`,
            },
            { status: 500 }
          );
        }
      }

      const hasCorrectAnswer = q.options.some((opt: any) => opt.isCorrect);
      if (!hasCorrectAnswer) {
        return NextResponse.json(
          {
            error: `Question ${
              i + 1
            }: At least one option must be marked as correct`,
          },
          { status: 500 }
        );
      }

      // Validate single correct answer for MULTIPLE_CHOICE and TRUE_FALSE
      if (
        (questionType === "MULTIPLE_CHOICE" || questionType === "TRUE_FALSE") &&
        q.options.filter((opt: any) => opt.isCorrect).length > 1
      ) {
        return NextResponse.json(
          {
            error: `Question ${
              i + 1
            }: Only one option can be correct for ${questionType} questions`,
          },
          { status: 500 }
        );
      }
    }

    console.log(
      `Successfully generated and validated ${questions.length} questions`
    );

    return NextResponse.json(
      {
        success: true,
        questions,
        count: questions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
