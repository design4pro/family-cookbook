module.exports = function(h) {
  const {add,t,ui,lines,rect,rule,icon,photo,source,glass,button,circleButton,phoneStatus,home,phoneTabs,beginClip,endClip,C}=h;
  function nav(title,save=false) {
    phoneStatus(); circleButton('xmark',20,64); ui(196.5,92,title,17,600,C.ink,'text-anchor="middle"');
    if(save) button(293,64,80,'Save',{material:true}); home();
  }
  function segments(sourceSelected=false) {
    glass(20,122,353,44,22); rect(sourceSelected?25:198,127,170,34,'white',17);
    ui(110,150,'Source',15,sourceSelected?600:400,C.ink,'text-anchor="middle"');
    ui(284,150,'Draft',15,sourceSelected?400:600,C.ink,'text-anchor="middle"');
  }
  function bookContent() {
    t(20,159,'Our cookbook',34,700,C.ink,'letter-spacing="-.9"');
    t(20,191,'Recipes kept close.',17,400,C.muted);
    rect(20,218,353,44,C.surface,22); icon('magnifyingglass',31,227,26,'muted'); ui(67,246,'Find a recipe',17,400,C.muted);
    rect(20,280,353,44,C.surface,10);rect(23,283,115,38,'white',8);
    ui(81,308,'All recipes',15,600,C.ink,'text-anchor="middle"');
    ui(196,308,'Favorites',15,400,C.muted,'text-anchor="middle"');
    ui(312,308,'Drafts',15,400,C.muted,'text-anchor="middle"');
    photo('shakshuka',20,344,353,264.75);
    t(20,647,'Shakshuka',24,600,C.ink,'letter-spacing="-.4"'); icon('chevron.right',345,626,24,'muted');
    ui(20,674,'25 min · Demo recipe',14,400,C.muted);
    rule(20,704,353); photo('greek-salad',20,725,76,57);
    t(112,748,'Greek salad',18,600); ui(112,774,'10 min · Demo recipe',14,400,C.muted);
    rule(20,802,353);
  }
  function bookChrome() { phoneStatus();circleButton('person.crop.circle',20,64);button(255,64,118,'Add recipe',{material:true});phoneTabs();home(); }
  function addContent() {
    t(20,152,'One recipe, up to 5 photos.',18,500);
    ui(20,181,'2 selected · Not uploaded',14,400,C.muted);
    button(20,207,171,'Photo library',{tone:'plain'});button(203,207,170,'Camera',{tone:'plain'});
    [20,205].forEach((x,i)=>{
      rect(x,278,168,216,C.surface,12);source(i,x+12,290,144);
      ui(x,524,`Photo ${i+1}`,16,600);icon('arrow.up.left.and.arrow.down.right',x+138,504,24,'muted');
      icon(i?'arrow.up':'arrow.down',x+3,541,22,'muted');ui(x+30,560,i?'Move up':'Move down',14,500,C.muted);icon('trash',x+132,535,36,'muted');
    });
    ui(20,609,'Uses 2 image pages.',15,500);ui(20,635,'You review the draft before saving.',15,400,C.muted);
    lines(20,675,['Keep this screen open until upload finishes.','Then processing can finish after you leave.'],14,23,400,C.muted,'SF');
    ui(20,733,'Enter manually',15,600,C.accent);
  }
  function addChrome() { nav('Add photos');button(20,765,353,'Upload & transcribe',{material:true,height:48}); }
  function input(x,y,w,value,unknown=false) {
    rect(x,y,w,44,'white',8,unknown?C.warning:C.line);
    ui(x+10,y+28,value,unknown?14:17,400,unknown?C.muted:C.ink);
  }
  function reviewDocument() {
    ui(20,201,'AI draft · Not yet in your cookbook',13,500,C.muted);
    lines(20,231,['Check every field against the original,','including fields without a warning.'],15,23,400,C.muted,'SF');
    ui(20,290,'Recipe title',13,500,C.muted);input(20,303,353,'Family pancakes');
    ui(20,382,'Recipe by',17);ui(373,382,'Anna',17,400,C.ink,'text-anchor="end"');rule(20,403,353);
    ui(20,434,'Servings',17);ui(373,434,'Not specified',16,400,C.muted,'text-anchor="end"');
    ui(20,458,'Portion scaling stays off.',13,400,C.muted);rule(20,479,353);
    ui(20,509,'Family note',17);ui(373,509,'Add a note',16,400,C.muted,'text-anchor="end"');rule(20,531,353);
    t(20,574,'Ingredients',24,600,C.ink,'letter-spacing="-.4"');
    [['2½ cups','flour'],['2','eggs'],['250 ml','milk'],['Not specified','salt']].forEach(([amount,name],i)=>{
      const y=592+i*48; input(20,y,114,amount,i===3);input(146,y,183,name);icon('trash',335,y+7,30,'muted');
    });
    ui(20,804,'Salt amount missing in original. Keep unknown.',13,400,C.warning);
    ui(20,837,'Add ingredient',15,600,C.accent);
    t(20,881,'Method',24,600,C.ink,'letter-spacing="-.4"');ui(20,907,'Compare with photo 2.',14,400,C.muted);
    ['Mix the ingredients.','Cook in a pan.'].forEach((value,i)=>{
      const y=923+i*76;ui(20,y+28,i+1,17,600,C.muted);input(50,y,279,value);icon('trash',335,y+7,30,'muted');
    });
    ui(50,1082,'Add step',15,600,C.accent);rule(20,1100,353);
    ui(20,1122,'Last edited by Alex · Synthetic demo',12,400,C.muted);
    lines(20,1150,['Save makes this recipe available','to your household.'],15,23,400,C.muted,'SF');
  }
  function reviewContent(offset=0) { beginClip(0,179,393,635,offset);reviewDocument();endClip(); }
  function reviewChrome() { nav('Review recipe',true);segments(); }
  function sourceContent() {
    ui(20,200,'AI draft · 2 original photos',13,500,C.muted);
    ui(20,235,'Photo 1 of 2',15,600);ui(264,235,'Next',15,600,C.accent);icon('chevron.right',341,215,24,'accent');
    rect(20,259,353,438,C.surface,12);source(0,36,275,321);
    ui(20,730,'Uploaded by Alex · Synthetic demo',13,400,C.muted);
    ui(20,758,'Your originals stay unchanged.',15,400,C.muted);
    ui(20,797,'Open original',16,600,C.accent);icon('arrow.up.left.and.arrow.down.right',341,778,26,'accent');
  }
  function recipeContent() {
    t(20,152,'Family pancakes',32,700,C.ink,'letter-spacing="-.8"');
    ui(20,181,'Recipe by Anna · Synthetic demo',14,400,C.muted);
    icon('doc.text',16,201,26,'accent');ui(51,221,'2 original photos',15,600,C.accent);
    ui(20,257,'Servings not specified',16,500);ui(20,281,'Portion scaling is unavailable.',13,400,C.muted);
    t(20,326,'Ingredients',24,600,C.ink,'letter-spacing="-.4"');
    [['2½ cups','flour'],['2','eggs'],['250 ml','milk'],['Not specified','salt']].forEach(([amount,name],i)=>{
      const y=344+i*42;rule(20,y,353);t(20,y+28,amount,i===3?14:17,600,i===3?C.muted:C.ink);t(166,y+28,name,17);
    });
    rule(20,512,353);t(20,551,'Method',24,600,C.ink,'letter-spacing="-.4"');
    ui(20,589,'1',16,600,C.muted);t(50,589,'Mix the ingredients.',18);
    ui(20,630,'2',16,600,C.muted);t(50,630,'Cook in a pan.',18);
    ui(20,666,'Ask about this recipe',15,600,C.accent);icon('arrow.right',340,647,26,'accent');
    button(20,693,171,'Start cooking');button(203,693,170,'Add ingredients',{tone:'plain'});
  }
  function recipeChrome() { phoneStatus();circleButton('chevron.left',20,64);circleButton('bookmark',277,64);circleButton('ellipsis',329,64);phoneTabs();home(); }
  return [
    {name:'iphone-01-cookbook',width:393,height:852,content:bookContent,chrome:bookChrome},
    {name:'iphone-02-add-photos',width:393,height:852,content:addContent,chrome:addChrome},
    {name:'iphone-03-review',width:393,height:852,content:()=>reviewContent(),chrome:reviewChrome},
    {name:'iphone-04-recipe',width:393,height:852,content:recipeContent,chrome:recipeChrome},
    {name:'iphone-review-source',width:393,height:852,content:sourceContent,chrome:()=>{nav('Review recipe',true);segments(true);}},
    {name:'iphone-review-lower',width:393,height:852,content:()=>reviewContent(370),chrome:reviewChrome},
  ];
};
