// @ts-check

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('No code found in URL.', { status: 400 });
  }

  // HTMLレスポンスを生成
  const htmlContent = `
    <html>
      <head>
        <title>Spotify Auth Code</title>
      </head>
      <body>
        <h1>Your Spotify Authentication Code</h1>
        <p>Copy and paste this code back into your Discord chat:</p>
				<div>
          <code>${code}</code>
				</div>
				<button onclick="copyToClipboard()">Copy to Clipboard</button>
      </body>
			<script>
				function copyToClipboard() {
					const code = document.querySelector("code");
					navigator.clipboard.writeText(code.textContent);
				}
			</script>
    </html>
  `;

  return new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html' },
  });
}
