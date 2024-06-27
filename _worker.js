export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log(`Received request for URL: ${request.url}`);

    if (url.pathname.startsWith('/v1/')) {
      url.host = 'api.oaifree.com';
      if (['POST', 'PUT'].includes(request.method)) {
        const reqBody = await request.json();
        if (reqBody && reqBody.model) {
          reqBody.model = reqBody.model.replace('gpt-4-gizmo-', '');
          request = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(reqBody)
          });
        }
      }
    } else if (['/backend-api/', '/public-api/'].some(path => url.pathname.startsWith(path))) {
      url.host = 'chat.oaifree.com';
      url.pathname = `/dad04481-fa3f-494e-b90c-b822128073e5${url.pathname}`;
    } else if (['/token', '/static', '/cdn-cgi'].some(path => url.pathname.startsWith(path))) {
      url.host = 'chat.oaifree.com';
      return fetch(url.toString(), request);
    } else {
      url.host = 'chat.oaifree.com';
    }

    const incomingApiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (incomingApiKey !== env.API_KEY) {
      console.error('Invalid API Key');
      return new Response('Invalid API Key', { status: 401 });
    }

    const tokens = env.ACCESS_TOKEN.split(',');
    let retryCount = 0;

    while (retryCount < tokens.length) {
      const headers = new Headers(request.headers);
      let authorizationKey = `Bearer ${tokens[retryCount]}`;
      if (env.CHATGPT_ACCOUNT_ID) {
        authorizationKey += `,${env.CHATGPT_ACCOUNT_ID}`;
      }
      headers.set('Authorization', authorizationKey);

      for (const key of headers.keys()) {
        if (key.toLowerCase().startsWith('x-') && key !== 'x-api-key') {
          headers.delete(key);
        }
      }

      url.protocol = 'https:';
      url.port = '';
      const modifiedRequest = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body,
      });

      console.log(`Attempting fetch with token index ${retryCount}`);
      const response = await fetch(modifiedRequest);
      if (response.ok) {
        console.log(`Request successful with token index ${retryCount}`);
        return response;
      }

      console.warn(`Request failed with token index ${retryCount}, status: ${response.status}`);
      retryCount++;
    }

    console.error('All tokens failed after retries');
    return new Response('All tokens failed', { status: 401 });
  },
};
