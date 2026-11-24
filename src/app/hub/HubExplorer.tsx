"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, Filter, Globe2, MapPin, Search, X } from "lucide-react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./hub.module.css";

type Category = "Event" | "Project" | "Organization" | "Person";
type Entry = { id: string; title: string; category: Category; city: string; country: string; lng: number; lat: number; detail: string; };
const colours: Record<Category, string> = { Event: "#b17850", Project: "#447766", Organization: "#806eab", Person: "#a98235" };
const categories: Category[] = ["Event","Project","Organization","Person"];

// Illustrative locations only. Replace with approved, geocoded, published records.
// No event, organization, person, or project below is represented as a real listing.
const examples: Entry[] = [
 { id:"nj", title:"New Jersey / Event example", category:"Event", city:"Newark, New Jersey", country:"United States", lng:-74.1724, lat:40.7357, detail:"Demonstration of a location-specific event marker in New Jersey. No event is currently listed." },
 { id:"toronto", title:"Toronto / Person example", category:"Person", city:"Toronto", country:"Canada", lng:-79.3832, lat:43.6532, detail:"Illustrative member discovery pin; not an actual member listing." },
 { id:"london", title:"London / Organization example", category:"Organization", city:"London", country:"United Kingdom", lng:-0.1276, lat:51.5072, detail:"Illustrative organizational location; not an actual organization listing." },
 { id:"nairobi", title:"Nairobi / Project example", category:"Project", city:"Nairobi", country:"Kenya", lng:36.8219, lat:-1.2921, detail:"Illustrative project location; not a live project or opportunity." },
 { id:"tokyo", title:"Tokyo / Event example", category:"Event", city:"Tokyo", country:"Japan", lng:139.6917, lat:35.6895, detail:"Illustrative geographic event pin; no actual event has been announced." }
];
const mapStyle = "https://tiles.openfreemap.org/styles/liberty";

export default function HubExplorer() {
 const mapElement = useRef<HTMLDivElement>(null);
 const map = useRef<MapLibreMap | null>(null);
 const markers = useRef<MapLibreMarker[]>([]);
 const [ready,setReady] = useState(false);
 const [failed,setFailed] = useState(false);
 const [category,setCategory] = useState<Category | "All">("All");
 const [search,setSearch] = useState("");
 const [selected,setSelected] = useState<string | null>("nj");
 const [showList,setShowList] = useState(true);
 const filtered=useMemo(()=>examples.filter(item=>(category==="All"||item.category===category)&&[item.title,item.city,item.country,item.category].join(" ").toLowerCase().includes(search.toLowerCase().trim())),[category,search]);
 const chosen=filtered.find(item=>item.id===selected)||filtered[0]||null;

 useEffect(()=>{
   if(!mapElement.current) return;
   let cancelled=false;
   let localMap:MapLibreMap|undefined;
   import("maplibre-gl").then(({Map})=>{
     if(cancelled||!mapElement.current)return;
     localMap=new Map({container:mapElement.current,style:mapStyle,center:[10,22],zoom:1.45,minZoom:1,maxZoom:16,attributionControl:true});
     map.current=localMap;
     localMap.on("load",()=>{if(!cancelled)setReady(true);});
     localMap.on("error",()=>{if(!cancelled)setFailed(true);});
   }).catch(()=>{if(!cancelled)setFailed(true);});
   return()=>{cancelled=true;markers.current.forEach(marker=>marker.remove());markers.current=[];localMap?.remove();map.current=null;};
 },[]);

 useEffect(()=>{
  const instance=map.current;
  if(!instance||!ready)return;
  let active=true;
  import("maplibre-gl").then(({Marker})=>{
   if(!active)return;
   markers.current.forEach(m=>m.remove());markers.current=[];
   for(const item of filtered){
    const button=document.createElement("button");
    button.type="button";
    button.className=styles.mapMarker;
    button.setAttribute("aria-label",item.title);
    button.title=item.title;
    button.style.setProperty("--pin",colours[item.category]);
    button.dataset.active=String(item.id===chosen?.id);
    button.addEventListener("click",()=>setSelected(item.id));
    const marker=new Marker({element:button,anchor:"center"}).setLngLat([item.lng,item.lat]).addTo(instance);
    markers.current.push(marker);
   }
  }).catch(()=>setFailed(true));
  return()=>{active=false;};
 },[filtered,ready,chosen?.id]);

 function focus(item:Entry){
  setSelected(item.id);
  map.current?.flyTo({center:[item.lng,item.lat],zoom:Math.max(map.current.getZoom(),4),essential:true});
 }
 function resetView(){map.current?.flyTo({center:[10,22],zoom:1.45,essential:true});setSelected(null);}
 return <main className={styles.hub}>
  <section className={styles.intro}>
    <div className={styles.introCopy}><p className={styles.eyebrow}>ASCENDERS HUB <span> / </span> THE GLOBAL NETWORK</p><h1>Discover the <em>connections.</em></h1><p>One world. Countless people, projects and ideas worth bringing together. Explore the network geographically.</p></div>
    <div className={styles.orbit} aria-hidden="true"><div/><div/><div/><span>✳</span></div>
  </section>
  <section className={styles.explorer} aria-label="Global discovery map">
   <div className={styles.toolbar}>
    <div className={styles.toolbarTitle}><Globe2 size={21}/><strong>World explorer</strong><span className={styles.demo}>INTERACTIVE PREVIEW · SAMPLE LOCATIONS</span></div>
    <div className={styles.actions}><button type="button" onClick={resetView}><Compass size={16}/> World view</button><button type="button" onClick={()=>setShowList(p=>!p)}><Filter size={16}/> {showList?"Hide":"Show"} directory</button></div>
   </div>
   <div className={styles.workspace}>
    <div className={styles.mapPanel}>
     <div ref={mapElement} className={styles.map} role="application" aria-label="Interactive geographical map with category-coloured location markers"/>
     {!ready&&!failed&&<div className={styles.mapNotice}>Loading global map…</div>}
     {failed&&<div className={styles.mapNotice}>Map tiles could not be loaded. Use the directory to explore sample locations.</div>}
     <div className={styles.legend} aria-label="Marker legend">{categories.map(c=><span key={c}><i style={{background:colours[c]}}/>{c}</span>)}</div>
    </div>
    {showList&&<aside className={styles.directory} aria-label="Location directory">
      <div className={styles.directoryHeading}><span>DISCOVER / 001</span><strong>Find your connection.</strong><p>Filter by category or location. These preview pins demonstrate the experience, not active listings.</p></div>
      <label className={styles.search}><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search a location or category" aria-label="Search sample locations"/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch("")}><X size={15}/></button>}</label>
      <div className={styles.filters} aria-label="Filter location type">{(["All",...categories] as const).map(c=><button key={c} type="button" aria-pressed={category===c} onClick={()=>{setCategory(c);setSelected(null);}}>{c}</button>)}</div>
      <div className={styles.results}><p>{filtered.length} SAMPLE {filtered.length===1?"LOCATION":"LOCATIONS"}</p>{filtered.length?filtered.map(item=><button type="button" className={styles.result} data.active={chosen?.id===item.id} onClick={()=>focus(item)} key={item.id}><span className={styles.resultTop}><span className={styles.dot} style={{background:colours[item.category]}}/>{item.category}<ArrowUpRight size={15}/></span><strong>{item.title}</strong><small><MapPin size={13}/>{item.city}, {item.country}</small></button>):<div className={styles.empty}>No matching locations. Try another category or search.</div>}</div>
    </aside>}
   </div>
   {chosen&&<div className={styles.detail}><span className={styles.dot} style={{background:colours[chosen.category]}}/><div><small>SELECTED / {chosen.category.toUpperCase()} / EXAMPLE</small><strong>{chosen.title}</strong><p>{chosen.detail}</p></div><button type="button" onClick={()=>focus(chosen)}>View on map <ArrowUpRight size={16}/></button></div>}
  </section>
  <section className={styles.bottom}><div><p className={styles.eyebrow}>THE NEXT CONNECTION</p><h2>Build something <em>meaningful.</em></h2><p>The public directory is currently a location-based interactive preview. Verified member profiles, approved projects and actual events will be published as those systems become available.</p></div><Link href="/contact">Connect with the club <ArrowUpRight size={18}/></Link></section>
 </main>;
}
