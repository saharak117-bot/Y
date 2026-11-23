const $ = (id) => document.getElementById(id);
let queue = [], currentIndex = -1, player = null, apiReady = false, touchStartY = null;
function extractId(raw){
  try { const u=new URL(raw.trim());
    if(u.hostname==='youtu.be') return u.pathname.slice(1).split('/')[0];
    if(u.hostname.endsWith('youtube.com')||u.hostname.endsWith('youtube-nocookie.com')){
      if(u.pathname==='/watch') return u.searchParams.get('v');
      const m=u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/); return m?m[1]:null;
    }
  } catch {}
  return /^[\w-]{11}$/.test(raw.trim())?raw.trim():null;
}
window.onYouTubeIframeAPIReady=()=>{apiReady=true;createPlayer()};
function createPlayer(){
  if(!apiReady||player)return;
  player=new YT.Player('player',{height:'100%',width:'100%',videoId:'',playerVars:{playsinline:1,rel:0},events:{onReady:()=>{if(currentIndex>=0)loadCurrent()},onStateChange:e=>{if(e.data===YT.PlayerState.ENDED)nextClip(true)}}});
}
function loadCurrent(){
  if(!player||currentIndex<0||!queue[currentIndex])return;
  $('player-placeholder').classList.add('hidden');
  player.loadVideoById(queue[currentIndex]);
  $('saveBtn').disabled=false; updateUI(); $('status').textContent='กำลังเล่นคลิป • เมื่อจบจะไปคลิปถัดไปอัตโนมัติ';
}
function addClip(raw){
  const id=extractId(raw);
  if(!id||!/^[\w-]{11}$/.test(id)){$('status').textContent='ลิงก์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';return;}
  if(!queue.includes(id))queue.push(id);
  if(currentIndex===-1){currentIndex=0;if(apiReady)createPlayer();loadCurrent();}
  renderQueue();updateUI();$('videoUrl').value='';$('status').textContent='เพิ่มคลิปในคิวแล้ว';
}
function playAt(i){if(i<0||i>=queue.length)return;currentIndex=i;loadCurrent();renderQueue();updateUI()}
function nextClip(fromEnd=false){if(currentIndex<queue.length-1){playAt(currentIndex+1)}else if(fromEnd){$('status').textContent='จบคิวแล้ว เพิ่มคลิปใหม่เพื่อเล่นต่อ';}}
function prevClip(){if(currentIndex>0)playAt(currentIndex-1)}
function updateUI(){
  $('clipCounter').textContent=queue.length?`${currentIndex+1} / ${queue.length}`:'0 / 0';
  $('prevBtn').disabled=currentIndex<=0;$('nextBtn').disabled=currentIndex<0||currentIndex>=queue.length-1;
}
$('loadBtn').addEventListener('click',()=>addClip($('videoUrl').value));
$('videoUrl').addEventListener('keydown',e=>{if(e.key==='Enter')addClip($('videoUrl').value)});
$('nextBtn').addEventListener('click',()=>nextClip());$('prevBtn').addEventListener('click',prevClip);
$('playerWrap').addEventListener('touchstart',e=>{touchStartY=e.changedTouches[0].clientY},{passive:true});
$('playerWrap').addEventListener('touchend',e=>{if(touchStartY===null)return;const delta=touchStartY-e.changedTouches[0].clientY;if(delta>55)nextClip();else if(delta< -55)prevClip();touchStartY=null},{passive:true});
function renderQueue(){const box=$('queueList');box.replaceChildren();if(!queue.length){box.innerHTML='<p class="muted">ยังไม่มีคลิปในคิว</p>';return;}queue.forEach((id,i)=>{const row=document.createElement('div');row.className='queue-item'+(i===currentIndex?' active':'');const name=document.createElement('span');name.textContent=`${i+1}. ${id}`;const play=document.createElement('button');play.textContent='เล่น';play.className='secondary small';play.onclick=()=>playAt(i);const remove=document.createElement('button');remove.textContent='×';remove.className='secondary small';remove.title='นำออกจากคิว';remove.onclick=()=>{queue.splice(i,1);if(!queue.length){currentIndex=-1;if(player)player.stopVideo();$('player-placeholder').classList.remove('hidden');$('saveBtn').disabled=true;}else if(i<currentIndex)currentIndex--;else if(i===currentIndex){currentIndex=Math.min(i,queue.length-1);loadCurrent();}renderQueue();updateUI()};row.append(name,play,remove);box.append(row)});}
$('clearQueue').addEventListener('click',()=>{queue=[];currentIndex=-1;if(player)player.stopVideo();$('player-placeholder').classList.remove('hidden');$('saveBtn').disabled=true;renderQueue();updateUI();$('status').textContent='ล้างคิวแล้ว'});
function getFavs(){try{return JSON.parse(localStorage.getItem('mytube_favs')||'[]')}catch{return []}}
function renderFavs(){const box=$('favoriteList');box.replaceChildren();const items=getFavs();if(!items.length){box.innerHTML='<p class="muted">ยังไม่มีคลิปที่บันทึกไว้</p>';return;}items.forEach(id=>{const row=document.createElement('div');row.className='fav';const label=document.createElement('span');label.textContent='YouTube • '+id;const group=document.createElement('div');const open=document.createElement('button');open.textContent='เพิ่มเข้าคิว';open.onclick=()=>addClip(id);const del=document.createElement('button');del.textContent='ลบ';del.className='secondary';del.onclick=()=>{localStorage.setItem('mytube_favs',JSON.stringify(getFavs().filter(x=>x!==id)));renderFavs()};group.append(open,del);row.append(label,group);box.append(row)});}
$('saveBtn').addEventListener('click',()=>{const id=queue[currentIndex];if(!id)return;const list=getFavs();if(!list.includes(id))list.unshift(id);localStorage.setItem('mytube_favs',JSON.stringify(list));renderFavs();$('status').textContent='บันทึกคลิปไว้ในอุปกรณ์นี้แล้ว'});
function decodeJwt(token){try{const part=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(atob(part).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')))}catch{return null}}
window.handleCredentialResponse=(response)=>{const data=decodeJwt(response.credential);if(!data)return;$('userline').textContent='เข้าสู่ระบบแล้ว: '+(data.name||data.email||'Google user');document.querySelector('.g_id_signin').classList.add('hidden');$('signout').classList.remove('hidden')};
$('signout').addEventListener('click',()=>{$('userline').textContent='ยังไม่ได้เข้าสู่ระบบ Google';document.querySelector('.g_id_signin').classList.remove('hidden');$('signout').classList.add('hidden');if(window.google?.accounts?.id)google.accounts.id.disableAutoSelect()});
renderFavs();renderQueue();updateUI();
