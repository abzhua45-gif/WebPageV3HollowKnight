// Hotdog click → open the Hollow Knight Unity page inside about:blank
document.getElementById("hotdog").addEventListener("click", () => {
  const win = window.open("about:blank", "_blank");

  win.document.write(`<!DOCTYPE html>
<html lang="en-us">
<head>
<base href="https://cdn.jsdelivr.net/gh/aukak/hollow-knight@latest/">
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<title>Hollow Knight (Chromebook Optimized)</title>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
 background:#000;
 overflow:hidden;
 display:flex;
 justify-content:center;
 align-items:center;
 height:100vh;
 font-family:Arial,sans-serif;
}
canvas{
 width:1280px;
 height:720px;
 display:block;
 image-rendering:pixelated;
 touch-action:none;
}
#loading-text{
 position:fixed;
 color:#fff;
 font-size:18px;
 top:50%;
 transform:translateY(-50%);
}
</style>
</head>

<body>

<div id="loading-text">Loading…</div>
<canvas id="unity-canvas" width="1280" height="720"></canvas>

<script>
window.Module = {
 webglContextAttributes: {
  alpha:false,
  depth:false,
  stencil:false,
  antialias:false,
  preserveDrawingBuffer:false,
  powerPreference:"low-power"
 }
};
const canvas = document.getElementById("unity-canvas");
canvas.width = 1280;
canvas.height = 720;

let loadedBytes = 0;
const TOTAL_MB = 912.81;
const loadingText = document.getElementById("loading-text");

async function fetchPart(url){
 const res = await fetch(url);
 const reader = res.body.getReader();
 const chunks = [];
 while(true){
  const {done,value} = await reader.read();
  if(done) break;
  loadedBytes += value.length;
  chunks.push(value);
  loadingText.textContent =
   (loadedBytes / 1048576).toFixed(1) + " / " + TOTAL_MB + " MB";
 }
 const blob = new Blob(chunks, { type:"application/octet-stream" });
 chunks.length = 0;
 return blob;
}

function parts(name,start,end){
 return Array.from({length:end-start+1},(_,i)=>\`\${name}.part\${start+i}\`);
}

async function loadMerged(parts){
 const blobs = [];
 for(const p of parts) blobs.push(await fetchPart(p));
 const merged = new Blob(blobs, { type:"application/octet-stream" });
 blobs.length = 0;
 return URL.createObjectURL(merged);
}

(async()=>{
 try{
  const dataUrl = await loadMerged(parts("Build/hktruffled.data",1,45));
  const wasmUrl = await loadMerged(parts("Build/hktruffled.wasm",1,2));

  const script = document.createElement("script");
  script.src = "Build/hktruffled.loader.js";

  script.onload = () => {
   createUnityInstance(canvas,{
    dataUrl:dataUrl,
    frameworkUrl:"Build/hktruffled.framework.js",
    codeUrl:wasmUrl,
    streamingAssetsUrl:"StreamingAssets",
    matchWebGLToCanvasSize:false,
    devicePixelRatio:1,
    companyName:"Team Cherry",
    productName:"Hollow Knight",
    productVersion:"1.0"
   }).then(()=>{
    loadingText.remove();
    setTimeout(()=>{ if(window.gc) window.gc(); },1000);
   }).catch(err=>{
    console.error(err);
    loadingText.textContent="Failed to load";
   });
  };

  document.body.appendChild(script);
 }catch(e){
  console.error(e);
  loadingText.textContent="Load error";
 }
})();

document.addEventListener("visibilitychange",()=>{
 if(!document.hidden) canvas.focus();
});
<\/script>

</body>
</html>`);
  win.document.close();
});

// Launcher logic
document.getElementById("launchBtn").addEventListener("click", launchSite);

function launchSite() {
  let url = document.getElementById("siteUrl").value.trim();

  if (!url) {
    alert("Please enter a website address.");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const win = window.open("about:blank", "_blank");

  win.document.write(`<!DOCTYPE html>
<html>
  <body style="margin:0;background:black">
    <iframe src="${url}" style="width:100%;height:100%;border:none" allowfullscreen></iframe>
  </body>
</html>`);
  win.document.close();
}
