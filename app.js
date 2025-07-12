// 전역 변수
let enigma = new EnigmaSimulator();

// DOM 요소들
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const encryptBtn = document.getElementById('encryptBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');

const rotor1Display = document.getElementById('rotor1');
const rotor2Display = document.getElementById('rotor2');
const rotor3Display = document.getElementById('rotor3');

const rotor1Slider = document.getElementById('rotor1Slider');
const rotor2Slider = document.getElementById('rotor2Slider');
const rotor3Slider = document.getElementById('rotor3Slider');

const rotor1Value = document.getElementById('rotor1Value');
const rotor2Value = document.getElementById('rotor2Value');
const rotor3Value = document.getElementById('rotor3Value');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateRotorDisplay();
    updateSliderValues();
    attachEventListeners();
});

function attachEventListeners() {
    // 암호화 버튼
    encryptBtn.addEventListener('click', encryptMessage);
    
    // 초기화 버튼
    clearBtn.addEventListener('click', clearAll);
    
    // 복사 버튼
    copyBtn.addEventListener('click', copyToClipboard);
    
    // 위치 초기화 버튼
    resetBtn.addEventListener('click', resetRotorPositions);
    
    // 회전자 슬라이더
    rotor1Slider.addEventListener('input', updateRotor1);
    rotor2Slider.addEventListener('input', updateRotor2);
    rotor3Slider.addEventListener('input', updateRotor3);
    
    // 엔터 키로 암호화
    inputText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            encryptMessage();
        }
    });
}

function encryptMessage() {
    const message = inputText.value.trim();
    if (!message) {
        showToast('암호화할 메시지를 입력해주세요.', 'warning');
        return;
    }
    
    // 회전자 애니메이션 시작
    animateRotors();
    
    // 암호화 실행 (각 문자마다 회전자 상태 업데이트)
    let encrypted = '';
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        const encryptedChar = enigma.encryptChar(char.toUpperCase());
        encrypted += encryptedChar;
        
        // 각 문자 암호화 후 회전자 상태 업데이트
        updateRotorDisplay();
        updateSliderValues();
        
        // 시각적 효과를 위한 짧은 지연 (선택사항)
        // await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    outputText.value = encrypted;
    
    // 최종 회전자 상태 업데이트
    updateRotorDisplay();
    updateSliderValues();
    showToast('암호화가 완료되었습니다!', 'success');
}

function clearAll() {
    inputText.value = '';
    outputText.value = '';
    showToast('입력이 초기화되었습니다.', 'info');
}

function copyToClipboard() {
    if (!outputText.value) {
        showToast('복사할 내용이 없습니다.', 'warning');
        return;
    }
    
    outputText.select();
    document.execCommand('copy');
    showToast('클립보드에 복사되었습니다!', 'success');
}

function resetRotorPositions() {
    enigma.resetRotors();
    rotor1Slider.value = 0;
    rotor2Slider.value = 0;
    rotor3Slider.value = 0;
    updateRotorDisplay();
    updateSliderValues();
    showToast('회전자 위치가 초기화되었습니다.', 'info');
}

function updateRotor1() {
    const pos = parseInt(rotor1Slider.value);
    enigma.position1 = pos;
    updateRotorDisplay();
    updateSliderValues();
}

function updateRotor2() {
    const pos = parseInt(rotor2Slider.value);
    enigma.position2 = pos;
    updateRotorDisplay();
    updateSliderValues();
}

function updateRotor3() {
    const pos = parseInt(rotor3Slider.value);
    enigma.position3 = pos;
    updateRotorDisplay();
    updateSliderValues();
}

function updateRotorDisplay() {
    const positions = enigma.getRotorPositions();
    rotor1Display.textContent = enigma.positionToChar(positions[0]);
    rotor2Display.textContent = enigma.positionToChar(positions[1]);
    rotor3Display.textContent = enigma.positionToChar(positions[2]);
}

function updateSliderValues() {
    const positions = enigma.getRotorPositions();
    
    // 슬라이더 값 업데이트
    rotor1Slider.value = positions[0];
    rotor2Slider.value = positions[1];
    rotor3Slider.value = positions[2];
    
    // 슬라이더 옆 값 표시 업데이트
    rotor1Value.textContent = enigma.positionToChar(positions[0]);
    rotor2Value.textContent = enigma.positionToChar(positions[1]);
    rotor3Value.textContent = enigma.positionToChar(positions[2]);
}

function animateRotors() {
    rotor1Display.classList.add('spinning');
    rotor2Display.classList.add('spinning');
    rotor3Display.classList.add('spinning');
    
    setTimeout(() => {
        rotor1Display.classList.remove('spinning');
        rotor2Display.classList.remove('spinning');
        rotor3Display.classList.remove('spinning');
    }, 500);
}

function showToast(message, type = 'info') {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 타입별 색상 설정
    switch(type) {
        case 'success':
            toast.style.background = '#27ae60';
            break;
        case 'warning':
            toast.style.background = '#f39c12';
            break;
        case 'error':
            toast.style.background = '#e74c3c';
            break;
        default:
            toast.style.background = '#3498db';
    }
    
    document.body.appendChild(toast);
    
    // 애니메이션으로 표시
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 300);
}

// 실시간 회전자 움직임을 위한 고급 암호화 함수 (선택사항)
async function encryptMessageWithAnimation() {
    const message = inputText.value.trim();
    if (!message) {
        showToast('암호화할 메시지를 입력해주세요.', 'warning');
        return;
    }
    
    // 버튼 비활성화
    encryptBtn.disabled = true;
    encryptBtn.textContent = '암호화 중...';
    
    let encrypted = '';
    
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        
        // 회전자 애니메이션
        animateRotors();
        
        // 암호화 실행
        const encryptedChar = enigma.encryptChar(char.toUpperCase());
        encrypted += encryptedChar;
        
        // 회전자 상태 업데이트
        updateRotorDisplay();
        updateSliderValues();
        
        // 출력 텍스트 실시간 업데이트
        outputText.value = encrypted;
        
        // 시각적 효과를 위한 지연
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 버튼 활성화
    encryptBtn.disabled = false;
    encryptBtn.textContent = '암호화';
    
    showToast('암호화가 완료되었습니다!', 'success');
}