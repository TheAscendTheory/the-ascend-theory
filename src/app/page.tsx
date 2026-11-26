"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Globe2, BookOpen, Clapperboard } from "lucide-react";
import PerceptionSequence from "./components/PerceptionSequence";

const platforms=[
 {number:"01",name:"Ascenders Hub",label:"THE NETWORK",description:"A curated global constellation of people, organizations, projects and shared opportunities.",href:"https://theascendtheory.github.io/the-ascend-theory/?revision=e4e5e69",Icon:Globe2},
 {number:"02",name:"Ascenders Academy",label:"THE KNOWLEDGE",description:"Structured learning, practical education and knowledge exchange across disciplines.",href:"https://theascendtheory.github.io/the-ascend-theory/academy/",Icon:BookOpen},
 {number:"03",name:"Ascenders Media",label:"THE STORIES",description:"Films, documentaries, interviews and photography that move beyond the surface.",href:"https://theascendtheory.github.io/the-ascend-theory/media/",Icon:Clapperboard}
];

function SacredGeometry(){
 return <div className="ascGeometry" aria-hidden="true"><svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
 <defs><radialGradient id="ascCore"><stop offset="0" stopColor="#d5e0cc" stopOpacity=".14"/><stop offset="1" stopColor="#d5e0cc" stopOpacity="0"/></radialGradient><linearGradient id="ascLine" x1="0" y1="0" x2="800" y2="800"><stop stopColor="#c4d1bc" stopOpacity=".12"/><stop offset=".5" stopColor="#c4d1bc" stopOpacity=".77"/><stop offset="1" stopColor="#c4d1bc" stopOpacity=".13"/></linearGradient></defs>
 <circle cx="400" cy="400" r="390" fill="url(#ascCore)"/>
 <g stroke="url(#ascLine)" strokeWidth="1">
 <circle cx="400" cy="400" r="348"/><circle cx="400" cy="400" r="308"/><circle cx="400" cy="400" r="230"/><circle cx="400" cy="400" r="154"/>
 <g className="ascOrbitA"><circle cx="400" cy="246" r="154"/><circle cx="533.368" cy="323" r="154"/><circle cx="533.368" cy="477" r="154"/><circle cx="400" cy="554" r="154"/><circle cx="266.632" cy="477" r="154"/><circle cx="266.632" cy="323" r="154"/></g>
 <g className="ascOrbitB" strokeOpacity=".75"><path d="M400 85 672.8 557.5H127.2Z"/><path d="M400 715 127.2 242.5H672.8Z"/><path d="M400 85 400 715M127.2 242.5 672.8 557.5M672.8 242.5 127.2 557.5"/></g>
 <g className="ascOrbitC" strokeOpacity=".45"><circle cx="400" cy="400" r="365" strokeDasharray="4 18"/><circle cx="400" cy="400" r="280" strokeDasharray="2 12"/></g>
 </g>
 <circle cx="400" cy="400" r="10" stroke="#e0e6d8" strokeWidth="1.5"/><circle cx="400" cy="400" r="3" fill="#e0e6d8" className="ascPulse"/>
 </svg></div>
}
export default function Home(){
 const reduceMotion=useReducedMotion();
 const transition=(delay:number)=>({duration:reduceMotion?0:.85,delay:reduceMotion?0:delay});
 return <main className="asc-home" data-home-revision="constellation-04">
  <style jsx global>{`.asc-home{background:#f8f8f3;color:#151914}.asc-home .ascHero{position:relative;min-height:80vh;display:flex;align-items:center;overflow:hidden;background:#171c17;color:#f7f6ef;padding:90px 7% 110px}.asc-home .ascGeometry{position:absolute;width:min(75vw,850px);right:-8%;top:50%;transform:translateY(-50%);opacity:.65;pointer-events:none}.asc-home .ascHeroContent{position:relative;z-index:1;max-width:800px}.asc-home .ascHero h1{font-size:clamp(70px,12vw,170px);line-height:.84;letter-spacing:-.08em;margin:38px 0;font-weight:750}.asc-home h1 em,.asc-home h2 em{font-family:Georgia,serif;font-weight:400}.asc-home .ascHeroIntro{max-width:530px;font-size:19px;line-height:1.6;color:#d4dcd0}.asc-home .ascKicker,.asc-home .ascOverline{font-size:11px;letter-spacing:.19em;font-weight:700}.asc-home .ascActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.asc-home .ascButton{display:inline-flex;align-items:center;gap:15px;background:#e3e8d9;color:#1a2119;padding:15px 22px;border-radius:50px;font-weight:700}.asc-home .ascButtonOutline{background:transparent;color:inherit;border:1px solid currentColor}.asc-home .ascHeroFooter{position:absolute;bottom:24px;left:7%;right:7%;display:flex;justify-content:space-between;gap:12px;font-size:10px;letter-spacing:.12em;color:#c0c8bb}.asc-home .ascWrap{max-width:1500px;margin:auto;padding-left:7%;padding-right:7%}.asc-home .ascSection{padding-top:85px;padding-bottom:85px}.asc-home .ascSplit{display:grid;grid-template-columns:1fr 1fr;gap:7%;align-items:center}.asc-home h2{font-size:clamp(42px,6vw,90px);line-height:1;letter-spacing:-.06em;margin:18px 0 25px}.asc-home .ascSplit p,.asc-home .ascHeading p,.asc-home .ascCard p{line-height:1.65}.asc-home .ascAlt{background:#e9ece3}.asc-home .ascHeading{display:grid;grid-template-columns:2fr 1fr;align-items:end;gap:5%;margin-bottom:30px}.asc-home .ascCards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.asc-home .ascCard{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;gap:15px;padding:32px;min-height:380px;border:0;border-radius:18px;background:#26352b;color:#f6f6ef}.asc-home .ascCard:nth-child(2){background:#252723}.asc-home .ascCard:nth-child(3){background:#41483b}.asc-home .ascCard:before{content:"";position:absolute;right:-60px;top:-70px;width:260px;height:260px;border:1px solid #ffffff35;border-radius:50%;box-shadow:0 0 0 25px #ffffff08,0 0 0 50px #ffffff08,inset 0 0 0 40px #ffffff08;pointer-events:none}.asc-home .ascCard h3{font-size:clamp(28px,3.4vw,48px);letter-spacing:-.045em;line-height:1.05;margin:0}.asc-home .ascCard p{flex:1;color:#e1e5dc}.asc-home .ascNum{font-size:12px;letter-spacing:.15em}.asc-home .ascCardIcon{margin:24px 0}.asc-home .ascClosing{background:#171c17;color:#f6f6ee;padding:85px 0}.asc-home .ascTextLink{font-weight:700}@media(max-width:760px){.asc-home .ascHero{min-height:76vh;padding:70px 6% 100px}.asc-home .ascGeometry{width:110vw;right:-40%;opacity:.35}.asc-home .ascHeroFooter span:nth-child(2){display:none}.asc-home .ascSplit,.asc-home .ascHeading,.asc-home .ascCards{grid-template-columns:1fr}.asc-home .ascSection{padding-top:50px;padding-bottom:50px}.asc-home .ascCard{min-height:310px;padding:26px}.asc-home .ascHero h1{font-size:clamp(64px,14vw,110px)}}
.ascSite .asc-home .ascHero{background:#fff!important;color:#111!important;display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:740px;padding:65px 6% 175px;gap:0}.ascSite .asc-home .ascHero:before,.ascSite .asc-home .ascHero:after{display:none!important}.ascSite .asc-home .ascDottedField{opacity:.15}.ascSite .asc-home .ascHeroContent{grid-column:1;grid-row:1;max-width:none;z-index:3}.ascSite .asc-home .ascGeometry{grid-column:2;grid-row:1;position:relative;right:auto;top:auto;left:auto;width:100%;max-width:680px;height:auto;aspect-ratio:1;transform:none;opacity:1;filter:none}.ascSite .asc-home .ascHero h1{font-size:clamp(68px,8.5vw,132px);line-height:.89;letter-spacing:-.075em;color:#080808!important}.ascSite .asc-home .ascHero h1 em{color:#080808!important;-webkit-text-fill-color:#080808!important;background:none!important;animation:none!important}.ascSite .asc-home .ascHeroIntro{color:#282c28!important}.ascSite .asc-home .ascHeroFooter{color:#222;bottom:12px}.homeGateway{display:grid;grid-template-columns:repeat(3,1fr);position:absolute;bottom:58px;left:6%;right:6%;gap:8px;z-index:4}.homeGatewayLink{display:flex;align-items:center;gap:13px;background:#161c17;color:white!important;padding:20px 18px;border-radius:10px;min-height:82px}.homeGatewayLink:nth-child(2){background:#30382e}.homeGatewayLink:nth-child(3){background:#444c3e}.homeGatewayLink span{flex:1;font-weight:700;font-size:16px}.homeGatewayLink small{display:block;color:#ced6c9;font-size:9px;letter-spacing:.13em;margin-bottom:5px}.ascSite .asc-home .ascAlt{background:#e9ece3!important}.ascSite .asc-home .ascCards{grid-template-columns:1.35fr 1fr 1fr;gap:12px}.ascSite .asc-home .ascCard{background:#18231b!important;color:#fff!important;border:0!important;min-height:410px;border-radius:16px;padding:27px}.ascSite .asc-home .ascCard:nth-child(2){background:#272a25!important}.ascSite .asc-home .ascCard:nth-child(3){background:#424a3c!important}.ascSite .asc-home .ascCard h3,.ascSite .asc-home .ascCard p,.ascSite .asc-home .ascCard .ascOverline,.ascSite .asc-home .ascCard .ascNum,.ascSite .asc-home .ascCard .ascCardIcon,.ascSite .asc-home .ascCard>span:last-child{color:#f5f6ef!important}.ascSite .asc-home .ascCard:after{opacity:.12}.ascSite .asc-home .ascClosing{background:#18231b!important;color:white!important}.ascSite .asc-home .ascClosing h2,.ascSite .asc-home .ascClosing h2 em,.ascSite .asc-home .ascClosing p,.ascSite .asc-home .ascClosing .ascOverline{color:#f3f5ed!important;-webkit-text-fill-color:#f3f5ed!important}.ascSite .asc-home .ascClosing .ascButton{background:#fff!important;color:#111!important}@media(max-width:760px){.ascSite .asc-home .ascHero{grid-template-columns:1fr;min-height:0;padding:34px 6% 34px;gap:16px}.ascSite .asc-home .ascHeroContent{grid-column:1;grid-row:1}.ascSite .asc-home .ascHero h1{font-size:clamp(64px,14vw,105px);margin:24px 0}.ascSite .asc-home .ascGeometry{grid-column:1;grid-row:2;width:min(80%,310px);margin:auto}.homeGateway{position:relative;inset:auto;grid-template-columns:1fr;grid-row:3}.homeGatewayLink{min-height:60px;padding:12px 16px}.ascSite .asc-home .ascHeroFooter{position:relative;inset:auto;grid-row:4;padding-top:12px}.ascSite .asc-home .ascCards{grid-template-columns:1fr}.ascSite .asc-home .ascCard{min-height:300px}}

/* Constellation 04 — approved sage canvas and kinetic geometry. */
.ascSite .asc-home{background:#e8e9df!important;color:#171b15}
.ascSite .asc-home .ascHero{background:radial-gradient(ellipse at 85% 25%,#cbd2c0 0,transparent 48%),linear-gradient(145deg,#efeee4,#e0e4d8)!important;min-height:680px}
.ascSite .asc-home .ascHero .ascGeometry{position:absolute;right:2%;top:4%;left:auto;width:48%;height:auto;max-width:700px;transform:none;opacity:.9;pointer-events:none}
.ascSite .asc-home .ascGeometry svg{display:block;width:100%;height:auto;overflow:visible}
.ascSite .asc-home .ascGeometry::before,.ascSite .asc-home .ascGeometry::after{pointer-events:none}
.ascSite .asc-home .ascOrbitA{transform-origin:400px 400px;animation:constellationSpin 42s linear infinite!important}
.ascSite .asc-home .ascOrbitB{transform-origin:400px 400px;animation:constellationSpin 29s linear infinite reverse!important}
.ascSite .asc-home .ascOrbitC{transform-origin:400px 400px;animation:constellationSpin 60s linear infinite!important}
@keyframes constellationSpin{to{transform:rotate(360deg)}}
.ascSite .asc-home .ascHeroContent{z-index:3}
.ascSite .asc-home .ascHeroContent img{filter:grayscale(1) brightness(.15)!important}
.ascSite .asc-home .ascSection{background:#e8e9df!important}
.ascSite .asc-home .ascAlt{background:#dfe4d7!important}
.ascSite .asc-home .ascCard{isolation:isolate}
.ascSite .asc-home .ascCard::before,.ascSite .asc-home .ascCard::after{display:none!important}
.ascSite .asc-home .ascCard>*:not(.kineticSpiral){position:relative;z-index:2}
.kineticSpiral{position:absolute;z-index:0;right:-19%;top:-20%;width:105%;aspect-ratio:1;pointer-events:none;opacity:.45;mask-image:linear-gradient(100deg,transparent 6%,#000 48%)}
.kineticSpiral svg{width:100%;height:100%;animation:constellationSpin 34s linear infinite;transform-origin:center}
.ascCard:nth-child(2) .kineticSpiral svg{animation-direction:reverse;animation-duration:43s}
.ascCard:nth-child(3) .kineticSpiral svg{animation-duration:52s}
.ascSite .asc-home .ascCard{min-height:330px}
.ascSite .asc-home .ascCard p{max-width:90%}
.ascSite .asc-home .ascHero .ascButtonOutline{background:#efeee4!important}
@media(max-width:760px){.ascSite .asc-home .ascHero{display:flex;flex-direction:column;align-items:stretch;min-height:0;padding:52px 6% 24px;gap:18px}.ascSite .asc-home .ascHero .ascGeometry{right:-11%;top:0;width:64%;max-width:310px;margin:0;opacity:.52;mask-image:linear-gradient(180deg,#000 60%,transparent)}.ascSite .asc-home .ascHeroContent{padding-top:58px}.ascSite .asc-home .ascHero h1{font-size:clamp(60px,13vw,100px);margin:24px 0}.ascSite .asc-home .ascHeroIntro{max-width:100%;font-size:17px}.ascSite .asc-home .ascHero .ascActions{margin-top:22px}.ascSite .asc-home .homeGateway{position:relative;inset:auto;margin-top:8px}.ascSite .asc-home .ascHeroFooter{position:relative;inset:auto}.ascSite .asc-home .ascCard{min-height:250px;padding:24px}.ascSite .asc-home .ascCardIcon{margin:12px 0}.kineticSpiral{width:90%;right:-25%;top:-18%}}
@media(prefers-reduced-motion:reduce){.ascSite .asc-home .ascOrbitA,.ascSite .asc-home .ascOrbitB,.ascSite .asc-home .ascOrbitC,.kineticSpiral svg{animation:none!important}}
`}</style>
  <section className="ascHero">
   <div className="ascDottedField" aria-hidden="true"/>
   <SacredGeometry/>
   <div className="ascHeroContent">
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={transition(0)} style={{display:"flex",alignItems:"center",gap:14}}>
     <Image src="/logo.PNG" alt="" width={58} height={58} style={{objectFit:"contain",filter:"drop-shadow(0 0 14px #c4d1bc70)"}}/>
     <p className="ascKicker">THE ASCENDERS CLUB <span style={{opacity:.48}}> / </span> A GLOBAL COLLECTIVE</p>
    </motion.div>
    <motion.h1 initial={{opacity:0,y:34}} animate={{opacity:1,y:0}} transition={transition(.12)}>WE ARE<br/><em>Ascenders.</em></motion.h1>
    <motion.p className="ascHeroIntro" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={transition(.3)}>An international collective connecting changemakers, knowledge and initiatives to cultivate a more connected, flourishing future.</motion.p>
    <motion.div className="ascActions" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={transition(.45)}>
     <Link className="ascButton" href="https://theascendtheory.github.io/the-ascend-theory/?revision=e4e5e69">Explore Ascenders Hub <ArrowUpRight aria-hidden="true"/></Link>
     <Link className="ascButton ascButtonOutline" href="/about">Discover our philosophy <ArrowRight aria-hidden="true"/></Link>
    </motion.div>
   </div>
   <div className="homeGateway" aria-label="Explore the three platforms">{platforms.map(({number,name,href,Icon})=><Link key={name} href={href} className="homeGatewayLink"><Icon size={22}/><span><small>{number} / EXPLORE</small>{name}</span><ArrowUpRight size={18}/></Link>)}</div>
   <div className="ascHeroFooter"><span>THE ASCENDERS CLUB</span><span>CONNECT / COLLABORATE / CULTIVATE</span><span>ONE WORLD · MANY PATHS</span></div>
  </section>
  <section className="ascWrap ascSection ascSplit">
   <div><p className="ascOverline">THE UNDERLYING PRINCIPLE</p><h2>Everything is<br/><em>connected.</em></h2></div>
   <div><p>Growth is not an isolated act. It emerges through relationships between people, ideas, communities and the living world.</p><p>We bring together changemakers across disciplines and borders, from emerging local initiatives to established organizations. Different paths, shared possibility.</p><Link className="ascTextLink" href="/about">Our philosophy <ArrowUpRight size={16} style={{verticalAlign:"middle",marginLeft:8}}/></Link></div>
  </section>
  <section className="ascAlt ascSection">
   <div className="ascWrap"><div className="ascHeading"><div><p className="ascOverline">ONE COMMUNITY / THREE EXPERIENCES</p><h2>A universe of <em>possibility.</em></h2></div><p>Ascend is the name of what we build. Ascenders are the people. The Ascenders Club brings us together.</p></div>
    <div className="ascCards">{platforms.map(({number,name,label,description,href,Icon})=><Link className="ascCard" href={href} key={name}><span className="kineticSpiral" aria-hidden="true"><svg viewBox="0 0 500 500" fill="none">{Array.from({length:16},(_,i)=><path key={i} d="M250 250 C260 160 390 120 470 250 C530 390 350 530 160 450 C-30 360 20 90 250 28" transform={"rotate("+(i*22.5)+" 250 250)"} stroke="#d9e3cd" strokeWidth=".9" opacity={.5}/>)}</svg></span><span className="ascNum">{number} / 03</span><span className="ascCardIcon"><Icon size={45} strokeWidth={1.2}/></span><span className="ascOverline">{label}</span><h3>{name}</h3><p>{description}</p><span style={{display:"flex",gap:10,alignItems:"center"}}>Explore platform <ArrowUpRight size={17}/></span></Link>)}</div>
   </div>
  </section>
  <PerceptionSequence/>
  <section className="ascWrap ascSection ascSplit"><div><p className="ascOverline">BEYOND DISCIPLINES / BEYOND BORDERS</p><h2>For those who <em>create change.</em></h2></div><div><p>Community builders, artists, scientists, educators, entrepreneurs, and stewards of nature. This is a place for individuals and organizations united not by prestige, but by purpose.</p><Link className="ascButton" href="/contact">Collaborate with us <ArrowUpRight aria-hidden="true"/></Link></div></section>
  <section className="ascClosing"><div className="ascWrap"><p className="ascOverline">THE FUTURE IS COLLECTIVE</p><h2>Become part of<br/><em>what comes next.</em></h2><p>Discover what becomes possible when we move together.</p><Link className="ascButton" href="https://theascendtheory.github.io/the-ascend-theory/?revision=e4e5e69">Discover Ascenders Hub <ArrowUpRight aria-hidden="true"/></Link></div></section>
 </main>;
}