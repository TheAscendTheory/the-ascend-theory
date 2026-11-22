"use client";

import {FormEvent,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowRight,CheckCircle2,Compass,ExternalLink,Globe2,LogIn,MapPin,Plus,Search,ShieldCheck,Users} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createBrowserSupabaseClient} from "../lib/supabaseBrowser";
import "./hub.css";

type Member={user_id:string;display_name:string;organization:string;country:string;city:string;discipline:string;bio:string;website:string;status:"pending"|"approved"|"declined"};
type Project={id:string;owner_id:string;title:string;description:string;discipline:string;country:string;city:string;latitude:number|null;longitude:number|null;website:string;looking_for:string;status:"pending"|"approved"|"declined";created_at:string};
type View="projects"|"people"|"apply"|"submit";
const clean=(v:string,max=300)=>v.trim().slice(0,max);
function safeUrl(value:string){try{const url=new URL(value);return url.protocol==="https:"||url.protocol==="http:"?url.toString():null;}catch{return null;}}
const emptyMember={display_name:"",organization:"",city:"",country:"",discipline:"",bio:"",website:""};
const emptyProject={title:"",description:"",discipline:"",city:"",country:"",latitude:"",longitude:"",website:"",looking_for:""};
export default function HubClient(){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [user,setUser]=useState<User|null>(null);
 const [email,setEmail]=useState("");
 const [view,setView]=useState<View>("projects");
 const [membership,setMembership]=useState<Member|null>(null);
 const [members,setMembers]=useState<Member[]>([]);
 const [blocked,setBlocked]=useState<Set<string>>(new Set());
 const [reportTarget,setReportTarget]=useState<{kind:"project"|"member";id:string;name:string}|null>(null);
 const [reportReason,setReportReason]=useState("");
 const [projects,setProjects]=useState<Project[]>([]);
 const [memberDraft,setMemberDraft]=useState(emptyMember);
 const [projectDraft,setProjectDraft]=useState(emptyProject);
 const [query,setQuery]=useState("");
 const [discipline,setDiscipline]=useState("All disciplines");
 const [selected,setSelected]=useState<string|null>(null);
 const [status,setStatus]=useState("");
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [setupMissing,setSetupMissing]=useState(false);

 useEffect(()=>{
   if(!supabase){setLoading(false);setSetupMissing(true);return;}
   let current=true;
   async function load(currentUser:User|null){
     if(!supabase)return;
     setLoading(true);
     setStatus("");
     setMembership(null);setMembers([]);setProjects([]);
     if(!currentUser){if(current)setLoading(false);return;}
     const own=await supabase.from("ascend_hub_members").select("user_id,display_name,organization,country,city,discipline,bio,website,status").eq("user_id",currentUser.id).maybeSingle();
     if(!current)return;
     if(own.error){
       setSetupMissing(true);
       setStatus("The Hub membership service is not available. Contact the Club for assistance.");
       setLoading(false);return;
     }
     setSetupMissing(false);
     setMembership(own.data as Member|null);
     const {data:blockRows}=await supabase.from("ascend_hub_blocks").select("blocked_id").eq("blocker_id",currentUser.id);
     if(current)setBlocked(new Set((blockRows||[]).map(row=>row.blocked_id)));
     if(own.data?.status==="approved"){
       const [people,work]=await Promise.all([
         supabase.from("ascend_hub_members").select("user_id,display_name,organization,country,city,discipline,bio,website,status").eq("status","approved").order("display_name"),
         supabase.from("ascend_hub_projects").select("id,owner_id,title,description,discipline,country,city,latitude,longitude,website,looking_for,status,created_at").eq("status","approved").order("created_at",{ascending:false}).limit(100)
       ]);
       if(!current)return;
       if(people.error||work.error)setStatus("Some directory data could not be loaded. Please try again.");
       setMembers((people.data||[]) as Member[]);
       setProjects((work.data||[]) as Project[]);
     }
     setLoading(false);
   }
   supabase.auth.getUser().then(({data})=>{if(current){setUser(data.user);void load(data.user);}});
   const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(current){setUser(session?.user||null);void load(session?.user||null);}});
   return()=>{current=false;subscription.unsubscribe();};
 },[supabase]);

 const approved=membership?.status==="approved";
 const categories=useMemo(()=>["All disciplines",...Array.from(new Set([...projects.map(p=>p.discipline),...members.map(p=>p.discipline)].filter(Boolean))).sort()],[projects,members]);
 const normalized=query.trim().toLowerCase();
 const filteredProjects=projects.filter(p=>!blocked.has(p.owner_id)&&(discipline==="All disciplines"||p.discipline===discipline)&&[p.title,p.description,p.city,p.country,p.discipline,p.looking_for].join(" ").toLowerCase().includes(normalized));
 const filteredMembers=members.filter(p=>!blocked.has(p.user_id)&&(discipline==="All disciplines"||p.discipline===discipline)&&[p.display_name,p.organization,p.city,p.country,p.bio,p.discipline].join(" ").toLowerCase().includes(normalized));
 const activeProject=filteredProjects.find(p=>p.id===selected)||filteredProjects.find(p=>p.latitude!==null&&p.longitude!==null)||null;
 const osmMap=activeProject&&activeProject.latitude!==null&&activeProject.longitude!==null
   ? `https://www.openstreetmap.org/export/embed.html?bbox=${activeProject.longitude-1.4}%2C${activeProject.latitude-1}%2C${activeProject.longitude+1.4}%2C${activeProject.latitude+1}&layer=mapnik&marker=${activeProject.latitude}%2C${activeProject.longitude}`
   : null;
 async function sendSignIn(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(!supabase)return;
   setSaving(true);setStatus("");
   const {error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:window.location.origin+"/hub"}});
   setSaving(false);setStatus(error?error.message:"Secure sign-in link sent. Check your inbox.");
 }
 async function signOut(){if(supabase){await supabase.auth.signOut();setStatus("Signed out.");}}
 async function apply(e:FormEvent<HTMLFormElement>){
   e.preventDefault();
   if(!supabase||!user||membership)return;
   if(clean(memberDraft.display_name,100).length<2){setStatus("Enter your full name or preferred public name.");return;}
   if(memberDraft.website.trim()&&!safeUrl(memberDraft.website.trim())){setStatus("Website must begin with https:// or http://");return;}
   setSaving(true);setStatus("");
   const payload={user_id:user.id,display_name:clean(memberDraft.display_name,100),organization:clean(memberDraft.organization,120),city:clean(memberDraft.city,100),country:clean(memberDraft.country,100),discipline:clean(memberDraft.discipline,100),bio:clean(memberDraft.bio,1500),website:clean(memberDraft.website,300),status:"pending"};
   const {data,error}=await supabase.from("ascend_hub_members").insert(payload).select("user_id,display_name,organization,country,city,discipline,bio,website,status").single();
   setSaving(false);
   if(error){setStatus("Application could not be submitted: "+error.message);return;}
   setMembership(data as Member);setStatus("Application received. The Club reviews each membership request.");
 }
 async function submitProject(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(!supabase||!user||!approved)return;
   if(clean(projectDraft.title,150).length<5||clean(projectDraft.description,3000).length<30){setStatus("Add a title (5+ characters) and a description (30+ characters).");return;}
   if(projectDraft.website.trim()&&!safeUrl(projectDraft.website)){setStatus("Website must begin with https:// or http://");return;}
   const latitude=projectDraft.latitude.trim()===""?null:Number(projectDraft.latitude);
   const longitude=projectDraft.longitude.trim()===""?null:Number(projectDraft.longitude);
   if((latitude===null)!==(longitude===null)||latitude!==null&&(!Number.isFinite(latitude)||latitude < -90||latitude >90)||longitude!==null&&(!Number.isFinite(longitude)||longitude < -180||longitude >180)){setStatus("Provide both valid latitude and longitude, or leave both empty.");return;}
   setSaving(true);setStatus("");
   const {error}=await supabase.from("ascend_hub_projects").insert({owner_id:user.id,title:clean(projectDraft.title,150),description:clean(projectDraft.description,3000),discipline:clean(projectDraft.discipline,100),city:clean(projectDraft.city,100),country:clean(projectDraft.country,100),latitude,longitude,website:clean(projectDraft.website,300),looking_for:clean(projectDraft.looking_for,500),status:"pending"});
   setSaving(false);
   if(error){setStatus("Project could not be submitted: "+error.message);return;}
   setProjectDraft(emptyProject);setView("projects");setStatus("Project submitted for review. It will appear in discovery once approved.");
 }
 async function submitReport(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(!supabase||!user||!reportTarget)return;
  if(reportReason.trim().length<10){setStatus("Describe the issue in at least ten characters.");return;}
  setSaving(true);setStatus("");
  const payload={reporter_id:user.id,target_type:reportTarget.kind,target_user_id:reportTarget.kind==="member"?reportTarget.id:null,target_project_id:reportTarget.kind==="project"?reportTarget.id:null,reason:reportReason.trim().slice(0,1500)};
  const {error}=await supabase.from("ascend_hub_reports").insert(payload);
  setSaving(false);
  if(error){setStatus(error.message);return;}
  setReportTarget(null);setReportReason("");setStatus("Report received. The Club will review it.");
 }
 async function blockMember(id:string){
  if(!supabase||!user||id===user.id)return;
  const {error}=await supabase.from("ascend_hub_blocks").insert({blocker_id:user.id,blocked_id:id});
  if(error){setStatus(error.message);return;}
  setBlocked(previous=>new Set([...previous,id]));setStatus("Member blocked from your directory.");
 }
 const memberField=(key:keyof typeof emptyMember,value:string)=>setMemberDraft(old=>({...old,[key]:value}));
 const projectField=(key:keyof typeof emptyProject,value:string)=>setProjectDraft(old=>({...old,[key]:value}));
 const location=(city:string,country:string)=>[city,country].filter(Boolean).join(", ")||"Worldwide";

 return <main className="ascHub">
  <section className="ascHubHero ascWrap">
   <div><p className="ascOverline">THE ASCENDERS CLUB / COLLABORATION</p><h1>Ascend <em>Hub.</em></h1><p>A curated network for discovering changemakers, initiatives and opportunities to collaborate across borders and disciplines.</p></div>
   <div className="ascHubHeroMark" aria-hidden="true"><Globe2 size={72} strokeWidth={.9}/><div className="ascHubOrbit"/><div className="ascHubOrbit ascHubOrbitTwo"/></div>
  </section>

  <section className="ascWrap ascHubWorkspace">
   {!supabase||setupMissing?<div className="ascHubNotice" role="status"><ShieldCheck size={24}/><div><h2>Hub access is being configured</h2><p>The secure membership database is not yet accessible. The public website remains available; no application has been recorded.</p><a href="mailto:contact@theascendersclub.com?subject=Ascend%20Hub%20Access">Contact the Club</a></div></div>
   :!user?<div className="ascHubAccess"><div><p className="ascOverline">PRIVATE NETWORK / VERIFIED MEMBERSHIP</p><h2>Join a network built for collaboration.</h2><p>Sign in with a secure email link to request membership. Once approved, you can explore the member directory, discover projects and propose your own initiatives.</p><div className="ascHubBenefits"><span><Users size={17}/> Curated membership</span><span><Compass size={17}/> Project discovery</span><span><MapPin size={17}/> Geographic exploration</span></div></div><form onSubmit={sendSignIn} className="ascHubForm"><h3>Access Ascend Hub</h3><label htmlFor="hub-email">Email address</label><input id="hub-email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/><button type="submit" disabled={saving}><LogIn size={17}/>{saving?"Sending link…":"Continue with email"}</button><p>Membership is subject to review. Your profile is visible only to other approved members.</p></form></div>
   :!approved?<div className="ascHubAccess"><div><p className="ascOverline">MEMBERSHIP / {membership?.status||"APPLICATION"}</p><h2>{membership?.status==="pending"?"Your application is under review.":membership?.status==="declined"?"Your application has been reviewed.":"Introduce yourself to the Club."}</h2><p>{membership?.status==="pending"?"The Club reviews membership requests before granting directory access.":membership?.status==="declined"?"This application was not approved. Contact the Club if you have questions.":"Tell us about your work, where you are based, and what you hope to build with others."}</p><p className="ascHubSignedIn">Signed in as {user.email} <button type="button" onClick={signOut}>Sign out</button></p></div>{!membership&&<form className="ascHubForm" onSubmit={apply}><h3>Request membership</h3><label htmlFor="h-name">Public display name *</label><input id="h-name" required minLength={2} maxLength={100} value={memberDraft.display_name} onChange={e=>memberField("display_name",e.target.value)}/><label htmlFor="h-org">Organization</label><input id="h-org" maxLength={120} value={memberDraft.organization} onChange={e=>memberField("organization",e.target.value)}/><div className="ascHubFields"><div><label htmlFor="h-city">City</label><input id="h-city" maxLength={100} value={memberDraft.city} onChange={e=>memberField("city",e.target.value)}/></div><div><label htmlFor="h-country">Country</label><input id="h-country" maxLength={100} value={memberDraft.country} onChange={e=>memberField("country",e.target.value)}/></div></div><label htmlFor="h-focus">Discipline / field</label><input id="h-focus" maxLength={100} value={memberDraft.discipline} onChange={e=>memberField("discipline",e.target.value)}/><label htmlFor="h-bio">About you and your work</label><textarea id="h-bio" rows={4} maxLength={1500} value={memberDraft.bio} onChange={e=>memberField("bio",e.target.value)}/><label htmlFor="h-web">Website (optional)</label><input id="h-web" type="url" placeholder="https://" maxLength={300} value={memberDraft.website} onChange={e=>memberField("website",e.target.value)}/><button type="submit" disabled={saving}>{saving?"Submitting…":"Submit membership request"}<ArrowRight size={17}/></button></form>}</div>
   :<div className="ascHubApp">
     <div className="ascHubToolbar"><div><p className="ascOverline">APPROVED NETWORK</p><h2>Discover & collaborate.</h2><p className="ascHubSignedIn">Welcome, {membership.display_name}. <Link href="/settings">Account settings</Link> <button type="button" onClick={signOut}>Sign out</button></p></div><button className="ascHubCreate" type="button" onClick={()=>{setView(view==="submit"?"projects":"submit");setStatus("");}}><Plus size={18}/> {view==="submit"?"Back to discovery":"Submit an initiative"}</button></div>
     <nav className="ascHubTabs" aria-label="Hub views"><button type="button" aria-current={view==="projects"?"page":undefined} onClick={()=>setView("projects")}><Compass size={18}/> Projects</button><button type="button" aria-current={view==="people"?"page":undefined} onClick={()=>setView("people")}><Users size={18}/> Members</button></nav>
     {view==="submit"?<form className="ascHubForm ascHubProjectForm" onSubmit={submitProject}><h3>Propose an initiative</h3><p>Projects are reviewed before they are visible to the community. Map coordinates are optional.</p><label htmlFor="p-title">Project name *</label><input id="p-title" required minLength={5} maxLength={150} value={projectDraft.title} onChange={e=>projectField("title",e.target.value)}/><label htmlFor="p-desc">What is the initiative doing? *</label><textarea id="p-desc" required minLength={30} maxLength={3000} rows={5} value={projectDraft.description} onChange={e=>projectField("description",e.target.value)}/><label htmlFor="p-category">Discipline</label><input id="p-category" maxLength={100} value={projectDraft.discipline} onChange={e=>projectField("discipline",e.target.value)}/><div className="ascHubFields"><div><label htmlFor="p-city">City</label><input id="p-city" maxLength={100} value={projectDraft.city} onChange={e=>projectField("city",e.target.value)}/></div><div><label htmlFor="p-country">Country</label><input id="p-country" maxLength={100} value={projectDraft.country} onChange={e=>projectField("country",e.target.value)}/></div></div><div className="ascHubFields"><div><label htmlFor="p-lat">Latitude (optional)</label><input id="p-lat" type="number" step="any" min="-90" max="90" value={projectDraft.latitude} onChange={e=>projectField("latitude",e.target.value)}/></div><div><label htmlFor="p-long">Longitude (optional)</label><input id="p-long" type="number" step="any" min="-180" max="180" value={projectDraft.longitude} onChange={e=>projectField("longitude",e.target.value)}/></div></div><label htmlFor="p-seek">Looking to collaborate with</label><input id="p-seek" maxLength={500} value={projectDraft.looking_for} onChange={e=>projectField("looking_for",e.target.value)}/><label htmlFor="p-web">Project URL</label><input id="p-web" type="url" maxLength={300} placeholder="https://" value={projectDraft.website} onChange={e=>projectField("website",e.target.value)}/><button type="submit" disabled={saving}>{saving?"Submitting…":"Submit for review"}<ArrowRight size={17}/></button></form>:<>
       <div className="ascHubFilters"><div className="ascHubSearch"><Search size={19}/><input aria-label="Search the directory" placeholder="Search people, projects, places, disciplines…" value={query} onChange={e=>setQuery(e.target.value)}/></div><select aria-label="Filter by discipline" value={discipline} onChange={e=>setDiscipline(e.target.value)}>{categories.map(k=><option key={k}>{k}</option>)}</select></div>
       {view==="projects"?<div className="ascHubDirectory"><div className="ascHubResults"><p className="ascOverline">{filteredProjects.length} APPROVED INITIATIVES</p>{filteredProjects.length===0?<div className="ascHubEmpty"><Compass size={32}/><h3>No projects to display yet</h3><p>Approved initiatives will appear here as the Club grows. Members can submit projects for review.</p></div>:filteredProjects.map(project=><button type="button" onClick={()=>setSelected(project.id)} className={activeProject?.id===project.id?"ascHubResult isActive":"ascHubResult"} key={project.id}><span className="ascHubTag">{project.discipline||"Initiative"}</span><strong>{project.title}</strong><span>{project.description}</span><small><MapPin size={14}/>{location(project.city,project.country)}</small>{project.looking_for&&<small>Seeking: {project.looking_for}</small>}</button>)}</div><div className="ascHubMap"><div className="ascHubMapHeader"><Globe2 size={20}/><span>{activeProject?"Project location":"Worldwide discovery"}</span></div>{osmMap?<iframe key={osmMap} loading="lazy" title={`Map showing ${activeProject?.title||"initiative"}`} src={osmMap} referrerPolicy="strict-origin-when-cross-origin"/>:<div className="ascHubMapEmpty"><Globe2 size={65} strokeWidth={.8}/><p>Projects with confirmed map coordinates appear here.</p></div>}{activeProject&&<div className="ascHubMapInfo"><strong>{activeProject.title}</strong><span>{location(activeProject.city,activeProject.country)}</span>{safeUrl(activeProject.website)&&<a target="_blank" rel="noopener noreferrer" href={safeUrl(activeProject.website)!}>Visit project <ExternalLink size={15}/></a>}<button type="button" className="ascHubSafetyAction" onClick={()=>setReportTarget({kind:"project",id:activeProject.id,name:activeProject.title})}>Report this project</button></div>}<small>Map data © OpenStreetMap contributors</small></div></div>
       :<div className="ascHubPeople"><p className="ascOverline">{filteredMembers.length} APPROVED MEMBERS</p>{filteredMembers.length===0?<div className="ascHubEmpty">No approved members match this search.</div>:filteredMembers.map(person=><article key={person.user_id} className="ascHubPerson"><div className="ascHubAvatar" aria-hidden="true">{person.display_name.slice(0,1).toUpperCase()}</div><div><h3>{person.display_name}</h3><span>{person.organization||person.discipline||"Ascender"}</span><p><MapPin size={14}/>{location(person.city,person.country)}</p><p>{person.bio}</p>{safeUrl(person.website)&&<a href={safeUrl(person.website)!} target="_blank" rel="noopener noreferrer">Website <ExternalLink size={15}/></a>}<div className="ascHubSafetyActions"><button type="button" onClick={()=>setReportTarget({kind:"member",id:person.user_id,name:person.display_name})}>Report</button>{person.user_id!==user.id&&<button type="button" onClick={()=>void blockMember(person.user_id)}>Block member</button>}</div></div></article>)}</div>}
     </>}
   </div>}
   {status&&<p className="ascHubStatus" role="status">{status}</p>}
   {loading&&<p className="ascHubStatus" role="status">Loading your Hub workspace…</p>}
  </section>
  {reportTarget&&<div className="ascHubModalBackdrop" role="presentation" onClick={()=>setReportTarget(null)}><form className="ascHubForm ascHubReportDialog" role="dialog" aria-modal="true" aria-label="Report content" onClick={e=>e.stopPropagation()} onSubmit={submitReport}><h3>Report {reportTarget.kind}</h3><p>{reportTarget.name}</p><label htmlFor="hub-report-reason">Describe the concern</label><textarea id="hub-report-reason" required minLength={10} maxLength={1500} rows={5} value={reportReason} onChange={e=>setReportReason(e.target.value)}/><button disabled={saving} type="submit">{saving?"Submitting…":"Send report for review"}</button><button type="button" onClick={()=>{setReportTarget(null);setReportReason("");}}>Cancel</button></form></div>}
  <section className="ascWrap ascHubPrinciples"><div><ShieldCheck size={23}/><h3>Curated by people</h3><p>Membership and initiatives are reviewed before community access or publication.</p></div><div><Globe2 size={23}/><h3>Across borders</h3><p>Search by work, discipline and geography—not prestige or follower count.</p></div><div><CheckCircle2 size={23}/><h3>Real projects</h3><p>Connect around practical work, collaborations and opportunities to contribute.</p></div></section>
 </main>;
}
