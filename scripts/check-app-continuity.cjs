const fs=require("node:fs");const crypto=require("node:crypto");const assert=require("node:assert/strict");
const manifest=require("../docs/approved-app-blobs.json");
for(const [path,expected] of Object.entries(manifest)){const bytes=fs.readFileSync(path);const actual=crypto.createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");assert.equal(actual,expected,"Approved app changed: "+path+" — recover approved version or explicitly review and update manifest");}
const config=fs.readFileSync("next.config.ts","utf8");assert.match(config,/cpSync\(join\(process.cwd\(\),"standalone",name\)/);assert.match(config,/beforeFiles/);assert.match(config,/\.theascendersclub\.com/);
for(const app of ["hub","academy","media"]){const route=fs.readFileSync("src/app/"+app+"/page.tsx","utf8");assert.ok(route.includes('redirect("/apps/'+app+'/index.html")'),"App gateway regression: "+app);}
for(const path of ["src/app/components/SiteShell.tsx","src/app/page.tsx","src/app/about/page.tsx","src/app/components/PerceptionSequence.tsx"]){const source=fs.readFileSync(path,"utf8");assert.ok(source.includes('_blank'),"App new-tab navigation missing: "+path);}
console.log("Approved application assets and routes verified.");
