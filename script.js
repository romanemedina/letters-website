// Edit the text between the backticks to add each original letter.
// Keep the backticks at the beginning and end of each letter.
const letters = {
  '31st': {date:'October 31st, 2026 1:12 Pm', homeDate:'October 31, 2026 1:12 Pm', text:`[Paste your October 31 letter here.]`},
  '30th': {date:'October 30, 2026 12:10 Pm', homeDate:'October 30, 2026 12:10 Pm', text:`[Paste your October 30 letter here.]`},
  '25th': {date:'October 25, 2026 2:19 Am', homeDate:'October 25, 2026 2:19 Am', text:`[Paste your October 25 letter here.]`},
  '15th': {date:'October 15, 2026 1:07 Am', homeDate:'October 15, 2026 1:07 Am', text:`[Paste your October 15 letter here.]`}
};
const content=document.getElementById('content');
const nav=document.querySelector('.nav');
const toggle=document.querySelector('.menu-toggle');
function render(){
  const page=decodeURIComponent(location.hash.replace(/^#\/?/,'')).replace(/\/$/,'')||'home';
  const entry=letters[page];
  content.replaceChildren();
  if(entry){
    const section=document.createElement('article');section.className='letter';
    const heading=document.createElement('h1');heading.textContent=entry.date;
    const body=document.createElement('div');body.className='body';
    if(entry.text.startsWith('[Paste'))body.classList.add('placeholder');
    for(const para of entry.text.split(/\n\s*\n/)){const p=document.createElement('p');p.textContent=para;body.append(p)}
    section.append(heading,body);content.append(section);
  }else{
    const section=document.createElement('section');section.className='home';
    const list=document.createElement('div');list.className='letter-links';
    for(const [key,value] of Object.entries(letters)){
      const a=document.createElement('a');a.href='#/'+key;a.textContent=value.homeDate;list.append(a);
    }
    section.append(list);content.append(section);
  }
  document.querySelectorAll('.nav a').forEach(a=>a.setAttribute('aria-current',a.dataset.page===(entry?page:'home')?'page':'false'));
  nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');
  window.scrollTo(0,0);
}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
window.addEventListener('hashchange',render);render();
