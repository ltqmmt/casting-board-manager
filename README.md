# casting-board-manager

# 🎭 AI 캐스팅 보드 자동 관리 시스템

뮤지컬/공연 캐스팅 보드 이미지를 업로드하면 AI가 자동으로 분석하여 배우별 출연 일정을 관리할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📸 **이미지 자동 분석**: Claude AI가 캐스팅 보드 이미지를 읽어 자동으로 데이터화
- 🎨 **표 형식 표시**: 원본과 동일한 표 형식으로 깔끔하게 표시
- 🔍 **배우별 필터링**: 배우를 선택하면 해당 배우 출연 회차만 표시
- 📊 **통계 정보**: 총 출연 횟수, 첫/마지막 공연 정보 자동 계산
- 🎯 **인터랙티브 UI**: 표에서 직접 배우 클릭으로 필터 가능

## 🚀 사용 방법

1. `ai-casting-board-table.html` 파일을 브라우저에서 열기
2. 캐스팅 보드 이미지 업로드 (드래그 앤 드롭 또는 클릭)
3. AI가 자동으로 분석 완료!
4. 배우 버튼을 클릭하여 출연 일정 확인

## 🛠️ 기술 스택

- HTML5 + Tailwind CSS
- Vanilla JavaScript
- Claude AI API (Sonnet 4)
- Google Fonts (Noto Sans KR)

## 📷 스크린샷

As-Is:
![캐스팅보드_(단순ver) 데스노트](https://github.com/user-attachments/assets/b47c7fb8-be8b-4ccc-aa6e-6f57f456d8c7)


To-Be:
<img width="1072" height="946" alt="image" src="https://github.com/user-attachments/assets/7d6d69e3-806b-458b-b466-d7ce211c4f87" />
<img width="1084" height="843" alt="image" src="https://github.com/user-attachments/assets/f804719e-b731-4422-8522-c76ff33642f5" />



## 📄 라이선스

MIT License

## 🙏 thanks

my-casting-app/
├── index.html # 기존 HTML 파일
├── api/
│ └── analyze.js # Serverless Function
├── vercel.json # Vercel 설정 (선택)
└── package.json # 의존성 관리
