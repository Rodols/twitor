//import sw-utils
importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v4";
const DYNAMIC_CACHE = "dynamic-v2";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHEL = [
  "/twitor/index.html",
  "/twitor/css/style.css",
  "/twitor/img/favicon.ico",
  "/twitor/img/avatars/hulk.jpg",
  "/twitor/img/avatars/ironman.jpg",
  "/twitor/img/avatars/spiderman.jpg",
  "/twitor/img/avatars/thor.jpg",
  "/twitor/img/avatars/wolverine.jpg",
  "/twitor/js/app.js",
  "/twitor/js/sw-utils.js"
];

const APP_SHEL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "/twitor/css/animate.css",
  "/twitor/js/libs/jquery.js"
];

self.addEventListener("install", e => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHEL));
  const cacheInmutable = caches
    .open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHEL_INMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("activate", e => {
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }
      if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener("fetch", e => {
  const respuesta = caches.match(e.request).then(res => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then(newRes => {
        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
      });
    }
    console.log(res);
  });

  e.respondWith(respuesta);
});
