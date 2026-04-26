/* Service Worker for PWA - 최소 구현
   PWA 설치 가능 조건 충족용. 캐싱 안 하고 항상 네트워크에서 받아 최신 버전 보장.
   업데이트 시 별도 캐시 정리 불필요. */
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(e) {
  /* 항상 네트워크 우선 (캐시 안 함) - 최신 코드 항상 받기 */
  e.respondWith(fetch(e.request).catch(function() {
    return new Response('오프라인 상태입니다.', { status: 503 });
  }));
});
