// Static Android shopping artwork; no live state or native components are created.
module.exports=function(h){
  const {C,add,rect,rule,text,ui,lines,target,material,button,checkbox,androidStatus,androidGesture,androidNav,androidIconButton}=h;
  const rows=[
    ['Eggs','6','2 recipe additions'],['Milk','750 ml','Recipe + manual item'],
    ['Flour','2½ cups','Family pancakes'],['Flour','250 g','Manual item'],
    ['Bread','1 loaf','Manual item'],['Chopped tomatoes','400 g','Shakshuka · 2 servings']
  ];
  function row(record,index,y,offline){
    const pending=offline&&(index===0||index===4),checked=index===5||pending;
    checkbox(12,y+5,{checked,pending,label:`${checked?'Uncheck':'Check'} ${record[0]}`});
    text(72,y+27,record[0],17,500,checked?C.muted:C.ink,checked?'text-decoration="line-through"':'');
    ui(340,y+27,record[1],16,500,checked?C.muted:C.ink,'text-anchor="end"');
    ui(72,y+48,record[2],12,400,C.muted);
    if(pending)ui(72,y+66,'Waiting to sync',12,500,C.warning);
    if(!offline)androidIconButton('more_vert',348,y+6,`Details for ${record[0]}`,C.muted);
    rule(72,y+72,320);
  }
  function list(offline=false){
    ui(20,113,offline?'3 to buy · 3 checked':'5 to buy · 1 checked',16,500);
    if(offline){
      rect(20,132,372,80,'#fbf3e8',12);
      ui(36,158,'Offline · 2 changes waiting to sync',14,500,C.warning);
      lines(36,181,['Checks are saved on this device.','Reconnect with the app open to sync.'],14,20,C.warning);
      button(20,228,178,'From recipes',{tone:'disabled',height:48});button(214,228,178,'Add item',{tone:'disabled',height:48});
      rows.forEach((r,i)=>row(r,i,290+i*72,true));
      button(20,752,160,'Clear checked',{tone:'disabled',height:48});ui(200,781,'Online only',14,400,C.muted);
    }else{
      ui(20,139,'Up to date · Synthetic shopping demo',12,400,C.muted);
      button(20,160,178,'From recipes',{tone:'secondary',height:48});
      rows.forEach((r,i)=>row(r,i,224+i*72,false));
      ui(20,693,'Cups and grams stay in separate rows.',14,400,C.muted);
      button(8,739,176,'Clear checked',{tone:'text',height:48});
    }
  }
  function listChrome(offline=false){
    androidStatus();rect(0,24,412,64);text(20,66,'Shopping list',32,700,C.ink,'letter-spacing="-.8"');
    androidIconButton('account_circle',348,32,'Account');
    if(!offline){
      add('<g filter="url(#fab-shadow)">');rect(220,739,172,56,C.container,16);add('</g>');
      material('add',236,755,24,C.onContainer);ui(276,772,'Add item',14,500,C.onContainer);target(220,739,172,56,'Add item');
    }androidNav();
  }
  function confirm(){
    text(20,136,'Family pancakes',28,700,C.ink,'letter-spacing="-.6"');
    ui(20,168,'Original recipe amounts',16,500);
    lines(20,194,['Servings not specified. Scaling is unavailable.'],14,22);
    ui(20,234,'Uncheck anything you already have.',16,400,C.muted);
    const proposals=[
      ['Flour','2½ cups','New, separate row','The existing 250 g stays unchanged.'],
      ['Eggs','2','4 on the list → 6 after adding','From Shakshuka + Family pancakes'],
      ['Milk','250 ml','500 ml on the list → 750 ml','Recipe and manual amounts combine.'],
      ['Salt','Not specified','Already at home · Excluded','Amount is missing in the recipe.']
    ];
    proposals.forEach(([name,amount,effect,note],i)=>{
      const y=258+i*100;checkbox(12,y+4,{checked:i!==3,label:`${i===3?'Include':'Exclude'} ${name}`});
      text(72,y+28,name,18,500);ui(392,y+28,amount,16,500,i===3?C.warning:C.ink,'text-anchor="end"');
      ui(72,y+54,effect,14,500,i===3?C.muted:C.ink);ui(72,y+77,note,12,400,C.muted);rule(72,y+94,320);
    });
    ui(20,690,'3 selected · 1 excluded',16,500);ui(20,718,'1 new row · 2 updated rows',14,400,C.muted);
    ui(20,760,'Nothing changes until you confirm.',16,500);
    ui(20,788,'Synthetic shopping demo',12,400,C.muted);
  }
  function confirmChrome(){
    androidStatus();rect(0,24,412,64);androidIconButton('arrow_back',8,32,'Back');ui(72,63,'Review additions',22);
    rect(0,811,412,80);button(20,827,372,'Confirm additions',{tone:'primary',height:48});androidGesture();
  }
  return[
    {name:'android-list',width:412,height:915,platform:'android',content:()=>list(),chrome:()=>listChrome()},
    {name:'android-confirm',width:412,height:915,platform:'android',content:confirm,chrome:confirmChrome},
    {name:'android-offline',width:412,height:915,platform:'android',content:()=>list(true),chrome:()=>listChrome(true)}
  ];
};
