// Protocolos e constantes para comunicação ACR122U

export interface APDUCommand {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data?: Uint8Array;
  le?: number;
}

export interface APDUResponse {
  data: Uint8Array;
  sw1: number;
  sw2: number;
  success: boolean;
}

// Classe de comandos APDU
export const CLA = {
  PROPRIETARY: 0xFF,
  ISO7816: 0x00
} as const;

// Códigos de instrução para ACR122U
export const INS = {
  GET_DATA: 0xCA,
  READ_BINARY: 0xB0,
  UPDATE_BINARY: 0xD6,
  LOAD_AUTHENTICATION_KEYS: 0x82,
  AUTHENTICATE: 0x86,
  GENERAL_AUTHENTICATE: 0x87,
  GET_CHALLENGE: 0x84
} as const;

// Status Words (SW1 SW2)
export const SW = {
  SUCCESS: 0x9000,
  WRONG_LENGTH: 0x6700,
  COMMAND_NOT_ALLOWED: 0x6986,
  WRONG_PARAMETERS: 0x6A86,
  INSTRUCTION_NOT_SUPPORTED: 0x6D00,
  CLASS_NOT_SUPPORTED: 0x6E00,
  NO_PRECISE_DIAGNOSIS: 0x6F00
} as const;

// Comandos específicos do ACR122U
export class ACR122UCommands {
  
  // Obter UID do cartão
  static getUID(): APDUCommand {
    return {
      cla: CLA.PROPRIETARY,
      ins: INS.GET_DATA,
      p1: 0x00,
      p2: 0x00,
      le: 0x00
    };
  }

  // Carregar chaves de autenticação MIFARE
  static loadAuthenticationKey(keyNumber: number, keyData: Uint8Array): APDUCommand {
    if (keyData.length !== 6) {
      throw new Error('Chave MIFARE deve ter 6 bytes');
    }
    
    return {
      cla: CLA.PROPRIETARY,
      ins: INS.LOAD_AUTHENTICATION_KEYS,
      p1: 0x00,
      p2: keyNumber,
      data: keyData
    };
  }

  // Autenticar bloco MIFARE
  static authenticateBlock(blockNumber: number, keyType: 0x60 | 0x61, keyNumber: number): APDUCommand {
    const authData = new Uint8Array([
      0x01, // Versão
      0x00, // Byte 2
      blockNumber, // Número do bloco
      keyType, // Tipo da chave (0x60 = Key A, 0x61 = Key B)
      keyNumber // Número da chave carregada
    ]);

    return {
      cla: CLA.PROPRIETARY,
      ins: INS.AUTHENTICATE,
      p1: 0x00,
      p2: 0x00,
      data: authData
    };
  }

  // Ler bloco binário
  static readBinaryBlock(blockNumber: number, length: number = 16): APDUCommand {
    return {
      cla: CLA.PROPRIETARY,
      ins: INS.READ_BINARY,
      p1: 0x00,
      p2: blockNumber,
      le: length
    };
  }

  // Escrever bloco binário
  static updateBinaryBlock(blockNumber: number, data: Uint8Array): APDUCommand {
    if (data.length !== 16) {
      throw new Error('Dados devem ter 16 bytes para blocos MIFARE');
    }

    return {
      cla: CLA.PROPRIETARY,
      ins: INS.UPDATE_BINARY,
      p1: 0x00,
      p2: blockNumber,
      data: data
    };
  }

  // Obter versão do firmware
  static getFirmwareVersion(): APDUCommand {
    return {
      cla: CLA.PROPRIETARY,
      ins: 0x48, // Comando específico ACR122U
      p1: 0x00,
      p2: 0x00,
      le: 0x00
    };
  }

  // Buzzer e LED control
  static setBuzzerBeep(duration: number = 50): APDUCommand {
    const buzzerData = new Uint8Array([
      0xD4, 0x32, // Comando SetParameters
      0x05, // Buzzer
      duration // Duração em unidades de 100ms
    ]);

    return {
      cla: CLA.PROPRIETARY,
      ins: 0x00,
      p1: 0x00,
      p2: 0x00,
      data: buzzerData
    };
  }

  // Controle de LED
  static setLED(red: boolean, green: boolean): APDUCommand {
    let ledMask = 0x00;
    if (red) ledMask |= 0x01;
    if (green) ledMask |= 0x02;

    const ledData = new Uint8Array([
      0xD4, 0x32, // Comando SetParameters
      0x05, // LED
      ledMask
    ]);

    return {
      cla: CLA.PROPRIETARY,
      ins: 0x00,
      p1: 0x00,
      p2: 0x00,
      data: ledData
    };
  }
}

// Utilitários para manipulação de dados
export class RFIDUtils {
  
  // Converter APDU para array de bytes
  static apduToBytes(command: APDUCommand): Uint8Array {
    const parts: number[] = [command.cla, command.ins, command.p1, command.p2];
    
    if (command.data && command.data.length > 0) {
      parts.push(command.data.length);
      parts.push(...Array.from(command.data));
    }
    
    if (command.le !== undefined) {
      parts.push(command.le);
    }
    
    return new Uint8Array(parts);
  }

  // Converter resposta em bytes para objeto APDU
  static bytesToAPDUResponse(bytes: Uint8Array): APDUResponse {
    if (bytes.length < 2) {
      throw new Error('Resposta APDU inválida');
    }

    const sw1 = bytes[bytes.length - 2];
    const sw2 = bytes[bytes.length - 1];
    const data = bytes.slice(0, -2);
    const sw = (sw1 << 8) | sw2;

    return {
      data,
      sw1,
      sw2,
      success: sw === SW.SUCCESS
    };
  }

  // Converter UID para string formatada
  static formatUID(uid: Uint8Array): string {
    return Array.from(uid)
      .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
      .join(':');
  }

  // Converter string hex para Uint8Array
  static hexStringToBytes(hex: string): Uint8Array {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    const bytes = new Uint8Array(cleanHex.length / 2);
    
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    
    return bytes;
  }

  // Converter Uint8Array para string hex
  static bytesToHexString(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
      .join('');
  }

  // Calcular checksum simples
  static calculateChecksum(data: Uint8Array): number {
    let checksum = 0;
    for (const byte of data) {
      checksum ^= byte;
    }
    return checksum;
  }

  // Validar cartão MIFARE
  static validateMIFARECard(uid: Uint8Array): { valid: boolean; type: string } {
    if (uid.length === 4) {
      return { valid: true, type: 'MIFARE Classic 1K/4K' };
    } else if (uid.length === 7) {
      return { valid: true, type: 'MIFARE Ultralight/NTAG' };
    } else if (uid.length === 10) {
      return { valid: true, type: 'MIFARE DESFire' };
    }
    
    return { valid: false, type: 'Desconhecido' };
  }

  // Gerar chave MIFARE padrão
  static getDefaultMIFAREKey(): Uint8Array {
    return new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
  }

  // Criptografar dados (simulação AES-256)
  static async encryptCardData(data: Uint8Array, key: string): Promise<Uint8Array> {
    // Em implementação real, usaria WebCrypto API com AES-256
    // Aqui simulamos com XOR simples para demonstração
    const keyBytes = this.hexStringToBytes(key.slice(0, 32));
    const encrypted = new Uint8Array(data.length);
    
    for (let i = 0; i < data.length; i++) {
      encrypted[i] = data[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return encrypted;
  }

  // Descriptografar dados
  static async decryptCardData(encryptedData: Uint8Array, key: string): Promise<Uint8Array> {
    // XOR é simétrico, então usamos a mesma função
    return this.encryptCardData(encryptedData, key);
  }
}

// Constantes de cartões RFID conhecidos
export const RFID_CARD_TYPES = {
  MIFARE_CLASSIC_1K: { size: 1024, blocks: 64, blockSize: 16 },
  MIFARE_CLASSIC_4K: { size: 4096, blocks: 256, blockSize: 16 },
  MIFARE_ULTRALIGHT: { size: 512, blocks: 16, blockSize: 4 },
  NTAG213: { size: 180, blocks: 45, blockSize: 4 },
  NTAG215: { size: 540, blocks: 135, blockSize: 4 },
  NTAG216: { size: 928, blocks: 232, blockSize: 4 }
} as const;

// Interface para logs detalhados
export interface RFIDOperationLog {
  timestamp: string;
  operation: 'read' | 'write' | 'authenticate' | 'detect';
  cardUID: string;
  blockNumber?: number;
  success: boolean;
  errorCode?: number;
  data?: string;
  duration: number;
}