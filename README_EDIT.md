# AY TECH GLOBAL Landing Page Edit Guide

이 프로젝트는 백엔드 없이 동작하는 정적 단일 페이지 랜딩페이지입니다. 보이는 문구는 `js/content.js`, 로고/문서/문의폼 설정은 `js/config.js`에서 관리합니다.

## 파일 구조

- `index.html`: 페이지 진입점, favicon, CSS/JS 연결
- `css/tokens.css`: 색상, 폰트, 간격, radius 등 디자인 토큰
- `css/base.css`: 기본 리셋, 접근성, 전역 스타일
- `css/layout.css`: 컨테이너, 그리드, 섹션, reveal 공통 레이아웃
- `css/components.css`: 헤더, 로고, 버튼, 카드, 폼, footer, media frame
- `css/sections.css`: Hero, About, Business, Process, Cases, Network, Contact
- `css/responsive.css`: 태블릿/모바일 반응형 조정
- `js/content.js`: KO/EN/ZH 실제 카피 데이터
- `js/config.js`: 로고, favicon, 회사소개서, 문의폼 endpoint 설정
- `js/render.js`: 콘텐츠 데이터를 HTML로 렌더링
- `js/i18n.js`: 언어 선택과 저장
- `js/form.js`: 문의폼 validation, endpoint 전송, mailto fallback
- `js/motion.js`: sticky header, reveal, anchor scroll, 모바일 메뉴
- `js/hero-visual.js`: 현재는 호환용 no-op 파일이며 로드하지 않음
- `assets/logos/brand/`: AY TECH GLOBAL Horizontal / Master / Mono 로고
- `assets/logos/`: AST 보조 로고
- `assets/favicons/`: favicon, apple-touch-icon, web manifest 아이콘
- `assets/docs/`: 회사소개서 다운로드 파일
- `assets/cases/`: 대표 사례 이미지 추가 위치
- `assets/images/`: About/Network 등 일반 이미지 추가 위치

## 로고 교체 방법

새 로고는 용도별로 분리되어 있습니다.

```js
logos: {
  horizontal: "assets/logos/brand/logo-horizontal-lockup-cropped.png",
  master: "assets/logos/brand/logo-master.png",
  monoLight: "assets/logos/brand/logo-mono-light.png",
  main: "assets/logos/brand/logo-horizontal-lockup-cropped.png",
  astWide: "assets/logos/logo-ast-wide.png",
  astSquare: "assets/logos/logo-ast-square.png"
}
```

- Header / 메인 브랜드 표시: `horizontal` (`logo-horizontal-lockup-cropped.png` 권장)
- About 브랜드 미디어: `horizontal`
- Favicon 원본: `master`
- Footer / 어두운 배경 1색 활용: `monoLight`
- AST 보조 브랜드: `astWide`, `astSquare`

새 파일을 같은 경로로 덮어쓰거나, `js/config.js`의 경로만 바꾸면 됩니다.

## Favicon 교체 방법

1. 새 Master mark를 `assets/logos/brand/logo-master.png`에 넣습니다.
2. 아래 명령으로 favicon 파일을 다시 생성합니다.

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path

src = Path("assets/logos/brand/logo-master.png")
out = Path("assets/favicons")
img = Image.open(src).convert("RGBA")
bbox = img.getchannel("A").getbbox()
if bbox:
    img = img.crop(bbox)
side = max(img.size)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.alpha_composite(img, ((side - img.width) // 2, (side - img.height) // 2))
for size, name in [(16, "favicon-16.png"), (32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    canvas.resize((size, size), Image.Resampling.LANCZOS).save(out / name, optimize=True)
canvas.save(out / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
PY
```

`index.html`은 `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `site.webmanifest`를 참조합니다.

## 회사소개서 PDF 연결 방법

현재 다운로드 버튼은 제공된 2025년 회사소개서 PPTX에 연결되어 있습니다. PDF로 교체하려면 파일을 `assets/docs/`에 넣고 `js/config.js`를 수정합니다.

```js
companyProfile: {
  href: "assets/docs/ay-tech-global-company-profile.pdf",
  fileName: "AY-TECH-GLOBAL-company-profile.pdf"
}
```

## 언어별 카피 수정 방법

모든 표시 문구는 `js/content.js`의 `ko`, `en`, `zh` 객체에 들어 있습니다.

- 메뉴: `nav`
- Hero: `hero`
- 회사 소개: `about`
- 사업 영역: `services`
- 진행 방식: `process`
- 대표 사례: `cases`
- 협력 네트워크: `network`
- 문의폼: `contact`
- Footer: `footer`

언어 전환 확인:

```text
http://127.0.0.1:4174/?lang=ko
http://127.0.0.1:4174/?lang=en
http://127.0.0.1:4174/?lang=zh
```

선택한 언어는 브라우저 localStorage에 저장됩니다.

## 사례 이미지/설명 교체 방법

사례 문구는 `js/content.js`의 각 locale 안 `cases.items`에서 수정합니다.

```js
cases: {
  items: [
    {
      category: "Investment",
      title: "아난티 1804억 투자유치",
      desc: "상세 설명 및 증빙 이미지 업데이트 예정"
    }
  ]
}
```

사례 이미지는 `assets/cases/`에 넣은 뒤 `js/config.js`의 `assets.media.cases` 배열에 순서대로 연결합니다.

```js
media: {
  cases: [
    "assets/cases/ananti-investment.jpg",
    "assets/cases/pnu-china-center.jpg",
    "assets/cases/technology-transfer.jpg"
  ]
}
```

이미지가 비어 있으면 현재처럼 의도된 media placeholder가 표시됩니다.

## About / Network 이미지 연결 방법

이미지를 `assets/images/`에 넣은 뒤 `js/config.js`에서 연결합니다.

```js
media: {
  about: "assets/images/about-meeting.jpg",
  network: "assets/images/network-event.jpg"
}
```

이미지가 비어 있으면 섹션별 media frame placeholder가 표시됩니다.

## 협력 네트워크 텍스트/로고 추가 방법

네트워크 문구는 `js/content.js`의 `network.groups`에서 수정합니다. 현재는 공개 범위가 확정되지 않은 상태를 고려해 텍스트 기반 카드로 구성했습니다.

로고 그리드를 추가하려면 `assets/logos/partners/`에 로고를 넣고, `network.logos` 배열을 만든 뒤 `js/render.js`의 `renderNetwork()`에 렌더링 블록을 추가하면 됩니다.

## 문의폼 endpoint 연결 방법

현재는 endpoint가 비어 있어 `mailto:ayt@aytech-global.com` fallback으로 동작합니다. 폼 수신 서비스를 연결하려면 `js/config.js`의 `form.endpoint`를 채웁니다.

```js
form: {
  endpoint: "https://example.com/form-endpoint",
  method: "POST",
  recipientEmail: "ayt@aytech-global.com",
  subjectPrefix: "[AY TECH GLOBAL 문의]"
}
```

endpoint가 설정되면 `form.js`가 JSON 방식으로 POST 요청을 보냅니다.

## Hero 성능 메모

Hero의 기존 canvas / pointer tracking / requestAnimationFrame 기반 dot simulation은 제거했습니다. 현재 Hero는 CSS gradient, line layer, static visual composition, 매우 느린 opacity/transform animation만 사용합니다. `prefers-reduced-motion` 환경에서는 전역 설정에 따라 애니메이션이 사실상 비활성화됩니다.

## 로컬 실행

정적 파일이므로 간단한 서버에서 바로 실행할 수 있습니다.

```bash
python3 -m http.server 4174
```

브라우저에서 `http://127.0.0.1:4174/`를 열면 됩니다.
