// netlify/functions/deleteReview.js
// 특정 id의 행을 구글 시트에서 삭제합니다 (관리자 전용)

const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');
const ADMIN_PW = process.env.ADMIN_PW || '6363';

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

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { reviewId, password } = JSON.parse(event.body);

    if (password !== ADMIN_PW) {
      return { statusCode: 403, body: JSON.stringify({ error: '권한 없음' }) };
    }

    const token = await getAccessToken();

    // 전체 행 조회 후 reviewId와 일치하는 행 인덱스 찾기
    const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent('시트1!A:A')}`;
    const getRes = await fetch(getUrl, { headers: { Authorization: `Bearer ${token}` } });
    const getData = await getRes.json();
    const rows = getData.values || [];

    // 1번 행은 헤더이므로 2번부터 (index 1부터)
    const rowIndex = rows.findIndex((row, i) => i > 0 && Number(row[0]) === Number(reviewId));
    if (rowIndex === -1) return { statusCode: 404, body: JSON.stringify({ error: '후기를 찾을 수 없음' }) };

    // 스프레드시트 ID(sheetId=0) 기준 해당 행 삭제
    const sheetMetaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
    const metaRes = await fetch(sheetMetaUrl, { headers: { Authorization: `Bearer ${token}` } });
    const meta = await metaRes.json();
    const sheetId = meta.sheets[0].properties.sheetId;

    const deleteUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`;
    await fetch(deleteUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          deleteDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 },
          },
        }],
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
