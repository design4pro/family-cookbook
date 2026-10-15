import test from 'node:test';
import assert from 'node:assert/strict';
import { assess, assessResponse, chunkRanges, parseDraft, decodeResponse, extractDraft } from './capture-smoke.ts';
const reference = { ingredients: [{ name: 'flour', quantity: 250, unit: 'g' }], temperatureC: null, minutes: null, steps: ['Mix.'], uncertainties: [] };
test('JSON byte-stream responses retain answers and provider metering', async () => {
  const body = { answer: JSON.stringify(reference), metrics: { output_tokens: 42 } };
  assert.deepEqual(await decodeResponse(new Response(JSON.stringify(body)).body), body);
  assert.deepEqual(await decodeResponse(body), body);
  await assert.rejects(decodeResponse(new Response('not JSON').body));
});
test('model-specific response envelopes expose the original draft without rewriting facts', () => {
  const draft = JSON.stringify(reference);
  for (const response of [{ response: draft }, { choices: [{ message: { content: draft } }] }, { answer: draft }, { result: { answer: draft } }]) {
    assert.equal(extractDraft(response), draft);
  }
  assert.equal(extractDraft({}), undefined);
});
test('a truncated completion cannot pass even when its partial JSON matches the reference', () => {
  const response = { choices: [{ finish_reason: 'length', message: { content: JSON.stringify(reference) } }] };
  assert.equal(assessResponse(response, reference).pass, false);
  assert.ok(assessResponse(response, reference).errors.includes('truncated completion'));
  response.choices[0].finish_reason = 'stop';
  assert.equal(assessResponse(response, reference).pass, true);
});
test('valid JSON does not hide a wrong quantity or invented temperature', () => {
  const result = assess({ ...reference, ingredients: [{ name: 'flour', quantity: 200, unit: 'g' }], temperatureC: 180 }, reference);
  assert.equal(result.pass, false);
  assert.equal(result.errors.length, 2);
});
test('missing independent reference leaves factual acceptance pending, while schema and truncation still fail', () => {
  const response = { response: JSON.stringify(reference) };
  assert.equal(assessResponse(response).pass, null);
  assert.equal(assessResponse(response).manualReviewRequired, true);
  assert.equal(assessResponse({ response: 'not JSON' }).pass, false);
  assert.equal(assessResponse({ ...response, finish_reason: 'length' }).pass, false);
});
test('unknowns, units, missing ingredients and steps remain observable', () => {
  assert.equal(assess(reference, reference).pass, true);
  assert.equal(assess({ ...reference, ingredients: [], steps: [] }, reference).pass, false);
  assert.equal(assess({ ...reference, minutes: 0 }, reference).pass, false);
  assert.equal(assess({ ...reference, ingredients: [{ name: 'flour', quantity: 250, unit: 'kg' }] }, reference).pass, false);
});
test('schema rejects non-finite quantities and unstructured prose', () => {
  assert.throws(() => parseDraft({ ...reference, minutes: 'unknown' }));
  assert.throws(() => parseDraft({ ...reference, ingredients: [{ name: 'flour', quantity: Infinity, unit: 'g' }] }));
  assert.throws(() => parseDraft('not JSON'));
});
test('five-minute chunks cover the full recording with boundary overlap', () => {
  assert.deepEqual(chunkRanges(300), [[0,60],[58,60],[116,60],[174,60],[232,60],[290,10]]);
  assert.deepEqual(chunkRanges(20), [[0,20]]);
  assert.throws(() => chunkRanges(301));
});
test('correct ingredients cannot hide a superseded quantity in cooking steps', () => {
  const result = assess({ ...reference, steps: ['Add 200 g of flour.', 'Correction: 250 g.'] }, { ...reference, forbiddenStepPatterns: ['\\b200\\b'] });
  assert.deepEqual(result.errors, ['superseded fact in steps']);
});
test('vision null arrays fail schema and require manual review', () => {
  assert.equal(assess({ ...reference, ingredients: null, steps: null }, reference).pass, false);
});
test('empty output cannot pass a multiple-recipe case without an explicit review reason', () => {
  const empty = { ingredients: [], temperatureC: null, minutes: null, steps: [], uncertainties: [] };
  assert.equal(assess(empty, { ...empty, requiredUncertainties: ['multiple_recipes'] }).pass, false);
  assert.equal(assess({ ...empty, uncertainties: ['multiple_recipes'] }, { ...empty, requiredUncertainties: ['multiple_recipes'] }).pass, true);
});
test('multiple-recipes warning cannot coexist with a usable merged draft', () => {
  const result = assess({ ...reference, uncertainties: ['multiple_recipes'] }, reference);
  assert.equal(result.pass, false);
  assert.ok(result.errors.includes('multiple recipes require a new source'));
});
