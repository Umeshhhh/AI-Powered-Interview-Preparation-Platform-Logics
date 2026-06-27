import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"] || "";
const endpoint = "https://models.github.ai/inference";
const model = "meta/Llama-4-Scout-17B-16E-Instruct";

export async function parseResumeToStructuredData({prompt} : {prompt: string}) {

    const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
    );

    const response = await client.path("/chat/completions").post({
        body: {
        messages: [
            { role:"system", content: "" },
            { role:"user", content: `${prompt}` }
        ],
        temperature: 0.8,
        top_p: 0.1,
        max_tokens: 2048,
        model: model
        }
    });

    if (isUnexpected(response)) {
        throw response.body.error;
    }

    return response.body.choices[0].message.content;
}

