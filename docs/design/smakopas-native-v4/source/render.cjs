// Static Apple-platform artwork exporter. No app, native view or prototype is built.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const config = fs.mkdtempSync(path.join(os.tmpdir(), 'cookbook-native-fonts-'));
fs.mkdirSync(path.join(config, 'cache'));
fs.writeFileSync(path.join(config, 'fonts.conf'), `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${root}/assets</dir><dir>/Library/Fonts</dir><cachedir>${config}/cache</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE = path.join(config, 'fonts.conf');
process.env.FONTCONFIG_PATH = config;
const sharp = require('sharp');
const C = { ink:'#1c1e21', muted:'#5b636b', line:'#dde3e6', surface:'#eef1f2', accent:'#0e7c70', warning:'#855119' };
const font = fs.readFileSync(path.join(root, 'assets/archivo-latin.woff2')).toString('base64');
const encoded = new Map();
function asset(name) {
  if (!encoded.has(name)) encoded.set(name, fs.readFileSync(path.join(root, 'assets', name)).toString('base64'));
  return encoded.get(name);
}
const usedSymbols = new Set();
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let parts = [], id = 0;
const add = s => parts.push(s);
function t(x,y,s,size=17,weight=400,color=C.ink,extra='') { add(`<text x="${x}" y="${y}" font-family="Archivo" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(s)}</text>`); }
function ui(x,y,s,size=17,weight=400,color=C.ink,extra='') { add(`<text x="${x}" y="${y}" font-family="SF Pro Text" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(s)}</text>`); }
function lines(x,y,values,size=17,gap=26,weight=400,color=C.muted,font='Archivo') { values.forEach((s,i)=>(font === 'Archivo' ? t : ui)(x,y+i*gap,s,size,weight,color)); }
function rect(x,y,w,h,fill='white',r=0,stroke='') { add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width=".8"` : ''}/>`); }
function rule(x,y,w,color=C.line) { add(`<path d="M${x} ${y}h${w}" stroke="${color}" stroke-width=".7"/>`); }
function icon(name,x,y,size=24,variant='ink') {
  const filename=`symbols/${name}-${variant}.png`; usedSymbols.add(filename);
  add(`<image href="data:image/png;base64,${asset(filename)}" x="${x}" y="${y}" width="${size}" height="${size}"/>`);
}
function photo(name,x,y,w,h,r=8) {
  const clip=`photo${++id}`;
  add(`<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs><image href="data:image/jpeg;base64,${asset(name+'.jpg')}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`);
}
function source(index,x,y,w) { add(`<image href="data:image/png;base64,${asset(`sample-page-0${index+1}.png`)}" x="${x}" y="${y}" width="${w}" height="${w*760/600}"/>`); }
// Material is a static approximation; actual Liquid Glass must come from native controls.
function glass(x,y,w,h,r=22,tinted=false) {
  const clip=`glass${++id}`;
  add(`<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>`);
  add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="white" filter="url(#shadow)"/>`);
  add(`<g clip-path="url(#${clip})"><use href="#scene" filter="url(#blur)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tinted ? C.accent : '#f8fafb'}" opacity="${tinted ? '.94' : '.82'}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#glass-light)"/></g>`);
  add(`<rect x="${x+.5}" y="${y+.5}" width="${w-1}" height="${h-1}" rx="${r-.5}" fill="none" stroke="${tinted ? '#b7dbd5' : 'white'}" stroke-opacity=".9" stroke-width=".8"/>`);
}
function button(x,y,w,label,{tone='tint',material=false,height=44}={}) {
  if(material) glass(x,y,w,height,height/2,tone==='tint');
  else rect(x,y,w,height,tone==='tint'?C.accent:C.surface,height/2);
  ui(x+w/2,y+height/2+6,label,16,600,tone==='tint'?'white':C.ink,'text-anchor="middle"');
}
function circleButton(name,x,y,variant='ink') { glass(x,y,44,44); icon(name,x+8,y+8,28,variant); }
function field(x,y,w,label,value,{height=44,muted=false}={}) { ui(x,y,label,13,500,C.muted); rect(x,y+12,w,height,'white',8,C.line); ui(x+12,y+40,value,17,400,muted?C.muted:C.ink); }
function phoneStatus() {
  rect(0,0,393,59,'white'); rect(136,11,121,35,C.ink,18);
  ui(52,35,'9:41',15,600,C.ink,'text-anchor="middle"');
  icon('cellularbars',294,20,19); icon('wifi',315,20,19); icon('battery.100',338,17,27);
}
function padStatus() {
  rect(0,0,1194,26,'white'); ui(24,18,'9:41',12,600); ui(61,18,'Fri 16 Oct',12,500,C.muted);
  icon('wifi',1091,4,18); ui(1121,18,'100%',12,500); icon('battery.100',1157,1,25);
}
function home(w=393,h=852) { rect(w/2-67,h-14,134,5,C.ink,2.5); }
function phoneTabs() {
  glass(20,758,353,66,33);
  rect(27,765,110,52,'#e0eeea',26);
  [['book.closed.fill','Cookbook',82,true],['bubble.left.and.bubble.right','Assistant',196,false],['checklist','Shopping',311,false]].forEach(([symbol,label,x,selected])=>{
    icon(symbol,x-15,771,30,selected?'accent':'ink'); ui(x,814,label,11,selected?600:500,selected?C.accent:C.ink,'text-anchor="middle"');
  });
}
function padTabs() {
  glass(388,38,450,52,26); rect(395,44,143,40,'#e0eeea',20);
  [['book.closed.fill','Cookbook',413,true],['bubble.left.and.bubble.right','Assistant',561,false],['checklist','Shopping',708,false]].forEach(([symbol,label,x,selected])=>{
    icon(symbol,x,51,26,selected?'accent':'ink'); ui(x+33,70,label,15,selected?600:500,selected?C.accent:C.ink);
  });
}
function beginClip(x,y,w,h,offset=0) { const clip=`content${++id}`;add(`<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${clip})"><g transform="translate(0 ${-offset})">`); }
function endClip() { add('</g></g>'); }
const h={fs,path,root,add,t,ui,lines,rect,rule,icon,photo,source,glass,button,circleButton,field,phoneStatus,padStatus,home,phoneTabs,padTabs,beginClip,endClip,C};
const defs=`<style>@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}</style><defs><filter id="blur"><feGaussianBlur stdDeviation="9"/></filter><filter id="shadow" x="-30%" y="-50%" width="160%" height="220%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dy="4"/><feComponentTransfer><feFuncA type="linear" slope=".13"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="glass-light" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="white" stop-opacity=".25"/><stop offset=".5" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="white" stop-opacity=".12"/></linearGradient></defs>`;
async function main() {
  const boards=[...require('./iphone.cjs')(h),...require('./ipad.cjs')(h)];
  const names=process.argv.slice(2);
  for(const board of boards.filter(b=>!names.length||names.includes(b.name))) {
    id=0;parts=[];board.content();const scene=parts.join('\n');parts=[];board.chrome();const chrome=parts.join('\n');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${board.width}" height="${board.height}" viewBox="0 0 ${board.width} ${board.height}"><title>${board.name} - static Apple-platform design study</title>${defs}<g id="scene"><rect width="100%" height="100%" fill="white"/>${scene}</g>${chrome}</svg>`;
    fs.writeFileSync(path.join(root,board.name+'.svg'),svg);
    await sharp(Buffer.from(svg),{density:144}).png().toFile(path.join(root,board.name+'.png'));
    console.log(`${board.name}: ${board.width} x ${board.height} @2x`);
  }
  fs.writeFileSync(path.join(root,'source/used-symbols.json'),JSON.stringify([...usedSymbols].sort(),null,2)+'\n');
  if (!names.length) {
    for (const device of ['iphone','ipad']) {
      const primary=boards.filter(b=>b.name.startsWith(device+'-0'));
      const columns=device==='iphone'?4:2;
      const gap=32, labelHeight=42;
      const cellWidth=primary[0].width, cellHeight=primary[0].height+labelHeight;
      const width=columns*cellWidth+(columns+1)*gap;
      const height=Math.ceil(primary.length/columns)*cellHeight+(Math.ceil(primary.length/columns)+1)*gap;
      const labels=['01  Cookbook','02  Add photos','03  Review','04  Recipe'];
      const items=primary.map((board,index)=>{
        const x=gap+(index%columns)*(cellWidth+gap), y=gap+Math.floor(index/columns)*(cellHeight+gap);
        const png=fs.readFileSync(path.join(root,board.name+'.png')).toString('base64');
        return `<text x="${x}" y="${y+23}" font-family="Archivo" font-size="20" font-weight="600" fill="${C.ink}">${labels[index]}</text><image href="data:image/png;base64,${png}" x="${x}" y="${y+labelHeight}" width="${board.width}" height="${board.height}"/><rect x="${x}" y="${y+labelHeight}" width="${board.width}" height="${board.height}" fill="none" stroke="${C.line}"/>`;
      }).join('');
      const overview=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${defs}<rect width="100%" height="100%" fill="#eef1f2"/>${items}</svg>`;
      await sharp(Buffer.from(overview)).png().toFile(path.join(root,device+'-flow.png'));
      console.log(`${device}-flow: ${width} x ${height}`);
    }
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
