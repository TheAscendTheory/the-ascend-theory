"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Check,RefreshCcw,Shield, X} from "lucide-react";
import {createBrowserSupabaseClient} from "../../lib/supabaseBrowser";
import "./admin.css";

type Application={user_id:string;display_name:string;organization:string;discipline:string;country:string;city:string;bio:string;website:string;status:string;created_at:string};
type Initiative={id:string;title:string;owner_id:string;discipline:string;country:string;description:string;status:string;created_at:string};
type Report={id:string;reporter_id:string;target_type:string;target_user_id:string|null;target_project_id:string|null;reason:string;status:string;created_at:string};
export default function HubAdminClient(){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [allowed,setAllowed]=useState(false);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState<string|null>(null);
 const [error,setError]=useState("");
 const [members,setMembers]=useState<Application[]>([]);
 const [projects,setProjects]=useState<Initiative[]>([]);
 const [reports,setReports]=useState<Report[]>([]);
 async function refresh(){
  if(!supabase){setError("Database connection unavailable");setLoading(false);return;}
  setError("");setLoading(true);
  const user=await supabase.auth.getUser();
  if(!user.data.user){setAllowed(false);setError("Sign in through Ascend Hub first.");setLoading(false);return;}
  const permission=await supabase.rpc("is_ascend_hub_admin");
  if(permission.error||permission.data!==true){setAllowed(false);setError("This page is restricted to authorized Club administrators.");setLoading(false);return;}
  setAllowed(true);
  const [a,b,c]=await Promise.all([
   supabase.from("ascend_hub_members").select("user_id,display_name,organization,discipline,country,city,bio,website,status,created_at").eq("status","pending").order("created_at",{ascending:true}).limit(100),
   supabase.from("ascend_hub_projects").select("id,title,owner_id,discipline,country,description,status,created_at").eq("status","pending").order("created_at",{ascending:true}).limit(100),
   supabase.from("ascend_hub_reports").select("id,reporter_id,target_type,target_user_id,target_project_id,reason,status,created_at").eq("status","pending").order("created_at",{ascending:true}).limit(100)
  ]);
  if(a.error||b.error||c.error)setError(a.error?.message||b.error?.message||c.error?.message||"Failed to load review queue");
  setMembers((a.data||[]) as Application[]);setProjects((b.data||[]) as Initiative[]);setReports((c.data||[]) as Report[]);
  setLoading(false);
 }
 useEffect(()=>{queueMicrotask(()=>{void refresh();});/* admin role checked on every write by RLS */},[]);
 async function moderate(table:"ascend_hub_members"|"ascend_hub_projects",id:string,status:"approved"|"declined"){
  if(!supabase||!allowed)return;
  setBusy(id);setError("");
  const column=table==="ascend_hub_members"?"user_id":"id";
  const {error}=await supabase.from(table).update({status,updated_at:new Date().toISOString()}).eq(column,id).eq("status","pending");
  setBusy(null);
  if(error){setError(error.message);return;}
  if(table==="ascend_hub_members")setMembers(p=>p.filter(m=>m.user_id!==id));
  else setProjects(p=>p.filter(m=>m.id!==id));
 }
 async function resolveReport(report:Report){
  if(!supabase||!allowed)return;
  setBusy(report.id);setError("");
  const {error}=await supabase.from("ascend_hub_reports").update({status:"reviewed",updated_at:new Date().toISOString()}).eq("id",report.id).eq("status","pending");
  setBusy(null);
  if(error){setError(error.message);return;}
  setReports(current=>current.filter(x=>x.id!==report.id));
 }
 return <main className="ascHub">
  <section className="ascWrap ascHubHero"><div><p className="ascOverline">THE ASCENDERS CLUB / MODERATION</p><h1>Hub <em>Review.</em></h1><p>Approve people and initiatives before they enter the curated network.</p></div></section>
  <div className="ascWrap ascHubWorkspace">
   <div className="ascHubToolbar"><Link className="ascTextLink" href="/hub"><ArrowLeft size={16}/> Back to Hub</Link><button type="button" className="ascHubCreate" onClick={()=>void refresh()}><RefreshCcw size={17}/> Reload queue</button></div>
   {loading&&<p role="status">Checking administrator permissions and loading applications…</p>}
   {error&&<p className="ascHubStatus" role="alert">{error}</p>}
   {allowed&&<>
    <section className="ascHubAdminSection"><h2><Shield size={22}/> Membership requests ({members.length})</h2>
    {members.length===0?<p>No membership requests awaiting review.</p>:members.map(m=><article className="ascHubAdminCard" key={m.user_id}><div><strong>{m.display_name}</strong><p>{[m.organization,m.discipline,m.city,m.country].filter(Boolean).join(" · ")}</p><p>{m.bio||"No biography submitted"}</p>{m.website&&<p>Website: {m.website}</p>}<small>Submitted {new Date(m.created_at).toLocaleDateString()}</small></div><div className="ascHubAdminActions"><button disabled={busy===m.user_id} onClick={()=>void moderate("ascend_hub_members",m.user_id,"approved")}><Check size={17}/> Approve</button><button disabled={busy===m.user_id} onClick={()=>void moderate("ascend_hub_members",m.user_id,"declined")}><X size={17}/> Decline</button></div></article>)}
    </section>
    <section className="ascHubAdminSection"><h2>Project submissions ({projects.length})</h2>
    {projects.length===0?<p>No project submissions awaiting review.</p>:projects.map(p=><article className="ascHubAdminCard" key={p.id}><div><strong>{p.title}</strong><p>{[p.discipline,p.country].filter(Boolean).join(" · ")}</p><p>{p.description}</p><small>Submitted {new Date(p.created_at).toLocaleDateString()}</small></div><div className="ascHubAdminActions"><button disabled={busy===p.id} onClick={()=>void moderate("ascend_hub_projects",p.id,"approved")}><Check size={17}/> Approve</button><button disabled={busy===p.id} onClick={()=>void moderate("ascend_hub_projects",p.id,"declined")}><X size={17}/> Decline</button></div></article>)}
    </section>
    <section className="ascHubAdminSection"><h2>Member safety reports ({reports.length})</h2>
    {reports.length===0?<p>No new safety reports.</p>:reports.map(report=><article className="ascHubAdminCard" key={report.id}><div><strong>Report: {report.target_type}</strong><p>{report.reason}</p><small>Submitted {new Date(report.created_at).toLocaleString()}</small><p>Target ID: {report.target_type==="member"?report.target_user_id:report.target_project_id}</p></div><div className="ascHubAdminActions"><button type="button" disabled={busy===report.id} onClick={()=>void resolveReport(report)}><Check size={17}/> Mark reviewed</button></div></article>)}
    </section>
   </>}
  </div>
 </main>;
}
