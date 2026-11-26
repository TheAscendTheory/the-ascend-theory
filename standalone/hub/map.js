/* Ascend Hub location discovery — Leaflet / OpenStreetMap. No user location is read unless opted in. */
(()=>{"use strict";
const colors={Workshop:"#378b62",Meetup:"#eb8c38",Discussion:"#8860bc",Exhibition:"#c24e8b",Talk:"#3279af",Conference:"#3279af",Event:"#3685ac",Project:"#36778e",Business:"#a75b35"};
let map=null,markers=new Map();
const valid=p=>p&&p.latitude!=null&&p.longitude!=null&&Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function legend(items,events){
 const categories=[...new Set([...items.map(x=>events?(x.category||"Event"):"Project"),...(events?["Business"]:[])])].sort();
 if(!categories.length)return "";
 return '<div class="map-legend" aria-label="Map pin guide"><strong>PIN GUIDE</strong>'+categories.map(c=>'<button type="button" data-pin-category="'+esc(c)+'"><i style="background:'+(colors[c]||"#5c7888")+'"></i>'+esc(c)+'</button>').join("")+'</div>';
}
function surface(items,events,guideItems=items){
 const count=items.filter(valid).length;
 return '<div class="ascend-map-container"><div id="ascendMap" class="ascend-map" role="region" aria-label="Interactive world map showing '+count+' mapped '+(events?"events":"projects")+'"></div><div class="ascend-map-hud"><span>DRAG · ZOOM · SELECT PIN</span><span>'+count+' LOCATIONS</span></div></div>'+legend(guideItems,events);
}
function destroy(){if(map){map.remove();map=null}markers.clear()}
function draw(items,events){
 destroy();
 const dom=document.getElementById("ascendMap");if(!dom)return;
 if(!window.L){dom.innerHTML='<div class="map-error">Map service unavailable. You can still browse events in the list below.</div>';return}
 const L=window.L;
 map=L.map(dom,{zoomControl:false,scrollWheelZoom:false,worldCopyJump:true,minZoom:2,maxBounds:[[-85,-220],[85,220]],maxBoundsViscosity:0.7}).setView([25,-10],2);
 L.control.zoom({position:"bottomright"}).addTo(map);
 L.control.scale({position:"bottomleft",imperial:false}).addTo(map);
 const reset=L.control({position:"topright"});reset.onAdd=()=>{const button=L.DomUtil.create("button","map-world-reset");button.type="button";button.textContent="World view";L.DomEvent.disableClickPropagation(button);L.DomEvent.on(button,"click",()=>map.setView([25,-10],2));return button};reset.addTo(map);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors",maxZoom:19}).addTo(map);
 const bounds=[];
 for(const item of items.filter(valid)){
  const type=events?(item.category||"Event"):"Project",shade=colors[type]||"#5c7888";
  const marker=L.marker([+item.latitude,+item.longitude],{icon:L.divIcon({className:"ascend-map-marker",html:'<span class="ascend-map-pin" style="background:'+shade+'"></span>',iconSize:[28,32],iconAnchor:[14,29]})}).addTo(map);
  const popup=document.createElement("div");popup.className="ascend-popup";
  popup.innerHTML='<small>'+(item.demo?"DEMO · ":"")+esc(type)+'</small><b>'+esc(item.title)+'</b><span>'+esc([item.city,item.country].filter(Boolean).join(", "))+'</span><button type="button">View '+(events?"event":"project")+'</button>';
  popup.querySelector("button").addEventListener("click",()=>{const card=[...document.querySelectorAll("[data-map-card]")].find(el=>el.dataset.mapCard===String(item.id));if(card){card.scrollIntoView({behavior:"smooth",block:"center"});card.classList.add("map-highlight");setTimeout(()=>card.classList.remove("map-highlight"),1800)}});
  marker.bindPopup(popup);markers.set(String(item.id),marker);bounds.push([+item.latitude,+item.longitude]);
 }
 if(bounds.length===1)map.setView(bounds[0],7);else if(bounds.length>1)map.fitBounds(bounds,{padding:[55,55],maxZoom:7});
 requestAnimationFrame(()=>map?.invalidateSize());
 document.querySelectorAll("[data-map-card]").forEach(card=>card.addEventListener("click",event=>{if(event.target.closest("button,a"))return;const pin=markers.get(card.dataset.mapCard);if(pin){map.flyTo(pin.getLatLng(),Math.max(map.getZoom(),7));pin.openPopup()}}));
}
window.AscendMap={surface,draw,destroy,colors};
})();