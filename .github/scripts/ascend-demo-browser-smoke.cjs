/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require("playwright");
const BASE="https://theascendtheory.github.io/the-ascend-theory/";
async function run(){
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(BASE+"academy/",{waitUntil:"domcontentloaded",timeout:45000});
 await page.locator('[data-course="demo-c1"]').waitFor({timeout:35000});
 await page.locator('[data-course="demo-c1"]').click();
 await page.locator('[data-mode="audio"]').waitFor();
 await page.locator('[data-mode="audio"]').click();
 await page.locator('#lessonMaterial audio').waitFor();
 await page.locator('[data-mode="interactive"]').click();
 await page.locator('#lessonMaterial [data-answer="1"]').click();
 await page.getByText(/Correct. The relationship/).waitFor();
 await page.locator('#openQuiz').click();
 await page.locator('[data-q="0"][data-a="1"]').click();
 await page.locator('[data-q="1"][data-a="0"]').click();
 await page.locator('#submitQuiz').click();
 await page.getByText(/100% · 2\/2 correct/).waitFor();
 await page.locator('#retry').click();
 await page.locator('#submitQuiz').waitFor();
 if(errors.length)throw Error("Academy JS errors: "+errors.join(","));
 console.log("PASS Academy: distinct classroom, choose listening and practice, graded quiz, retry");
 for(let i=0;i<30;i++){await page.goto(BASE+"media/?revision=vector-controls-02&attempt="+i,{waitUntil:"domcontentloaded",timeout:45000});if(await page.locator('meta[name="ascenders-release"][content="vector-controls-02"]').count())break;await page.waitForTimeout(5000);}
 if(!await page.locator('meta[name="ascenders-release"][content="vector-controls-02"]').count())throw Error("Updated Media release not live");
 for(const id of ["btnPrev","btnToggle","btnNext","btnExpand","panelPrev","panelToggle","panelNext"]){if(await page.locator("#"+id+" svg.transportIcon").count()!==1)throw Error("Missing vector control "+id);if((await page.locator("#"+id).textContent()).trim())throw Error("Unexpected text/glyph in "+id);}
 await page.locator('[data-playlist="demo-collection"]').waitFor({timeout:35000});
 await page.locator('[data-playlist="demo-collection"]').click();
 await page.locator('#playerbar.active').waitFor();
 await page.locator('#fullPlayer.active').waitFor();
 for(const id of ["panelPrev","panelToggle","panelNext"]){if(await page.locator("#"+id+" svg.transportIcon").count()!==1)throw Error("Playback replaced SVG "+id);}
 const first=await page.locator('#playerTitle').innerText();
 await page.locator('#panelNext').click();
 const second=await page.locator('#playerTitle').innerText();
 if(first===second)throw Error("Media queue did not advance");
 await page.locator('#btnClose').click();
 await page.locator('#playerbar.active').waitFor();
 if(await page.locator('#fullPlayer.active').count())throw Error("Minimize failed");
 await page.locator('#btnExpand').click();
 await page.locator('#fullPlayer.active').waitFor();
 if(errors.length)throw Error("Media JS errors: "+errors.join(","));
 console.log("PASS Media: immersive shelves, mixed playlist, persistent mini player, next and reopen");
 await browser.close();
}
run().catch(e=>{console.error(e);process.exit(1)});
