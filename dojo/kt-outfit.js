/* KTキャラクター:曜日ごとに服装が変わる。
   OUTFIT_BY_DAY: 日,月,火,水,木,金,土 の順。
   READY    : 本番で使う服装(表情6種がそろったもの)。月=casualblack・火=grayhoodie・その他=stylish。
              月・火も準備はできているので、READY に 'casualblack','grayhoodie' を足せば曜日で切り替わる。
   HAVE     : 画像が入っている服装。プレビュー用(?outfit=casualblack)。
   READY にない曜日は DEFAULT(stylish)になる。 */
var KT=(function(){
 var OUTFIT_BY_DAY=['stylish','casualblack','grayhoodie','stylish','whitewhite','yellowwhite','denim'];
 var READY=['stylish','casualblack','grayhoodie'],HAVE=['stylish','casualblack','grayhoodie'],DEFAULT='stylish';
 var pick=null;
 try{var q=new URLSearchParams(location.search).get('outfit');if(q)sessionStorage.setItem('kt-outfit',q);pick=sessionStorage.getItem('kt-outfit')}catch(e){}
 var o;
 if(pick&&HAVE.indexOf(pick)>=0)o=pick;
 else{o=OUTFIT_BY_DAY[new Date().getDay()];if(READY.indexOf(o)<0)o=DEFAULT}
 var base=document.currentScript.src.replace(/kt-outfit\.js.*$/,'');
 function img(expr){return base+'img/kt/'+o+'/'+expr+'.webp'}
 var s=document.documentElement.style;
 s.setProperty('--kt-ok','url("'+img('smile')+'")');
 s.setProperty('--kt-ng','url("'+img('cheering')+'")');
 s.setProperty('--kt-tip','url("'+img('serious')+'")');
 return{outfit:o,img:img};
})();
