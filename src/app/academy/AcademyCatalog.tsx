"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowRight,BookOpen,GraduationCap,Search} from "lucide-react";
import {createBrowserSupabaseClient} from "../lib/supabaseBrowser";
import "./academy-app.css";
type Course={id:string;slug:string;title:string;summary:string;discipline:string;cover_url:string;published:boolean};
export default function AcademyCatalog(){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [courses,setCourses]=useState<Course[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [query,setQuery]=useState("");
 const [topic,setTopic]=useState("All disciplines");
 useEffect(()=>{
  if(!supabase){setLoading(false);setError("Academy database connection is not configured.");return;}
  let active=true;
  supabase.from("ascend_academy_courses").select("id,slug,title,summary,discipline,cover_url,published").eq("published",true).order("created_at",{ascending:false}).limit(100).then(({data,error})=>{
   if(!active)return;
   setCourses((data||[]) as Course[]);setError(error?.message||"");setLoading(false);
  });
  return()=>{active=false;};
 },[supabase]);
 const disciplines=["All disciplines",...Array.from(new Set(courses.map(x=>x.discipline).filter(Boolean))).sort()];
 const visible=courses.filter(c=>(topic==="All disciplines"||c.discipline===topic)&&[c.title,c.summary,c.discipline].join(" ").toLowerCase().includes(query.toLowerCase()));
 return <main className="ascAcademyApp">
  <section className="ascInnerHero ascWrap"><p className="ascOverline">ASCEND ACADEMY / LEARNING</p><h1>Knowledge in <em>motion.</em></h1><p>An evolving interdisciplinary learning environment. Courses are published when educators have completed the material; the previous finance curriculum is no longer part of this Academy.</p></section>
  <section className="ascWrap ascAcademyCatalog"><div className="ascAcademyHeading"><div><p className="ascOverline">LEARN / EXPLORE / APPLY</p><h2>Learning library.</h2></div><BookOpen size={42} strokeWidth={1}/></div>
  <div className="ascAcademyFilters"><div><Search size={18}/><input aria-label="Search courses" placeholder="Search subjects, courses, disciplines…" value={query} onChange={e=>setQuery(e.target.value)}/></div><select aria-label="Filter by discipline" value={topic} onChange={e=>setTopic(e.target.value)}>{disciplines.map(x=><option key={x}>{x}</option>)}</select></div>
  {loading?<p role="status">Loading Academy courses…</p>:error?<p className="ascAcademyNotice" role="status">The Academy catalogue is not available: {error}</p>:visible.length===0?<div className="ascAcademyEmpty"><GraduationCap size={48} strokeWidth={1.1}/><h3>No published courses in this view.</h3><p>Courses appear here after editorial publication. We are not presenting unfinished or invented lessons as completed education.</p></div>:<div className="ascAcademyCards">{visible.map(course=><Link className="ascAcademyCard" href={`/academy/${course.slug}`} key={course.id}><div className="ascAcademyCardArt" aria-hidden="true"><div/><span><BookOpen size={36} strokeWidth={1.2}/></span></div><div className="ascAcademyCardText"><small>{course.discipline||"Interdisciplinary"}</small><h3>{course.title}</h3><p>{course.summary}</p><span>Enter course <ArrowRight size={17}/></span></div></Link>)}</div>}
  </section>
 </main>;
}
