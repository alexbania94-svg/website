/* Ευκολίες μετακίνησης: επιστροφή στα άρθρα */
(function(){
  /* Αν ήρθατε από τη σελίδα Άρθρα, το «Όλα τα άρθρα» σας γυρίζει εκεί που ήσασταν (με την αναζήτηση/φίλτρο) */
  try{
    var r=document.referrer;
    if(r&&new URL(r).origin===location.origin&&/\/arthra\.html/.test(new URL(r).pathname)&&history.length>1){
      document.querySelectorAll('a.back-link').forEach(function(a){
        a.addEventListener('click',function(e){e.preventDefault();history.back();});
      });
    }
  }catch(err){}
})();
/* ---- v29: κοινοποίηση (πάνω και στο τέλος του άρθρου) ---- */
(function(){
  var btns=document.querySelectorAll('[data-share]'); if(!btns.length)return;
  var url=location.href.split('#')[0], title=document.querySelector('h1')?document.querySelector('h1').textContent:document.title;
  var t=encodeURIComponent(title+' '+url);
  Array.prototype.forEach.call(btns,function(sh){
    var menu=sh.parentElement.querySelector('.share-menu');
    if(menu){
      menu.querySelector('.sm-viber').href='viber://forward?text='+t;
      menu.querySelector('.sm-wa').href='https://wa.me/?text='+t;
      menu.querySelector('.sm-mail').href='mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(url);
      menu.querySelector('.sm-copy').addEventListener('click',function(){
        var b=this;function ok(){b.textContent='Ο σύνδεσμος αντιγράφηκε';setTimeout(function(){b.textContent='Αντιγραφή συνδέσμου'},2000)}
        if(navigator.clipboard)navigator.clipboard.writeText(url).then(ok);else{prompt('Αντιγράψτε τον σύνδεσμο:',url)}
      });
    }
    sh.addEventListener('click',function(){
      if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share({title:title,url:url}).catch(function(){});return;}
      if(menu){var h=menu.hasAttribute('hidden');menu.toggleAttribute('hidden',!h);sh.setAttribute('aria-expanded',h);}
    });
    document.addEventListener('click',function(e){if(menu&&!menu.hasAttribute('hidden')&&!menu.contains(e.target)&&e.target!==sh&&!sh.contains(e.target)){menu.setAttribute('hidden','');sh.setAttribute('aria-expanded','false');}});
  });
})();

/* ---- v30: αναζήτηση σε όλο το site (ερωτήσεις ή λέξεις) ---- */
(function(){
  var btn=document.querySelector('.head-search'); if(!btn)return;
  var EX=['Μπορώ να τρώω ψωμί αν έχω ινσουλινοαντίσταση;','Τι τρώω στη νηστεία για πρωτεΐνη;','Πώς παίρνω κιλά όταν δεν έχω όρεξη;','Πόσο κρατάει το πρώτο ραντεβού;','Γίνονται ραντεβού online;'];
  var STOP=('και να το τα τη την της του των τον τους ο η οι ενα ενας μια μιας με σε στο στη στην στα στον στις στους για απο αν η θα δεν μη μην μου σου μας σας τι πως ποιο ποια ποιος ποιες ποιοι ποσο ποση ποσα ποτε γιατι που ειναι ειμαι εισαι εχω εχει εχετε εχουμε μπορω μπορει μπορουμε πρεπει πολυ λιγο οτι αυτο αυτα αυτη ολα ολο κατι κανω κανει κανετε θελω θελει ρε ενω ή αλλα ομως οταν οσο μετα πριν πιο δηλαδη').split(' ');
  var SYN={'ζαχαρ':'σακχαρ','σακχαρ':'σακχαρ γλυκοζ','pcos':'πολυκυστικ pcos','pmos':'πολυκυστικ','πολυκυστ':'πολυκυστικ pcos','θυροειδ':'θυρεοειδ','κιλα':'βαρ κιλ','κιλο':'βαρ κιλ','παχαιν':'βαρ κιλ','αδυνατ':'απωλει βαρ','χασω':'απωλει','παρω':'αυξησ','διαιτ':'διατροφ διαιτολογ','χοληστερ':'χοληστερ λιπαρ','glp':'glp','ozempic':'glp','οζεμπ':'glp','mounjaro':'glp','wegovy':'glp','φουσκ':'φουσκ εντερ','εντερ':'εντερ','γλυκα':'γλυκ','γλυκο':'γλυκ','τιμη':'κοστιζ','κοστ':'κοστιζ','λεφτα':'κοστιζ','κοστιζ':'κοστιζ','ραντεβ':'ραντεβ συνεδρ','βιντεο':'online','skype':'online','zoom':'online','online':'online','διευθυνσ':'ιατρει σητει','ψωμ':'ψωμ','τρωω':'τρω φαγητ','φαω':'τρω φαγητ','φαγητ':'φαγητ','εμμηνοπ':'εμμηνοπαυσ','οστ':'οστ οστεοπορ','νηστ':'νηστει','γιορτ':'γιορτ','αλκοολ':'αλκοολ','ποτ':'αλκοολ','ζυγαρι':'ζυγαρι συστασ','λιπομετρ':'συστασ σωματ','ευερεθ':'ευερεθιστ','fodmap':'fodmap','γλουτεν':'γλουτεν','σοι':'σογια','συμπληρωμ':'συμπληρωμ','βιταμ':'βιταμιν','νεφρ':'νεφρ','εξετασ':'εξετασ','μυς':'μυ μυικ','μυες':'μυ μυικ','πρωτεϊν':'πρωτειν','πρωτειν':'πρωτειν','κετο':'κετογον','ιατρει':'ιατρει σητει','σητει':'σητει ιατρει','πολυκυστ':'πολυκυστικ pcos'};
  function N(s){return(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ς/g,'σ')}
  /* «σκελετός» λέξης: ίδιος για ελληνικά και greeklish, και αγνοεί τα συχνά ορθογραφικά (ι/η/υ/ει/οι, ο/ω, διπλά σύμφωνα) */
  var GR={'α':'a','β':'v','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'8','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'ks','ο':'o','π':'p','ρ':'r','σ':'s','τ':'t','υ':'i','φ':'f','χ':'q','ψ':'ps','ω':'o'};
  function SK(s){s=N(s);
    s=s.replace(/ου/g,'U').replace(/ει|οι|υι/g,'ι').replace(/αι/g,'ε').replace(/μπ/g,'B').replace(/ντ/g,'D').replace(/γκ|γγ/g,'G').replace(/αυ/g,'av').replace(/ευ/g,'ev');
    s=s.replace(/[α-ω]/g,function(c){return GR[c]||c});
    /* greeklish */
    s=s.replace(/ou/g,'U').replace(/th/g,'8').replace(/ch|kh|x/g,'q').replace(/ps/g,'ps').replace(/ph/g,'f').replace(/mp/g,'B').replace(/nt/g,'D').replace(/gk|gg/g,'G').replace(/ei|oi|yi/g,'i').replace(/ai/g,'e').replace(/w/g,'o').replace(/[yhu]/g,'i').replace(/b/g,'v').replace(/c/g,'k');
    s=s.replace(/U/g,'u').replace(/B/g,'b').replace(/D/g,'d').replace(/G/g,'g').replace(/([a-z8q])\1+/g,'$1');
    return s}
  function stem(w){var s=w.replace(/(ou|on|os|es|is|as|us|ei|i|a|o|e|u)$/,'');if(s.length<4)s=w.length>4?w.slice(0,4):w;return s.length>9?s.slice(0,s.length-1):s}
  var STOP={};('και να το τα τη την της του των τον τους ο η οι ενα ενας μια μιας με σε στο στη στην στα στον στις στους για απο αν ή θα δεν μη μην μου σου μας σας τι πως ποιο ποια ποιος ποιες ποιοι ποσο ποση ποσα ποτε γιατι που ειναι ειμαι εισαι εχω εχει εχετε εχουμε μπορω μπορει μπορουμε πρεπει πολυ λιγο οτι αυτο αυτα αυτη ολα ολο κατι κανω κανει κανετε θελω θελει ενω αλλα ομως οταν οσο μετα πριν πιο δηλαδη ενα ειμαστε στ σ μ θ προστατευω προστατευσω βοηθαει βοηθαω βοηθησει γινεται γινονται χρειαζομαι χρειαζεται ξερω λενε λεει ειπαν ειπε καλο καλα σωστα σωστο').split(' ').forEach(function(w){STOP[SK(w)]=1});
  function toks(q){return N(q).replace(/[^a-z0-9α-ω\- ]+/g,' ').split(/[\s\-]+/).map(SK).filter(function(w){return w.length>1&&!STOP[w]})}
  var SYN0={'ζαχαρο':'σακχαρ διαβητ','ζαχαρη':'ζαχαρ σακχαρ γλυκ','σακχαρ':'σακχαρ','διαβητικ':'διαβητ','pcos':'πολυκυστικ','pmos':'πολυκυστικ','πολυκυστ':'πολυκυστικ','κιλα':'βαρ κιλ','κιλο':'βαρ κιλ','παχαιν':'βαρ κιλ','αδυνατ':'απωλει βαρ','χασω':'απωλει χαν','χανω':'χαν απωλει ζυγαρι','παρω':'αυξησ','διαιτ':'διατροφ διαιτολογ','χοληστερ':'χοληστερ λιπαρ','glp':'glp','ozempic':'glp','οζεμπ':'glp','mounjaro':'glp','μουντζαρ':'glp','wegovy':'glp','saxenda':'glp','σαξεντ':'glp','σεμαγλουτιδ':'glp','φουσκ':'φουσκ εντερ','γλυκα':'γλυκ','γλυκο':'γλυκ','τιμη':'κοστιζ','τιμεσ':'εξετασ κοστιζ','κοστ':'κοστιζ','λεφτα':'κοστιζ','ευρω':'κοστιζ','ραντεβ':'ραντεβ συνεδρ','βιντεο':'online','skype':'online','zoom':'online','διευθυνσ':'ιατρει σητει','τρωω':'τρω φαγητ','φαω':'τρω φαγητ','εμμηνοπ':'εμμηνοπαυσ','οστα':'οστ οστεοπορ','οστο':'οστ οστεοπορ','νηστ':'νηστει','λιπομετρ':'συστασ σωματ μετρησ','λιπος':'λιπ','αλκοολ':'αλκοολ','κρασ':'αλκοολ','μπυρ':'αλκοολ','ζυγαρι':'ζυγαρι συστασ','ευερεθ':'ευερεθιστ','ibs':'ευερεθιστ fodmap','γλουτεν':'γλουτεν','συμπληρωμ':'συμπληρωμ','βιταμ':'βιταμιν','νεφρ':'νεφρ','κετο':'κετογον','keto':'κετογον','ιατρει':'ιατρει σητει','σητει':'σητει ιατρει','γιατρ':'ιατρ','μυεσ':'μυ μυικ','πρωτειν':'πρωτειν','κοιλια':'κοιλια περιμετρ','μεση':'μεσ περιμετρ','hba1c':'hba1c γλυκοζυλιωμ','ldl':'ldl χοληστερ','hdl':'χοληστερ','πιεσ':'πιεσ αλατ','μεσογειακ':'μεσογειακ ελαιολαδ','λιγουρ':'λιγουρ γλυκ'};
  var SYN={};for(var k in SYN0)SYN[SK(k)]=SYN0[k].split(' ').map(SK);
  var VOC=null;
  function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;var p=[],i,j;for(j=0;j<=b.length;j++)p[j]=j;for(i=1;i<=a.length;i++){var c=[i],m=i;for(j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));if(c[j]<m)m=c[j]}if(m>max)return max+1;p=c}return p[b.length]}
  function alts(w){var a=[stem(w)];for(var k in SYN){if(w.indexOf(k)===0||(k.indexOf(w)===0&&w.length>3))a=a.concat(SYN[k])}
    if(VOC&&w.length>=5&&!VOC.some(function(v){return v.indexOf(stem(w))===0})){var max=w.length>=8?2:1,best=[];VOC.forEach(function(v){var d=lev(w,v.slice(0,w.length+1),max);var d2=lev(w,v,max);d=Math.min(d,d2);if(d<=max)best.push(stem(v))});a=a.concat(best.slice(0,4))}
    return a.filter(function(x,i,s){return x&&x.length>1&&s.indexOf(x)===i})}
  function cnt(s,w){var n=0,i=0;while((i=s.indexOf(w,i))>-1&&n<12){n++;i+=w.length}return n}
  var IDX=null,loading=false,ov,inp,res,lastQ='';var BASE=((document.querySelector('script[src$="site.js"]')||{}).src||'site.js').replace(/site\.js$/,'');
  function load(cb){if(IDX)return cb();if(window.SITE_IDX){prep();return cb()}if(loading)return;loading=true;var s=document.createElement('script');s.src=BASE+'site-index.js?v=20261120b';s.onload=function(){prep();cb()};document.head.appendChild(s)}
  function prep(){var V={};IDX=window.SITE_IDX.map(function(e){var x=SK(e.x);(SK(e.h)+' '+x).split(/[^a-z0-9]+/).forEach(function(w){if(w.length>=5)V[w]=1});return {e:e,h:' '+SK(e.h).replace(/[^a-z0-9]+/g,' '),p:' '+SK(e.p+' '+e.t).replace(/[^a-z0-9]+/g,' '),x:' '+x.replace(/[^a-z0-9]+/g,' ')}});VOC=Object.keys(V)}
  function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function snip(x,A){var ss=x.split(/(?<=[.;!;·])\s+/),best='',bs=-1;ss.forEach(function(s){var n=' '+SK(s).replace(/[^a-z0-9]+/g,' '),sc=0;A.forEach(function(a){if(n.indexOf(' '+a)>-1)sc++});if(sc>bs){bs=sc;best=s}});if(best.length>190)best=best.slice(0,187).replace(/\s\S*$/,'')+'…';
    return best.split(/(\s+)/).map(function(w){var n=SK(w);return A.some(function(a){return a.length>2&&n.replace(/[^a-z0-9]/g,'').indexOf(a)===0})?'<mark>'+esc(w)+'</mark>':esc(w)}).join('')}
  function search(q,lax){var T=toks(q);if(!T.length)return [];var AL=T.map(alts),out=[];
    IDX.forEach(function(r){var sc=0,hit=0;AL.forEach(function(A){var s=0;A.forEach(function(a){var b=' '+a;s+=cnt(r.h,b)*6+cnt(r.p,b)*2+Math.min(cnt(r.x,b),6)});if(s){hit++;sc+=s}});
      var cov=hit/T.length,need=(T.length<=2&&!lax)?1:0.5;if(hit&&cov>=need)out.push({r:r,s:sc*(0.4+cov),A:[].concat.apply([],AL)})});
    out.sort(function(a,b){return b.s-a.s});var per={},fin=[];out.forEach(function(o){var pg=o.r.e.u.split('#')[0];per[pg]=(per[pg]||0)+1;if(per[pg]<=2&&fin.length<8)fin.push(o)});return fin}
  function render(){var q=inp.value.trim();if(q===lastQ)return;lastQ=q;
    if(!q){res.innerHTML='<p class="ss-label">Μπορείτε να γράψετε μια λέξη ή μια ολόκληρη ερώτηση. Για παράδειγμα:</p><ul class="ss-ex">'+EX.map(function(e){return '<li><button type="button">'+esc(e)+'</button></li>'}).join('')+'</ul>';
      [].forEach.call(res.querySelectorAll('.ss-ex button'),function(b){b.onclick=function(){inp.value=b.textContent;go()}});return}
    if(!IDX){res.innerHTML='<p class="ss-label">Αναζήτηση…</p>';return}
    var R=search(q);
    if(!R.length){var TOP=['Ινσουλινοαντίσταση','Διαβήτης','Απώλεια βάρους','Χοληστερίνη','Θυρεοειδής','Εμμηνόπαυση'];
      res.innerHTML='<div class="ss-none"><p class="ss-none-t">Δεν υπάρχει ακόμα σελίδα για «'+esc(q)+'».</p>'
       +'<p class="ss-label">Δοκιμάστε ένα από τα θέματα:</p><div class="ss-chips">'+TOP.map(function(t){return '<button type="button">'+t+'</button>'}).join('')+'</div>'
       +'<div class="ss-go"><a href="'+BASE+'pathiseis.html"><span>Όλα τα θέματα υγείας</span><span aria-hidden="true">→</span></a><a href="'+BASE+'arthra.html"><span>Όλα τα άρθρα</span><span aria-hidden="true">→</span></a></div>'
       +'<p class="ss-ask">Έχετε ερώτηση για τη δική σας περίπτωση; <a href="'+BASE+'epikoinonia.html">Γράψτε μου</a></p></div>';
      [].forEach.call(res.querySelectorAll('.ss-chips button'),function(b){b.onclick=function(){inp.value=b.textContent;inp.focus();go()}});return}
    res.innerHTML='<p class="ss-label">'+(R.length===1?'1 αποτέλεσμα':R.length+' αποτελέσματα')+'</p><ol class="ss-list">'+R.map(function(o){var e=o.r.e;return '<li><a href="'+esc(BASE+e.u)+'"><span class="ss-page">'+esc(e.p)+'</span><span class="ss-h">'+esc(e.h)+'</span><span class="ss-x">'+snip(e.x,o.A)+'</span></a></li>'}).join('')+'</ol>'}
  var tm;function go(){clearTimeout(tm);tm=setTimeout(function(){if(inp.value.trim()&&!IDX){load(function(){lastQ=null;render()})}render()},120)}
  function build(){ov=document.createElement('div');ov.className='ss';ov.id='siteSearch';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Αναζήτηση στο site');ov.hidden=true;
    ov.innerHTML='<div class="ss-box"><form class="ss-form" role="search"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><label class="sr-only" for="ssq">Τι ψάχνετε;</label><input id="ssq" type="search" placeholder="Τι ψάχνετε;" autocomplete="off" enterkeyhint="search"><button type="button" class="ss-close" aria-label="Κλείσιμο αναζήτησης">✕</button></form><div class="ss-res" aria-live="polite"></div></div>';
    document.body.appendChild(ov);inp=ov.querySelector('input');res=ov.querySelector('.ss-res');
    inp.addEventListener('input',go);
    ov.querySelector('form').addEventListener('submit',function(e){e.preventDefault();var a=res.querySelector('.ss-list a');if(a)a.click()});
    ov.querySelector('.ss-close').onclick=close;
    ov.addEventListener('click',function(e){if(e.target===ov)close();var a=e.target.closest('a');if(a&&a.hash&&a.pathname===location.pathname){close();setTimeout(function(){openTarget(a.hash)},30)}else if(a)close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)close()})}
  function open(){if(!ov)build();ov.hidden=false;document.body.classList.add('ss-open');btn.setAttribute('aria-expanded','true');lastQ=null;render();setTimeout(function(){inp.focus()},30);load(function(){if(inp.value.trim()){lastQ=null;render()}})}
  function close(){ov.hidden=true;document.body.classList.remove('ss-open');btn.setAttribute('aria-expanded','false');btn.focus({preventScroll:true})}
  btn.addEventListener('click',function(){ov&&!ov.hidden?close():open()});
  /* όταν ένα αποτέλεσμα δείχνει ερώτηση που ανοίγει (details), την ανοίγουμε */
  function openTarget(h){if(!h)return;var t;try{t=document.querySelector(decodeURIComponent(h))}catch(e){return}if(!t)return;var d=t.tagName==='DETAILS'?t:t.closest('details');if(d)d.open=true;var y=t.getBoundingClientRect().top+scrollY-((document.querySelector('header.site')||{}).offsetHeight||0)-14;scrollTo({top:y,behavior:'smooth'})}
  if(location.hash)window.addEventListener('load',function(){var t;try{t=document.querySelector(decodeURIComponent(location.hash))}catch(e){}if(t&&(t.tagName==='DETAILS'||t.closest('details')))openTarget(location.hash)});
})();

/* Ένα «Κλείστε ραντεβού» τη φορά: το κουμπί της κεφαλίδας κρύβεται όσο φαίνεται άλλο κουμπί ραντεβού στην οθόνη (Νοέ 2026) */
(function(){
  if(!('IntersectionObserver' in window)){document.documentElement.classList.remove('cta-on');return}
  var els=document.querySelectorAll('main a.btn[href*="epikoinonia"], main a.btn[href^="mailto:"], main a.btn[href^="tel:"], main .contact-cards');
  if(!els.length){document.documentElement.classList.remove('cta-on');return}
  var seen=new Set(),b=document.documentElement;
  b.classList.add('cta-on');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting)seen.add(e.target);else seen.delete(e.target)});
    b.classList.toggle('cta-on',seen.size>0);
  },{threshold:0});
  els.forEach(function(el){io.observe(el)});
  /* τα εφέ ενεργοποιούνται μόνο αφού οριστεί η αρχική κατάσταση, ώστε να μην «κλωτσάει» στο άνοιγμα της σελίδας */
  setTimeout(function(){requestAnimationFrame(function(){b.classList.add('cta-ready')})},400);
})();
/* ύψος κεφαλίδας για το μενού σε όλη την οθόνη (24/11/2026) */
(function(){var h=document.querySelector('header.site');if(!h)return;function s(){document.documentElement.style.setProperty('--hh',h.getBoundingClientRect().height+'px')}s();addEventListener('resize',s);addEventListener('scroll',s,{passive:true});var t=document.querySelector('.menu-toggle');if(t)t.addEventListener('click',s)})();
/* μενού: άνοιγμα λίστας θεμάτων στο κινητό (24/11/2026) */
(function(){document.querySelectorAll('.dd-tog').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();var p=b.parentNode,o=p.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'−':'+'})})})();
