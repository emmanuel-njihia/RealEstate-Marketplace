const isLocalhost = isLocalDevelopment(); // Define a function for development detection

function isLocalDevelopment() {
  // Implement logic to detect localhost environment (similar to original code)
  // ...
}

export async function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    try {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      const response = await fetch(swUrl);

      if (!response.ok || !response.headers.get('content-type').includes('javascript')) {
        throw new Error('Service worker not found or invalid');
      }

      const registration = await navigator.serviceWorker.register(swUrl);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = async () => {
          if (installingWorker.state === 'installed') {
            const isNewContentAvailable = navigator.serviceWorker.controller === null;
            const updateMessage = getUpdateMessage(isNewContentAvailable);
            console.log(updateMessage);

            if (config && isNewContentAvailable && config.onUpdate) {
              config.onUpdate(registration);
            }
          }
        };
      };

      if (config && config.onSuccess) {
        config.onSuccess(registration);
      }
    } catch (error) {
      console.error('Error during service worker registration:', error);
    }
  }
}

function getUpdateMessage(isNewContentAvailable) {
  if (isLocalhost) {
    return 'This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA';
  } else if (isNewContentAvailable) {
    return 'New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.';
  } else {
    return 'Content is cached for offline use.';
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => registration.unregister());
  }
}
