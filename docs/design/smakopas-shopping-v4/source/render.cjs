// Design-artifact renderer only. No application routes, views or interactions are implemented.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'..');
const config=fs.mkdtempSync(path.join(os.tmpdir(),'cookbook-shopping-fonts-'));
fs.mkdirSync(path.join(config,'cache'));
fs.writeFileSync(path.join(config,'fonts.conf'),`<fontconfig><dir>${root}/assets</dir><dir>/Library/Fonts</dir><cachedir>${config}/cache</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE=path.join(config,'fonts.conf');process.env.FONTCONFIG_PATH=config;
const sharp=require('sharp');
const C={ink:'#1c1e21',muted:'#5b636b',line:'#dde3e6',surface:'#eef1f2',accent:'#0e7c70',warning:'#855119',pale:'#e2efeb',container:'#d8eee8',onContainer:'#104b43'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const assets=new Map(),usedSF=new Set(),usedMaterial=new Set();
function asset(name){if(!assets.has(name))assets.set(name,fs.readFileSync(path.join(root,'assets',name)).toString('base64'));return assets.get(name);}
let parts=[],targets=[],id=0,platform='web';
const add=s=>parts.push(s);
function rect(x,y,w,h,fill='white',r=0,stroke=''){add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="1"`:''}/>`);}
function rule(x,y,w,color=C.line){add(`<path d="M${x} ${y}h${w}" stroke="${color}" stroke-width="1"/>`);}
function text(x,y,s,size=17,weight=400,color=C.ink,extra=''){add(`<text x="${x}" y="${y}" font-family="Archivo" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(s)}</text>`);}
function ui(x,y,s,size=17,weight=400,color=C.ink,extra=''){const font=platform==='apple'?'SF Pro Text':platform==='android'?'Roboto':'Archivo';add(`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(s)}</text>`);}
function lines(x,y,values,size=16,gap=24,color=C.muted){values.forEach((v,i)=>ui(x,y+i*gap,v,size,400,color));}
function target(x,y,w,h,label,disabled=false){targets.push({x,y,width:w,height:h,label,disabled});}
function sf(name,x,y,size=24,variant='ink'){const file=`symbols/${name}-${variant}.png`;usedSF.add(file);add(`<image href="data:image/png;base64,${asset(file)}" x="${x}" y="${y}" width="${size}" height="${size}"/>`);}
function material(name,x,y,size=24,color=C.ink){usedMaterial.add(name);const svg=fs.readFileSync(path.join(root,'assets/material-symbols',name+'.svg'),'utf8');const body=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');add(`<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 -960 960 960" fill="${color}">${body}</svg>`);}
function icon(name,x,y,size=20,color=C.ink){
  const paths={plus:'<path d="M12 5v14M5 12h14"/>',back:'<path d="M20 12H4m6-6-6 6 6 6"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',down:'<path d="m6 9 6 6 6-6"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-2l2 3M4 15l2 3a8 8 0 0 0 13-2"/>',more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'};
  if(!paths[name])throw Error(`Unknown web icon: ${name}`);
  add(`<g transform="translate(${x} ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</g>`);
}
function glass(x,y,w,h,r=22,tinted=false){const clip=`glass${++id}`;add(`<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>`);add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="white" filter="url(#shadow)"/><g clip-path="url(#${clip})"><use href="#scene" filter="url(#blur)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tinted?C.accent:'#f8fafb'}" opacity="${tinted?'.94':'.82'}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#glass-light)"/></g><rect x="${x+.5}" y="${y+.5}" width="${w-1}" height="${h-1}" rx="${r-.5}" fill="none" stroke="${tinted?'#b7dbd5':'white'}" stroke-opacity=".9" stroke-width=".8"/>`);}
function button(x,y,w,label,{tone='secondary',glass:materialGlass=false,height=44}={}){
  target(x,y,w,height,label,tone==='disabled');
  const primary=tone==='primary',disabled=tone==='disabled';
  if(materialGlass)glass(x,y,w,height,height/2,primary);
  else if(tone!=='text')rect(x,y,w,height,primary?(platform==='web'?C.ink:C.accent):disabled?C.surface:platform==='web'?'white':C.surface,height/2,tone==='secondary'&&platform==='web'?C.line:'');
  ui(x+w/2,y+height/2+5,label,platform==='android'?14:16,platform==='android'?500:600,primary?'white':disabled?C.muted:tone==='text'?C.accent:C.ink,'text-anchor="middle"');
}
function checkbox(x,y,{checked=false,pending=false,label='Check item',disabled=false}={}){
  const size=platform==='android'?48:44;target(x,y,size,size,label,disabled);
  const color=pending?C.warning:C.accent,box=platform==='apple'?24:22,offset=(size-box)/2;
  rect(x+offset,y+offset,box,box,checked?color:'white',platform==='apple'?12:platform==='android'?2:4,checked?'':C.muted);
  if(checked)icon('check',x+offset+3,y+offset+3,box-6,'white');
  if(pending)add(`<rect x="${x+offset-3}" y="${y+offset-3}" width="${box+6}" height="${box+6}" rx="${platform==='apple'?15:5}" fill="none" stroke="${C.warning}" stroke-width="1" stroke-dasharray="2 2"/>`);
}
function circleButton(name,x,y,variant='ink'){target(x,y,44,44,name);glass(x,y,44,44);sf(name,x+8,y+8,28,variant);}
function phoneStatus(){rect(0,0,393,59);rect(136,11,121,35,C.ink,18);ui(52,35,'9:41',15,600,C.ink,'text-anchor="middle"');sf('cellularbars',294,20,19);sf('wifi',315,20,19);sf('battery.100',338,17,27);}
function padStatus(){rect(0,0,1194,26);ui(24,18,'9:41',12,600);ui(61,18,'Fri 16 Oct',12,500,C.muted);sf('wifi',1091,4,18);ui(1121,18,'100%',12,500);sf('battery.100',1157,1,25);}
function home(w=393,h=852){rect(w/2-67,h-14,134,5,C.ink,2.5);}
function phoneTabs(){glass(20,758,353,66,33);rect(256,765,110,52,C.pale,26);[['book.closed','Cookbook',82],['bubble.left.and.bubble.right','Assistant',196],['checklist','Shopping',311]].forEach(([name,label,x],i)=>{target(x-52,765,104,52,label);sf(name,x-15,771,30,i===2?'accent':'ink');ui(x,814,label,11,i===2?600:500,i===2?C.accent:C.ink,'text-anchor="middle"');});}
function padTabs(){glass(388,38,450,52,26);rect(691,44,140,40,C.pale,20);[['book.closed','Cookbook',413],['bubble.left.and.bubble.right','Assistant',561],['checklist','Shopping',708]].forEach(([name,label,x],i)=>{target(x-7,42,139,46,label);sf(name,x,51,26,i===2?'accent':'ink');ui(x+33,70,label,15,i===2?600:500,i===2?C.accent:C.ink);});}
function androidStatus(){rect(0,0,412,24);ui(24,18,'9:41',12,500);material('wifi',328,4,16);material('signal_cellular_4_bar',348,4,16);material('battery_full',372,3,18);}
function androidGesture(color='white'){rect(0,891,412,24,color);rect(152,903,108,4,C.ink,2);}
function androidNav(){rect(0,811,412,104,'#f0f5f2');[['menu_book','Cookbook',69],['chat_bubble','Assistant',206],['checklist','Shopping',343]].forEach(([name,label,x],i)=>{target(x-64,811,128,80,label);if(i===2)rect(x-32,823,64,32,C.container,16);material(name,x-12,827,24,i===2?C.onContainer:C.muted);ui(x,878,label,12,i===2?700:500,i===2?C.onContainer:C.muted,'text-anchor="middle"');});androidGesture('#f0f5f2');}
function androidIconButton(name,x,y,label,color=C.ink){target(x,y,48,48,label);material(name,x+12,y+12,24,color);}
const h={C,add,rect,rule,text,t:text,ui,lines,target,icon,sf,material,button,checkbox,glass,circleButton,phoneStatus,padStatus,home,phoneTabs,padTabs,androidStatus,androidGesture,androidNav,androidIconButton};
const defs=`<style>@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${asset('archivo-latin.woff2')}) format('woff2');font-weight:100 900}@font-face{font-family:Roboto;src:url(data:font/ttf;base64,${asset('roboto-variable.ttf')}) format('truetype');font-weight:100 900}</style><defs><filter id="blur"><feGaussianBlur stdDeviation="9"/></filter><filter id="shadow" x="-30%" y="-50%" width="160%" height="220%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dy="4"/><feComponentTransfer><feFuncA type="linear" slope=".13"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="fab-shadow" x="-20%" y="-30%" width="140%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dy="2"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="glass-light" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="white" stop-opacity=".25"/><stop offset=".5" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="white" stop-opacity=".12"/></linearGradient></defs>`;
async function main(){
  const boards=[...require('./web.cjs')(h),...require('./apple.cjs')(h),...require('./android.cjs')(h)],inventory={};
  for(const board of boards){
    platform=board.platform;parts=[];targets=[];id=0;rect(0,0,board.width,board.height);board.content();const scene=parts.join('\n');parts=[];board.chrome();
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${board.width}" height="${board.height}" viewBox="0 0 ${board.width} ${board.height}"><title>${board.name} - static shopping design study</title>${defs}<g id="scene">${scene}</g>${parts.join('\n')}</svg>`;
    fs.writeFileSync(path.join(root,board.name+'.svg'),svg);await sharp(Buffer.from(svg),{density:144}).png().toFile(path.join(root,board.name+'.png'));
    inventory[board.name]={platform,logicalWidth:board.width,logicalHeight:board.height,targets};console.log(`${board.name}: ${board.width} x ${board.height} @2x`);
  }
  fs.writeFileSync(path.join(root,'source/target-regions.json'),JSON.stringify(inventory,null,2)+'\n');
  fs.writeFileSync(path.join(root,'source/used-assets.json'),JSON.stringify({sf:[...usedSF].sort(),material:[...usedMaterial].sort()},null,2)+'\n');
  const layouts=[{name:'phone-overview',width:1291,height:1106,items:[['web-mobile-list','Mobile web',24,74,1],['iphone-list','iPhone',438,74,1],['android-list','Android',855,74,1]]},{name:'wide-overview',width:1930,height:758,items:[['web-desktop-list','Web desktop',24,74,.65],['ipad-list','iPad',996,74,.75]]}];
  for(const layout of layouts){
    const items=layout.items.map(([name,label,x,y,scale])=>{const b=boards.find(b=>b.name===name),png=fs.readFileSync(path.join(root,name+'.png')).toString('base64');return `<text x="${x}" y="${y-24}" font-family="Archivo" font-size="20" font-weight="600" fill="${C.ink}">${label}</text><image href="data:image/png;base64,${png}" x="${x}" y="${y}" width="${b.width*scale}" height="${b.height*scale}"/><rect x="${x}" y="${y}" width="${b.width*scale}" height="${b.height*scale}" fill="none" stroke="${C.line}"/>`;}).join('');
    await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}">${defs}<rect width="100%" height="100%" fill="${C.surface}"/>${items}</svg>`)).png().toFile(path.join(root,layout.name+'.png'));
  }
  fs.rmSync(config,{recursive:true,force:true});
}
main().catch(e=>{console.error(e);process.exitCode=1;});
