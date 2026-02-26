const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing Gemini API key. Set GEMINI_API_KEY (preferred) in .env.local."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "text/plain",
};

const codeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export const GenAiCode = model.startChat({
  generationConfig: codeGenerationConfig,
  history: [],
});

     
  
  // async function run() {
  //   const chatSession = model.startChat({
  //     generationConfig,
  //     history: [
  //     ],
  //   });
  
  //   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  //   // TODO: Following code needs to be updated for client-side apps.
  //   const candidates = result.response.candidates;
  //   for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
  //     for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
  //       const part = candidates[candidate_index].content.parts[part_index];
  //       if(part.inlineData) {
  //         try {
  //           const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
  //           fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
  //           console.log(`Output written to: ${filename}`);
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       }
  //     }
  //   }
  //   console.log(result.response.text());
  // }
  
  // run();
