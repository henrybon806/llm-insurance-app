import stringSimilarity from 'string-similarity';

type Company = {
  internalId: string;
  name: string;
};

type MatchResult = Company & { match: number };

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[,\.]/g, '')
    .replace(
      /\b(llc|inc|corp|co|ltd|company|corporation|partners|group|services|holdings)\b/g,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}

export function findBestMatch(
  input: string,
  companies: Company[]
): MatchResult | 'No match' {
  const normalizedInput = normalize(input);
  let best: MatchResult | null = null;
  let bestScore = 0;

  for (const company of companies) {
    const score = stringSimilarity.compareTwoStrings(
      normalizedInput,
      normalize(company.name)
    );

    if (score > bestScore) {
      bestScore = score;
      best = { ...company, match: score };
    }
  }

  return bestScore >= 0.8 && best ? best : 'No match';
}