// Drawing instructions for six static phone artboards, not application components.
module.exports=function(h){
  const {C,add,rect,rule,text,ui,lines,target,icon,iconButton,button,field,photo,source,clip,endClip,status,gesture,topBar,nav,tabs}=h;
  function cookbook(){
    ui(20,115,'Recipes kept close.',16,400,C.muted);
    rect(20,132,372,56,C.surface,28);icon('search',36,148);ui(76,166,'Find a recipe',16,400,C.muted);target(20,132,372,56,'Search recipes');
    [['All recipes',82],['Favorites',206],['Drafts',330]].forEach(([label,x],i)=>{
      target(x-62,204,124,48,label);ui(x,234,label,14,500,i?C.muted:C.primary,'text-anchor="middle"');
    });rule(20,251,372);rect(54,248,56,4,C.primary,2);
    photo('shakshuka',20,272,372,279);target(20,272,372,360,'Read Shakshuka');
    text(20,590,'Shakshuka',24,600,C.ink,'Archivo','letter-spacing="-.4"');icon('chevron_right',364,568,24,C.muted);
    ui(20,616,'25 min · Demo recipe',14,400,C.muted);rule(20,640,372);
    photo('greek-salad',20,660,76,57);text(112,684,'Greek salad',20,500);ui(112,710,'10 min · Demo recipe',14,400,C.muted);target(20,652,372,72,'Read Greek salad');
  }
  function bookChrome(){
    status();topBar('Our cookbook',{book:true});
    // Extended FAB, with a dedicated gap above destination navigation.
    add('<g filter="url(#fab-shadow)">');rect(220,739,172,56,C.container,16);add('</g>');
    icon('add',236,755,24,C.onContainer);ui(276,772,'Add recipe',14,500,C.onContainer);target(220,739,172,56,'Add recipe');nav();
  }
  function addPhotos(){
    text(20,122,'One recipe, up to 5 photos.',20,500);
    ui(20,150,'2 selected · Not uploaded',14,400,C.muted);
    button(20,172,178,'Photo library',{tone:'outlined',symbol:'photo_library'});button(214,172,178,'Camera',{tone:'outlined',symbol:'photo_camera'});
    [20,212].forEach((x,i)=>{
      rect(x,244,180,226,C.surface,12);source(i,x+12,256,156);target(x,244,180,226,`Preview photo ${i+1}`);
      text(x,503,`Photo ${i+1}`,16,600);iconButton('open_in_full',x+132,476,`Open photo ${i+1}`,C.muted);
      target(x,532,124,48,i?'Move photo up':'Move photo down');icon(i?'arrow_upward':'arrow_downward',x+8,544,24,C.muted);ui(x+38,562,i?'Move up':'Move down',14,500,C.muted);
      iconButton('delete',x+132,532,`Remove photo ${i+1}`,C.muted);
    });
    ui(20,622,'Uses 2 image pages.',16,500);ui(20,650,'You review the draft before saving.',16,400,C.muted);
    lines(20,696,['Keep this screen open until upload finishes.','Then processing can finish after you leave.'],14,24);
    button(8,748,160,'Enter manually',{tone:'text'});
  }
  function addChrome(){status();topBar('Add photos');rect(0,811,412,80);button(20,827,372,'Upload & transcribe');gesture();}
  function draft(){
    ui(20,170,'AI draft · Not yet in your cookbook',14,500,C.muted);
    lines(20,200,['Check every field against the original,','including fields without a warning.']);
    field(20,250,372,'Recipe title','Family pancakes');
    field(20,330,178,'Recipe by','Anna');field(214,330,178,'Servings','Not specified',{placeholder:true});
    ui(20,411,'Portion scaling stays off.',14,400,C.muted);
    field(20,438,372,'Family note (optional)','Add a note',{placeholder:true});
    text(20,540,'Ingredients',24,600,C.ink,'Archivo','letter-spacing="-.4"');
    ui(20,570,'Amount',12,500,C.muted);ui(174,570,'Ingredient',12,500,C.muted);
    [['2½ cups','flour'],['2','eggs'],['250 ml','milk'],['Not specified','salt']].forEach(([amount,name],i)=>{
      const y=582+i*72;
      field(20,y,142,'',amount,{unknown:i===3});field(174,y,158,'',name);iconButton('delete',344,y+4,`Remove ${name}`,C.muted);
    });
    ui(20,878,'Salt amount missing in original. Keep unknown.',14,400,C.warning);
    button(8,896,174,'Add ingredient',{tone:'text',symbol:'add'});
    text(20,980,'Method',24,600,C.ink,'Archivo','letter-spacing="-.4"');
    ui(20,1004,'Compare with photo 2.',14,400,C.muted);
    ['Mix the ingredients.','Cook in a pan.'].forEach((value,i)=>{
      const y=1024+i*72;ui(20,y+35,i+1,16,500,C.muted);field(52,y,280,'',value);iconButton('delete',344,y+4,`Remove step ${i+1}`,C.muted);
    });
    button(40,1160,146,'Add step',{tone:'text',symbol:'add'});rule(20,1216,372);
    ui(20,1234,'Last edited by Alex · Synthetic demo',12,400,C.muted);
    ui(20,1254,'Save shares this recipe with your household.',14,400,C.muted);
  }
  function reviewContent(offset=0){clip(148,743,offset);draft();endClip();}
  function reviewChrome(sourceSelected=false){status();topBar('Review recipe',{save:true});tabs(sourceSelected);gesture();}
  function original(){
    ui(20,170,'AI draft · 2 original photos',14,500,C.muted);ui(20,210,'Photo 1 of 2',16,500);
    button(280,180,112,'Next',{tone:'text',symbol:'arrow_forward'});
    rect(20,244,372,456,C.surface,12);source(0,36,258,340);
    ui(20,736,'Uploaded by Alex · Synthetic demo',14,400,C.muted);
    ui(20,764,'Your originals stay unchanged.',16,400,C.muted);
    button(8,800,188,'Open original',{tone:'text',symbol:'open_in_full'});
  }
  function recipe(){
    text(20,132,'Family pancakes',32,700,C.ink,'Archivo','letter-spacing="-.8"');ui(20,162,'Recipe by Anna · Synthetic demo',14,400,C.muted);
    button(8,182,210,'2 original photos',{tone:'text',symbol:'article'});
    ui(20,258,'Servings not specified',16,500);ui(20,282,'Portion scaling is unavailable.',14,400,C.muted);
    text(20,326,'Ingredients',24,600,C.ink,'Archivo','letter-spacing="-.4"');
    [['2½ cups','flour'],['2','eggs'],['250 ml','milk'],['Not specified','salt']].forEach(([amount,name],i)=>{
      const y=344+i*44;rule(20,y,372);text(20,y+29,amount,i===3?14:16,600,i===3?C.muted:C.ink);text(174,y+29,name,16);
    });rule(20,520,372);
    text(20,566,'Method',24,600,C.ink,'Archivo','letter-spacing="-.4"');
    ui(20,608,'1',16,500,C.muted);text(52,608,'Mix the ingredients.',18);
    ui(20,652,'2',16,500,C.muted);text(52,652,'Cook in a pan.',18);
    target(20,675,372,48,'Ask about this recipe');ui(20,705,'Ask about this recipe',14,500,C.primary);icon('arrow_forward',364,687,24,C.primary);
    button(20,747,178,'Start cooking');button(214,747,178,'Add ingredients',{tone:'tonal'});
  }
  return [
    {name:'android-01-cookbook',content:cookbook,chrome:bookChrome},
    {name:'android-02-add-photos',content:addPhotos,chrome:addChrome},
    {name:'android-03-review',content:()=>reviewContent(),chrome:()=>reviewChrome()},
    {name:'android-04-recipe',content:recipe,chrome:()=>{status();topBar('Recipe',{recipe:true});nav();}},
    {name:'android-review-source',content:original,chrome:()=>reviewChrome(true)},
    {name:'android-review-lower',content:()=>reviewContent(370),chrome:()=>reviewChrome()},
  ];
};
