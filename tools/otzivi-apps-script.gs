/**
 * АНЕТО: отзиви от сайта в Google таблица
 *
 * Как работи:
 *  - Формата „Оставете отзив“ в сайта изпраща отзива тук. Той се записва в листа „Отзиви“
 *    със скрит статус. На вашия имейл идва известие.
 *  - Напишете „да“ в колоната „Одобрен“ и отзивът се показва в сайта до няколко минути.
 *    Изтрийте „да“ и отзивът изчезва.
 *  - Преводът на другия език (български/английски) се прави автоматично.
 *
 * Първоначална настройка: вижте стъпките в README.md, раздел „Отзиви“.
 */

const SHEET_NAME = 'Отзиви';
const NOTIFY_EMAIL = '';          // празно = известието идва на имейла на собственика на таблицата
const SITE_NAME = 'Занималня АНЕТО';
const HEADERS = ['Дата', 'Име', 'Оценка', 'Отзив (оригинал)', 'Език', 'Превод', 'Одобрен'];
const APPROVED = ['да', 'yes', 'x', '✓', 'true', 'одобрен'];
const CACHE_KEY = 'approved-reviews';

/** Пуснете веднъж ръчно: създава листа, заглавията и падащото меню „да / не“. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#FCEFC7');
  sh.setFrozenRows(1);
  sh.setColumnWidth(4, 420);
  sh.setColumnWidth(6, 420);
  sh.getRange('D:D').setWrap(true);
  sh.getRange('F:F').setWrap(true);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(['да', 'не'], true).setAllowInvalid(true).build();
  sh.getRange(2, 7, 1000, 1).setDataValidation(rule);
  CacheService.getScriptCache().remove(CACHE_KEY);
}

/** Сайтът чете одобрените отзиви: GET ...?list=1 */
function doGet() {
  const cache = CacheService.getScriptCache();
  let out = cache.get(CACHE_KEY);
  if (!out) {
    out = JSON.stringify({ reviews: readApproved_() });
    cache.put(CACHE_KEY, out, 300);
  }
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

/** Сайтът изпраща нов отзив: POST с JSON {name, stars, text, lang, consent, website} */
function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ ok: true });                     // скрито поле: попълват го само ботове
    if (d.consent !== true) return json_({ ok: false, error: 'consent' });
    const text = clean_(d.text, 2000);
    if (text.length < 10) return json_({ ok: false, error: 'short' });
    if (!rateOk_()) return json_({ ok: false, error: 'busy' });
    const name = clean_(d.name, 80) || (d.lang === 'en' ? 'A parent' : 'Родител');
    const stars = Math.max(1, Math.min(5, parseInt(d.stars, 10) || 5));
    const lang = d.lang === 'en' ? 'en' : 'bg';
    let translated = '';
    try { translated = LanguageApp.translate(text, lang, lang === 'bg' ? 'en' : 'bg'); } catch (err) { translated = ''; }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      sh.appendRow([new Date(), safe_(name), stars, safe_(text), lang, safe_(translated), '']);
    } finally {
      lock.releaseLock();
    }
    notify_(name, stars, text);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  }
}

/** При всяка ръчна промяна в таблицата (например „да“) сайтът вижда новото веднага. */
function onEdit() {
  CacheService.getScriptCache().remove(CACHE_KEY);
}

function readApproved_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues();
  const tz = Session.getScriptTimeZone();
  return rows
    .filter(function (r) { return APPROVED.indexOf(String(r[6]).trim().toLowerCase()) > -1 && String(r[3]).trim(); })
    .map(function (r) {
      const lang = r[4] === 'en' ? 'en' : 'bg';
      const orig = String(r[3]), tr = String(r[5] || '');
      return {
        name: String(r[1]),
        stars: Number(r[2]) || 5,
        text: lang === 'bg' ? orig : (tr || orig),
        text_en: lang === 'en' ? orig : (tr || orig),
        when: r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'dd.MM.yyyy') : '',
        lang: lang,
        source: 'site'
      };
    })
    .reverse();
}

function notify_(name, stars, text) {
  try {
    const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    const url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    MailApp.sendEmail(to, 'Нов отзив за одобрение – ' + SITE_NAME,
      'Име: ' + name + '\nОценка: ' + stars + ' от 5\n\n' + text +
      '\n\nЗа да се покаже в сайта, напишете „да“ в колоната „Одобрен“:\n' + url);
  } catch (err) { /* известието не е задължително */ }
}

function rateOk_() {
  const c = CacheService.getScriptCache();
  const k = 'rate-' + Math.floor(Date.now() / 600000);            // прозорец от 10 минути
  const n = parseInt(c.get(k) || '0', 10);
  if (n >= 20) return false;
  c.put(k, String(n + 1), 700);
  return true;
}

function clean_(v, max) {
  return String(v || '').replace(/[\u0000-\u0009\u000B-\u001F]/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max);
}

/** Пази таблицата: текст, започващ с =, +, - или @, не се изпълнява като формула. */
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
