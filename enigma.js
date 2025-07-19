class EnigmaSimulator {
  constructor() {
    this.rotor1_wiring = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
    this.rotor2_wiring = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
    this.rotor3_wiring = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
    this.reflector_wiring = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
    this.rotor1_turnover = 16;
    this.rotor2_turnover = 4;
    this.rotor3_turnover = 21;

    this.plugboard = {'E': 'J', 'J': 'E','O': 'Y', 'Y': 'O','I': 'V', 'V': 'I', 'A': 'Q', 'Q': 'A','K': 'W', 'W': 'K','F': 'X', 'X': 'F','M': 'T', 'T': 'M','P': 'S', 'S': 'P','L': 'U', 'U': 'L','B': 'D', 'D': 'B'
	} ;
    this.reset_rotors();
  }

  reset_rotors() {
    this.rotor1_pos = 0;
    this.rotor2_pos = 0;
    this.rotor3_pos = 0;
  }

  set_initial_position(pos1, pos2, pos3) {
    this.rotor1_pos = pos1;
    this.rotor2_pos = pos2;
    this.rotor3_pos = pos3;
  }

  get_rotor_positions() {
    return [this.rotor1_pos, this.rotor2_pos, this.rotor3_pos];
  }

  step_rotors() {
    if (this.rotor2_pos === this.rotor2_turnover) {
      this.rotor2_pos = (this.rotor2_pos + 1) % 26;
      this.rotor1_pos = (this.rotor1_pos + 1) % 26;
    } else if (this.rotor3_pos === this.rotor3_turnover) {
      this.rotor2_pos = (this.rotor2_pos + 1) % 26;
    }
    this.rotor3_pos = (this.rotor3_pos + 1) % 26;
  }

  encrypt_char(char) {
    if (!/^[A-Z]$/.test(char)) return char;

    this.step_rotors();

    char = this.plugboard[char] || char;
    let char_index = char.charCodeAt(0) - 65;

    char_index = (char_index + this.rotor3_pos) % 26;
    char_index = this.rotor3_wiring.charCodeAt(char_index) - 65;
    char_index = (char_index - this.rotor3_pos + 26) % 26;

    char_index = (char_index + this.rotor2_pos) % 26;
    char_index = this.rotor2_wiring.charCodeAt(char_index) - 65;
    char_index = (char_index - this.rotor2_pos + 26) % 26;

    char_index = (char_index + this.rotor1_pos) % 26;
    char_index = this.rotor1_wiring.charCodeAt(char_index) - 65;
    char_index = (char_index - this.rotor1_pos + 26) % 26;

    char_index = this.reflector_wiring.charCodeAt(char_index) - 65;

    char_index = (char_index + this.rotor1_pos) % 26;
    char_index = this.rotor1_wiring.indexOf(String.fromCharCode(char_index + 65));
    char_index = (char_index - this.rotor1_pos + 26) % 26;

    char_index = (char_index + this.rotor2_pos) % 26;
    char_index = this.rotor2_wiring.indexOf(String.fromCharCode(char_index + 65));
    char_index = (char_index - this.rotor2_pos + 26) % 26;

    char_index = (char_index + this.rotor3_pos) % 26;
    char_index = this.rotor3_wiring.indexOf(String.fromCharCode(char_index + 65));
    char_index = (char_index - this.rotor3_pos + 26) % 26;

    let out_char = String.fromCharCode(char_index + 65);
    out_char = this.plugboard[out_char] || out_char;
    return out_char;
  }

  encrypt_message(message) {
    let result = '';
    for (let i = 0; i < message.length; i++) {
      let ch = message[i].toUpperCase();
      if (ch >= 'A' && ch <= 'Z') {
        result += this.encrypt_char(ch);
      } else {
        result += message[i]; // Keep spaces, numbers, etc.
      }
    }
    return result;
  }
}
