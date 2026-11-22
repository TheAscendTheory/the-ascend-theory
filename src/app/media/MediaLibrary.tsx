"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Film,Headphones,Play,Search,ShieldCheck,Video} from "lucide-react";
import {createBrowserSupabaseClient} from "../lib/supabaseBrowser";
import "./media-app.css";
type Media={id:string;title:string;description:string;kind:"video"|"audio"|"course"|"documentary"|"podcast"|"music";source:"youtube"|"file";source_url:string;thumbnail_url:string|null;access_level:string;created_at:string};
function youtubeEmbed(url:string){try{const parsed=new URL(url);let id="";if(parsed.hostname==="youtu.be")id=parsed.pathname.slice(1);else if(["youtube.com","www.youtube.com","m.youtube.com"].includes(parsed.hostname)){id=parsed.searchParams.get("v")||parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]||"";}if(!/^[A-Za-z0-9_-]{11}$/.test(id))return null;return `https://www.youtube-nocookie.com/embed/${id}`;}catch{return null;}}
function safeUrl(u:string){try{const x=new URL(u);return x.protocol==="https:"?x.toString():null;}catch{return null;}}
export default function MediaLibrary(){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [items,setItems]=useState<Media[]>([]);
 const [active,setActive]=useState<Media|null>(null);
 const [filter,setFilter]=useState("all");
 const [search,setSearch]=useState("");
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(!supabase){setMessage("Media catalogue connection is not configured.");setLoading(false);return;}
  let current=true;
  supabase.from("ascend_media_items").select("id,title,description,kind,source,source_url,thumbnail_url,access_level,created_at").eq("published",true).eq("access_level","free").order("created_at",{ascending:false}).limit(100).then(({data,error})=>{
   if(!current)return;
   setItems((data||[]) as Media[]);if(error)setMessage("Media library could not load: "+error.message);setLoading(false);
  });
  return()=>{current=false;};
 },[supabase]);
 const visible=items.filter(m=>(filter==="all"||m.kind===filter)&&[m.title,m.description,m.kind].join(" ").toLowerCase().includes(search.toLowerCase()));
 const embed=active?.source==="youtube"?youtubeEmbed(active.source_url):null;
 const fileUrl=active?.source==="file"?safeUrl(active.source_url):null;
 return <main className="ascMediaApp">
 <section className="ascInnerHero ascWrap"><p className="ascOverline">ASCEND MEDIA / THE STORIES</p><h1>Stories that <em>move us.</em></h1><p>Discover original film, interviews, documentary work and audio perspectives. Watch, listen, and explore the people and ideas shaping a connected future.</p></section>
 <section className="ascWrap ascMediaLibrary"><div className="ascMediaTop"><div><p className="ascOverline">WATCH / LISTEN / EXPLORE</p><h2>Media library.</h2></div><Link className="ascTextLink" href="/contact">Submit a collaboration <ArrowUpRight size={16}/></Link></div>
 <div className="ascMediaFilters"><div><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search stories and subjects…" aria-label="Search media"/></div><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filter media type">{["all","video","documentary","podcast","audio","music","course"].map(k=><option key={k} value={k}>{k==="all"?"All media":k[0].toUpperCase()+k.slice(1)}</option>)}</select></div>
 {loading?<p role="status">Loading published media…</p>:message?<p className="ascMediaMessage" role="status">{message}</p>:visible.length===0?<div className="ascMediaEmpty"><Film size={48} strokeWidth={1}/><h3>No published stories in this view yet.</h3><p>The library shows actual published releases only. There are no placeholder videos or invented episodes.</p></div>:<div className="ascMediaGrid">{visible.map(m=><button className="ascMediaCard" type="button" key={m.id} onClick={()=>setActive(m)}><div className="ascMediaCover">{safeUrl(m.thumbnail_url||"")?<img src={safeUrl(m.thumbnail_url||"")!} alt="" loading="lazy"/>:<div className="ascMediaPattern" aria-hidden="true"/>}<span className="ascMediaPlay"><Play size={22}/></span></div><div className="ascMediaCardBody"><span>{m.kind}</span><h3>{m.title}</h3><p>{m.description}</p><small>{m.kind==="podcast"||m.kind==="audio"||m.kind==="music"?<Headphones size={14}/>:<Video size={14}/>} Watch or listen</small></div></button>)}</div>}
 </section>
 {active&&<div className="ascMediaBackdrop" role="presentation" onMouseDown={()=>setActive(null)}><section className="ascMediaModal" role="dialog" aria-modal="true" aria-label={active.title} onMouseDown={e=>e.stopPropagation()}><div className="ascMediaModalHead"><h2>{active.title}</h2><button type="button" aria-label="Close player" onClick={()=>setActive(null)}>Close</button></div>{embed?<iframe title={active.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen src={embed}/>:fileUrl&&["audio","podcast","music"].includes(active.kind)?<audio controls autoPlay src={fileUrl}/>:fileUrl?<video controls autoPlay playsInline src={fileUrl}/>:<p>Source URL is unavailable or unsupported.</p>}<p>{active.description}</p></section></div>}
 <section className="ascWrap ascMediaFooter"><ShieldCheck size={20}/><p>Media is published through a reviewed editorial catalogue. Member and paid access will be introduced when those access flows are verified.</p></section>
 </main>;
}
