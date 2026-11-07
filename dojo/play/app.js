(function(){
var AUDIO_BASE=document.currentScript.src.replace(/play\/app\.js.*$/,'audio/');
var app=document.getElementById('app');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function norm(s){return s.toLowerCase().replace(/[’‘]/g,"'").replace(/[.!?,]/g,' ').replace(/\s+/g,' ').trim()}
function expand(s){var re=/\(([^()|]+(?:\|[^()|]+)+)\)/;var m=re.exec(s);if(!m)return[s];var out=[];m[1].split('|').forEach(function(o){expand(s.replace(re,o)).forEach(function(x){out.push(x)})});return out}
function dat(n){return typeof window[n]!=='undefined'?window[n]:[]}
var cfg={form:{data:dat('FORM')},reorderja:{data:dat('REORDER_JA')},reorder:{data:dat('REORDER')},translate:{data:dat('TRANSLATE')},basic:{data:dat('BASIC')}}[MODE];
var N=cfg.data.length,course=0,order=[],idx=0,score=0,answered=0,wrong=[];
function startCourse(n){course=n;order=shuffle(cfg.data).slice(0,Math.min(n,N));idx=0;score=0;answered=0;wrong=[];render()}
function retryWrong(){order=shuffle(wrong);idx=0;score=0;answered=0;wrong=[];render()}
function mark(q,ok){answered++;if(ok)hit();else wrong.push(q)}
function qText(q){if(MODE==='form')return esc(q.s.replace('{}','( '+q.v+' )'));if(MODE==='reorder')return '語を並べかえ: '+esc(shuffle(q.w.split(' ')).join(' / '));if(MODE==='basic')return esc(q.q);return esc(q.j)}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
var curAudio=null;
function audioBtn(text){if(typeof KT_AUDIO==='undefined')return '';return '<button type="button" class="sound" data-t="'+esc(text)+'"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.7 5.8a9 9 0 0 1 0 12.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>音声を聞く</span></button>'}
function bindAudio(){Array.prototype.forEach.call(app.querySelectorAll('.sound'),function(b){b.onclick=function(){
 try{if(curAudio){curAudio.pause()}}catch(e){}
 var au=new Audio(AUDIO_BASE+slug(b.getAttribute('data-t'))+'.mp3?v=2');curAudio=au;
 b.classList.add('on');au.onended=function(){b.classList.remove('on')};
 au.onerror=function(){b.classList.remove('on');b.querySelector('span').textContent='音声がありません'};
 var pr=au.play();if(pr&&pr.catch)pr.catch(function(){b.classList.remove('on')})}})}

function hit(){score++}
function header(){return '<div class="meta"><span>'+(idx+1)+' / '+order.length+' もん目</span><span>正解 '+score+' / '+answered+'</span></div><div class="bar"><i style="width:'+Math.round(idx/order.length*100)+'%"></i></div>'}
var OKS=['正解!','ナイス!','その調子!','いいね!'];var NGS=['おしい!','目印を見直してみよう','次はできる!','ここで覚えよう'];
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function finish(){var r=score/order.length;
 var k=r>=0.9?['jumping','すばらしい!やりきったね!']:r>=0.7?['smile','よくできました!その調子!']:r>=0.5?['cheering','あと少し!もう一回やってみよう']:['tiring','ふぅ、おつかれさま!ここまでやりきったのがえらい。ここからが伸びるところ!'];
 if(!wrong.length)k=['jumping',MODE==='basic'?'基本コース クリア!全問正解!KTに自慢してね!':'全問正解!KTに自慢してね!'];
 var w='';
 if(wrong.length){w='<div class="wrongs"><b>まちがえた問題(' +wrong.length+'問)</b><ol>';wrong.forEach(function(q){w+='<li>'+qText(q)+'</li>'});w+='</ol><p>次の塾でKTに質問しよう!<br>一歩ずつ英語に寄り添っていこう!</p></div>'}
 app.innerHTML='<div class="slate finish"><div class="chalk s-small">RESULT</div><div class="chalk s-score"><b>'+score+'</b><span> / '+order.length+'</span></div><svg class="chalk s-line" viewBox="0 0 300 8" preserveAspectRatio="none"><path d="M2 5 C60 2,120 7,180 4 S270 3,298 5" stroke="#f0b765" stroke-width="3.2" fill="none" stroke-linecap="round"/></svg></div><div class="kt-say"><img src="'+KT.img(k[0])+'" alt="KT" width="110"><div class="bubble"><b>KTからひとこと</b>'+k[1]+'</div></div>'+w
  +(wrong.length?'<button class="acc" id="retry">まちがえた問題だけもう一度</button>':'')
  +'<button class="'+(wrong.length?'sub2':'acc')+'" id="again">もう一度'+(MODE==='basic'?'':'(同じコース)')+'</button>'+(MODE==='basic'?'':'<button class="sub2" id="pickc">コースをえらびなおす</button>');
 if(wrong.length)document.getElementById('retry').onclick=retryWrong;
 document.getElementById('again').onclick=function(){startCourse(course)};var pc=document.getElementById('pickc');if(pc)pc.onclick=chooser}
function nextBtn(){return '<button class="acc" id="next">'+(idx+1<order.length?'次の問題 →':'結果を見る')+'</button>'}
function bindNext(){document.getElementById('next').onclick=function(){idx++;render()}}
function render(){if(idx>=order.length)return finish();var q=order[idx];({form:rForm,reorderja:rReorder,reorder:rReorder,translate:rTrans,basic:rBasic})[MODE](q)}

function rForm(q){
 var parts=q.s.split('{}');
 app.innerHTML=header()+'<div class="card"><span class="qlabel">Q'+(idx+1)+'</span><p class="en">'+esc(parts[0])+(q.v?'( <b>'+esc(q.v)+'</b> )':'( ______ )')+esc(parts[1])+'</p><p class="hint">'+(q.hint?esc(q.hint):'( )の動詞を正しい形に。答えは1語とは限りません。目印の言葉を探そう!')+'</p></div>'
 +'<input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="答えを入力">'
 +'<button id="chk">答えあわせ</button><div id="res"></div>';
 var inp=document.getElementById('ans');inp.focus();
 function check(){
  var ok=q.a.some(function(x){return norm(x)===norm(inp.value)});
  var p0=esc(parts[0]);if(q.n)p0=p0.replace(esc(q.n),'<span class="ant">'+esc(q.n)+'</span>');var full=p0+'<b>'+esc(q.a[0])+'</b>'+esc(parts[1]);
  q.m.forEach(function(m){full=full.replace(esc(m),'<mark>'+esc(m)+'</mark>')});
  mark(q,ok);
  document.getElementById('res').innerHTML='<div class="res '+(ok?'ok':'ng')+'"><b class="big '+(ok?'ok':'ng')+'">'+(ok?pick(OKS):pick(NGS)+' 正解は「'+esc(q.a[0])+'」')+'</b><p class="en">'+full+'</p><p>目印: '+q.m.map(function(m){return '<mark>'+esc(m)+'</mark>'}).join(' ')+'<br>'+esc(q.e).replace('　★','<br>★')+'</p>'+audioBtn(q.s.replace('{}',q.a[0]))+'</div>'+nextBtn();bindAudio();
  document.getElementById('chk').disabled=true;inp.disabled=true;bindNext()}
 document.getElementById('chk').onclick=check;
 inp.onkeydown=function(e){if(e.key==='Enter'&&!inp.disabled)check()}
}

function rReorder(q){
 var words=shuffle(q.w.split(' ')),picked=[];
 app.innerHTML=header()+'<div class="card"><span class="qlabel">Q'+(idx+1)+'</span>'+(q.j?'<p class="ja">'+esc(q.j)+'</p>':'<p class="ja">語を並べかえて、意味の通る英文にしよう。</p>')+'</div>'
 +'<div class="line" id="line"></div><div class="chips" id="pool"></div>'
 +'<button id="chk" class="acc" disabled>答えあわせ</button><button id="clr" class="sub2">やり直す</button><div id="res"></div>';
 var line=document.getElementById('line'),pool=document.getElementById('pool'),chk=document.getElementById('chk');
 var done=false;
 function draw(){
  line.innerHTML='';picked.forEach(function(i,k){var b=document.createElement('button');b.className='chip';b.textContent=words[i];b.onclick=function(){if(done)return;picked.splice(k,1);draw()};line.appendChild(b)});
  pool.innerHTML='';words.forEach(function(w,i){var b=document.createElement('button');b.className='chip'+(picked.indexOf(i)>=0?' used':'');b.textContent=w;b.disabled=picked.indexOf(i)>=0;b.onclick=function(){if(done)return;picked.push(i);draw()};pool.appendChild(b)});
  chk.disabled=picked.length!==words.length||done}
 draw();
 document.getElementById('clr').onclick=function(){if(done)return;picked=[];draw()};
 chk.onclick=function(){
  done=true;var mine=picked.map(function(i){return words[i]}).join(' ');
  var ok=norm(mine)===norm(q.a);mark(q,ok);
  document.getElementById('res').innerHTML='<div class="res '+(ok?'ok':'ng')+'"><b class="big '+(ok?'ok':'ng')+'">'+(ok?pick(OKS):pick(NGS))+'</b><p class="en">'+esc(q.a)+'</p>'+(ok?'':'<p class="hint">あなたの答え: '+esc(mine)+'</p>')+'<p class="hint">プリントでは、文頭は大文字・最後はピリオドを忘れずに</p>'+audioBtn(q.a)+'</div>'+nextBtn();bindAudio();
  chk.disabled=true;draw();bindNext()}
}

function rTrans(q){
 app.innerHTML=header()+'<div class="card"><span class="qlabel">Q'+(idx+1)+'</span><p class="ja">'+esc(q.j)+'</p><p class="hint">ヒント: '+esc(q.h)+'</p></div>'
 +'<input type="text" id="ans" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="英文を入力">'
 +'<button id="chk">答えあわせ</button><div id="res"></div>';
 var inp=document.getElementById('ans');
 var accepted=expand(q.a).map(norm);
 var model=expand(q.a)[0];
 function check(){
  var ok=accepted.indexOf(norm(inp.value))>=0;
  document.getElementById('chk').disabled=true;inp.disabled=true;
  if(ok){mark(q,true);
   document.getElementById('res').innerHTML='<div class="res ok"><b class="big ok">'+pick(OKS)+'</b><p class="en">'+esc(model)+'</p><p>'+esc(q.m)+'</p>'+audioBtn(model)+'</div>'+nextBtn();bindAudio();bindNext()}
  else{
   document.getElementById('res').innerHTML='<div class="res ng"><b class="big ng">あれ?ちがうかも</b><p class="hint">あなたの答え: '+esc(inp.value||'(未入力)')+'</p><p class="en">模範解答: '+esc(model)+'</p><p>'+esc(q.m)+'</p>'+audioBtn(model)+'<p>言い方がちがうだけで、文法的に正しければ○にしてOK。自分で判定しよう。</p><button id="okb">自分の答えも正しかった</button><button id="ngb" class="sub2">まちがっていた</button></div>';
   function go(good){mark(q,good);document.getElementById('res').insertAdjacentHTML('beforeend',nextBtn());document.getElementById('okb').disabled=true;document.getElementById('ngb').disabled=true;bindNext()}
   bindAudio();document.getElementById('okb').onclick=function(){go(true)};document.getElementById('ngb').onclick=function(){go(false)}}}
 document.getElementById('chk').onclick=check;
 inp.onkeydown=function(e){if(e.key==='Enter'&&!inp.disabled)check()}
}

function rBasic(q){
 var cs=shuffle(q.c.map(function(t,i){return{t:t,ok:i===0}}));
 var h=header()+'<div class="card"><span class="qlabel">Q'+(idx+1)+'</span><p class="en">'+esc(q.q)+'</p></div><div class="choices">';
 cs.forEach(function(c,i){h+='<button class="choice" data-i="'+i+'">'+esc(c.t)+'</button>'});
 app.innerHTML=h+'</div><div id="res"></div>';
 Array.prototype.forEach.call(app.querySelectorAll('.choice'),function(b){b.onclick=function(){
  var c=cs[+b.getAttribute('data-i')],ok=c.ok;mark(q,ok);
  Array.prototype.forEach.call(app.querySelectorAll('.choice'),function(x){x.disabled=true;if(cs[+x.getAttribute('data-i')].ok)x.className+=' right'});
  if(!ok)b.className+=' bad';
  document.getElementById('res').innerHTML='<div class="res '+(ok?'ok':'ng')+'"><b class="big '+(ok?'ok':'ng')+'">'+(ok?pick(OKS):pick(NGS)+' 正解は「'+esc(q.c[0])+'」')+'</b><p>'+esc(q.e)+'</p>'+(q.s?audioBtn(q.s):'')+'</div>'+nextBtn();bindAudio();bindNext()}})
}

function chooser(){
 var cs=[[5,'5問コース','約3分','まずはここから'],[10,'10問コース','約6分','ちょうどいい量'],[15,'15問コース','約9分','しっかり練習'],[20,'20問コース','約12分','じっくり実力アップ']];
 var h='<div class="kt-say"><img src="'+KT.img('smile')+'" alt="KT" width="110"><div class="bubble"><b>KTからひとこと</b>今日はどれくらいやる?<br>無理せず、できる数でOK!</div></div><div class="grid courses">';
 cs.forEach(function(c){h+='<button class="tile cbtn" data-n="'+c[0]+'"><div class="no">'+c[0]+'</div><div class="tt">'+c[1]+'</div><div class="ds">'+c[3]+'<br>めやす '+c[2]+'</div></button>'});
 app.innerHTML=h+'</div>';
 Array.prototype.forEach.call(app.querySelectorAll('.cbtn'),function(b){b.onclick=function(){startCourse(+b.getAttribute('data-n'))}});
}
if(MODE==='basic')startCourse(N);else chooser();
})();
