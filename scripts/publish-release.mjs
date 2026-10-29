import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { Transform, Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// Only already-published installers, never a private source checkout or token.
try {
  const release = JSON.parse(await readFile('release.json', 'utf8'));
  const sources = JSON.parse(process.env.SOURCE_URLS);
  await mkdir('files', { recursive: true });
  const sums = [];
  if (release.assets.length !== 4) throw new Error('Expected four installers');
  for (const asset of release.assets) {
    if (!/^jane-client-2\.2\.1-[a-zA-Z0-9_.-]+$/.test(asset.name) || !/^[a-f0-9]{64}$/.test(asset.sha256)) throw new Error('Invalid installer metadata');
    const url = new URL(sources[asset.name]);
    if (url.protocol !== 'https:' || !['release-assets.githubusercontent.com', 'objects.githubusercontent.com'].includes(url.hostname)) throw new Error('Invalid asset host');
    console.log('::add-mask::' + url.href);
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(180000) });
    if (!response.ok || !response.body) throw new Error('Installer request failed');
    const hash = createHash('sha256');
    let length = 0;
    const verifier = new Transform({ transform(chunk, _encoding, done) {
      length += chunk.length;
      if (length > asset.size) return done(new Error('Installer too large'));
      hash.update(chunk); done(null, chunk);
    } });
    await pipeline(Readable.fromWeb(response.body), verifier, createWriteStream('files/' + asset.name));
    if (length !== asset.size || hash.digest('hex') !== asset.sha256) throw new Error('Installer checksum mismatch');
    sums.push(asset.sha256 + '  ' + asset.name);
    console.log('Verified: ' + asset.name);
  }
  const zip = await readFile('jane-website.zip');
  if (zip.length > 5 * 1024 * 1024 || zip.readUInt32LE(0) !== 0x04034b50) throw new Error('Invalid website archive');
  sums.push(createHash('sha256').update(zip).digest('hex') + '  jane-website.zip');
  await writeFile('files/SHA256SUMS', sums.join('\n') + '\n');
} catch {
  // Never put signed URLs or credentials into error output.
  console.error('Release verification failed. Nothing has been published by this step.');
  process.exitCode = 1;
}
