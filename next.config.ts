import type {NextConfig} from "next";
import {cpSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {join} from "node:path";
const appRoot=join(process.cwd(),"public","apps");
for(const name of ["hub","academy","media"]){
 const target=join(appRoot,name);mkdirSync(target,{recursive:true});cpSync(join(process.cwd(),"standalone",name),target,{recursive:true});
 if(name!=="hub"){const file=join(target,"index.html");writeFileSync(file,readFileSync(file,"utf8").replaceAll('href="../"','href="https://hub.theascendersclub.com/"'));}
}
const nextConfig:NextConfig={reactCompiler:true,async rewrites(){return {beforeFiles:[
 ...["hub","academy","media"].map(name=>({source:"/",has:[{type:"host" as const,value:name+".theascendersclub.com"}],destination:"/apps/"+name+"/index.html"})),
 ...["hub","academy","media"].flatMap(name=>["app-icon.png","brand.png"].map(asset=>({source:"/"+asset,has:[{type:"host" as const,value:name+".theascendersclub.com"}],destination:"/apps/"+name+"/"+asset}))),
 {source:"/map.js",has:[{type:"host",value:"hub.theascendersclub.com"}],destination:"/apps/hub/map.js"}
 ],afterFiles:[],fallback:[]};}};
export default nextConfig;
