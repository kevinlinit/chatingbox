export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log(`Received request for URL: ${request.url}`);

    if (url.pathname.startsWith('/v1/')) {
      url.host = 'copilot.bawcat.wiki';
      const headers = new Headers(request.headers);
      headers.set('Accept', '*/*');
      headers.set('Accept-Encoding', 'gzip,deflate,br');
      headers.set('Content-Type', 'application/json');
      headers.set('Editor-Plugin-Version', 'copilot-intellij/1.5.11.5872');
      headers.set('Editor-Version', 'JetBrains-GO/241.18034.61');
      headers.set('Openai-Intent', 'copilot-ghost');
      headers.set('Openai-Organization', 'github-copilot');
      headers.set('User-Agent', 'GithubCopilot/1.207.0');
      headers.set('Vscode-Machineid', 'b5265e3c55fa4ef610974f0a0b40e1f5b113a4bd1e95acea39194967a9a2aa1e');
      headers.set('Vscode-Sessionid', 'dea3b9f2-198f-481d-b63d-6186772786f01719451563061');
      headers.set('X-Forwarded-For', '59.174.150.29');
      headers.set('X-Forwarded-Proto', 'https');
      headers.set('X-Forwarded-Scheme', 'https');
      headers.set('X-Real-Ip', '59.174.150.29');
      headers.set('X-Request-Id', '061df0eb-deef-40af-b07a-bc7bf9c90a0f');
      request = new Request(request.url, {
        method: request.method,
        headers: headers,
        body: request.body
      });
    }
  },
}