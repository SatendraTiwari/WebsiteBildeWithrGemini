import { GenAiCode } from "@/configs/AiModel"
import { NextResponse } from "next/server";

const buildStructuredFallbackProject = (parsedOutput) => {
    const safeData = parsedOutput && typeof parsedOutput === "object" ? parsedOutput : {};
    const projectTitle = safeData?.projectTitle || safeData?.dashboardName || "Generated Project";
    const explanation =
        safeData?.explanation ||
        "The model returned structured data without a files map, so a renderable preview project was generated automatically.";

    const embeddedData = JSON.stringify(safeData, null, 2).replace(/`/g, "\\`");
    const serializedTitle = JSON.stringify(projectTitle);
    const serializedExplanation = JSON.stringify(explanation);
    const appCode = `const generatedData = ${embeddedData};\nconst projectTitle = ${serializedTitle};\nconst projectExplanation = ${serializedExplanation};\n\nexport default function App() {\n  const sections = generatedData?.sections || [];\n\n  return (\n    <main className=\"min-h-screen bg-slate-950 text-slate-100 p-6\">\n      <div className=\"max-w-5xl mx-auto space-y-6\">\n        <header>\n          <h1 className=\"text-3xl font-bold\">{projectTitle}</h1>\n          <p className=\"text-slate-300 mt-2\">{projectExplanation}</p>\n        </header>\n\n        <section className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          {sections.map((section, index) => (\n            <article key={section?.id || index} className=\"rounded-xl border border-slate-700 bg-slate-900 p-4\">\n              <h2 className=\"font-semibold text-lg\">{section?.title || \"Section\"}</h2>\n              <p className=\"text-slate-400 text-sm mt-1\">Layout: {section?.layout || \"n/a\"}</p>\n              <p className=\"text-slate-300 text-sm mt-2\">Widgets: {Array.isArray(section?.widgets) ? section.widgets.length : 0}</p>\n            </article>\n          ))}\n        </section>\n\n        <section className=\"rounded-xl border border-slate-700 bg-slate-900 p-4\">\n          <h3 className=\"font-semibold mb-2\">Raw Model Output</h3>\n          <pre className=\"text-xs whitespace-pre-wrap text-slate-300\">{JSON.stringify(generatedData, null, 2)}</pre>\n        </section>\n      </div>\n    </main>\n  );\n}\n`;

    return {
        projectTitle,
        explanation,
        files: {
            "/App.js": { code: appCode },
            "/index.js": {
                code: `import React, { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`,
            },
        },
        generatedFiles: ["/App.js", "/index.js"],
        fallback: true,
    };
};

export async function POST(req) {
    const { prompt } = await req.json()

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    try {
        const result = await GenAiCode.sendMessage(prompt)

        const resp = result.response.text();
        const parsed = JSON.parse(resp);

        if (!parsed?.files || typeof parsed.files !== "object") {
            return NextResponse.json(buildStructuredFallbackProject(parsed));
        }

        return NextResponse.json(parsed)
    } catch (error) {
        const status = Number(error?.status) || 500;
        if (status === 429) {
            return NextResponse.json({
                projectTitle: "Fallback Starter",
                explanation:
                    "Gemini quota is currently exhausted, so a local starter template was returned.",
                files: {
                    "/App.js": {
                        code: `export default function App() {\n  return (\n    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">\n      <section className="max-w-xl text-center space-y-4">\n        <h1 className="text-3xl font-bold">CreateFy Fallback Mode</h1>\n        <p className="text-slate-300">Gemini quota is exhausted right now, but your app is running correctly.</p>\n        <p className="text-slate-400 text-sm">Enable Gemini quota/billing to get full AI code generation.</p>\n      </section>\n    </main>\n  );\n}\n`,
                    },
                },
                generatedFiles: ["/App.js"],
                fallback: true,
            });
        }

        const message = error?.message || "Failed to generate code response.";

        return NextResponse.json({ error: message }, { status });
    }
}
