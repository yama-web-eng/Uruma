// 単語練習道場: WORDS(学年別リスト)から、その場で4択問題を作る(選択肢は毎回ランダム)
var POSJ={'名':'名詞','動':'動詞','形':'形容詞','副':'副詞','前':'前置詞','代':'代名詞','助':'助動詞','接':'接続詞','間':'間投詞','冠':'冠詞'};
function vsh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function bg(s){var o={};for(var i=0;i<s.length-1;i++)o[s.substr(i,2)]=1;return o}
function near(a,b){if(a===b||a.indexOf(b)>=0||b.indexOf(a)>=0)return true;var x=bg(a),y=bg(b);for(var k in x)if(y[k])return true;return false}
function buildVocab(W){
 var byPos={};W.forEach(function(e){(byPos[e.p]=byPos[e.p]||[]).push(e)});
 var out=[];
 W.forEach(function(e){
  var dir=Math.random()<0.5?'ej':'je',pool=vsh(byPos[e.p]||[]),ds=[],seenM={},seenW={};seenM[e.m]=1;seenW[e.w.toLowerCase()]=1;
  for(var i=0;i<pool.length&&ds.length<3;i++){var d=pool[i],lw=d.w.toLowerCase();
   if(seenW[lw]||seenM[d.m])continue;
   if(dir==='ej'){if(near(e.m,d.m))continue}else{if(lw.indexOf(e.w.toLowerCase())>=0||e.w.toLowerCase().indexOf(lw)>=0)continue;if(near(e.m,d.m))continue}
   ds.push(d);seenM[d.m]=1;seenW[lw]=1}
  if(ds.length<3)return;
  var ex=e.x?('例文: '+e.x+(e.j?' ／ '+e.j:'')):'';
  var full=e.w+' = '+e.f;
  if(dir==='ej')out.push({q:'「'+e.w+'」('+POSJ[e.p]+')の意味は?',c:[e.m].concat(ds.map(function(d){return d.m})),e:full+(ex?'\n'+ex:''),s:e.w});
  else out.push({q:'「'+e.m+'」('+POSJ[e.p]+')を英語にすると?',c:[e.w].concat(ds.map(function(d){return d.w})),e:full+(ex?'\n'+ex:''),s:e.w})
 });
 return out}
