export const prompt = `
You need to extract the name of the primary insured party from claim documents whether it be a person or organization.
The name may refer to a person or an organization.
Look for labels such as "Insured", "Insured Party", or similar.
If multiple companies are mentioned, choose the one clearly identified as the primary insured.
If no name organization is found, return exactly: "Unknown"
Return ONLY the name. No quotes, no punctuation, no formatting.
`;

export async function getPrimaryInsuredFromText(text: string): Promise<string> {
  {/*
  This function sends a request to the OpenAI API to extract the primary insured name from the provided text.
  It uses the GPT-4o model and a specific prompt to guide the model's response.
  The function returns the extracted name or "Unknown" if no name is found.
  */}
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
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