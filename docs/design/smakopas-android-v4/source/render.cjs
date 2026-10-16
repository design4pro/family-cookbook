// Static Android design artwork only. This does not build application UI.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const config = fs.mkdtempSync(path.join(os.tmpdir(), 'cookbook-android-fonts-'));
fs.mkdirSync(path.join(config, 'cache'));
fs.writeFileSync(path.join(config, 'fonts.conf'), `<fontconfig><dir>${root}/assets</dir><cachedir>${config}/cache</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE = path.join(config, 'fonts.conf');
process.env.FONTCONFIG_PATH = config;
const sharp = require('sharp');
const C = { ink:'#1c1e21', muted:'#5b636b', line:'#dde3e6', outline:'#747e83', surface:'#eef1f2', primary:'#0e7c70', onPrimary:'#ffffff', container:'#d8eee8', onContainer:'#104b43', warning:'#855119' };
const W = 412, H = 915;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const embedded = new Map();
function asset(name) {
  if(!embedded.has(name)) embedded.set(name,fs.readFileSync(path.join(root,'assets',name)).toString('base64'));
  return embedded.get(name);
}
const style = `<style>@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${asset('archivo-latin.woff2')}) format('woff2');font-weight:100 900}@font-face{font-family:Roboto;src:url(data:font/ttf;base64,${asset('roboto-variable.ttf')}) format('truetype');font-weight:100 900}</style><defs><filter id="fab-shadow" x="-20%" y="-30%" width="140%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dy="2"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
let parts=[], targets=[], id=0;
const usedIcons=new Set();
const add=s=>parts.push(s);
function rect(x,y,w,h,fill='white',r=0,stroke='') { add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="1"`:''}/>`); }
function rule(x,y,w,color=C.line) { add(`<path d="M${x} ${y}h${w}" stroke="${color}" stroke-width="1"/>`); }
function text(x,y,value,size=16,weight=400,color=C.ink,font='Archivo',extra='') { add(`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(value)}</text>`); }
function ui(x,y,value,size=16,weight=400,color=C.ink,extra='') { text(x,y,value,size,weight,color,'Roboto',extra); }
function lines(x,y,values,size=14,gap=22,color=C.muted) { values.forEach((v,i)=>ui(x,y+i*gap,v,size,400,color)); }
function target(x,y,w,h,label) { targets.push({x,y,width:w,height:h,label}); }
function icon(name,x,y,size=24,color=C.ink) {
  usedIcons.add(name);
  const svg=fs.readFileSync(path.join(root,'assets/material-symbols',name+'.svg'),'utf8');
  const body=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
  add(`<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 -960 960 960" fill="${color}">${body}</svg>`);
}
function iconButton(name,x,y,label,color=C.ink) { target(x,y,48,48,label); icon(name,x+12,y+12,24,color); }
function button(x,y,w,label,{tone='filled',symbol='',height=48}={}) {
  target(x,y,w,height,label);
  if(tone!=='text') rect(x,y,w,height,tone==='filled'?C.primary:tone==='tonal'?C.container:'white',height/2,tone==='outlined'?C.outline:'');
  const color=tone==='filled'?C.onPrimary:tone==='tonal'?C.onContainer:C.primary;
  if(symbol)icon(symbol,x+16,y+(height-20)/2,20,color);
  ui(x+w/2+(symbol?12:0),y+height/2+5,label,14,500,color,'text-anchor="middle"');
}
function field(x,y,w,label,value,{unknown=false,placeholder=false}={}) {
  target(x,y,w,56,label||value);
  rect(x,y,w,56,'white',4,unknown?C.warning:C.outline);
  if(label){rect(x+12,y-8,label.length*6.3+8,16,'white');ui(x+16,y+4,label,12,400,C.muted);}
  ui(x+16,y+35,value,16,400,unknown||placeholder?C.muted:C.ink);
}
function photo(name,x,y,w,h) {
  const clip=`photo${++id}`;
  add(`<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/></clipPath></defs><image href="data:image/jpeg;base64,${asset(name+'.jpg')}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`);
}
function source(index,x,y,w) { add(`<image href="data:image/png;base64,${asset(`sample-page-0${index+1}.png`)}" x="${x}" y="${y}" width="${w}" height="${w*760/600}"/>`); }
function clip(y,height,offset=0) { const key=`clip${++id}`;add(`<defs><clipPath id="${key}"><rect x="0" y="${y}" width="412" height="${height}"/></clipPath></defs><g clip-path="url(#${key})"><g transform="translate(0 ${-offset})">`); }
function endClip(){add('</g></g>');}
function status(){
  rect(0,0,W,24);ui(24,18,'9:41',12,500);icon('wifi',328,4,16);icon('signal_cellular_4_bar',348,4,16);icon('battery_full',372,3,18);
}
function gesture(color='white'){rect(0,891,W,24,color);rect(152,903,108,4,C.ink,2);}
function topBar(title,{book=false,save=false,recipe=false}={}) {
  rect(0,24,W,64);
  if(book){text(20,66,title,32,700,C.ink,'Archivo','letter-spacing="-.8"');iconButton('account_circle',348,32,'Account');}
  else {iconButton('arrow_back',8,32,'Back');ui(72,63,title,22,400);}
  if(save)button(324,32,72,'Save',{tone:'text'});
  if(recipe){iconButton('bookmark',292,32,'Save to favorites');iconButton('more_vert',348,32,'More recipe actions');}
}
function nav(){
  rect(0,811,W,104,'#f0f5f2');
  [['menu_book','Cookbook',69],['chat_bubble','Assistant',206],['checklist','Shopping',343]].forEach(([symbol,label,x],index)=>{
    target(x-64,811,128,80,label);if(!index)rect(x-32,823,64,32,C.container,16);
    icon(symbol,x-12,827,24,index?C.muted:C.onContainer);ui(x,878,label,12,index?500:700,index?C.muted:C.onContainer,'text-anchor="middle"');
  });gesture('#f0f5f2');
}
function tabs(sourceSelected=false){
  rect(0,88,W,48);rule(0,135,W);
  [['Source',103],['Draft',309]].forEach(([label,x],i)=>{target(x-103,88,206,48,label);ui(x,117,label,14,500,(sourceSelected?i===0:i===1)?C.primary:C.muted,'text-anchor="middle"');});
  rect((sourceSelected?103:309)-28,132,56,4,C.primary,2);
}
const h={W,H,C,add,rect,rule,text,ui,lines,target,icon,iconButton,button,field,photo,source,clip,endClip,status,gesture,topBar,nav,tabs};
async function main(){
  const boards=require('./artboards.cjs')(h), inventory={};
  for(const board of boards){
    parts=[];targets=[];id=0;rect(0,0,W,H);board.content();board.chrome();
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><title>${board.name} - static Android design study</title>${style}${parts.join('\n')}</svg>`;
    fs.writeFileSync(path.join(root,board.name+'.svg'),svg);
    await sharp(Buffer.from(svg),{density:144}).png().toFile(path.join(root,board.name+'.png'));
    inventory[board.name]=targets;console.log(`${board.name}: ${W} x ${H} @2x`);
  }
  fs.writeFileSync(path.join(root,'source/target-regions.json'),JSON.stringify(inventory,null,2)+'\n');
  fs.writeFileSync(path.join(root,'source/used-icons.json'),JSON.stringify([...usedIcons].sort(),null,2)+'\n');
  const gap=32,labelHeight=42,width=4*W+5*gap,height=H+2*gap+labelHeight;
  const labels=['01  Cookbook','02  Add photos','03  Review','04  Recipe'];
  const items=boards.slice(0,4).map((b,i)=>{
    const x=gap+i*(W+gap),png=fs.readFileSync(path.join(root,b.name+'.png')).toString('base64');
    return `<text x="${x}" y="55" font-family="Archivo" font-size="20" font-weight="600" fill="${C.ink}">${labels[i]}</text><image href="data:image/png;base64,${png}" x="${x}" y="${gap+labelHeight}" width="${W}" height="${H}"/><rect x="${x}" y="${gap+labelHeight}" width="${W}" height="${H}" fill="none" stroke="${C.line}"/>`;
  }).join('');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${style}<rect width="100%" height="100%" fill="${C.surface}"/>${items}</svg>`)).png().toFile(path.join(root,'android-flow.png'));
  fs.rmSync(config,{recursive:true,force:true});
}
main().catch(e=>{console.error(e);process.exitCode=1;});
