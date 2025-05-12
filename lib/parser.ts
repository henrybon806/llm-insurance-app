export async function getText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error parsing file: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return data.text;
}