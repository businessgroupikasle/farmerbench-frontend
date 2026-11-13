const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = fs.readFileSync('src/utils/bookingValidation.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function('exports', 'module', compiled)(loaded.exports, loaded);
const { getFarmerNameError, getBookingDateError, localDateMinimum } = loaded.exports;

test('farmer names require letters, including Indian scripts', () => {
  for (const name of ['', '  ', '45888988', '785633333', '---']) assert.ok(getFarmerNameError(name));
  for (const name of ['Arun Kumar', 'அருண்', "D’Souza", 'राम कुमार']) assert.equal(getFarmerNameError(name), '');
});

test('calendar dates allow today and reject yesterday', () => {
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  assert.ok(getBookingDateError(localDateMinimum(false, yesterday)));
  assert.equal(getBookingDateError(localDateMinimum()), '');
  assert.equal(getBookingDateError(localDateMinimum(false, tomorrow)), '');
  assert.equal(getBookingDateError(''), '');
  assert.ok(getBookingDateError('invalid-date'));
});

test('consultations require a strictly future time', () => {
  const past = new Date(Date.now() - 120000);
  const future = new Date(Date.now() + 120000);
  assert.ok(getBookingDateError(localDateMinimum(true, past), true));
  assert.equal(getBookingDateError(localDateMinimum(true, future), true), '');
});

test('input minimum uses local calendar dates and rounds future minutes', () => {
  const local = new Date(2026, 10, 11, 23, 59, 40);
  assert.equal(localDateMinimum(false, local), '2026-11-11');
  assert.equal(localDateMinimum(true, local), '2026-11-12T00:00');
});
