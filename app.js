let enigma = new EnigmaSimulator();

let rotorPositions = [0, 0, 0];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


const navEncrypt = document.getElementById('nav-encrypt');
const navHelp = document.getElementById('nav-help');
const pageEncrypt = document.getElementById('page-encrypt');
const pageHelp = document.getElementById('page-help');
const indicator0 = document.getElementById('indicator-0');
const indicator1 = document.getElementById('indicator-1');

// 로터 라벨/슬라이더/슬라이더라벨
const rotorLetters = [
  document.getElementById('rotor1-letter'),
  document.getElementById('rotor2-letter'),
  document.getElementById('rotor3-letter')
];
const rotorSliders = [
  document.getElementById('rotor1-slider'),
  document.getElementById('rotor2-slider'),
  document.getElementById('rotor3-slider')
];
const rotorSliderLabels = [
  document.getElementById('rotor1-slider-label'),
  document.getElementById('rotor2-slider-label'),
  document.getElementById('rotor3-slider-label')
];


const inputMsg = document.getElementById('input-msg');
const outputMsg = document.getElementById('output-msg');
const encryptBtn = document.getElementById('encrypt-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');


function showPage(idx) {
  if (idx === 0) {
    pageEncrypt.classList.add('active');
    pageHelp.classList.remove('active');
    navEncrypt.classList.add('active');
    navHelp.classList.remove('active');
    indicator0.classList.add('active');
    indicator1.classList.remove('active');
  } else {
    pageEncrypt.classList.remove('active');
    pageHelp.classList.add('active');
    navEncrypt.classList.remove('active');
    navHelp.classList.add('active');
    indicator0.classList.remove('active');
    indicator1.classList.add('active');
  }
}

// --- 로터 UI 업데이트 ---
function updateRotorUI() {
  for (let i = 0; i < 3; i++) {
    let letter = alphabet[rotorPositions[i]];
    rotorLetters[i].textContent = letter;
    rotorSliderLabels[i].textContent = letter;
    rotorSliders[i].value = rotorPositions[i];
  }
}

// --- 로터 슬라이더 변경 ---
for (let i = 0; i < 3; i++) {
  rotorSliders[i].addEventListener('input', function (e) {
    rotorPositions[i] = parseInt(e.target.value);
    updateRotorUI();
  });
}

// --- 암호화 ---
encryptBtn.onclick = function () {
  enigma.reset_rotors();
  enigma.set_initial_position(...rotorPositions);
  let plain = inputMsg.value;
  let result = enigma.encrypt_message(plain);
  outputMsg.value = result;
  // 암호화 후 로터 상태 갱신
  let pos = enigma.get_rotor_positions();
  rotorPositions = pos;
  updateRotorUI();
};

// --- 입력초기화 ---
clearBtn.onclick = function () {
  inputMsg.value = '';
  outputMsg.value = '';
};

// --- 결과 복사 ---
copyBtn.onclick = function () {
  let out = outputMsg.value;
  if (out) {
    navigator.clipboard.writeText(out);
    alert('암호문이 복사되었습니다!');
  }
};

// --- 위치초기화 ---
resetBtn.onclick = function () {
  rotorPositions = [0, 0, 0];
  enigma.reset_rotors();
  updateRotorUI();
};

// --- 설정저장 (알림만) ---
saveBtn.onclick = function () {
  alert('로터 위치 설정이 저장되었습니다!');
};

// --- 네비게이션 ---
navEncrypt.onclick = () => showPage(0);
navHelp.onclick = () => showPage(1);
indicator0.onclick = () => showPage(0);
indicator1.onclick = () => showPage(1);

// --- 단축키 (암호화/초기화/복사/페이지전환) ---
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.key === 'Enter') {
    encryptBtn.click();
    e.preventDefault();
  }
  if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
    resetBtn.click();
    e.preventDefault();
  }
  if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
    copyBtn.click();
    e.preventDefault();
  }
  if (e.ctrlKey && e.key === '1') {
    showPage(0);
    e.preventDefault();
  }
  if (e.ctrlKey && e.key === '2') {
    showPage(1);
    e.preventDefault();
  }
  if (e.key === 'F1') {
    showPage(1);
    e.preventDefault();
  }
});

// --- 최초 초기화 ---
showPage(0);
updateRotorUI();
