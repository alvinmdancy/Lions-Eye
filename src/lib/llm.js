const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function invokeLLM(prompt) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/llm-proxy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(data.error || "LLM request failed");
    }

    return data.text;
}
