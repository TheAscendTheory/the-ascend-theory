"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {usePathname} from "next/navigation";
import {useState} from "react";
import "./ascenders.css";
import "./ascenders-art.css";
const links=[{label:"Our Story",href:"/about"},{label:"Ascend Hub",href:"/hub"},{label:"Academy",href:"/academy"},{label:"Media",href:"/media"},{label:"Contact",href:"/contact"}];
export default function SiteShell({children}:{children:React.ReactNode}){const [open,setOpen]=useState(false);const path=usePathname();return <div className="ascSite"><header className="ascHeader"><Link className="ascBrand" href="/" onClick={()=>setOpen(false)}><Image className="ascBrandLogo" src="/logo.PNG" width={54} height={54} alt=""/>THE ASCENDERS CLUB</Link><nav className="ascNav" aria-label="Primary navigation">{links.map(link=><Link key={link.href} aria-current={path===link.href?"page":undefined} href={link.href}>{link.label}</Link>)}</nav><Link className="ascNavCta" href="/hub">Explore the Hub <ArrowUpRight size={16} aria-hidden="true"/></Link><button type="button" className="ascMenu" aria-expanded={open} aria-controls="asc-mobile-navigation" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button></header>{open&&<nav className="ascMobileNav" id="asc-mobile-navigation" aria-label="Mobile navigation">{links.map(link=><Link href={link.href} key={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}</nav>}{children}</div>}