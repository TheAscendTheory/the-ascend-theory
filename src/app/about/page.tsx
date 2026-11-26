import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {title:"Our Story & Philosophy",description:"The story and philosophy behind The Ascenders Club."};
function SacredGeometry(){
 return <div className="ascGeometry ascStoryGeometry" aria-hidden="true"><svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
 <defs><radialGradient id="storyCore"><stop offset="0" stopColor="#000000" stopOpacity=".14"/><stop offset="1" stopColor="#000000" stopOpacity="0"/></radialGradient><linearGradient id="storyLine" x1="0" y1="0" x2="800" y2="800"><stop stopColor="#000000" stopOpacity=".12"/><stop offset=".5" stopColor="#000000" stopOpacity=".77"/><stop offset="1" stopColor="#000000" stopOpacity=".13"/></linearGradient></defs>
 <circle cx="400" cy="400" r="390" fill="url(#storyCore)"/>
 <g stroke="url(#storyLine)" strokeWidth="1">
 <circle cx="400" cy="400" r="348"/><circle cx="400" cy="400" r="308"/><circle cx="400" cy="400" r="230"/><circle cx="400" cy="400" r="154"/>
 <g className="ascOrbitA"><circle cx="400" cy="246" r="154"/><circle cx="533.368" cy="323" r="154"/><circle cx="533.368" cy="477" r="154"/><circle cx="400" cy="554" r="154"/><circle cx="266.632" cy="477" r="154"/><circle cx="266.632" cy="323" r="154"/></g>
 <g className="ascOrbitB" strokeOpacity=".75"><path d="M400 85 672.8 557.5H127.2Z"/><path d="M400 715 127.2 242.5H672.8Z"/><path d="M400 85 400 715M127.2 242.5 672.8 557.5M672.8 242.5 127.2 557.5"/></g>
 <g className="ascOrbitC" strokeOpacity=".45"><circle cx="400" cy="400" r="365" strokeDasharray="4 18"/><circle cx="400" cy="400" r="280" strokeDasharray="2 12"/></g>
 </g>
 <circle cx="400" cy="400" r="10" stroke="#000000" strokeWidth="1.5"/><circle cx="400" cy="400" r="3" fill="#000000" className="ascPulse"/>
 </svg></div>
}

function PrincipleArt({kind}:{kind:number}){
 const rays=Array.from({length:20},(_,i)=>i*9);
 return <svg className="ascPrincipleArt" viewBox="0 0 240 240" fill="none" aria-hidden="true">
 <defs><linearGradient id={"principle"+kind} x1="0" y1="0" x2="0.8" y2="1"><stop stopColor="#83a98a" stopOpacity=".08"/><stop offset="1" stopColor="#507e56" stopOpacity=".45"/></linearGradient></defs>
 <circle cx="120" cy="120" r="104" stroke="#202820" strokeDasharray="2 5" opacity=".65"/>
 <g className="ascPrincipleSpin" stroke="#202820" strokeWidth=".8">
 {kind===0?<><circle cx="120" cy="84" r="66"/><circle cx="120" cy="156" r="66" fill="url(#principle0)"/><circle cx="120" cy="120" r="93"/><path d="M120 16V224M16 120H224" opacity=".5"/></>:kind===1?<>{Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return <circle key={i} cx={120+48*Math.cos(a)} cy={120+48*Math.sin(a)} r="48" fill="url(#principle1)"/>})}<circle cx="120" cy="120" r="96"/></>:<><circle cx="120" cy="120" r="92"/><circle cx="120" cy="120" r="70"/>{rays.map(a=><path key={a} d="M120 120V33" transform={"rotate("+a+" 120 120)"}/>)}<path d="M28 143Q72 89 120 143T212 143V156Q120 236 28 156Z" fill="url(#principle2)"/><path d="M34 164Q80 119 120 164T206 164" stroke="#497b50"/></>}
 </g><path d="M120 16V224" stroke="#202820" opacity=".55"/>{[16,68,120,172,224].map(y=><circle key={y} cx="120" cy={y} r={y===120?4:2.4} fill="#151b16"/>)}</svg>
}
const principles=[{title:"Connection",text:"We see shared purpose across disciplines, communities and borders."},{title:"Collaboration",text:"We encourage new partnerships between established and emerging changemakers."},{title:"Regeneration",text:"We value flourishing social and ecological systems, informed by practice and evidence."}];

export default function About(){return <main className="ascSite ascCombinedAbout"><nav className="ascWrap ascAboutSections" aria-label="About sections"><a href="#our-story">Our Story</a><a href="#our-philosophy">Our Philosophy</a></nav><div id="our-story" className="ascAboutChapter">
    <section className="ascInnerHero ascWrap ascStoryHero"><SacredGeometry/>
      <p className="ascOverline">THE ASCENDERS CLUB / OUR STORY</p>
      <h1>We are <em>Ascenders.</em></h1>
      <p>The Ascenders Club began with a question: what could we accomplish if the people working to create meaningful change were connected rather than working in isolation?</p>
    </section>
    <section className="ascWrap ascSection ascSplit">
      <div><p className="ascOverline">THE BEGINNING</p><h2>From individual purpose to <em>collective action.</em></h2></div>
      <div><p>Our vision grew from an interest in the relationship between humanity and nature, the way we cultivate our food, care for our environment and share knowledge. It developed into a broader ambition: to bring together people whose work contributes to the world around them.</p><p>From those regenerating the land to those educating young people, serving their communities or creating new possibilities through art and innovation, meaningful change takes many forms. We believe these efforts deserve to be seen, understood and connected, regardless of their scale or recognition.</p></div>
    </section>
    <section className="ascWrap ascSection">
      <p className="ascOverline">BUILDING THE COLLECTIVE</p>
      <h2>Three platforms. <em>One purpose.</em></h2>
      <div className="ascFeatureGrid">
        <article><h2>Ascend Hub</h2><p>A global network connecting changemakers, organizations, initiatives and opportunities for collaboration.</p><Link className="ascTextLink" href="/hub" target="_blank" rel="noopener noreferrer">Explore Ascend Hub</Link></article>
        <article><h2>Ascend Academy</h2><p>A place to exchange knowledge, develop practical skills and learn from people putting ideas into practice.</p><Link className="ascTextLink" href="/academy" target="_blank" rel="noopener noreferrer">Explore Ascend Academy</Link></article>
        <article><h2>Ascend Media</h2><p>A platform dedicated to documenting meaningful work and sharing the stories of the people behind it.</p><Link className="ascTextLink" href="/media" target="_blank" rel="noopener noreferrer">Explore Ascend Media</Link></article>
      </div>
    </section>
    <section className="ascClosing"><div className="ascWrap"><p className="ascOverline">OUR NEXT CHAPTER</p><h2>The story is still <em>being written.</em></h2><p>We are building an international collective shaped by the people who participate in it. Our ambition is to turn connections into collaborations, knowledge into action and individual contributions into lasting collective impact.</p><Link className="ascButton" href="/contact">Connect with us</Link></div></section>
  </div><div id="our-philosophy" className="ascAboutChapter ascEditorialPhilosophy"><div className="ascWrap">
 <header className="ascPhilosophyIntro"><div className="ascEditorialMark" aria-hidden="true"><span/><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 32 20 4 35 32 20 22ZM10 30 20 15 30 30"/></svg><span/></div><h2>Our Philosophy</h2><p>A shared commitment to people, place, and planet — across disciplines and borders.</p><p className="ascPhilosophyOriginal">We believe in connection, collective progress and living in greater harmony with the world around us. We bring people and organizations together to exchange knowledge, cultivate opportunities and advance meaningful work.</p></header>
 <section className="ascPrinciplePanels" aria-label="Our three principles">{principles.map((p,i)=><article className={"ascPrinciplePanel ascPrinciplePanel"+i} key={p.title}><div className="ascPrincipleInside"><div className="ascPrincipleCopy"><div className="ascPrincipleNumber">0{i+1}<span/></div><h3>{p.title}</h3><p>{p.text}</p></div><PrincipleArt kind={i}/></div></article>)}</section>
 <div className="ascPhilosophyManifesto"><div className="ascEditorialMark" aria-hidden="true"><span/><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 32 20 4 35 32 20 22ZM10 30 20 15 30 30"/></svg><span/></div><p>One community. Many forms of meaningful change.</p><Link className="ascButton" href="/hub" target="_blank" rel="noopener noreferrer">Discover the network</Link></div>
 </div></div></main>}
