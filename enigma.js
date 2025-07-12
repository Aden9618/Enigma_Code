// 에니그마 시뮬레이터 클래스
class EnigmaSimulator {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // 실제 에니그마 I, II, III 회전자 배선
        this.rotor1 = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
        this.rotor2 = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
        this.rotor3 = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
        
        // 반사판 B
        this.reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
        
        // 회전자 위치 (0-25)
        this.position1 = 0;
        this.position2 = 0;
        this.position3 = 0;
        
        // 회전자 턴오버 위치
        this.turnover1 = 17; // R
        this.turnover2 = 5;  // F
        this.turnover3 = 22; // W
        
        // 플러그보드
        this.plugboard = {
            'A': 'B', 'B': 'A', 'C': 'D', 'D': 'C',
            'E': 'F', 'F': 'E', 'G': 'H', 'H': 'G'
        };
    }

    plugboardSwap(char) {
        return this.plugboard[char] || char;
    }

    rotorForward(char, rotor, position) {
        const index = (this.alphabet.indexOf(char) + position) % 26;
        return rotor[index];
    }

    rotorBackward(char, rotor, position) {
        const index = rotor.indexOf(char);
        return this.alphabet[(index - position + 26) % 26];
    }

    reflect(char) {
        const index = this.alphabet.indexOf(char);
        return this.reflector[index];
    }

    rotateRotors() {
        // 더블 스테핑 체크
        if (this.position2 === this.turnover2) {
            this.position2 = (this.position2 + 1) % 26;
            this.position3 = (this.position3 + 1) % 26;
        }
        
        // 일반 회전
        if (this.position1 === this.turnover1) {
            this.position2 = (this.position2 + 1) % 26;
        }
        
        this.position1 = (this.position1 + 1) % 26;
    }

    encryptChar(char) {
        if (!this.alphabet.includes(char)) {
            return char;
        }
        
        // 회전자 회전
        this.rotateRotors();
        
        // 1. 플러그보드 통과
        char = this.plugboardSwap(char);
        
        // 2. 회전자 1, 2, 3 순서로 앞방향 통과
        char = this.rotorForward(char, this.rotor1, this.position1);
        char = this.rotorForward(char, this.rotor2, this.position2);
        char = this.rotorForward(char, this.rotor3, this.position3);
        
        // 3. 반사판 통과
        char = this.reflect(char);
        
        // 4. 회전자 3, 2, 1 순서로 뒷방향 통과
        char = this.rotorBackward(char, this.rotor3, this.position3);
        char = this.rotorBackward(char, this.rotor2, this.position2);
        char = this.rotorBackward(char, this.rotor1, this.position1);
        
        // 5. 플러그보드 다시 통과
        char = this.plugboardSwap(char);
        
        return char;
    }

    encryptMessage(message) {
        let result = '';
        for (let char of message.toUpperCase()) {
            result += this.encryptChar(char);
        }
        return result;
    }

    setInitialPosition(pos1, pos2, pos3) {
        this.position1 = pos1;
        this.position2 = pos2;
        this.position3 = pos3;
    }

    resetRotors() {
        this.position1 = 0;
        this.position2 = 0;
        this.position3 = 0;
    }

    getRotorPositions() {
        return [this.position1, this.position2, this.position3];
    }

    positionToChar(position) {
        return this.alphabet[position];
    }
}