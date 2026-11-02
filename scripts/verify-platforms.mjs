import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const json = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const endpoint = 'https://api.xdata.kr/mcp';
const plugin = await json('plugin.json');
const portable = await json('mcp.json');
const openai = await json('examples/platforms/openai-mcp.json');
const gemini = await json('gemini-extension.json');
const pkg = await json('package.json');

requireValue(plugin.name === pkg.name && gemini.name === pkg.name, 'Platform package identities must match.');
requireValue(plugin.version === pkg.version && gemini.version === pkg.version, 'Platform package versions must match.');
requireValue(plugin.$schema === 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', 'Use the portable plugin schema.');
requireValue(!('hooks' in plugin) && !('apps' in plugin.extensions['com.openai']) && !('hooks' in plugin.extensions['com.openai']), 'Public plugins must not contain lifecycle hooks or app overlays.');
requireValue(Object.keys(portable.mcpServers).length === 1 && Object.keys(openai.mcpServers).length === 1, 'Submit exactly one MCP server.');
for (const server of [portable.mcpServers.xboss, openai.mcpServers.xboss]) {
  requireValue(server.type === 'streamable-http' && server.url === endpoint, 'Use the official HTTPS streamable HTTP endpoint.');
  requireValue(!server.headers && !server.command && !server.env, 'Do not package credentials or executable MCP launchers.');
}
const auth = openai.mcpServers.xboss.extensions['com.openai'].auth;
requireValue(auth.type === 'mixed' && auth.client.mode === 'cimd' && !auth.client.clientId && !auth.clientSecret, 'OpenAI must discover public and OAuth access using CIMD without packaged secrets.');
requireValue(gemini.mcpServers.xboss.httpUrl === endpoint && !gemini.mcpServers.xboss.trust && !gemini.mcpServers.xboss.headers, 'Gemini must preserve normal tool approvals without packaged secrets.');
const listing = plugin.extensions['com.openai'].interface;
for (const key of ['displayName', 'shortDescription']) requireValue(listing[key].length > 0 && [...listing[key]].length <= 30, `${key} exceeds the listing limit.`);
requireValue([...listing.longDescription].length <= 4000 && /홈택스/.test(listing.longDescription), 'Provide a Korean listing within the length limit.');
requireValue(!/[·•]/.test(JSON.stringify(plugin)), 'Listing copy must not contain decorative middle dots or bullets.');
for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
  const url = new URL(listing[key]);
  requireValue(url.protocol === 'https:' && !url.username && !url.password && ['xboss.biz', 'xdata.kr'].includes(url.hostname), `Invalid public listing URL: ${key}`);
}
requireValue(listing.defaultPrompt.length === 3 && listing.defaultPrompt.every(p => [...p].length <= 128 && !p.includes('@')), 'Use at most three short prompts without app mentions.');
const canonicalRoot = await realpath(root);
for (const file of [listing.logo, listing.composerIcon, plugin.extensions['com.openai'].onboardingSkill, 'skills/xboss-workflows/SKILL.md', gemini.contextFileName]) {
  const absolute = await realpath(path.resolve(root, file));
  requireValue(absolute.startsWith(canonicalRoot + path.sep), 'All referenced assets must stay inside the package.');
  const text = (await readFile(absolute, 'utf8')).replace(/\r\n/g, '\n');
  requireValue(text.length > 0, 'Referenced assets must be present.');
  if (file.endsWith('.svg')) requireValue(/width="512" height="512"/.test(text), 'Use a square icon with explicit dimensions.');
  if (file.endsWith('SKILL.md')) requireValue(/^---\nname: [a-z0-9-]+\ndescription: .+\n---\n/.test(text), 'Skill front matter is required.');
}
console.log(JSON.stringify({ ok: true, version: plugin.version, platforms: ['ChatGPT and Codex submission package', 'Cursor portable plugin', 'Gemini CLI extension'], remoteMcp: endpoint, credentialsPackaged: false, hooksPackaged: false, liveOAuthAndInstitutionTests: 'not covered by package validation' }, null, 2));
