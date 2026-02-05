// api/analyze.js
export default async function handler(req, res) {
  // CORS 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: "imageData is required" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageData,
                },
              },
              {
                type: "text",
                text: `이 이미지는 공연/뮤지컬/드라마 캐스팅 보드입니다.
아래 JSON 형식으로만 응답하세요. 다른 텍스트, 설명, 백틱 금지.

{
  "title": "공연 제목",
  "period": "공연 기간",
  "roles": ["역할1", "역할2"],
  "schedule": [
    {
      "date": "7월 26일",
      "day": "수",
      "time": "14:30",
      "cast": ["배우1", "배우2"]
    }
  ],
  "note": "하단 주석"
}

⚠️ 반드시 유효한 JSON만 출력하세요.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Anthropic API Error:", errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || "API request failed",
      });
    }

    const data = await response.json();

    /* 🔥 핵심 수정 시작 */

    // 1️⃣ Claude가 준 텍스트만 추출
    const text = data.content
      ?.filter(item => item.type === "text")
      .map(item => item.text)
      .join("\n")
      .trim();

    // 2️⃣ JSON 블록만 추출
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI 응답에서 JSON을 찾을 수 없습니다.");
    }

    // 3️⃣ 안전하게 파싱
    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (e) {
      console.error("원본 AI 텍스트:", text);
      throw new Error("AI JSON 파싱 실패");
    }

    // 4️⃣ 프론트에는 '이미 JSON인 데이터만' 전달
    return res.status(200).json({ data: parsed });

    /* 🔥 핵심 수정 끝 */

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
