import fetch from 'node-fetch';

export interface WordPressCredentials {
  url: string;
  user: string;
  applicationPassword: string;
}

export interface WordPressPageInput {
  title: string;
  content: string;
  slug?: string;
  status?: 'draft' | 'publish' | 'private';
}

export async function createOrUpdateWordPressPage(
  credentials: WordPressCredentials,
  payload: WordPressPageInput
) {
  const endpoint = new URL('/wp-json/wp/v2/pages', credentials.url);
  const authToken = Buffer.from(`${credentials.user}:${credentials.applicationPassword}`).toString('base64');

  const response = await fetch(endpoint.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`
    },
    body: JSON.stringify({
      title: payload.title,
      content: payload.content,
      slug: payload.slug,
      status: payload.status ?? 'draft'
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to publish page: ${response.status} ${body}`);
  }

  return response.json();
}
