// Basic interactivity for Norma & Adat Purworejo site (final version)

// Rooms data (editable)
const rooms = {
  pengertian: {title:'Pengertian Norma & Adat', body:'<p><strong>Norma</strong> adalah aturan... contoh: memberi salam, jaga kebersihan.</p>'},
  rumah:{title:'Norma di Rumah', body:'<p>Contoh: membantu orang tua, sopan, disiplin.</p>'},
  sekolah:{title:'Norma di Sekolah', body:'<p>Contoh: menghormati guru, datang tepat waktu.</p>'},
  purworejo:{title:'Adat Purworejo', body:'<p>Contoh adat lokal: (isi oleh guru).</p>'},
  nilai:{title:'Nilai Islam & Muhammadiyah', body:'<p>Nilai: jujur, tolong-menolong, disiplin, belajar gigih.</p>'}
};

function openRoom(id){
  document.getElementById('roomTitle').innerText = rooms[id].title;
  document.getElementById('roomBody').innerHTML = rooms[id].body;
  document.getElementById('roomModal').style.display = 'flex';
}

function closeRoom(){ document.getElementById('roomModal').style.display = 'none'; }

// Splash
document.getElementById('startBtn').addEventListener('click', ()=> {
  document.getElementById('splash').style.display = 'none';
  window.scrollTo(0,0);
});

// Video modal open/close
function openVideo(card){
  const type = card.dataset.type;
  const src = card.dataset.src;
  const caption = card.querySelector('h3').innerText;
  const frame = document.getElementById('videoFrame');
  frame.innerHTML = '';
  if(type === 'youtube'){
    const ifr = document.createElement('iframe');
    ifr.width = '100%'; ifr.height = '480';
    ifr.src = src + '&enablejsapi=1';
    ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    ifr.allowFullscreen = true;
    frame.appendChild(ifr);
  } else {
    const v = document.createElement('video');
    v.src = src; v.controls = true; v.autoplay = true; v.style.width = '100%';
    frame.appendChild(v);
  }
  document.getElementById('videoCaption').innerText = caption;
  document.getElementById('videoModal').style.display = 'flex';
}

function closeVideo(){
  document.getElementById('videoFrame').innerHTML = '';
  document.getElementById('videoModal').style.display = 'none';
}

// Eval levels
const levels = {
  1:{q:'Apa contoh norma baik di rumah?', opts:['Menjawab orang tua dengan sopan','Bermain sampai larut malam'], a:0, next:2},
  2:{q:'Apa contoh norma baik di sekolah?', opts:['Menghormati guru','Berteriak di kelas'], a:0, next:3},
  3:{q:'Apa contoh norma baik di masyarakat?', opts:['Membuang sampah di sungai','Menolong tetangga'], a:1, next:null}
};
let score = 0;
function startLevel(n){
  const btn = document.getElementById('lvl'+n);
  if(btn.classList.contains('locked')) return;
  const data = levels[n];
  const gc = document.getElementById('game-content');
  gc.innerHTML = '<h3>'+data.q+'</h3>';
  data.opts.forEach((o,i)=>{
    const b = document.createElement('button'); b.className='btn alt'; b.style.margin='6px'; b.innerText = o;
    b.onclick = ()=> answerLevel(n,i);
    gc.appendChild(b);
  });
}
function answerLevel(n,i){
  const data = levels[n];
  const gc = document.getElementById('game-content');
  if(i === data.a){ score += 10; document.getElementById('score').innerText = score; document.getElementById('lvl'+n).classList.add('completed');
    gc.innerHTML = '<h3>Benar! '+(data.next? 'Lanjut ke level berikutnya.':'Semua level selesai!')+'</h3>';
    if(data.next) document.getElementById('lvl'+data.next).classList.remove('locked');
    updateProgress();
  } else {
    gc.innerHTML += '<p style="color:#d9534f">Jawaban belum tepat, coba lagi ya!</p>';
  }
}
function updateProgress(){
  const done = document.querySelectorAll('.level.completed').length;
  const pct = (done/3)*100;
  document.getElementById('progress').style.width = pct+'%';
}
document.getElementById('lvl1').addEventListener('click', ()=> startLevel(1));
document.getElementById('lvl2').addEventListener('click', ()=> startLevel(2));
document.getElementById('lvl3').addEventListener('click', ()=> startLevel(3));
document.getElementById('lvl2').classList.add('locked'); document.getElementById('lvl3').classList.add('locked');

// Chatbot simple (keyword based)
const chatBody = document.getElementById('chatBody'); const chatInput = document.getElementById('chatInput'); const sendBtn = document.getElementById('sendBtn');
const canned = [
  {k:['norma'], r:['Hehe, norma itu aturan supaya hidup rapi, contoh: memberi salam.']},
  {k:['adat','purworejo','tradisi'], r:['Adat itu kebiasaan yang diwariskan, mis. kenduren, gotong royong.']},
  {k:['sekolah','guru'], r:['Di sekolah kita jaga norma: menghormati guru, datang tepat waktu.']},
  {k:['islam','muhammadiyah','nilai'], r:['Nilai Islam & Muhammadiyah: jujur, tolong-menolong, rajin belajar.']}
];
function appendChat(msg, who='bot'){ const d = document.createElement('div'); d.innerHTML = '<b>'+ (who==='user' ? 'Kamu' : 'Web Edu') +':</b> '+msg; chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight; }
sendBtn.addEventListener('click', ()=> {
  const v = chatInput.value.trim(); if(!v) return; appendChat(v,'user'); chatInput.value='';
  setTimeout(()=>{
    const low = v.toLowerCase();
    for(const it of canned){ for(const k of it.k){ if(low.includes(k)){ appendChat(it.r[Math.floor(Math.random()*it.r.length)],'bot'); return; } } }
    appendChat('Maaf, aku belum mengerti. Coba tanya tentang norma atau adat ya!','bot');
  },600);
});
chatInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter') sendBtn.click(); });

// TF game for projector
const tfQuestions = [{q:'Memberi salam adalah contoh norma baik.', ans:true},{q:'Membuang sampah di sungai adalah norma baik.', ans:false},{q:'Menolong tetangga termasuk perilaku baik.', ans:true}];
let tfIndex=0, tfTimer=null, tfTime=10;
const tfQel = document.getElementById('tf-question'), tfTimerEl = document.getElementById('tf-timer'), tfResult = document.getElementById('tf-result');
document.getElementById('tf-start').addEventListener('click', ()=> {
  tfIndex = Math.floor(Math.random()*tfQuestions.length); tfTime = 10; tfQel.innerText = tfQuestions[tfIndex].q; tfTimerEl.innerText = tfTime; tfResult.innerText='';
  if(tfTimer) clearInterval(tfTimer); tfTimer = setInterval(()=>{ tfTime--; tfTimerEl.innerText = tfTime; if(tfTime<=0){ clearInterval(tfTimer); tfResult.innerText='Waktu habis!'; } },1000);
});
document.getElementById('tf-true').addEventListener('click', ()=> submitTF(true)); document.getElementById('tf-false').addEventListener('click', ()=> submitTF(false));
function submitTF(choice){ if(tfTimer) clearInterval(tfTimer); const correct = tfQuestions[tfIndex].ans; if(choice===correct){ tfResult.innerText='Jawaban benar!'; score+=5; document.getElementById('score').innerText = score; updateProgress(); } else { tfResult.innerText='Jawaban salah!'; } }

// Slides
const slides = [{img:'images/adat1.jpg', caption:'Gambar 1: Tebak nama adat'},{img:'images/adat2.jpg', caption:'Gambar 2: Tebak nama adat'},{img:'images/adat3.jpg', caption:'Gambar 3: Tebak nama adat'}];
let slideIdx=0; const slideImg = document.getElementById('slide-img'), slideCap = document.getElementById('slide-caption');
document.getElementById('next-slide').addEventListener('click', ()=>{ slideIdx=(slideIdx+1)%slides.length; renderSlide(); }); document.getElementById('prev-slide').addEventListener('click', ()=>{ slideIdx=(slideIdx-1+slides.length)%slides.length; renderSlide(); });
function renderSlide(){ slideImg.src = slides[slideIdx].img; slideCap.innerText = slides[slideIdx].caption; } renderSlide();
