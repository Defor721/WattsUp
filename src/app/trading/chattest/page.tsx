"use client";

import { useState } from "react";

function Page() {
  const [text, setText] = useState("face");
  const [embedding, setEmbedding] = useState(null);

  async function generate() {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {
              source_sentence: "What is Hugging Face?",
              sentences: [
                "Tell me about Hugging Face.",
                "What is Pinecone?",
                "Explain machine learning.",
              ],
            },
          }), // `inputs` 키에 문자열 전달
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Embedding Generated:", data);
        setEmbedding(data);
      } else {
        console.error("API Error:", data.error || data);
      }
    } catch (error) {
      console.error("Error generating embedding:", error);
    }
  }

  return (
    <div>
      <h1>임베딩 테스트</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to embed"
      />
      <button onClick={generate}>Generate Embedding</button>
      {embedding && (
        <div>
          <h2>Embedding Result:</h2>
          <pre>{JSON.stringify(embedding, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Page;
