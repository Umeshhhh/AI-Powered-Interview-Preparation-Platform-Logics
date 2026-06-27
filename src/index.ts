import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import { createResumeParserPrompt } from "./prompt";
import { parseResumeToStructuredData } from "./aiService";

const resumeUploadFlow = async (filePath: string) => {

  let parser: PDFParse | undefined;

  try {
    const dataBuffer = await readFile(filePath);

    parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    const resumeText = result.text;

    const sanitizedText = resumeText.replace(/\0/g, "").trim().slice(0, 50_000);

    const prompt = createResumeParserPrompt(sanitizedText);

    const response = await parseResumeToStructuredData({prompt});

    if(!response) throw new Error("AI failed to generate response");

    const cleanResp = response.slice(4, response.length-3);

    const resumeData = JSON.parse(cleanResp);

    console.log(resumeData);

  } catch (error) {
    console.error("Error while structuring raw text to JSON: ", error);
  } finally {
    await parser?.destroy();
  }
};

void resumeUploadFlow("./data/2337512_Umesh.pdf");