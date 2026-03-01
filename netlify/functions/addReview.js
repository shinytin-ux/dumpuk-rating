// netlify/functions/addReview.js
// 구글 시트에 후기 한 행을 추가합니다

const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');

async function getAccessToken() {
  const crypto = await import('crypto');

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const crypto2 = await import('crypto');
  const sign = crypto2.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(PRIVATE_KEY, 'base64url');
  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  return data.access_token;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { bundleId, stars, nickname, text, date } = JSON.parse(event.body);

    // 기본 유효성 검사
    if (!bundleId || !stars || !nickname) {
      return { statusCode: 400, body: JSON.stringify({ error: '필수 항목 누락' }) };
    }
    if (nickname.length > 10) {
      return { statusCode: 400, body: JSON.stringify({ error: '닉네임은 10자 이하' }) };
    }

    const id = Date.now();
    const token = await getAccessToken();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/시트1!A:F:append?valueInputOption=RAW`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[id, bundleId, stars, nickname, text || '', date]],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
