export async function translateText(
  sourceLang: string,
  targetLang: string,
  text: string
): Promise<string | null> {
  const encodedText = encodeURIComponent(text);
  const url = `https://grubk-lingvatranslate.vercel.app/api/v1/${sourceLang}/${targetLang}/${encodedText}`;
  //const url = `https://grubk-lingvatranslate.vercel.app/api/v1/en/fr/greetings`;

  console.log("Translation URL:", url); // Debug log to verify URL format

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Translation API error: ${res.status}`);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const textBody = await res.text();
      console.error("Expected JSON but got:", textBody);
      return null;
    }

    const data = await res.json();
    console.log("Translation API response:", data);

    // Adjust depending on actual response structure:
    return data.translation || data.translatedText || null;
  } catch (error) {
    console.error("Translation fetch failed:", error);
    return null;
  }
}
