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
                text: `이 이미지는 공연/뮤지컬/드라마 캐스팅 보드입니다. 다음 정보를 정확하게 추출해주세요:

1. 공연 제목 (있다면)
2. 공연 기간 (있다면)
3. 역할 이름들 (라이토, L, 렘 등)
4. 각 공연 일정 (날짜, 요일, 시간)
5. 각 공연별 출연 배우 리스트

다음 JSON 형식으로만 응답해주세요 (다른 텍스트 없이):
{
  "title": "공연 제목",
  "period": "공연 기간",
  "roles": ["역할1", "역할2", "역할3"],
  "schedule": [
    {
      "date": "7월 26일",
      "day": "수",
      "time": "14:30",
      "cast": ["배우1", "배우2", "배우3"]
    }
  ],
  "note": "하단 주석 (있다면)"
}

주의사항:
- roles 배열에는 역할 이름만 (날짜/일정 제외)
- cast 배열은 roles 순서와 동일하게 매칭
- JSON만 출력 (마크다운 백틱 없이)`,
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
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
