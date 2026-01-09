const assetCache = new Map();
const fetchPromises = new Map();

export const preloadAsset = (url) => {
    if (!url) return Promise.resolve(null);
    if (assetCache.has(url)) return Promise.resolve(assetCache.get(url));
    if (fetchPromises.has(url)) return fetchPromises.get(url);

    const promise = fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return response.arrayBuffer();
        })
        .then(data => {
            assetCache.set(url, data);
            return data;
        })
        .catch(err => {
            console.error("Failed to preload asset:", url, err);
            return null;
        });

    fetchPromises.set(url, promise);
    return promise;
};

export const getAsset = (url) => {
    return assetCache.get(url);
};
