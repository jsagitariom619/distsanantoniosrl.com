const CACHE="san-antonio-web-v2";
const ASSETS=["/styles.css","/js/app.js","/js/config.js","/data/catalog.js","/assets/logo-san-antonio.svg","/assets/hero-distribucion.png","/manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const isDocument=e.request.mode==="navigate"||e.request.destination==="document";
  if(isDocument){
    e.respondWith(fetch(e.request).then(r=>r).catch(()=>caches.match("/index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>{
    const network=fetch(e.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r});
    return cached||network;
  }));
});