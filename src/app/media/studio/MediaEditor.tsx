"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Check,Plus,RefreshCcw,Shield,X} from "lucide-react";
import {createBrowserSupabaseClient} from "../../lib/supabaseBrowser";
import "../media-app.css";
import "../../hub/hub.css";
type Item={id:string;title:string;description:string;kind:string;source:string;source_url:string;thumbnail_url:string|null;access_level:string;published:boolean;created_at:string};
const empty={title:"",description:"",kind:"video",source:"youtube",source_url:"",thumbnail_url:"",access_level:"free"};
function externalUrl(v:string){try{const u=new URL(v);return u.protocol==="https:"?u.toString():null;}catch{return null;}}
export default function MediaEditor(){
 const client=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [allowed,setAllowed]=useState(false);
 const [items,setItems]=useState<Item[]>([]);
 const [form,setForm]=useState(empty);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [status,setStatus]=useState("");
 const [editing,setEditing]=useState<string|null>(null);
 async function load(){
  if(!client){setStatus("Database connection unavailable.");setLoading(false);return;}
  setLoading(true);setStatus("");
  const {data:{user}}=await client.auth.getUser();
  if(!user){setAllowed(false);setStatus("Sign in to Ascend Hub before accessing the editorial studio.");setLoading(false);return;}
  const {data:admin,error:permissionError}=await client.rpc("is_ascend_hub_admin");
  if(permissionError||admin!==true){setAllowed(false);setStatus("Editorial access restricted to authorized Club administrators.");setLoading(false);return;}
  setAllowed(true);
  const {data,error}=await client.from("ascend_media_items").select("id,title,description,kind,source,source_url,thumbnail_url,access_level,published,created_at").order("created_at",{ascending:false}).limit(150);
  setItems((data||[]) as Item[]);if(error)setStatus(error.message);setLoading(false);
 }
 useEffect(()=>{void load();},[]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!client||!allowed)return;
  if(form.title.trim().length<3||!externalUrl(form.source_url)){setStatus("Enter a title and valid HTTPS media source.");return;}
  if(form.thumbnail_url.trim()&&!externalUrl(form.thumbnail_url)){setStatus("Thumbnail must be a valid HTTPS URL.");return;}
  setSaving(true);setStatus("");
  const payload={title:form.title.trim(),description:form.description.trim(),kind:form.kind,source:form.source,source_url:form.source_url.trim(),thumbnail_url:form.thumbnail_url.trim()||null,access_level:form.access_level,published:false,updated_at:new Date().toISOString()};
  const result=editing?await client.from("ascend_media_items").update(payload).eq("id",editing):await client.from("ascend_media_items").insert(payload);
  setSaving(false);
  if(result.error){setStatus(result.error.message);return;}
  setForm(empty);setEditing(null);setStatus("Draft saved. Publish it when the source, rights, and metadata are verified.");await load();
 }
 async function publish(item:Item,publicly:boolean){
  if(!client||!allowed)return;setSaving(true);setStatus("");
  const {error}=await client.from("ascend_media_items").update({published:publicly,updated_at:new Date().toISOString()}).eq("id",item.id);
  setSaving(false);
  if(error){setStatus(error.message);return;}
  setItems(list=>list.map(x=>x.id===item.id?{...x,published:publicly}:x));
 }
 function edit(item:Item){setEditing(item.id);setForm({title:item.title,description:item.description,kind:item.kind,source:item.source,source_url:item.source_url,thumbnail_url:item.thumbnail_url||"",access_level:item.access_level});window.scrollTo({top:0,behavior:"smooth"});}
 return <main className="ascMediaApp"><section className="ascInnerHero ascWrap"><p className="ascOverline">ASCEND MEDIA / STUDIO</p><h1>Editorial <em>Studio.</em></h1><p>Publish real media into the public library after reviewing rights and source URLs.</p></section>
 <div className="ascWrap ascMediaLibrary"><Link className="ascTextLink" href="/media"><ArrowLeft size={16}/> Return to the library</Link><button type="button" className="ascHubCreate" onClick={()=>void load()}><RefreshCcw size={16}/> Refresh</button>
 {loading&&<p role="status">Checking editorial permissions…</p>}{status&&<p className="ascMediaMessage" role="status">{status}</p>}
 {allowed&&<><form onSubmit={submit} className="ascHubForm ascHubProjectForm">
 <h2>{editing?"Edit media draft":"Create a media draft"}</h2><label htmlFor="media-title">Title</label><input id="media-title" required minLength={3} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><label htmlFor="media-desc">Description</label><textarea id="media-desc" rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="ascHubFields"><div><label htmlFor="media-kind">Format</label><select id="media-kind" value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}>{["video","documentary","podcast","audio","music","course"].map(x=><option key={x} value={x}>{x}</option>)}</select></div><div><label htmlFor="media-source">Source</label><select id="media-source" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}><option value="youtube">YouTube</option><option value="file">Hosted HTTPS file</option></select></div></div>
 <label htmlFor="media-url">Media URL (HTTPS)</label><input id="media-url" required type="url" placeholder="https://" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})}/><label htmlFor="media-thumb">Thumbnail image URL (HTTPS, optional)</label><input id="media-thumb" type="url" placeholder="https://" value={form.thumbnail_url} onChange={e=>setForm({...form,thumbnail_url:e.target.value})}/>
 <label htmlFor="media-access">Access level</label><select id="media-access" value={form.access_level} onChange={e=>setForm({...form,access_level:e.target.value})}><option value="free">Free/public</option><option value="member">Member (restricted; not in public library)</option><option value="paid">Paid (restricted; not in public library)</option><option value="exclusive">Exclusive (restricted; not in public library)</option></select>
 <button type="submit" disabled={saving}><Plus size={17}/> {saving?"Saving…":"Save unpublished draft"}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(empty);}}>Cancel edit</button>}</form>
 <section><h2>Editorial queue</h2>{items.length===0?<p>No items yet.</p>:items.map(item=><article className="ascHubAdminCard" key={item.id}><div><strong>{item.title}</strong><p>{item.kind} · {item.published?"Published":"Draft"} · {item.access_level}</p><p>{item.description}</p></div><div className="ascHubAdminActions"><button type="button" onClick={()=>edit(item)}>Edit</button><button disabled={saving} type="button" onClick={()=>void publish(item,!item.published)}>{item.published?<X size={16}/>:<Check size={16}/>} {item.published?"Unpublish":"Publish"}</button></div></article>)}</section></>}
 </div></main>;
}
