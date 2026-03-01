// netlify/functions/getReviews.js
// Google Sheets에서 후기를 읽어옵니다 (JWT 직접 구현, 외부 라이브러리 불필요)

const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');

// JWT 생성 (crypto 내장 모듈 사용)
async function getAccessToken() {
  const crypto = await import('crypto');

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
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

export const handler = async () => {
  try {
    const token = await getAccessToken();
    const range = encodeURIComponent('시트1!A2:F10000');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const rows = data.values || [];

    // bundleId별로 그룹핑
    const reviews = {};
    for (const row of rows) {
      const [id, bundleId, stars, nickname, text, date] = row;
      if (!bundleId) continue;
      if (!reviews[bundleId]) reviews[bundleId] = [];
      reviews[bundleId].push({
        id: Number(id),
        bundleId,
        stars: Number(stars),
        nickname,
        text: text || '',
        date,
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviews),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
