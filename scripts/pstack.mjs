#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const at = (...p) => path.join(root, ...p);
const read = p => fs.readFileSync(p, 'utf8');
const write = (p,s) => {fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,s);};
const files = dir => fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const digest = dir => {const h=crypto.createHash('sha256'); for(const p of files(dir)){h.update(path.relative(dir,p));h.update('\0');h.update(fs.readFileSync(p));h.update('\0');} return h.digest('hex');};
const git = (...args) => execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const json = p => JSON.parse(read(p));
const source=at('upstream','pstack');
const names = () => fs.readdirSync(path.join(source,'skills')).filter(n=>fs.existsSync(path.join(source,'skills',n,'SKILL.md'))).sort();
const nativeNames = () => [...names(),'update-pstack'];
const contract = () => read(at('codex','runtime.md'));
const rules = [
 [/\]\(url\)/g,'](#source-url)'],
 [/Each runner uses a different model\./g,'Runners use independent contexts; models may be the same.'],
 [/^disable-model-invocation:.*\n/gm,''],
 [/~\/\.cursor\/rules\/pstack-models\.mdc/g,'~/.codex/pstack-models.md'],
 [/~\/\.cursor\/projects\/[^\s`]+/g,'available scoped Codex session records'],
 [/~\/\.cursor\/skills\//g,'~/.codex/skills/'],
 [/~\/\.cursor\/plugins\//g,'the adaptation repository upstream/ directory'],
 [/\.cursor\/skills\//g,'.agents/skills/'],
 [/\b(?:claude-(?:fable|opus|sonnet|haiku)[a-z0-9.-]*|grok-[a-z0-9.-]+|gpt-5\.6-sol-max)\b/g,'inherit-parent'],
 [/\bTask\b/g,'Codex delegation'],
 [/subagent_type/g,'delegated role'],
 [/run_in_background/g,'background intent'],
 [/\breadonly\b/g,'read-only intent'],
 [/\bAskQuestion\b/g,'available user-input tool'],
 [/\bTodoWrite\b/g,'available planning tool'],
 [/\bReadFile\b/g,'available file-reading tool'],
 [/\bGlob\b/g,'file discovery'],
 [/\bGrep\b/g,'text search']
];
function transform(s){for(const [re,to] of rules)s=s.replace(re,to); for(const n of [...nativeNames(),'create-skill','deslop'].sort((a,b)=>b.length-a.length))s=s.replace(new RegExp('(?<![\\w./])/'+n+'(?![\\w/-])','g'),()=>'$'+(n==='create-skill'?'skill-creator':n)); return s;}
function build(){
 const lock=json(at('upstream.lock.json'));
 if(digest(source)!==lock.treeSha256)throw Error('Upstream changed: review adaptations and update lock before building.');
 const approved=json(at('codex','reviewed.json'));
 if(approved.treeSha256!==lock.treeSha256 || approved.commit!==lock.commit)throw Error('Upstream revision has not been reviewed.');
 const tmp=at('.build-'+process.pid);fs.mkdirSync(tmp);
 try {
 const overrides=json(at('codex','overrides.json'));
 for(const p of files(path.join(source,'skills'))){const rel=path.relative(path.join(source,'skills'),p);const content=p.endsWith('.md')?transform(read(p)):fs.readFileSync(p);write(path.join(tmp,'skills',rel),content);}
 for(const name of names()){
  const p=path.join(tmp,'skills',name,'SKILL.md');let s=read(p);const m=s.match(/^---\n([\s\S]*?)\n---\n/);if(!m)throw Error('Invalid frontmatter '+name);
  const body=overrides[name]?`# ${name}\n\n${overrides[name]}\n`:s.slice(m[0].length);
  write(p,m[0]+'\n'+contract()+'\n'+body);
  write(path.join(tmp,'skills',name,'agents','openai.yaml'),'policy:\n  allow_implicit_invocation: false\n');
 }
 write(path.join(tmp,'skills','update-pstack','SKILL.md'),read(at('codex','update-pstack.md')));
 write(path.join(tmp,'skills','update-pstack','agents','openai.yaml'),'policy:\n  allow_implicit_invocation: false\n');
 // Keep relative cross-skill and source-document references resolvable.
 for(const folder of ['agents','docs','assets'])if(fs.existsSync(path.join(source,folder)))fs.cpSync(path.join(source,folder),path.join(tmp,folder),{recursive:true});
 fs.copyFileSync(path.join(source,'README.md'),path.join(tmp,'README.md'));
 fs.copyFileSync(path.join(source,'LICENSE'),path.join(tmp,'LICENSE'));
 check(tmp);
 const old=at('.build-previous-'+process.pid);
 if(fs.existsSync(at('candidate-dist')))fs.renameSync(at('candidate-dist'),old);
 try{fs.renameSync(tmp,at('candidate-dist'));}catch(e){if(fs.existsSync(old))fs.renameSync(old,at('candidate-dist'));throw e;}
 fs.rmSync(old,{recursive:true,force:true});
 console.log(`Built ${nativeNames().length} skills from ${lock.commit}`);
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
function check(dir=fs.existsSync(at('candidate-dist'))?at('candidate-dist'):at('dist')){
 const errors=[];
 for(const name of nativeNames()){
 const p=path.join(dir,'skills',name,'SKILL.md');if(!fs.existsSync(p)){errors.push('Missing '+name);continue;}
 const s=read(p);if(!s.startsWith('---\n')||!s.match(/^name: .+$/m)||!s.match(/^description: .+$/m))errors.push('Metadata '+name);
 if(!read(path.join(dir,'skills',name,'agents','openai.yaml')).includes('allow_implicit_invocation: false'))errors.push('Invocation policy '+name);
 }
 for(const p of files(path.join(dir,'skills')).filter(p=>p.endsWith('.md'))){const s=read(p);
 if(/~\/\.cursor|\bTask\b|subagent_type|run_in_background|claude-(?:fable|opus)|grok-4|gpt-5\.6-sol-max/.test(s))errors.push('Unsupported runtime token '+path.relative(dir,p));
 for(const m of s.matchAll(/\]\(([^)]+)\)/g)){const link=m[1].split('#')[0];if(!link||/^(?:https?:|mailto:|#|\/)/.test(link)||link.includes(' '))continue;if(!fs.existsSync(path.resolve(path.dirname(p),link)))errors.push('Broken link '+path.relative(dir,p)+' -> '+link);}
 }
 if(errors.length)throw Error(errors.join('\n'));
 console.log('Checks passed: skill coverage, metadata, invocation policy, runtime tokens, Markdown links.');
}
function sync(ref='main'){
 if(!/^[a-zA-Z0-9._/-]+$/.test(ref))throw Error('Invalid revision');
 if(fs.existsSync(at('.candidate')))throw Error('Existing .candidate: review or move it first.');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pstack-sync-'));
 try{execFileSync('git',['clone','--depth','1','https://github.com/cursor/plugins.git',tmp],{stdio:'inherit'});
 execFileSync('git',['fetch','--depth','1','origin',ref],{cwd:tmp,stdio:'inherit'});
 const commit=execFileSync('git',['rev-parse','FETCH_HEAD'],{cwd:tmp,encoding:'utf8'}).trim();
 execFileSync('git',['checkout','--detach',commit],{cwd:tmp,stdio:'inherit'});
 fs.mkdirSync(at('.candidate'));fs.cpSync(path.join(tmp,'pstack'),at('.candidate','pstack'),{recursive:true});
 write(at('.candidate','upstream.lock.json'),JSON.stringify({repository:'https://github.com/cursor/plugins',commit,treeSha256:digest(at('.candidate','pstack'))},null,2)+'\n');
 console.log('Candidate staged; installed skills unchanged. Review with git diff --no-index upstream/pstack .candidate/pstack (exit 1 means changes).');
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
function install(){check();const dest=process.env.PSTACK_SKILLS_DIR||path.join(os.homedir(),'.codex','skills');fs.mkdirSync(dest,{recursive:true});
 // Validate all destinations before making any links.
 for(const n of nativeNames()){const p=path.join(dest,n);let stat;try{stat=fs.lstatSync(p);}catch(e){if(e.code==='ENOENT')continue;throw e;}if(!stat.isSymbolicLink()||path.resolve(path.dirname(p),fs.readlinkSync(p))!==at('dist','skills',n))throw Error('Refusing to overwrite '+p);}
 for(const n of fs.readdirSync(dest)){const p=path.join(dest,n);const st=fs.lstatSync(p);if(st.isSymbolicLink()&&path.resolve(path.dirname(p),fs.readlinkSync(p)).startsWith(at('dist','skills')+path.sep)&&!nativeNames().includes(n))console.warn('Obsolete owned skill link (not removed): '+p);}
 if(fs.existsSync(at('candidate-dist'))){const old=at('.build-installed-'+process.pid);if(fs.existsSync(at('dist')))fs.renameSync(at('dist'),old);try{fs.renameSync(at('candidate-dist'),at('dist'));}catch(e){if(fs.existsSync(old))fs.renameSync(old,at('dist'));throw e;}fs.rmSync(old,{recursive:true,force:true});}

 for(const n of nativeNames()){const p=path.join(dest,n);try{fs.lstatSync(p);}catch(e){if(e.code!=='ENOENT')throw e;fs.symlinkSync(at('dist','skills',n),p,'dir');}}
 console.log(`Installed ${nativeNames().length} skill links in ${dest}`);
}
const cmd=process.argv[2];
try{if(cmd==='build')build();else if(cmd==='check')check();else if(cmd==='sync')sync(process.argv[3]);else if(cmd==='install')install();else if(cmd==='test')execFileSync(process.execPath,['--test',at('scripts','pstack.test.mjs')],{stdio:'inherit',env:process.env});else if(cmd==='digest')console.log(digest(source));else throw Error('Usage: node scripts/pstack.mjs build|check|sync [ref]|install|digest');}catch(e){console.error(e.message);process.exitCode=1;}
