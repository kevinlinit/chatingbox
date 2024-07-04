async function handleRequest(request) {
  const url = new URL(request.url);

  // Check if the request is a POST request
  if (request.method === "POST") {
    // Specify your target server URL
    const targetURL = 'https://copilot.bawcat.wiki' + url.pathname;

    // Optionally modify the request headers or body here
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set('Host', 'copilot.bawcat.wiki');

    // Clone the request to modify its properties
    const modifiedRequest = new Request(targetURL, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.body,
      redirect: 'follow'
    });

    try {
      // Fetch the request from the target and return the response
      const response = await fetch(modifiedRequest);

      if (url.pathname === "/login/device/code") {
        // Modify the response if the path is /login/device/code
        const responseData = await response.json();  // Assuming the response is JSON
        const modifiedBody = JSON.stringify(responseData, (key, value) =>
          typeof value === 'string' ? value.replace('copilot.bawcat.wiki', 'chatingbox.pages.dev') : value
        );

        return new Response(modifiedBody, {
          status: response.status,
          headers: response.headers
        });
      }

      return response;
    } catch (error) {
      return new Response('Error in fetching response: ' + error.message, { status: 500 });
    }
  }

  // If not a POST request, simply return the request unmodified
  return fetch(request);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
