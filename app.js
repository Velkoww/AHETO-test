(function(){
  var mb=document.getElementById('menu-btn'),nv=document.getElementById('site-nav');
  if(!mb||!nv)return;
  function setOpen(o){nv.classList.toggle('open',o);mb.setAttribute('aria-expanded',o?'true':'false')}
  mb.addEventListener('click',function(e){e.stopPropagation();setOpen(!nv.classList.contains('open'))});
  nv.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('a'))setOpen(false)});
  document.addEventListener('click',function(e){if(!nv.contains(e.target)&&!mb.contains(e.target))setOpen(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false)});
})();
(function(){
  'use strict';

  /* ===== ВСИЧКИ ДАННИ НА КЛИЕНТА СА ТУК ===== */
  var CONFIG={
    name:'Занималня АНЕТО',
    phoneDisplay:'087 898 7552',
    phoneIntl:'+359878987552',
    street:'ул. „Бели Искър“ 21',
    postalCode:'1527',
    city:'София',
    addressFull:'ул. „Бели Искър“ 21, 1527 София, Център',
    mapsUrl:'https://maps.app.goo.gl/5QMCN1awGLX9WzHA8',
    timezone:'Europe/Sofia',
    hours:[
      {label:'Понеделник – петък',days:[1,2,3,4,5],open:'11:00',close:'18:00'},
      {label:'Събота и неделя',days:[6,0],closed:true}
    ],
    gaId:'',              /* Google Analytics 4, напр. 'G-ABC123XYZ0'. Зарежда се само след съгласие. */
    reviews:[            /* {name, text, text_en (превод за английската версия), stars, when}. Редовете в text стават отделни абзаци. */
      {name:'Родител',name_en:'A parent',stars:5,when:'',
       text:"Ани се грижи за дъщеря ни през по-голямата част от 2021 г.\nМира се привърза към нея  още през първата седмица. - спокойствието и дискретното чувство за хумор на Ани бързо ни вдъхнаха доверие, а дъщеря ни изпитваше искрена радост при всяко нейно появяване.\nНякак Ани намира фината зона на комуникация, в която се държи с нея като с дете, без да я лигави или подценява.\nЗа времето заедно Мира напредна страшно много - започна да общува и говори много добре за възрастта си и да се заиграва с другите деца.\nНещо уникално при Ани - може би това, кеото ни привлече най-силно в началото - е богатият ѝ опит в сферата на изкуството и превеждането му на детски език. Въпреки, че произведенията на дъщеря ни все още приличат на работите на Пикасо от късния му период :)) виждаме, че вече ѝ е интересно да рисува и често търси четката.\nСъс съпругата ми се занимаваме с дизайн - докато избирахме занималня бяхме потресени от пластмасовите и грозни интериори на почти всички ясли и детски градини, които оглеждахме. Ние не искаме детето ни да расте в такава среда. Ани се е погрижила нейното място да е светло и ведро. Дизайнът е приятен и детски без да подценява интелекта на малките обитатели.\nС голямо доверие и радост изпращаме Мира в занималня \"Ането\" всяка сутрин и желаем успех на създателите ѝ!",
       text_en:"Ani looked after our daughter for most of 2021.\nMira grew attached to her in the very first week. Ani's calm and her quiet sense of humour quickly won our trust, and our daughter was genuinely happy every time she appeared.\nSomehow Ani finds that delicate way of communicating where she treats her as a child without babying her or underestimating her.\nDuring their time together Mira made huge progress: she began to communicate and speak very well for her age and to play with the other children.\nSomething unique about Ani, and perhaps what drew us most at the start, is her rich experience in art and her way of translating it into a child's language. Although our daughter's works still look like late-period Picasso :)) we can see she now enjoys drawing and often reaches for the brush.\nMy wife and I work in design. While choosing a playroom we were shocked by the plastic, ugly interiors of almost every nursery and kindergarten we visited. We don't want our child to grow up in that kind of environment. Ani has made sure her place is bright and cheerful. The design is pleasant and child-friendly without underestimating the intelligence of its little residents.\nWe send Mira to ANETO every morning with great trust and joy, and we wish its founders every success!"}
    ],
    formEndpoint:'',      /* напр. https://api.web3forms.com/submit или https://formspree.io/f/xxxx */
    formAccessKey:'',     /* само за Web3Forms */
    photos:[]             /* напр. [{src:'photos/1.jpg',alt:'Стаята за игри',caption:'Стаята за игри'}] */
  };
  /* ========================================= */

  /* --- език: български или английски (според <html lang>) --- */
  var EN=document.documentElement.lang==='en';
  var BASE=EN?'../':'';
  var L=EN?{
    name:'ANETO Montessori Playroom',street:'21 Beli Iskar St.',city:'Sofia',addrFull:'21 Beli Iskar St., 1527 Sofia, Center',chip:'Center, 21 Beli Iskar St.',
    hours:['Monday – Friday','Saturday & Sunday'],closedDay:'closed',
    days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    openNow:'Open now · until ',closedToday:'Closed · opens today at ',closedOpens:'Closed · opens ',tomorrow:'tomorrow',on:'on ',at:' at ',closed:'Closed',now:'Now',
    spaceLead:'This is the room where the children spend their day.',mapTitle:'Map: ',
    fNeed:'Please enter your name and phone so we can contact you.',fConsent:'Please confirm your consent to data processing.',fThanks:'Thank you!',
    fDemo:function(n){return 'Thank you, '+n+'! This is a demo: on the live site your request goes straight to the playroom.'},
    fSending:'Sending your request...',fOk:function(n){return 'Thank you, '+n+'! We received your request and will call you.'},
    fErr:function(p){return 'We could not send your request. Please call '+p+'.'},subject:'New enquiry from the website of ',
    stars:' out of 5 stars',save:'Save choice',settings:'Settings',
    lines:['Hi! I am Dotty!','Shall we build with Lego today?','Are we drawing today?','Don\'t forget to drink water!','Want to play a memory game?'],
    playWord:'play',toGame:'To the game →',gameUrl:'about.html#game',hello:'Hi! I am Dotty. Want to play?',
    icons:{globe:'globe',book:'book',pencil:'pencil',tent:'tent',ball:'ball',lion:'lion cub'},
    card:'Card: ',hidden:'Hidden card ',win:function(m){return 'Well done! You found all pairs in '+m+' moves.'},champ:'Hooray! You are a champion!',
    cheers:['Well done!','That\'s right!','Great!'],
    themeDark:'Switch to dark theme',themeLight:'Switch to light theme',
    revMore:'Read the full review',revLess:'Show less',revTranslated:'translated from Bulgarian'
  }:{
    name:CONFIG.name,street:CONFIG.street,city:CONFIG.city,addrFull:CONFIG.addressFull,chip:'Център, '+CONFIG.street,
    hours:['Понеделник – петък','Събота и неделя'],closedDay:'почивен ден',
    days:['неделя','понеделник','вторник','сряда','четвъртък','петък','събота'],
    openNow:'Отворено сега · до ',closedToday:'Затворено · отваря днес в ',closedOpens:'Затворено · отваря ',tomorrow:'утре',on:null,at:' в ',closed:'Затворено',now:'Сега',
    spaceLead:'Така изглежда стаята, в която децата прекарват деня.',mapTitle:'Карта: ',
    fNeed:'Моля, въведете име и телефон, за да се свържем с вас.',fConsent:'Моля, потвърдете съгласието за обработка на данните.',fThanks:'Благодарим!',
    fDemo:function(n){return 'Благодарим, '+n+'! Това е демо: в готовия сайт запитването пристига директно на занималнята.'},
    fSending:'Изпращаме запитването...',fOk:function(n){return 'Благодарим, '+n+'! Получихме запитването и ще ви се обадим.'},
    fErr:function(p){return 'Не успяхме да изпратим запитването. Моля, обадете се на '+p+'.'},subject:'Ново запитване от сайта на ',
    stars:' от 5 звезди',save:'Запази избора',settings:'Настройки',
    lines:['Здравей! Аз съм Точко!','Днес ще строим ли с лего?','Днес рисуваме ли?','Не забравяй да пиеш вода!','Искаш ли да поиграем на памет?'],
    playWord:'поиграем',toGame:'Към играта →',gameUrl:'za-nas.html#game',hello:'Здравей! Аз съм Точко. Искаш ли да поиграем?',
    icons:{globe:'глобус',book:'книга',pencil:'молив',tent:'палатка',ball:'топка',lion:'лъвче'},
    card:'Карта: ',hidden:'Скрита карта ',win:function(m){return 'Браво! Намерихте всички двойки за '+m+' хода.'},champ:'Ура! Ти си шампион!',
    cheers:['Браво!','Точно така!','Чудесно!'],
    themeDark:'Включи тъмна тема',themeLight:'Включи светла тема',
    revMore:'Прочети целия отзив',revLess:'Скрий',revTranslated:''
  };
  CONFIG.hours[0].label=L.hours[0];CONFIG.hours[1].label=L.hours[1];

  /* --- светла/тъмна тема: по подразбиране според устройството, бутонът я сменя ръчно --- */
  (function(){
    var TK='aneto-theme',root=document.documentElement,mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
    function sys(){return mq&&mq.matches?'dark':'light'}
    function cur(){return root.getAttribute('data-theme')||sys()}
    function label(){
      var next=cur()==='dark'?'light':'dark';
      document.querySelectorAll('[data-theme-toggle]').forEach(function(b){var t=next==='dark'?L.themeDark:L.themeLight;b.setAttribute('aria-label',t);b.title=t;b.setAttribute('aria-pressed',cur()==='dark'?'true':'false')});
      var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',cur()==='dark'?'#0F1B1E':'#17525C');
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.addEventListener('click',function(){
      var next=cur()==='dark'?'light':'dark';
      if(next===sys()){root.removeAttribute('data-theme');try{localStorage.removeItem(TK)}catch(e){}}
      else{root.setAttribute('data-theme',next);try{localStorage.setItem(TK,next)}catch(e){}}
      label();
    })});
    if(mq){var h=function(){label()};if(mq.addEventListener)mq.addEventListener('change',h);else if(mq.addListener)mq.addListener(h)}
    label();
  })();

  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var motionOK=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  var DAYS=L.days;
  function toMin(t){var p=t.split(':');return (+p[0])*60+(+p[1])}
  function fmt(t){return t.replace(/^0/,'')}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  /* --- връзки и текстове --- */
  var digits=CONFIG.phoneIntl.replace(/\D/g,'');
  var hrefs={
    tel:'tel:'+CONFIG.phoneIntl,
    viber:'viber://chat?number='+encodeURIComponent(CONFIG.phoneIntl),
    wa:'https://wa.me/'+digits,
    maps:CONFIG.mapsUrl,
    dir:'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(CONFIG.street+', '+CONFIG.postalCode+' '+CONFIG.city)
  };
  $$('[data-href]').forEach(function(a){var h=hrefs[a.getAttribute('data-href')];if(h)a.setAttribute('href',h)});
  $$('[data-phone]').forEach(function(e){e.textContent=CONFIG.phoneDisplay});
  $$('[data-addr]').forEach(function(e){e.textContent=L.addrFull});
  $$('[data-addr-chip]').forEach(function(e){e.textContent=L.chip});
  $$('[data-addr-name]').forEach(function(e){e.innerHTML=esc(L.name)+'<br>'+esc(L.street)+', '+esc(L.city)});
  var yr=$('#year');if(yr)yr.textContent=new Date().getFullYear();

  /* --- време в София --- */
  function sofiaNow(){
    try{
      var parts=new Intl.DateTimeFormat('en-GB',{timeZone:CONFIG.timezone,weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
      var o={};parts.forEach(function(p){o[p.type]=p.value});
      var wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[o.weekday];
      return {d:wd,m:(+o.hour)*60+(+o.minute)};
    }catch(e){var n=new Date();return {d:n.getDay(),m:n.getHours()*60+n.getMinutes()}}
  }
  function slotFor(d){
    for(var i=0;i<CONFIG.hours.length;i++){var h=CONFIG.hours[i];if(!h.closed&&h.days.indexOf(d)>-1)return {o:toMin(h.open),c:toMin(h.close),ot:h.open,ct:h.close}}
    return null;
  }
  function prep(name){return L.on!==null?L.on:(/^[вф]/.test(name)?'във ':'в ')}
  function status(){
    var n=sofiaNow(),s=slotFor(n.d);
    if(s&&n.m>=s.o&&n.m<s.c)return {open:true,text:L.openNow+fmt(s.ct)};
    if(s&&n.m<s.o)return {open:false,text:L.closedToday+fmt(s.ot)};
    for(var k=1;k<=7;k++){
      var d=(n.d+k)%7,t=slotFor(d);
      if(t)return {open:false,text:L.closedOpens+(k===1?L.tomorrow:prep(DAYS[d])+DAYS[d])+L.at+fmt(t.ot)};
    }
    return {open:false,text:L.closed};
  }

  /* --- часове в контактите --- */
  var hl=$('#hours-list');
  if(hl){
    var today=sofiaNow().d;
    hl.innerHTML=CONFIG.hours.map(function(h){
      var t=h.closed?L.closedDay:fmt(h.open)+' – '+fmt(h.close);
      return '<li'+(h.days.indexOf(today)>-1?' class="today"':'')+'><span>'+esc(h.label)+'</span><b>'+t+'</b></li>';
    }).join('');
  }

  /* --- бадж отворено/затворено и маркер "Сега" --- */
  function refresh(){
    var st=status(),chip=$('#open-chip'),txt=$('#open-text');
    if(chip&&txt){txt.textContent=st.text;chip.classList.toggle('is-closed',!st.open)}
    var n=sofiaNow();
    $$('#day-list .seg').forEach(function(seg){
      var on=n.d>=1&&n.d<=5&&n.m>=+seg.getAttribute('data-s')&&n.m<+seg.getAttribute('data-e');
      var had=seg.classList.contains('now');
      seg.classList.toggle('now',on);
      var pill=$('.pill',seg);
      if(on&&!pill){var p=document.createElement('span');p.className='pill';p.textContent=L.now;var b=$('b',seg);b.insertBefore(p,b.firstChild)}
      if(!on&&pill)pill.remove();
    });
  }
  refresh();setInterval(refresh,60000);

  /* --- JSON-LD за Google --- */
  try{
    var spec=[],dn=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    CONFIG.hours.forEach(function(h){if(h.closed)return;spec.push({'@type':'OpeningHoursSpecification',dayOfWeek:h.days.map(function(d){return dn[d]}),opens:h.open,closes:h.close})});
    var ld={'@context':'https://schema.org','@type':'ChildCare',name:L.name,telephone:CONFIG.phoneIntl,
      address:{'@type':'PostalAddress',streetAddress:CONFIG.street,postalCode:CONFIG.postalCode,addressLocality:CONFIG.city,addressCountry:'BG'},
      openingHoursSpecification:spec,hasMap:CONFIG.mapsUrl,url:location.href.split('#')[0]};
    var sc=document.createElement('script');sc.type='application/ld+json';sc.textContent=JSON.stringify(ld);document.head.appendChild(sc);
  }catch(e){}

  /* --- снимки от CONFIG --- */
  if(CONFIG.photos&&CONFIG.photos.length&&$('#space-grid')){
    var grid=$('#space-grid'),figs=$$('figure',grid);
    CONFIG.photos.forEach(function(ph,i){
      var fig=figs[i];
      if(!fig){fig=document.createElement('figure');fig.innerHTML='<div class="tile"></div><figcaption></figcaption>';grid.appendChild(fig)}
      $('.tile',fig).innerHTML='<img loading="lazy" src="'+esc(BASE+ph.src)+'" alt="'+esc(ph.alt||'')+'">';
      $('figcaption',fig).textContent=ph.caption||'';
    });
    var lead=$('#space .lead');if(lead)lead.textContent=L.spaceLead;
  }

  /* --- плаващи точки --- */
  function dots(el,n,seed){
    if(!el)return;
    var s=seed;function r(){s=(s*1664525+1013904223)%4294967296;return s/4294967296}
    var cols=['--yellow','--red','--purple','--orange','--pink','--grey'];
    for(var i=0;i<n;i++){
      var d=Math.round(10+r()*r()*70),sp=document.createElement('span');
      sp.style.left=(r()*100)+'%';sp.style.top=(r()*100)+'%';
      sp.style.width=d+'px';sp.style.height=d+'px';
      sp.style.background='var('+cols[Math.floor(r()*cols.length)]+')';
      sp.style.setProperty('--t',(7+r()*7).toFixed(1)+'s');
      sp.style.setProperty('--dl','-'+(r()*8).toFixed(1)+'s');
      sp.style.setProperty('--dx',Math.round((r()-.5)*30)+'px');
      sp.style.setProperty('--dy',Math.round(-10-r()*22)+'px');
      el.appendChild(sp);
    }
  }
  dots($('#dots-hero'),26,7);dots($('#dots-book'),22,31);dots($('#dots-ph'),14,19);dots($('#dots-cta'),20,53);

  /* --- хедър със сянка --- */
  var tb=$('#topbar');
  function onScroll(){tb.classList.toggle('scrolled',window.scrollY>8)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* --- появяване при скрол (само движение, текстът е винаги видим) --- */
  if(motionOK&&'IntersectionObserver' in window){
    var groups=['.why-grid>*','.day>*','.steps>*','.space-grid>*','.gallery>*','.packs>*','.team>*','.rev>*','.contact-grid>*','.faq>*','.book-grid>*'];
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        var el=e.target;io.unobserve(el);el.classList.add('in');
        el.addEventListener('transitionend',function(ev){if(ev.target===el&&ev.propertyName==='transform')el.classList.remove('rv','in')});
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    groups.forEach(function(g){
      $$(g).forEach(function(el,i){el.style.setProperty('--i',Math.min(i,6));el.classList.add('rv');io.observe(el)});
    });
    $$('.rv').forEach(function(el){ /* ако е вече в екрана, не чакаме */ });
  }

  /* --- рейтинг: брояч и звезди --- */
  var score=$('#score');
  if(score&&motionOK&&'IntersectionObserver' in window&&score.animate){
    var so=new IntersectionObserver(function(es){
      if(!es[0].isIntersecting)return;so.disconnect();
      var num=$('#score-num'),t0=null;
      function step(t){
        if(!t0)t0=t;var p=Math.min((t-t0)/1200,1),v=5*(1-Math.pow(1-p,3));
        num.textContent=EN?v.toFixed(1):v.toFixed(1).replace('.',',');
        if(p<1)requestAnimationFrame(step);else num.textContent=EN?'5.0':'5,0';
      }
      requestAnimationFrame(step);
      $$('.stars span',score).forEach(function(s,i){
        s.animate([{transform:'scale(.3) rotate(-40deg)'},{transform:'scale(1.35) rotate(10deg)',offset:.6},{transform:'none'}],{duration:600,delay:i*120,easing:'ease-out',fill:'backwards'});
      });
    },{threshold:.5});
    so.observe(score);
  }

  /* --- карта при клик --- */
  var mapBtn=$('#map-load');
  if(mapBtn)mapBtn.addEventListener('click',function(){
    var box=$('#map'),f=document.createElement('iframe');
    f.title=L.mapTitle+L.name;f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';
    f.src='https://www.google.com/maps?q='+encodeURIComponent(CONFIG.street+', '+CONFIG.postalCode+' '+CONFIG.city)+'&hl=bg&z=16&output=embed';
    box.appendChild(f);box.classList.add('loaded');track('map_load');
  });

  /* --- политика за поверителност --- */
  $$('[data-open-privacy]').forEach(function(a){a.addEventListener('click',function(){var d=$('#privacy');if(d)d.open=true})});
  if(location.hash==='#privacy'){var pd=$('#privacy');if(pd)pd.open=true}

  /* --- форма --- */
  var form=$('#book-form'),st=$('#f-status'),btn=$('#f-btn');
  function formMsg(msg,bad){st.style.color=bad?'var(--red)':'var(--accent)';st.textContent=msg}
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=$('#f-name').value.trim(),phone=$('#f-phone').value.trim();
    if(!name||phone.replace(/\D/g,'').length<6){formMsg(L.fNeed,true);return}
    if(!$('#f-consent').checked){formMsg(L.fConsent,true);return}
    if($('#f-web').value){formMsg(L.fThanks,false);form.reset();return}
    var first=name.split(' ')[0];
    if(!CONFIG.formEndpoint){
      formMsg(L.fDemo(first),false);form.reset();return;
    }
    var body={name:name,phone:phone,age:$('#f-age').value,time:$('#f-time').value,subject:L.subject+CONFIG.name+(EN?' (EN)':'')};
    if(CONFIG.formAccessKey)body.access_key=CONFIG.formAccessKey;
    btn.disabled=true;formMsg(L.fSending,false);
    fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
      .then(function(r){if(!r.ok)throw new Error('bad');formMsg(L.fOk(first),false);form.reset();track('generate_lead')})
      .catch(function(){formMsg(L.fErr(CONFIG.phoneDisplay),true)})
      .then(function(){btn.disabled=false});
  });


  /* --- отзиви от CONFIG --- */
  (function(){
    var l=$('#rev-list');if(!l||!CONFIG.reviews||!CONFIG.reviews.length)return;
    l.innerHTML=CONFIG.reviews.map(function(r){
      var n=Math.max(1,Math.min(5,r.stars||5)),s='';for(var i=0;i<n;i++)s+='★';
      var txt=(EN&&r.text_en)?r.text_en:r.text,paras=String(txt).split(/\n+/).filter(Boolean),long=paras.length>2;
      var body=paras.map(function(p,i){return '<p'+(long&&i>1?' class="rmore" hidden':'')+'>'+esc(p)+'</p>'}).join('');
      var who=(EN&&r.name_en)?r.name_en:r.name;
      return '<article class="rcard"><div class="rstars" aria-label="'+n+L.stars+'">'+s+'</div><div class="rtext">'+body+'</div>'+
        (long?'<button class="rtoggle" type="button" aria-expanded="false">'+L.revMore+'</button>':'')+
        '<footer><b>'+esc(who)+'</b><span>Google'+(r.when?' · '+esc(r.when):'')+(EN&&r.text_en?' · '+L.revTranslated:'')+'</span></footer></article>';
    }).join('');
    l.addEventListener('click',function(e){var b=e.target.closest('.rtoggle');if(!b)return;
      var open=b.getAttribute('aria-expanded')!=='true';$$('.rmore',b.parentNode).forEach(function(p){p.hidden=!open});
      b.setAttribute('aria-expanded',open?'true':'false');b.textContent=open?L.revLess:L.revMore;});
  })();

  /* --- бисквитки и Google Analytics --- */
  var CK_KEY='aneto-consent',gaLoaded=false;
  function readConsent(){try{return JSON.parse(localStorage.getItem(CK_KEY))}catch(e){return null}}
  function writeConsent(v){try{localStorage.setItem(CK_KEY,JSON.stringify(v))}catch(e){}}
  function loadGA(){
    if(gaLoaded||!CONFIG.gaId||!/^G-[A-Z0-9]+$/i.test(CONFIG.gaId))return;
    gaLoaded=true;window['ga-disable-'+CONFIG.gaId]=false;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    gtag('config',CONFIG.gaId,{anonymize_ip:true,allow_google_signals:false});
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(CONFIG.gaId);
    document.head.appendChild(s);
  }
  function clearGA(){
    if(CONFIG.gaId)window['ga-disable-'+CONFIG.gaId]=true;
    gaLoaded=false;
    var parts=location.hostname.split('.');
    document.cookie.split(';').forEach(function(c){
      var n=c.split('=')[0].trim();
      if(!/^_ga/.test(n))return;
      ['',location.hostname,'.'+location.hostname,parts.length>1?'.'+parts.slice(-2).join('.'):''].forEach(function(dm){
        document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'+(dm?';domain='+dm:'');
      });
    });
  }
  function applyConsent(on){if(on)loadGA();else clearGA()}
  function track(name,params){if(gaLoaded&&window.gtag)window.gtag('event',name,params||{})}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-href]');if(!a)return;
    var t=a.getAttribute('data-href');
    var ev={tel:'click_to_call',viber:'click_viber',wa:'click_whatsapp',dir:'click_directions',maps:'click_google_maps'}[t];
    if(ev)track(ev);
  });
  (function(){
    var ck=$('#cookie');if(!ck)return;
    var an=$('#ck-an'),opts=$('#cookie-opts'),set=$('#ck-set');
    function showCk(withOpts){
      var c=readConsent();an.checked=!!(c&&c.analytics);
      opts.hidden=!withOpts;set.textContent=withOpts?L.save:L.settings;ck.hidden=false;
    }
    function save(on){writeConsent({analytics:on,ts:Date.now()});applyConsent(on);ck.hidden=true}
    $('#ck-yes').addEventListener('click',function(){save(true)});
    $('#ck-no').addEventListener('click',function(){save(false)});
    set.addEventListener('click',function(){
      if(opts.hidden){opts.hidden=false;set.textContent=L.save;an.focus()}else save(an.checked);
    });
    $$('[data-cookie-settings]').forEach(function(b){b.addEventListener('click',function(){showCk(true)})});
    $$('[data-open-privacy]').forEach(function(a){a.addEventListener('click',function(){var d=$('#privacy');if(d)d.open=true})});
    var c0=readConsent();
    if(c0)applyConsent(!!c0.analytics);else setTimeout(function(){showCk(false)},700);
  })();

  /* --- галерия: снимките се отварят в голям размер --- */
  (function(){
    var lb=$('#lb'),items=$$('[data-gallery]');if(!lb||!items.length||!lb.showModal)return;
    var img=$('#lb-img'),cap=$('#lb-cap'),cur=0;
    function show(i){cur=(i+items.length)%items.length;var a=items[cur],t=$('img',a);img.src=a.getAttribute('href');img.alt=t.alt;cap.textContent=t.alt}
    items.forEach(function(a,i){a.addEventListener('click',function(e){if(e.metaKey||e.ctrlKey)return;e.preventDefault();show(i);lb.showModal()})});
    lb.addEventListener('click',function(e){var b=e.target.closest('[data-lb]');
      if(b){var k=b.getAttribute('data-lb');if(k==='close')lb.close();else show(cur+(k==='next'?1:-1));return}
      if(e.target===lb||e.target.tagName==='FIGURE')lb.close()});
    lb.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(cur+1);else if(e.key==='ArrowLeft')show(cur-1)});
    var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));sx=null});
    lb.addEventListener('close',function(){img.removeAttribute('src')});
  })();

  /* --- простор: плъзгане и люлеене на снимките --- */
  (function(){
    var sc=$('.line-scroll');if(!sc)return;
    var items=$$('.ln-item',sc),last=sc.scrollLeft,stopT=null,raf=null;
    function swing(v){
      var d=Math.max(-9,Math.min(9,-v*.35));
      items.forEach(function(it,i){it.style.setProperty('--sw',(d*(.75+((i*37)%5)/10)).toFixed(2)+'deg')});
    }
    sc.addEventListener('scroll',function(){
      var v=sc.scrollLeft-last;last=sc.scrollLeft;
      if(motionOK){sc.classList.add('moving');if(!raf)raf=requestAnimationFrame(function(){raf=null;swing(v)})}
      clearTimeout(stopT);stopT=setTimeout(function(){swing(0);sc.classList.remove('moving')},90);
    },{passive:true});
    function step(dir){
      var w=items[0].getBoundingClientRect().width+parseFloat(getComputedStyle($('.ln-track',sc)).columnGap||getComputedStyle($('.ln-track',sc)).gap||0);
      sc.scrollBy({left:dir*w,behavior:motionOK?'smooth':'auto'});
    }
    $$('[data-ln]').forEach(function(b){b.addEventListener('click',function(){step(+b.getAttribute('data-ln'))})});
    sc.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();step(1)}else if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
    /* влачене с мишката на компютър */
    var down=false,sx=0,sl=0,moved=false;
    sc.addEventListener('pointerdown',function(e){moved=false;if(e.pointerType!=='mouse'||e.button!==0)return;down=true;sx=e.clientX;sl=sc.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(!moved&&Math.abs(dx)>5){moved=true;sc.classList.add('drag')}if(moved){sc.scrollLeft=sl-dx}});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){sc.classList.remove('drag');
      var r=sc.getBoundingClientRect(),c=r.left+r.width/2,best=null,bd=1e9;
      items.forEach(function(it){var b=it.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-c);if(d<bd){bd=d;best=b}});
      if(best)sc.scrollBy({left:best.left+best.width/2-c,behavior:motionOK?'smooth':'auto'});
    }});
    sc.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  })();

  /* --- талисман Точко --- */
  var mascots=$$('.mascot-wrap');
  function say(w,text,ms,link){
    var b=$('.bubble',w);if(!b)return;
    b.textContent=text;
    if(link){b.appendChild(document.createElement('br'));var a=document.createElement('a');a.href=link.href;a.textContent=link.text;b.appendChild(a)}
    b.hidden=false;clearTimeout(w._bt);w._bt=setTimeout(function(){b.hidden=true},ms||3600);
  }
  function mood(w,m,ms){
    w.classList.remove('cheer','oops');void w.offsetWidth;w.classList.add(m);
    clearTimeout(w._mt);w._mt=setTimeout(function(){w.classList.remove(m)},ms||1300);
  }
  var LINES=L.lines;
  mascots.forEach(function(w){
    var n=0;
    $('.mascot',w).addEventListener('click',function(){
      var line=LINES[n++%LINES.length];
      mood(w,'cheer',1100);
      if(line.indexOf(L.playWord)>-1&&!$('#game'))say(w,line,4200,{href:L.gameUrl,text:L.toGame});
      else say(w,line,3200);
    });
  });
  if(mascots.length&&motionOK&&window.matchMedia&&matchMedia('(pointer:fine)').matches){
    var tick=false,lx=0,ly=0;
    document.addEventListener('pointermove',function(e){
      lx=e.clientX;ly=e.clientY;if(tick)return;tick=true;
      requestAnimationFrame(function(){
        tick=false;
        mascots.forEach(function(w){
          var r=w.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight)return;
          var dx=lx-(r.left+r.width/2),dy=ly-(r.top+r.height*.5),d=Math.hypot(dx,dy)||1,k=Math.min(d/160,1)*4;
          $$('.pupil',w).forEach(function(p){p.style.transform='translate('+(dx/d*k).toFixed(2)+'px,'+(dy/d*k).toFixed(2)+'px)'});
        });
      });
    },{passive:true});
  }
  var heroM=$('#hero-mascot');
  if(heroM){
    var seen=false;try{seen=sessionStorage.getItem('aneto-hello')}catch(e){}
    if(!seen){
      setTimeout(function(){say(heroM,L.hello,4500,{href:L.gameUrl,text:L.toGame});mood(heroM,'cheer',1100)},1800);
      try{sessionStorage.setItem('aneto-hello','1')}catch(e){}
    }
  }

  /* --- игра: цветна памет --- */
  (function(){
    var board=$('#g-board');if(!board)return;
    var ICONS={
      globe:[L.icons.globe,'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="28" r="20" fill="var(--globe)"/><path d="M18 24c6-6 12-4 15 1s-3 9-8 8-9 2-7-9zM38 36c5-2 9 2 8 7s-7 5-9 1-1-6 1-8z" fill="var(--land)"/><rect x="30" y="47" width="4" height="8" fill="#222"/><rect x="21" y="54" width="22" height="4" rx="2" fill="#222"/></svg>'],
      book:[L.icons.book,'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="8" width="40" height="48" rx="5" fill="var(--red)"/><rect x="16" y="8" width="3" height="48" fill="#000" opacity=".2"/><rect x="25" y="18" width="19" height="4" rx="2" fill="#fff"/><rect x="25" y="26" width="14" height="4" rx="2" fill="#fff" opacity=".8"/><rect x="50" y="12" width="6" height="40" rx="2" fill="var(--yellow)"/></svg>'],
      pencil:[L.icons.pencil,'<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-40 32 32)"><rect x="26" y="4" width="12" height="10" rx="3" fill="var(--pink)"/><rect x="26" y="14" width="12" height="30" fill="var(--yellow)"/><rect x="26" y="12" width="12" height="4" fill="#bbb"/><path d="M26 44h12l-6 14z" fill="#F3EBD2"/><path d="M29.5 52h5l-2.5 6z" fill="#222"/></g></svg>'],
      tent:[L.icons.tent,'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8L58 54H6z" fill="#7DBB6A"/><path d="M32 8L44 54H20z" fill="#5FA14F"/><path d="M32 30c-6 0-9 5-9 11v13h18V41c0-6-3-11-9-11z" fill="#F3EBD2"/><circle cx="32" cy="7" r="3.5" fill="var(--red)"/></svg>'],
      ball:[L.icons.ball,'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="24" fill="var(--orange)"/><path d="M8 32h48M32 8c-10 10-10 38 0 48M32 8c10 10 10 38 0 48" stroke="#2A1604" stroke-width="3" fill="none" opacity=".75"/></svg>'],
      lion:[L.icons.lion,'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="var(--orange)"/><circle cx="32" cy="34" r="17" fill="#F6C98B"/><circle cx="26" cy="31" r="2.5" fill="#222"/><circle cx="38" cy="31" r="2.5" fill="#222"/><ellipse cx="32" cy="36" rx="3" ry="2" fill="#222"/><path d="M28 40q4 4 8 0" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>']
    };
    var keys=Object.keys(ICONS),movesEl=$('#g-moves'),bestEl=$('#g-best'),msg=$('#g-msg'),mw=$('#game-mascot');
    var first=null,lock=false,moves=0,found=0;
    var BK='aneto-memory-best',best=null;
    try{best=parseInt(localStorage.getItem(BK),10)||null}catch(e){}
    function showBest(){bestEl.textContent=best?best:'–'}
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
    function label(c,open){return open?L.card+ICONS[c.getAttribute('data-k')][0]:L.hidden+c.getAttribute('data-n')}
    function build(){
      board.innerHTML='';first=null;lock=false;moves=0;found=0;movesEl.textContent='0';msg.textContent='';showBest();
      shuffle(keys.concat(keys)).forEach(function(k,i){
        var b=document.createElement('button');b.type='button';b.className='gcard';b.setAttribute('data-k',k);b.setAttribute('data-n',i+1);
        b.innerHTML='<span class="gin"><span class="gface gback"></span><span class="gface gfront">'+ICONS[k][1]+'</span></span>';
        b.setAttribute('aria-label',label(b,false));
        board.appendChild(b);
      });
    }
    function confetti(){
      if(!motionOK||!board.animate)return;
      var cols=['--yellow','--red','--purple','--orange','--pink','--teal'];
      for(var i=0;i<26;i++)(function(){
        var s=document.createElement('span'),sz=8+Math.random()*9,a=Math.random()*Math.PI*2,d=80+Math.random()*150;
        s.className='conf';s.style.width=s.style.height=sz+'px';s.style.background='var('+cols[Math.floor(Math.random()*cols.length)]+')';
        board.appendChild(s);
        var an=s.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:'translate(calc(-50% + '+(Math.cos(a)*d)+'px),calc(-50% + '+(Math.sin(a)*d)+'px)) scale(1)',opacity:0}],{duration:1000+Math.random()*600,easing:'cubic-bezier(.2,.7,.2,1)'});
        an.onfinish=function(){s.remove()};
      })();
    }
    board.addEventListener('click',function(e){
      var c=e.target.closest('.gcard');
      if(!c||lock||c===first||c.classList.contains('done'))return;
      c.classList.add('flip');c.setAttribute('aria-label',label(c,true));
      if(!first){first=c;return}
      moves++;movesEl.textContent=moves;
      if(first.getAttribute('data-k')===c.getAttribute('data-k')){
        first.classList.add('done');c.classList.add('done');first=null;found++;
        if(found===keys.length){
          msg.textContent=L.win(moves);
          if(!best||moves<best){best=moves;try{localStorage.setItem(BK,String(moves))}catch(e){}showBest()}
          if(mw){mood(mw,'cheer',2200);say(mw,L.champ,4000)}
          confetti();track('game_win',{moves:moves});
        }else if(mw){mood(mw,'cheer',900);say(mw,L.cheers[found%3],1600)}
      }else{
        lock=true;var a=first;first=null;
        if(mw)mood(mw,'oops',700);
        setTimeout(function(){
          a.classList.remove('flip');c.classList.remove('flip');
          a.setAttribute('aria-label',label(a,false));c.setAttribute('aria-label',label(c,false));lock=false;
        },motionOK?850:1100);
      }
    });
    $('#g-reset').addEventListener('click',build);
    build();
  })();

})();
