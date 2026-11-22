"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ShieldCheck,Trash2} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createBrowserSupabaseClient} from "../lib/supabaseBrowser";
import "../hub/hub.css";
export default function AccountSettings(){
 const client=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true);
 const [confirm,setConfirm]=useState("");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [deleted,setDeleted]=useState(false);
 useEffect(()=>{
  if(!client){queueMicrotask(()=>setLoading(false));return;}
  let active=true;
  client.auth.getUser().then(({data})=>{if(active){setUser(data.user);setLoading(false);}});
  const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{if(active){setUser(session?.user||null);setLoading(false);}});
  return()=>{active=false;subscription.unsubscribe();};
 },[client]);
 async function deleteAccount(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!client||!user||confirm!=="DELETE")return;
  setBusy(true);setError("");
  const {data:{session}}=await client.auth.getSession();
  if(!session){setBusy(false);setError("Your session has expired. Sign in again.");return;}
  try{
   const response=await fetch("/api/account/delete",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({confirm:"DELETE"})});
   const body=await response.json();
   if(!response.ok){setError(body.error||"Account deletion could not be completed.");return;}
   setDeleted(true);await client.auth.signOut();setConfirm("");
  }catch{setError("Unable to reach account deletion service. Contact the Club.");}finally{setBusy(false);}
 }
 return <main className="ascHub"><section className="ascInnerHero ascWrap"><p className="ascOverline">THE ASCENDERS CLUB / YOUR ACCOUNT</p><h1>Account <em>settings.</em></h1><p>Manage your account and request information about how your data is handled.</p></section><section className="ascWrap ascHubWorkspace">
 <Link className="ascTextLink" href="/hub"><ArrowLeft size={16}/> Back to Ascend Hub</Link>
 {loading?<p role="status">Checking your account…</p>:deleted?<div className="ascHubNotice" role="status"><ShieldCheck/><div><h2>Account deleted</h2><p>Your sign-in identity was deleted and your session ended. See our privacy policy for details about related data and retention.</p></div></div>:!user?<div className="ascHubNotice"><h2>Sign-in required</h2><p>Open Ascend Hub to sign in and access account controls.</p><Link className="ascTextLink" href="/hub">Sign in to Ascend Hub</Link></div>:<div className="ascHubAccess"><div><p className="ascOverline">ACCOUNT INFORMATION</p><h2>{user.email}</h2><p>Your account connects you to the Club’s applications and saved learning. Deletion is permanent and removes your access, profile and personal records that are tied to this identity through database cascading rules.</p><p><Link className="ascTextLink" href="/privacy">Review the privacy policy</Link></p></div><form className="ascHubForm" onSubmit={deleteAccount}><Trash2 size={26}/><h3>Delete your account</h3><p>This operation cannot be undone. Enter <strong>DELETE</strong> to confirm permanent removal. If automatic deletion is unavailable, contact contact@theascendersclub.com.</p><label htmlFor="delete-confirm">Type DELETE to confirm</label><input id="delete-confirm" autoComplete="off" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="DELETE"/><button disabled={busy||confirm!=="DELETE"} type="submit">{busy?"Deleting…":"Permanently delete my account"}</button>{error&&<p role="alert">{error}</p>}</form></div>}
 </section></main>;
}
