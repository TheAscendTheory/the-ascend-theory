"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Compass,Globe2,MapPin,Minus,Plus,Search} from "lucide-react";
import styles from "./public-hub.module.css";

type Kind="Event"|"Project"|"Organization"|"Person";
type Place={id:string;name:string;kind:Kind;city:string;country:string;lat:number;lng:number;description:string};
const pins:Place[]=[
{id:"newark",name:"New Jersey · Event example",kind:"Event",city:"Newark",country:"United States",lat:40.7357,lng:-74.1724,description:"Illustrative location for a future event listing. This is not an announced event."},
{id:"toronto",name:"Toronto · Person example",kind:"Person",city:"Toronto",country:"Canada",lat:43.6532,lng:-79.3832,description:"Illustrative changemaker pin. This is not a real member profile."},
{id:"lisbon",name:"Lisbon · Organization example",kind:"Organization",city:"Lisbon",country:"Portugal",lat:38.7223,lng:-9.1393,description:"Illustrative organization pin. No organization is represented by this listing."},
{id:"nairobi",name:"Nairobi · Project example",kind:"Project",city:"Nairobi",country:"Kenya",lat:-1.2921,lng:36.8219,description:"Illustrative collaboration project pin. This is not an active opportunity."},
{id:"tokyo",name:"Tokyo · Event example",kind:"Event",city:"Tokyo",country:"Japan",lat:35.6762,lng:139.6503,description:"Illustrative location for future events. No event is advertised here."}
];
const colors:Record<Kind,string>={Event:"#b46a48",Project:"#33715a",Organization:"#795c9b",Person:"#af8734"};
const kinds:Kind[]=["Event","Project","Organization","Person"];
const tileSize=256;
function project(lat:number,lng:number,z:number){const n=2**z;const bounded=Math.max(-85.05112878,Math.min(85.05112878,lat));const phi=bounded*Math.PI/180;return {x:(lng+180)/360*n*tileSize,y:(1-Math.log(Math.tan(phi)+1/Math.cos(phi))/Math.PI)/2*n*tileSize};}
export default function PublicHub(){
 const [kind,setKind]=useState<Kind|"All">("All");
 const [term,setTerm]=useState("");
 const [active,setActive]=useState("newark");
 const [zoom,setZoom]=useState(2);
 const [center,setCenter]=useState({lat:23,lng:8});
 const [directory,setDirectory]=useState(true);
 const visible=useMemo(()=>pins.filter(p=>(kind==="All"||p.kind===kind)&&[p.name,p.kind,p.city,p.country].join(" ").toLowerCase().includes(term.trim().toLowerCase())),[kind,term]);
 const selected=visible.find(p=>p.id===active)||visible[0]||null;
 const world=tileSize*2**zoom;const origin=project(center.lat,center.lng,zoom);
 const tiles=useMemo(()=>{const a:{x:number;y:number;src:string}[]=[];const count=2**zoom;const cx=Math.floor(origin.x/tileSize);const cy=Math.floor(origin.y/tileSize);for(let x=Math.max(0,cx-4);x<=Math.min(count-1,cx+4);x++)for(let y=Math.max(0,cy-3);y<=Math.min(count-1,cy+3);y++)a.push({x:x*tileSize,y:y*tileSize,src:`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`});return a;},[zoom,origin.x,origin.y]);
 function focus(p:Place){setActive(p.id);setCenter({lat:p.lat,lng:p.lng});setZoom(z=>Math.max(z,3));}
 return <main className={styles.root}>
   <header className={styles.heading}><div><p className={styles.overline}>ASCENDERS HUB / THE GLOBAL NETWORK</p><h1>Find your <em>connection.</em></h1><p>A world of people, initiatives and ideas. Discover where collaboration can begin.</p></div><div className={styles.geometry} aria-hidden="true"><span/><span/><span/></div></header>
   <section className={styles.stage} aria-label="Global discovery experience">
    <div className={styles.topbar}><div className={styles.topTitle}><Globe2 size={21}/><strong>World explorer</strong><span>INTERACTIVE PREVIEW · EXAMPLE LOCATIONS</span></div><div className={styles.topActions}><button onClick={()=>{setCenter({lat:23,lng:8});setZoom(2);}} type="button"><Compass size={16}/> World view</button><button type="button" onClick={()=>setDirectory(d=>!d)}>{directory?"Hide":"Show"} directory</button></div></div>
    <div className={styles.body}>
     <div className={styles.mapArea}>
      <div className={styles.mapViewport} role="group" aria-label="Interactive OpenStreetMap map, with selectable location markers">
       <div className={styles.mapWorld} style={{width:world,height:world,left:`calc(50% - ${origin.x}px)`,top:`calc(50% - ${origin.y}px)`}}>
        {tiles.map(t=><img loading="lazy" draggable={false} alt="" key={t.src} src={t.src} width={256} height={256} style={{position:"absolute",left:t.x,top:t.y,width:256,height:256}}/>)}
        {visible.map(p=>{const coord=project(p.lat,p.lng,zoom);return <button type="button" key={p.id} className={styles.pin} style={{left:coord.x,top:coord.y,background:colors[p.kind]}} aria-label={p.name} aria-pressed={selected?.id===p.id} onClick={()=>focus(p)}/>;})}
       </div>
      </div>
      <div className={styles.zoom}><button aria-label="Zoom in" disabled={zoom===5} onClick={()=>setZoom(z=>Math.min(5,z+1))}><Plus size={17}/></button><button aria-label="Zoom out" disabled={zoom===1} onClick={()=>setZoom(z=>Math.max(1,z-1))}><Minus size={17}/></button></div>
      <div className={styles.legend}>{kinds.map(k=><span key={k}><i style={{background:colors[k]}}/>{k}</span>)}</div>
      <small className={styles.attribution}>© OpenStreetMap contributors</small>
     </div>
     {directory&&<aside className={styles.directory}><p className={styles.overline}>EXPLORE THE WORLD</p><h2>Discover what&apos;s happening.</h2><p className={styles.explainer}>Find people, projects and gatherings by location. All current pins are examples, not real listings.</p><label className={styles.search}><Search size={17}/><input aria-label="Search places" placeholder="Search a place or category" value={term} onChange={e=>setTerm(e.target.value)}/></label><div className={styles.filters}>{(["All",...kinds] as const).map(k=><button type="button" key={k} aria-pressed={kind===k} onClick={()=>{setKind(k);setActive("");}}>{k}</button>)}</div><p className={styles.count}>{visible.length} SAMPLE LOCATIONS</p><div className={styles.results}>{visible.length===0?<p>No locations match. Change your search or filter.</p>:visible.map(p=><button type="button" key={p.id} className={styles.result} aria-pressed={selected?.id===p.id} onClick={()=>focus(p)}><span><i style={{background:colors[p.kind]}}/>{p.kind}</span><strong>{p.name}</strong><small><MapPin size={13}/>{p.city}, {p.country}</small></button>)}</div></aside>}
    </div>
    {selected&&<div className={styles.selection}><i style={{background:colors[selected.kind]}}/><div><small>SELECTED / {selected.kind.toUpperCase()} / EXAMPLE</small><strong>{selected.name}</strong><p>{selected.description}</p></div><button type="button" onClick={()=>focus(selected)}>Show location <ArrowUpRight size={16}/></button></div>}
   </section>
   <footer className={styles.footer}><div><p className={styles.overline}>THE ASCENDERS CLUB</p><h2>Collaborate beyond <em>borders.</em></h2><p>This public map works without a membership login. Approved profiles, genuine events and projects will replace these preview examples as they are published.</p></div><div className={styles.footerLinks}><Link href="/hub/members">Member workspace <ArrowUpRight size={17}/></Link><Link href="/contact">Contact the Club <ArrowUpRight size={17}/></Link></div></footer>
 </main>;
}
