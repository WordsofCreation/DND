const $ = (s, r = document) => r.querySelector(s);
const uid = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
const blankPlayer = () => ({ id: uid(), name: '', character: '', classLevel: '', hp: 10, ac: 10, passive: 10, notes: '' });
const starter = {
  name: 'The Ember Vale', code: Math.random().toString(36).slice(2, 8).toUpperCase(), dm: 'Dungeon Master', nextGame: new Date().toISOString().slice(0, 10), safety: 'Lines, veils, pause card, and open table feedback are always available.',
  players: [blankPlayer(), blankPlayer(), blankPlayer(), blankPlayer(), blankPlayer(), blankPlayer()].map((p, i) => ({ ...p, name: `Player ${i + 1}`, character: ['Kael','Mira','Thorn','Nyx','Bryn','Sable'][i], classLevel: 'Level 1 Adventurer' })),
  quests: [{ id: uid(), title: 'Find the ember shard', status: 'Active', description: 'Track the goblin raiders back to the ruined watchtower.' }],
  encounters: [{ id: uid(), name: 'Ruined Watchtower Ambush', difficulty: 'Medium', location: 'Old north road', monsters: '4 goblins, 1 wolf', treasure: '25 gp, smoky quartz, map scrap' }],
  sessions: [{ id: uid(), date: new Date().toISOString().slice(0, 10), title: 'Session 0 / Launch', recap: 'Confirm characters, table rules, campaign tone, and first hook.', next: 'Begin on the road to Ember Vale.' }],
  notes: 'Use this shared dashboard to run scenes, track the party, record lore, and export backups after every session.'
};
let state = JSON.parse(localStorage.getItem('dnd-campaign') || 'null') || starter;
const save = () => { localStorage.setItem('dnd-campaign', JSON.stringify(state)); render(); };
const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const field = (path, label, value, area = false, type = 'text') => `<label><span>${label}</span>${area ? `<textarea data-path="${path}">${esc(value)}</textarea>` : `<input data-path="${path}" type="${type}" value="${esc(value)}">`}</label>`;
const icon = x => `<span class="icon">${x}</span>`;
function render(){
  const invite = `${location.origin}${location.pathname}?join=${state.code}`;
  $('#app').innerHTML = `<main>
    <header class="hero"><div><p class="eyebrow">${icon('🛡️')} campaign command center</p><h1>${esc(state.name)}</h1><p>Run a full D&D campaign from session prep to table play: six-player roster, quests, encounters, notes, recaps, dice, invites, and portable backups.</p></div><div class="panel invite"><b>Join code</b><strong>${state.code}</strong><button data-copy="${esc(invite)}">📋 Copy invite link</button></div></header>
    <section class="grid two"><div class="card"><h2>${icon('📖')} Campaign setup</h2>${field('name','Campaign name',state.name)}${field('dm','Dungeon Master',state.dm)}${field('nextGame','Next game',state.nextGame,false,'date')}${field('safety','Safety tools & table rules',state.safety,true)}</div><div class="card"><h2>${icon('🎲')} Dice roller</h2><div class="dice"><input id="dice" value="d20"><button id="roll">Roll</button></div><p class="result" id="result">Roll initiative, checks, damage, or wild magic.</p><div class="actions"><button id="export">⬇️ Export campaign</button><label class="button">⬆️ Import backup<input hidden id="import" type="file" accept="application/json"></label></div></div></section>
    <section class="card"><h2>${icon('👥')} Party roster (${state.players.length}/6+)</h2><div class="cards">${state.players.map((p,i)=>`<article class="mini">${field(`players.${i}.name`,'Player',p.name)}${field(`players.${i}.character`,'Character',p.character)}${field(`players.${i}.classLevel`,'Class / level',p.classLevel)}<div class="triple">${field(`players.${i}.hp`,'HP',p.hp,false,'number')}${field(`players.${i}.ac`,'AC',p.ac,false,'number')}${field(`players.${i}.passive`,'Passive',p.passive,false,'number')}</div>${field(`players.${i}.notes`,'Notes',p.notes,true)}</article>`).join('')}</div><button data-add="players">➕ Add player</button></section>
    <section class="grid three">${list('Quest board','📜','quests', q=>`${field(`quests.${q.i}.title`,'Title',q.title)}<label><span>Status</span><select data-path="quests.${q.i}.status"><option ${q.status==='Active'?'selected':''}>Active</option><option ${q.status==='Completed'?'selected':''}>Completed</option><option ${q.status==='Rumor'?'selected':''}>Rumor</option></select></label>${field(`quests.${q.i}.description`,'Description',q.description,true)}`)}${list('Encounter builder','⚔️','encounters', e=>`${field(`encounters.${e.i}.name`,'Name',e.name)}${field(`encounters.${e.i}.difficulty`,'Difficulty',e.difficulty)}${field(`encounters.${e.i}.location`,'Location',e.location)}${field(`encounters.${e.i}.monsters`,'Monsters / NPCs',e.monsters,true)}${field(`encounters.${e.i}.treasure`,'Treasure',e.treasure)}`)}${list('Session log','📅','sessions', s=>`${field(`sessions.${s.i}.date`,'Date',s.date,false,'date')}${field(`sessions.${s.i}.title`,'Title',s.title)}${field(`sessions.${s.i}.recap`,'Recap',s.recap,true)}${field(`sessions.${s.i}.next`,'Next time',s.next,true)}`)}</section>
    <section class="card"><h2>${icon('🗺️')} World notes</h2>${field('notes','Locations, NPCs, factions, secrets, house rules',state.notes,true)}</section>
  </main>`;
  bind();
}
function list(title, emoji, key, renderItem){ return `<div class="card"><h2>${icon(emoji)} ${title}</h2>${state[key].map((it,i)=>`<article class="mini">${renderItem({...it,i})}</article>`).join('')}<button data-add="${key}">➕ Add</button></div>`; }
function setPath(path, value){ const parts=path.split('.'); let o=state; while(parts.length>1)o=o[parts.shift()]; const k=parts[0]; o[k]=['hp','ac','passive'].includes(k)?Number(value):value; localStorage.setItem('dnd-campaign', JSON.stringify(state)); }
function bind(){
  document.querySelectorAll('[data-path]').forEach(el => el.addEventListener('input', e => setPath(e.target.dataset.path, e.target.value)));
  document.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => { const k=btn.dataset.add; state[k].push(k==='players'?blankPlayer():k==='quests'?{id:uid(),title:'New quest',status:'Active',description:''}:k==='encounters'?{id:uid(),name:'New encounter',difficulty:'Easy',location:'',monsters:'',treasure:''}:{id:uid(),date:new Date().toISOString().slice(0,10),title:'New session',recap:'',next:''}); save(); }));
  $('[data-copy]')?.addEventListener('click', e => navigator.clipboard.writeText(e.target.dataset.copy));
  $('#roll').addEventListener('click', rollDice); $('#dice').addEventListener('keydown', e => { if(e.key==='Enter') rollDice(); });
  $('#export').addEventListener('click', () => { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})); a.download=`${state.name.replace(/\W+/g,'-')}-campaign.json`; a.click(); });
  $('#import').addEventListener('change', e => e.target.files?.[0]?.text().then(t => { state=JSON.parse(t); save(); }));
}
function rollDice(){ const text=$('#dice').value, m=text.match(/(\d*)d(\d+)([+-]\d+)?/i); if(!m){$('#result').textContent='Use dice notation like d20, 2d6+3, or 1d100.';return;} const c=Math.min(Number(m[1]||1),40), sides=Number(m[2]), mod=Number(m[3]||0); const rolls=Array.from({length:c},()=>Math.ceil(Math.random()*sides)); $('#result').textContent=`${rolls.join(' + ')}${mod?` ${mod>0?'+':'-'} ${Math.abs(mod)}`:''} = ${rolls.reduce((a,b)=>a+b,0)+mod}`; }
render();
