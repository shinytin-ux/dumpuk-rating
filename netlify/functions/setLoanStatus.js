// netlify/functions/setLoanStatus.js
// 구글 시트 "대출현황" 시트에서 꾸러미 대출 상태를 업데이트합니다

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

// 모든 꾸러미 상태를 한번에 덮어씁니다 (25개 행 전체 업데이트)
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { password, status } = JSON.parse(event.body);
    if (password !== ADMIN_PW) {
      return { statusCode: 403, body: JSON.stringify({ error: '비밀번호가 올바르지 않습니다.' }) };
    }

    const token = await getAccessToken();

    // status = { A01: "available", A02: "loaned", ... }
    // 시트에 bundleId, state 형태로 기록
    const values = Object.entries(status).map(([id, state]) => [id, state]);

    // 헤더 포함해서 A1부터 쓰기
    const allValues = [['bundleId', 'status'], ...values];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent('대출현황!A1')}?valueInputOption=RAW`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ range: '대출현황!A1', majorDimension: 'ROWS', values: allValues }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
