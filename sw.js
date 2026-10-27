/* Service Worker for PWA - 최소 구현
   PWA 설치 가능 조건 충족용. 캐싱 안 하고 항상 네트워크에서 받아 최신 버전 보장.

   [변경] 페이지(HTML) 요청은 매번 서버에 "바뀌었는지" 확인(no-cache 재검증).
   - 변경 없음: 서버가 304(변경 없음)만 응답 → 휴대폰에 있던 파일 사용 (전송량 거의 0)
   - 변경 있음: 새 index.html 즉시 수신
   이전: fetch(e.request) → GitHub Pages의 캐시 헤더(max-age=600) 때문에
         새 index.html을 올려도 최대 10분 이상 예전 페이지가 열리는 문제.
   이미지·라이브러리 등 나머지 요청은 기존처럼 처리(속도 유지). */
var SW_VERSION = '2026-10-27';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  var req = e.request;
  var isPage = req.mode === 'navigate' ||
    (req.method === 'GET' && (req.headers.get('accept') || '').indexOf('text/html') >= 0);

  if (isPage) {
    /* navigate 모드 Request에는 옵션을 붙일 수 없어 URL로 새로 요청 */
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .catch(function() {
          return new Response('오프라인 상태입니다.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        })
    );
    return;
  }

  e.respondWith(fetch(req).catch(function() {
    return new Response('오프라인 상태입니다.', { status: 503 });
  }));
});
