import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Manually selected complete recipes; related toppings and sauces stay in the same ROI.
const regions = {
  2729: [[480, 160, 2280, 2400], [480, 2630, 2300, 1280]],
  2730: [[430, 250, 2240, 3750]],
  2731: [[450, 180, 2574, 3300]],
  2732: [[480, 340, 2070, 3150]],
  2733: [[430, 210, 2200, 1600], [430, 2080, 2200, 1540]],
  2734: [[420, 100, 2110, 2330], [420, 2530, 2110, 1330]],
  2735: [[450, 450, 2080, 3120]],
};
const base = 'test-results/t09-photos';
const directory = `${base}/crops`;
mkdirSync(directory, { recursive: true });
const previous = JSON.parse(readFileSync(`${base}/two-stage-glm-manifest.json`, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const decode = path => execFileSync('ffmpeg', ['-v', 'error', '-i', path, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1'], { maxBuffer: 64 * 1024 * 1024 });
const fixtures = [];
for (const [number, boxes] of Object.entries(regions)) {
  const source = previous.sources.find(s => s.name === `IMG_${number}.HEIC`);
  assert.equal(hash(readFileSync(`tests/assets/${source.name}`)), source.sha256);
  const jpeg = `${base}/IMG_${number}-normalized.jpg`;
  assert.equal(hash(readFileSync(jpeg)), source.jpegSha256);
  const pixels = decode(jpeg);
  assert.equal(pixels.length, 3024 * 4032 * 3);
  for (const [index, [x, y, width, height]] of [[0, 0, 3024, 4032], ...boxes].entries()) {
    assert.ok(x >= 0 && y >= 0 && x + width <= 3024 && y + height <= 4032);
    const selected = Buffer.alloc(width * height * 3);
    for (let row = 0; row < height; row++) {
      const start = ((y + row) * 3024 + x) * 3;
      pixels.copy(selected, row * width * 3, start, start + width * 3);
    }
    const id = `photo-${number}-${index === 0 ? 'full' : `crop-${index}`}`;
    const path = `${directory}/${id}.png`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgb24', '-video_size', `${width}x${height}`, '-i', 'pipe:0', '-frames:v', '1', '-map_metadata', '-1', path], { input: selected, maxBuffer: 64 * 1024 * 1024 });
    assert.ok(decode(path).equals(selected), `PNG must preserve every RGB pixel: ${id}`);
    fixtures.push({ id, kind: 'image', path: `${id}.png`, mime: 'image/png', consent: true, synthetic: false, parent: source.name, originalSha256: source.sha256, jpegSha256: source.jpegSha256, sha256: hash(readFileSync(path)), rgbSha256: hash(selected), roi: { x, y, width, height }, pixelEqualityVerified: true });
  }
}
const manifest = { consent: previous.consent, referenceProvenance: previous.referenceProvenance, transformation: 'Decode existing normalized JPEG to RGB24 once; copy exact rectangular pixel rows; lossless PNG; no resampling, enhancements, masking, rotation or content repair. Full-page PNG controls use the same decoded pixels.', imageModel: '@cf/zai-org/glm-5.3-flash', imageDetail: 'high', imagePipeline: 'transcribe-only', fixtures };
writeFileSync(`${directory}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ fixtures: fixtures.length, originalsVerified: 7, pixelEqualityVerified: fixtures.length, manifest: `${directory}/manifest.json` }));
