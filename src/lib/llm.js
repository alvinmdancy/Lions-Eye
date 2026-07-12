const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function invokeLLM(prompt, onChunk) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/llm-proxy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        let message = "LLM request failed";
        try {
            const data = await response.json();
            message = data.error || message;
        } catch {
            // response wasn't JSON (e.g. a plain error page), keep default message
        }
        throw new Error(message);
    }

    if (!response.body) {
        throw new Error("No response body received from server");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        if (onChunk) onChunk(fullText);
    }

    return fullText;
}
