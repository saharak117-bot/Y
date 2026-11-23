const $ = (id) => document.getElementById(id);
let currentVideoId = '';
function extractId(raw){
  try {
    const u = new URL(raw.trim());
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0];
    if (u.hostname.endsWith('youtube.com') || u.hostname.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/); return m ? m[1] : null;
    }
  } catch {}
  return /^[\w-]{11}$/.test(raw.trim()) ? raw.trim() : null;
}
function play(raw){
  const id = extractId(raw);
  if (!id || !/^[\w-]{11}$/.test(id)) { $('status').textContent='ลิงก์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'; return; }
  currentVideoId=id;
  const frame=document.createElement('iframe');
  frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?playsinline=1&rel=0`;
  frame.title='YouTube video player'; frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.referrerPolicy='strict-origin-when-cross-origin'; frame.allowFullscreen=true;
  $('player-placeholder').replaceChildren(frame); $('saveBtn').disabled=false; $('status').textContent='กำลังเล่นวิดีโอผ่าน YouTube';
}
$('loadBtn').addEventListener('click',()=>play($('videoUrl').value));
$('videoUrl').addEventListener('keydown',e=>{if(e.key==='Enter')play($('videoUrl').value)});
function getFavs(){try{return JSON.parse(localStorage.getItem('mytube_favs')||'[]')}catch{return []}}
function renderFavs(){const box=$('favoriteList');box.replaceChildren();const items=getFavs();if(!items.length){box.innerHTML='<p class="muted">ยังไม่มีคลิปที่บันทึกไว้</p>';return;}items.forEach(id=>{const row=document.createElement('div');row.className='fav';const label=document.createElement('span');label.textContent='YouTube • '+id;const group=document.createElement('div');const open=document.createElement('button');open.textContent='เล่น';open.onclick=()=>{play(id);window.scrollTo({top:0,behavior:'smooth'})};const del=document.createElement('button');del.textContent='ลบ';del.className='secondary';del.onclick=()=>{localStorage.setItem('mytube_favs',JSON.stringify(getFavs().filter(x=>x!==id)));renderFavs()};group.append(open,del);row.append(label,group);box.append(row)});}
$('saveBtn').addEventListener('click',()=>{if(!currentVideoId)return;const list=getFavs();if(!list.includes(currentVideoId))list.unshift(currentVideoId);localStorage.setItem('mytube_favs',JSON.stringify(list));renderFavs();$('status').textContent='บันทึกคลิปไว้ในอุปกรณ์นี้แล้ว'});
function decodeJwt(token){try{const part=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(atob(part).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')))}catch{return null}}
window.handleCredentialResponse=(response)=>{const data=decodeJwt(response.credential);if(!data)return;$('userline').textContent='เข้าสู่ระบบแล้ว: '+(data.name||data.email||'Google user');document.querySelector('.g_id_signin').classList.add('hidden');$('signout').classList.remove('hidden')};
$('signout').addEventListener('click',()=>{$('userline').textContent='ยังไม่ได้เข้าสู่ระบบ Google';document.querySelector('.g_id_signin').classList.remove('hidden');$('signout').classList.add('hidden');if(window.google?.accounts?.id)google.accounts.id.disableAutoSelect()});
renderFavs();
