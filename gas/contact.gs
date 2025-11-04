// Google Apps Script - Contact Form Endpoint
// Setup: File > Project properties > Script properties
//  - SHEET_ID: <your spreadsheet id>
//  - SLACK_WEBHOOK_URL: (optional) https://hooks.slack.com/services/...
//  - NOTIFY_EMAILS: (optional) comma-separated emails

const PROP = PropertiesService.getScriptProperties();
const SHEET_NAME = '상담신청내역';

function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  PROP.setProperty('SHEET_ID', ss.getId());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  const locked = lock.tryLock(10000);
  if (!locked) return json(429, { ok: false, error: 'busy' });
  try {
    const contentType = e?.postData?.type || '';
    let payload = {};
    if (contentType.indexOf('application/json') !== -1 && e.postData?.contents) {
      try { payload = JSON.parse(e.postData.contents) || {}; } catch (_) {}
    } else {
      payload = Object.assign({}, e?.parameter || {});
    }

    // Honeypot
    if (payload.website) return json(200, { ok: true });

    const data = {
      name: (payload.name || '').trim(),
      email: (payload.email || '').trim(),
      company: (payload.company || '').trim(),
      phone: normalizePhone(payload.phone || ''),
      message: (payload.message || '').trim(),
      ua: (payload.ua || '').substring(0, 300),
      ref: (payload.ref || '').substring(0, 500)
    };

    const errors = validatePayload(data);
    if (errors.length) return json(400, { ok: false, errors });

    if (!checkCooldown(data.email)) return json(429, { ok: false, error: 'too_many_requests' });

    const now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    const ss = SpreadsheetApp.openById(PROP.getProperty('SHEET_ID'));
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    const headers = getHeaders(sheet);
    const row = headers.map(h => mapValue(h, now, data));
    sheet.appendRow(row);

    try { notifySlack(headers, row); } catch (err) { console.warn('Slack failed', err); }
    try { notifyEmail(headers, row); } catch (err) { console.warn('Email failed', err); }

    return json(200, { ok: true });
  } catch (err) {
    console.error(err);
    return json(500, { ok: false, error: String(err) });
  } finally {
    Utilities.sleep(400 + Math.floor(Math.random() * 400));
    lock.releaseLock();
  }
}

function normalizePhone(raw) {
  let s = String(raw || '').replace(/[^\d+]/g, '');
  if (s.startsWith('+82')) s = '0' + s.slice(3);
  s = s.replace(/[^\d]/g, '');
  return s;
}

function validatePayload(d) {
  const errs = [];
  if (!d.name || d.name.length < 2) errs.push({ field: 'name', msg: '이름을 확인해주세요.' });
  const emailRe = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRe.test(d.email)) errs.push({ field: 'email', msg: '이메일 형식을 확인해주세요.' });
  if (d.phone) {
    if (d.phone.length < 10 || d.phone.length > 11) errs.push({ field: 'phone', msg: '전화번호를 확인해주세요.' });
  }
  if (!d.message || d.message.length < 5) errs.push({ field: 'message', msg: '문의 내용을 입력해주세요.' });
  if (d.message.length > 4000) errs.push({ field: 'message', msg: '메시지가 너무 깁니다.' });
  return errs;
}

function getHeaders(sheet) {
  const lastCol = sheet.getLastColumn() || 1;
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0] || [];
  return headers.length ? headers : ['Date','name','email','company','phone','message','ua','ref'];
}

function mapValue(header, now, d) {
  switch (header) {
    case 'Date': return now;
    case 'name': return d.name;
    case 'email': return d.email;
    case 'company': return d.company;
    case 'phone': return d.phone;
    case 'message': return d.message;
    case 'ua': return d.ua;
    case 'ref': return d.ref;
    default: return '';
  }
}

function notifySlack(headers, row) {
  const url = PROP.getProperty('SLACK_WEBHOOK_URL');
  if (!url) return;
  const lines = headers.map((h, i) => `${h}: ${maskIfNeeded(h, row[i])}`);
  const payload = { text: `*[신규 상담신청]*\n${lines.join('\n')}` };
  UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  });
}

function notifyEmail(headers, row) {
  const recipients = PROP.getProperty('NOTIFY_EMAILS') || '';
  if (!recipients) return;
  const lines = headers.map((h, i) => `${h}: ${maskIfNeeded(h, row[i])}`);
  const body = `\n    <h2>신규 상담신청이 접수되었습니다.</h2>\n    <h3>상담 신청 내용</h3>\n    <p>${lines.join('<br>')}</p>\n  `;
  MailApp.sendEmail({ to: recipients, subject: '[홈페이지-신규 상담신청 접수]', htmlBody: body });
}

function maskIfNeeded(field, value) {
  if (field === 'phone' && value) {
    const s = String(value);
    if (s.length === 11) return `${s.slice(0,3)}-${s.slice(3,7).replace(/\d/g,'*')}-${s.slice(7)}`;
  }
  return value;
}

function json(status, obj) {
  return ContentService.createTextOutput(JSON.stringify(Object.assign({ status }, obj)))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkCooldown(email) {
  try {
    const key = `cooldown:${email}`;
    const last = PROP.getProperty(key);
    const now = Date.now();
    if (last && now - Number(last) < 60000) return false;
    PROP.setProperty(key, String(now));
    return true;
  } catch (_) { return true; }
}


