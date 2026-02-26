import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, remove, ref, onValue, set, get, push } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import {  getAuth,  createUserWithEmailAndPassword,  signInWithEmailAndPassword,  signOut} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5Ts7M38crgBH1JCuzCeCVE3I7yrnwYVI",
  authDomain: "alatar-education-academy-5255b.firebaseapp.com",
  databaseURL: "https://alatar-education-academy-5255b-default-rtdb.firebaseio.com",
  projectId: "alatar-education-academy-5255b",
  storageBucket: "alatar-education-academy-5255b.appspot.com",
  messagingSenderId: "469297141835",
  appId: "1:469297141835:web:2ad6674f4b0453d340d5ce"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
//==========create user page ======
const createform = document.getElementById('createform');
createform.addEventListener("submit" , async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const phone = data.get("phone").trim();
  const password = data.get("password").trim();
  const surepassword = data.get("surepassword").trim();
  const role = data.get("role");
  if (password !== surepassword) {
      alert("كلمتي السر غير متطابقتين ❌");
      return;
  }
  const load = document.getElementById('loadingforcreate');
  load.hidden = false;
  try {
    const usercred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = usercred.user.uid;
    const path = role ==="teacher" ? `users/teacher/${uid}` : `users/student/${uid}`;
    await set(ref(db, path) , {
      name : name,
      email : email,
      phone : phone,
      role : role,
    })
    localStorage.name = name;
    localStorage.role = role;
    localStorage.email = email;
    localStorage.uid  = uid;
    localStorage.sign = true;
    alert("تم إنشاء الحساب ✔")
    if (localStorage.role == "teacher") {
    mainpage.style.display= "block";
    sendreviewpage.style.display= "block";
    ulfoteacher.style.display= "block";
    createuserpage.style.display = "none";
}else if(localStorage.role == "student"){
    mainpage.style.display = "block";
    reviewpage.style.display= "none"
    createuserpage.style.display = "none";
}
  } catch (error) {
    alert("خطأ: " + error.message);
      console.error(error);
  }finally{
    load.hidden = true;
  }
})
//==========sign in ============
const signForm = document.getElementById('signform');
signForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const data = new FormData(e.target);
    const email = data.get("email").trim();
    const password = data.get("password").trim();
    
    if (!email || !password) {
      alert("أدخل البريد وكلمة السر");
      return;
    }

    const load = document.getElementById('loadingforsign');
    load.hidden = false;
    
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      if (email == "mainadmin@gmail.com" && password == "admin#2010") {
        localStorage.role = "admin";
        localStorage.name = "ahmed alatar";
        localStorage.email = email;
        localStorage.uid = uid;
        localStorage.sign = true;
        load.hidden = true;
        alert("Hello Admin 👋")
        adminpage.style.display= "block";
        toadminpage.style.display= "block";
        sendreviewpage.style.display= "block";
        signpage.style.display= "none";
        ulfoteacher.style.display= "block";
        return;
      }
      let snap = await get(ref(db, `users/teacher/${uid}`));
      let role = "student";
      let username = "";
      
      if (snap.exists()) {
        role = "teacher";
        username = snap.val().name;
      } else {
        snap = await get(ref(db, `users/student/${uid}`));
        if (snap.exists()) {
          username = snap.val().name;
        }
      }
      localStorage.name = username;
      localStorage.email = email;
      localStorage.uid = uid;
      localStorage.role = role;
      localStorage.sign = true;
      
if (localStorage.role == "teacher") {
    mainpage.style.display= "block";
    sendreviewpage.style.display= "block";
    ulfoteacher.style.display= "block";
    signpage.style.display= "none";
}else if(localStorage.role == "student"){
    mainpage.style.display = "block";
    reviewpage.style.display= "none"
    signpage.style.display= "none";
}
    } catch (error) {
      alert("خطأ: " + error.message);
      console.error(error);
    } finally {
      load.hidden = true;
    }
  });
//=======================admin page =========

//========sign out ==========================
const signOutBtn =document.getElementById('signout');
signOutBtn.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.clear();
    location.reload();
  });
//======send review========
const createreview = document.getElementById('sendreview');
  createreview.addEventListener("click", async () => {
    const reviewuserInput = document.getElementById('reviewwriter');
    const reviewtitleInput = document.getElementById('reviewtitle');
    const reviewbodyInput = document.getElementById('reviewbody');
    const reviewuser = reviewuserInput.value.trim();
    const reviewtitle = reviewtitleInput.value.trim();
    const reviewbody = reviewbodyInput.value.trim();
    
    if (!reviewuser || !reviewtitle || !reviewbody) {
      alert("أدخل جميع الحقول");
      return;
    }
    const loadingforreview = document.getElementById('loadingforreview');
    loadingforreview.hidden = false;
    createreview.disabled = true;
    
    try {
      await push(ref(db, "reviews"), {
        user: reviewuser,
        title: reviewtitle,
        review: reviewbody
      });
      
      alert("تم إرسال المقال ✔");
      reviewtitleInput.value = "";
      reviewbodyInput.value = "";
      
    } catch (error) {
      alert("خطأ: " + error.message);
      console.error(error);
    } finally {
      loadingforreview.hidden = true;
      createreview.disabled = false;
    }
  });
//===========================send question ==================================
let selectedSubject = null;

document.querySelectorAll(".cardqu").forEach(card=>{
    card.addEventListener("click",()=>{
        document.querySelectorAll(".cardqu").forEach(c=>c.classList.remove("active"));
        card.classList.add("active");
        selectedSubject = card.querySelector("input").value;
    });
});

document.getElementById("createBtn").onclick = async ()=>{
  const q = question.value.trim();
  const opts = [opt1.value,opt2.value,opt3.value,opt4.value];
  const correct = +document.getElementById("correct").value;

  if(!selectedSubject) return alert("اختار المادة");
  if(!q || opts.some(o=>!o)) return alert("كمّل كل البيانات");
  if(correct<1 || correct>4) return alert("رقم الإجابة من 1 لـ 4");

  const btn = createBtn;
  btn.disabled = true;
  btn.innerText = "جاري الإرسال...";

  await push(ref(db, `questions/${selectedSubject}`),{
    question:q,
    options:opts,
    correctAnswer:correct,
    createdAt:Date.now()
  });

  alert("تم الحفظ بنجاح ✅");
  document.getElementById('questionform').reset();
  btn.disabled = false;
  btn.innerText = "إنشاء السؤال";
  document.querySelectorAll(".cardqu").forEach(card=>{
    
        document.querySelectorAll(".cardqu").forEach(c=>c.classList.remove("active"));
    
});
};
//=======send quiz =====
let questions = [];
let editIndex = null;

document.querySelectorAll(".subject-card").forEach(card=>{
    card.addEventListener("click",()=>{
    document.querySelectorAll(".subject-card").forEach(c=>c.classList.remove("active"));
        card.classList.add("active");
        selectedSubject = card.querySelector("input").value;
    });
});


const addBtn = document.querySelector("[data-add]");
const saveBtn = document.querySelector("[data-save]");
const listContainer = document.querySelector("[data-questions-list]");

addBtn.addEventListener("click", ()=>{

  const q = document.querySelector("[data-q]").value.trim();
  const o1 = document.querySelector("[data-o1]").value.trim();
  const o2 = document.querySelector("[data-o2]").value.trim();
  const o3 = document.querySelector("[data-o3]").value.trim();
  const o4 = document.querySelector("[data-o4]").value.trim();
  const correct = parseInt(document.querySelector("[data-correct]").value);

  if(!q || !o1 || !o2 || !o3 || !o4){
    alert("اكمل بيانات السؤال");
    return;
  }

  if(isNaN(correct) || correct < 1 || correct > 4){
    alert("رقم الإجابة لازم بين 1 و 4");
    return;
  }

  const obj = { question:q, options:[o1,o2,o3,o4], correctAnswer:correct };

  if(editIndex !== null){
    questions[editIndex] = obj;
    editIndex = null;
  } else {
    questions.push(obj);
  }

  renderQuestions();
  clearInputs();
});

function renderQuestions(){
  listContainer.innerHTML = "";

  questions.forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "question-card";

    div.innerHTML = `
      <strong>سؤال ${i+1}:</strong> ${q.question}
      <br>
      1) ${q.options[0]}
      <br>
      2) ${q.options[1]}
      <br>
      3) ${q.options[2]}
      <br>
      4) ${q.options[3]}
      <br>
      <b>الإجابة الصحيحة: ${q.correctAnswer}</b>
      <br><br>
      <button class="edit-btn" data-edit="${i}">تعديل</button>
      <button class="delete-btn" data-del="${i}">حذف</button>
    `;

    listContainer.appendChild(div);
  });

  document.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = ()=> {
      questions.splice(btn.dataset.del,1);
      renderQuestions();
    };
  });

  document.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.onclick = ()=> {
      const q = questions[btn.dataset.edit];
      document.querySelector("[data-q]").value = q.question;
      document.querySelector("[data-o1]").value = q.options[0];
      document.querySelector("[data-o2]").value = q.options[1];
      document.querySelector("[data-o3]").value = q.options[2];
      document.querySelector("[data-o4]").value = q.options[3];
      document.querySelector("[data-correct]").value = q.correctAnswer;
      editIndex = btn.dataset.edit;
    };
  });
}

function clearInputs(){
  document.querySelectorAll("[data-q],[data-o1],[data-o2],[data-o3],[data-o4],[data-correct]")
  .forEach(el=>el.value="");
}

saveBtn.addEventListener("click", async ()=>{

  const subject = document.querySelector('input[name="sub"]:checked');
  const title = document.querySelector("[data-exam-title]").value.trim();
  const duration = parseInt(document.querySelector("[data-duration]").value);

  if(!subject){
    alert("اختار المادة");
    return;
  }

  if(!title || isNaN(duration)){
    alert("اكتب اسم الامتحان والمدة");
    return;
  }

  if(questions.length === 0){
    alert("لازم تضيف سؤال واحد على الأقل");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerText = "جاري الحفظ...";

  const data = {
    title,
    duration,
    questions,
    createdAt: Date.now()
  };

  await push(ref(db,"exams/"+subject.value), data);

  alert("تم حفظ الامتحان بنجاح ✅");
  document.getElementById('sendquiestion').reset();
  listContainer.innerHTML = "";
    saveBtn.disabled = false;
  saveBtn.innerText = "حفظ الإمتحان ";
  document.querySelectorAll(".subject-card").forEach(card=>{
    document.querySelectorAll(".subject-card").forEach(c=>c.classList.remove("active"));
  });
});
//===============download review =====================

const appDiv = document.getElementById("app");
const loadBtn = document.getElementById("loadBtn");

/* تحميل المقالات */
async function loadReviews(){
  appDiv.innerHTML = '<p class="loading">جاري تحميل المقالات...</p>';

  const snapshot = await get(ref(db,"reviews"));

  if(!snapshot.exists()){
    appDiv.innerHTML = "<p>لا توجد مقالات</p>";
    return;
  }

  const data = snapshot.val();
  const keys = Object.keys(data).reverse();

  let html = "";
  keys.forEach(id=>{
    const item = data[id];
    html += `
      <div class="card" data-id="${id}">
        <div class="title">${item.title}</div>
        <div class="author">✍ ${item.user}</div>
      </div>
    `;
  });

  appDiv.innerHTML = html;

  /* ربط الكروت */
  document.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
      openArticle(card.dataset.id);
    });
  });
}

/* فتح المقال */
async function openArticle(id){
  const snap = await get(ref(db,"reviews/"+id));
  const d = snap.val();

  appDiv.innerHTML = `
    <div class="article">
      <h2>${d.title}</h2>
      <p><strong>الكاتب:</strong> ${d.user}</p>
      <hr>
      <p>${d.review}</p>
      <button class="back" id="backBtn">رجوع</button>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", loadReviews);
}

/* زر عرض المقالات */
loadBtn.addEventListener("click", loadReviews);
//=================download question=====

const subjectsView = document.getElementById("subjectsView");
const questionsView = document.getElementById("questionsView");
const questionContainer = document.getElementById("questionContainer");
const subjectTitle = document.getElementById("subjectTitle");

document.querySelectorAll(".subject-card").forEach(card=>{
  card.onclick = ()=>{
    loadQuestions(card.dataset.sub, card.innerText);
  };
});

async function loadQuestions(subject, title){
  subjectsView.classList.add("hidden");
  questionsView.classList.remove("hidden");
  subjectTitle.innerText = title;
  questionContainer.innerHTML = "جاري تحميل الأسئلة...";

  const snapshot = await get(ref(db,"questions/" + subject));

  if(!snapshot.exists()){
    questionContainer.innerHTML = "لا توجد أسئلة لهذه المادة";
    return;
  }

  questionContainer.innerHTML = "";

  // ترتيب الأسئلة: الأحدث أولاً
  const questionsArray = Object.values(snapshot.val())
    .sort((a,b)=> b.createdAt - a.createdAt);

  questionsArray.forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "question-item";
    div.innerHTML = `<h4>${i+1}- ${q.question}</h4>`;

    q.options.forEach((opt,idx)=>{
      const op = document.createElement("div");
      op.className = "option";
      op.innerText = opt;

      op.onclick = ()=>{
        div.querySelectorAll(".option").forEach(o=>o.onclick=null);

        if(idx+1 === q.correctAnswer){
          op.classList.add("correct");
        }else{
          op.classList.add("wrong");
          div.querySelectorAll(".option")[q.correctAnswer-1]
            .classList.add("correct");
        }
      };

      div.appendChild(op);
    });

    questionContainer.appendChild(div);
  });
}

document.getElementById("backToSubjects").onclick = ()=>{
  questionsView.classList.add("hidden");
  subjectsView.classList.remove("hidden");
};
//=====download quiz========
const mainContainer = document.getElementById("quizpage");
const originalHTML = mainContainer.innerHTML;

/* ================== تعديل: فانكشن الرجوع ================== */
function goHome(){
  mainContainer.innerHTML = originalHTML;
  attachSubjectEvents();
}

/* ================== تعديل: ربط أحداث المواد ================== */
function attachSubjectEvents(){
  const subjectsGrid = document.getElementById("subjectsGrid");
  subjectsGrid.querySelectorAll(".card").forEach(card=>{
    card.onclick = ()=>loadExams(card);
  });
}

attachSubjectEvents();

/* ================== تعديل: تحميل الامتحانات ================== */
async function loadExams(card){
  const subject = card.dataset.subject;

  mainContainer.innerHTML = `
    <button id="backBtn">←</button>
    <h2>جاري تحميل الامتحانات...</h2>
    <div class="loading">انتظر قليلاً</div>
  `;

  document.getElementById("backBtn").onclick = goHome;

  const snap = await get(ref(db, "exams/" + subject));
  const exams = snap.val();

  mainContainer.innerHTML = `
    <button id="backBtn">←</button>
    <h2>${card.textContent}</h2>
    <div class="cards-grid" id="examsGrid"></div>
  `;

  document.getElementById("backBtn").onclick = goHome;

  if(!exams){
    document.getElementById("examsGrid").innerHTML = "<p>لا يوجد امتحانات</p>";
    return;
  }

  Object.entries(exams).forEach(([id,data])=>{
    const div = document.createElement("div");
    div.className="exam-card";
    div.innerHTML=`<span>${data.title}</span><span>${Math.floor(data.duration)} دقيقة</span>`;
    div.onclick=()=>startExam(subject,id,data);
    document.getElementById("examsGrid").appendChild(div);
  });
}

/* ================== تعديل: بدء الامتحان بدون reload ================== */
async function startExam(subject,examId,examData){
  mainContainer.innerHTML=`
    <button id="backBtn">←</button>
    <h2>${examData.title}</h2>
    <div class="timer" id="timer" style="font-weight:bold; color:red; margin:10px;"></div>
    <div id="questionsContainer" class="loading">جاري تحميل الأسئلة...</div>
    <button class="finish-btn" id="finishBtn">إنهاء الامتحان</button>
  `;

  // --- كود التيمر المضاف ---
  let timeLeft = Math.floor(examData.duration * 60);
  const timerDiv = document.getElementById("timer");

  const timerInterval = setInterval(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDiv.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("انتهى الوقت!");
      finishExam(); // إنهاء تلقائي
    }
    timeLeft--;
  }, 1000);

  // تحديث زر الرجوع ليمسح التيمر
  document.getElementById("backBtn").onclick = () => {
    clearInterval(timerInterval);
    goHome();
  };
  // -----------------------

  const snap = await get(ref(db,`exams/${subject}/${examId}/questions`));
  const questions = snap.val();
  const qc = document.getElementById("questionsContainer");
  qc.innerHTML="";

  const answers=[];

  questions.forEach((q,i)=>{
    const d=document.createElement("div");
    d.className="question-card";
    d.innerHTML=`<div class="question-text">${i+1}- ${q.question}</div>`;
    const ops=document.createElement("div");
    ops.className="options";
    q.options.forEach((o,j)=>{
      const l=document.createElement("label");
      l.innerHTML=`<input type="radio" name="q${i}" value="${j+1}"><span>${o}</span>`;
      l.querySelector("input").onchange=e=>{
        ops.querySelectorAll("label").forEach(x=>x.classList.remove("selected"));
        l.classList.add("selected");
        answers[i]=+e.target.value;
      };
      ops.appendChild(l);
    });
    d.appendChild(ops);
    qc.appendChild(d);
  });

  document.getElementById("finishBtn").onclick=finishExam;

  async function finishExam(){
    clearInterval(timerInterval); // إيقاف التيمر عند الإنهاء اليدوي
    let score=0;
    questions.forEach((q,i)=>{ if(answers[i]===q.correctAnswer) score++; });
    alert(`درجتك ${score} من ${questions.length}`);
    goHome();
  }
}

//================admin page============

function initCounters(){
onValue(ref(db,'users'), snap => {
const data = snap.val()||{};
document.getElementById('count-teachers').innerText = data.teacher?Object.keys(data.teacher).length:0;
document.getElementById('count-students').innerText = data.student?Object.keys(data.student).length:0;
});
onValue(ref(db,'reviews'), snap => {
document.getElementById('count-reviews').innerText = snap.exists()?Object.keys(snap.val()).length:0;
});
['questions','exams'].forEach(path => {
onValue(ref(db,path), snap => {
let total=0;
if(snap.exists()){ const allData=snap.val(); Object.keys(allData).forEach(sub=>{ total+=Object.keys(allData[sub]).length; }); }
document.getElementById(`count-${path}`).innerText=total;
});
});
}
initCounters();

window.showData=function(type){
const panel=document.getElementById('display-panel');
panel.innerHTML="<p style='text-align:center;'>جاري التحميل...</p>";
let dbPath=type;
if(type==='teachers') dbPath='users/teacher';
if(type==='students') dbPath='users/student';
onValue(ref(db,dbPath), snap=>{
panel.innerHTML="";
const data=snap.val();
if(!data){ panel.innerHTML="<p style='text-align:center;'>لا توجد بيانات.</p>"; return; }
if(type==='questions' || type==='exams'){
Object.keys(data).forEach(subject=>{
Object.keys(data[subject]).forEach(id=>{
renderCard(type,id,data[subject][id],panel,subject);
});
});
} else {
Object.keys(data).forEach(id=>{ renderCard(type,id,data[id],panel); });
}
});
};

function renderCard(type,id,item,container,subject=null){
const div=document.createElement('div'); div.className='item-card';
let header="", body="";
if(type==='reviews'){
header=`<strong>${item.title||'بدون عنوان'}</strong> <span class="badge">المؤلف: ${item.user}</span>`;
body=`المراجعة: ${item.review}`;
}else if(type==='teachers'||type==='students'){
header=`<strong>${item.name}</strong> <span class="badge">الهاتف: ${item.phone}</span>`;
body=`البريد: ${item.email} <br> الدور: ${item.role}`;
div.innerHTML=`<div>${header}</div>
<button style="margin-top:10px; background:#f39c12; font-size:0.8rem;" onclick="const d=document.getElementById('det-${id}'); d.style.display=d.style.display==='block'?'none':'block'">التفاصيل</button>
<div id="det-${id}" class="details-box">${body}</div>`;
container.appendChild(div);
return;
}else if(type==='questions'){
header=`<span class="badge" style="color:var(--secondary)">${subject}</span> <strong>${item.question}</strong>`;
body=`الخيارات: ${item.options?Object.values(item.options).join(' | '):'لا يوجد'} <br> الإجابة: ${item.correctAnswer}`;
}else if(type==='exams'){
header=`<span class="badge" style="color:var(--success)">${subject}</span> <strong>${item.title}</strong>`;
let questionsList="";
if(item.questions && Array.isArray(item.questions)){
item.questions.forEach(q=>{
questionsList+=`<div class="question-box"><strong>${q.question}</strong>الخيارات: ${q.options?Object.values(q.options).join(' | '):'لا يوجد'}<br>الإجابة: ${q.correctAnswer}</div>`;
});
}else{ questionsList=item.question || 'متعدد'; }
body=`المدة: ${item.duration} دقيقة <br>${questionsList}`;
}
div.innerHTML=`<div>${header}</div>
<button style="margin-top:10px; background:#f39c12; font-size:0.8rem;" onclick="const d=document.getElementById('det-${id}'); d.style.display=d.style.display==='block'?'none':'block'">التفاصيل</button>
<button class="delete-btn" onclick="deleteItem('${type}','${id}','${subject}')">حذف</button>
<div id="det-${id}" class="details-box">${body}</div>`;
container.appendChild(div);
}

window.deleteItem=function(type,id,subject){
if(!confirm("حذف نهائي؟")) return;
let path="";
if(type==='teachers') path=`users/teacher/${id}`;
else if(type==='students') path=`users/student/${id}`;
else if(subject && subject!=='null') path=`${type}/${subject}/${id}`;
else path=`${type}/${id}`;
remove(ref(db,path)).then(()=>alert("تم الحذف"));

};

