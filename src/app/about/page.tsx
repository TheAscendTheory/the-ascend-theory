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
  </div><div id="our-philosophy" className="ascAboutChapter"><section className="ascInnerHero ascWrap ascPhilosophyHero"><div className="ascPhilosophyGeometry" aria-hidden="true"><i/><i/><i/></div><p className="ascOverline">THE ASCENDERS CLUB / OUR PHILOSOPHY</p><h1>We are <em>Ascenders.</em></h1><p>We believe in connection, collective progress and living in greater harmony with the world around us. We bring people and organizations together to exchange knowledge, cultivate opportunities and advance meaningful work.</p><Link className="ascButton" href="/hub" target="_blank" rel="noopener noreferrer">Discover the network</Link></section><section className="ascWrap ascFeatureGrid"><article><h2>Connection</h2><p>We see shared purpose across disciplines, communities and borders.</p></article><article><h2>Collaboration</h2><p>We encourage new partnerships between established and emerging changemakers.</p></article><article><h2>Regeneration</h2><p>We value flourishing social and ecological systems, informed by practice and evidence.</p></article></section></div></main>}
