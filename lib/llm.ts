export const prompt = `
Your need to extract the name of the primary insured party from claim documents whether it be a person or organization.

The name may refer to a person or an organization.
Look for labels such as "Insured", "Insured Party", or similar.
If multiple companies are mentioned, choose the one clearly identified as the primary insured.
If no name organization is found, return exactly: "Unknown"

Return ONLY the name. No quotes, no punctuation, no formatting.
`;

export async function getPrimaryInsuredFromText(text: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text }
      ],
      temperature: 0,
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Unkown";
}