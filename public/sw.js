importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js'
);

const CACHE_NAME = 'product-cache-v1';
const DATA_URL = 'https://heisse-preise.io/data/latest-canonical.json';
const CACHE_EXPIRY_HOURS = 24; // Cache expiry in hours

// Helper to check if cached data is expired
async function isCacheExpired() {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(DATA_URL);

    if (!cachedResponse) return true;

    const dateHeader = cachedResponse.headers.get('date');
    const cacheTime = dateHeader ? new Date(dateHeader).getTime() : 0;
    const currentTime = new Date().getTime();

    return (currentTime - cacheTime) > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
}

// Cache product data on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch(DATA_URL).then((response) => {
                cache.put(DATA_URL, response.clone());
            });
        })
    );
});

// Fetch and cache product data if expired
self.addEventListener('fetch', (event) => {
    if (event.request.url === DATA_URL) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const expired = await isCacheExpired();
                if (expired) {
                    return fetch(event.request).then((fetchResponse) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                } else {
                    return cache.match(event.request).then((response) => {
                        return response || fetch(event.request);
                    });
                }
            })
        );
    }
});

// Widget event listeners
self.addEventListener('widgetinstall', (event) => {
    event.waitUntil(updateWidget(event));
});

self.addEventListener('widgetresume', (event) => {
    event.waitUntil(updateWidget(event));
});

self.addEventListener('widgetclick', (event) => {
if (event.action == "updateName") {
    event.waitUntil(updateName(event));
}
});

// When the widget is uninstalled/unpinned, clean up any unnecessary
// periodic sync or widget-related state.
self.addEventListener('widgetuninstall', (event) => {});

const updateWidget = async (event) => {
// The widget definition represents the fields specified in the manifest.
    const widgetDefinition = event.widget.definition;

    // Fetch the template and data defined in the manifest to generate the payload.
    const payload = {
        template: JSON.stringify(await (await fetch(widgetDefinition.msAcTemplate)).json()),
        data: JSON.stringify(await (await fetch(widgetDefinition.data)).json()),
    };

    // Push payload to widget.
    await self.widgets.updateByInstanceId(event.instanceId, payload);
}

const updateName = async (event) => {
    const name = event.data.json().name;

    // The widget definition represents the fields specified in the manifest.
    const widgetDefinition = event.widget.definition;

    // Fetch the template and data defined in the manifest to generate the payload.
    const payload = {
        template: JSON.stringify(await (await fetch(widgetDefinition.msAcTemplate)).json()),
        data: JSON.stringify({name}),
    };

    // Push payload to widget.
    await self.widgets.updateByInstanceId(event.instanceId, payload);
}

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);