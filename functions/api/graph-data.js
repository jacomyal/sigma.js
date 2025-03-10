export async function onRequest(context) {
  // Odczytaj dane z pliku JSON
  const data = await context.env.ASSETS.fetch(
    new URL('/ai_news_dataset.json', context.request.url)
  ).then(res => res.json());
  
  // Ustaw nagłówki CORS
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
  
  // Zwróć dane jako odpowiedź JSON
  return new Response(JSON.stringify(data), { headers });
} 