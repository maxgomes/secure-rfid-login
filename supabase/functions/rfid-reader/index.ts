import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Interface para comandos ACR122U
interface ACR122UCommand {
  command: 'INIT' | 'SCAN' | 'READ' | 'WRITE' | 'STATUS' | 'STOP';
  data?: string;
}

interface RFIDCard {
  uid: string;
  type: string;
  data?: string;
  timestamp: string;
}

// Comandos APDU para ACR122U
const ACR122U_COMMANDS = {
  // Get firmware version
  GET_FIRMWARE: new Uint8Array([0xFF, 0x00, 0x48, 0x00, 0x00]),
  
  // Load authentication keys (for MIFARE)
  LOAD_KEY: new Uint8Array([0xFF, 0x82, 0x00, 0x00, 0x06]),
  
  // Authenticate block
  AUTHENTICATE: new Uint8Array([0xFF, 0x86, 0x00, 0x00, 0x05]),
  
  // Read binary block
  READ_BLOCK: new Uint8Array([0xFF, 0xB0, 0x00, 0x00, 0x10]),
  
  // Update binary block  
  WRITE_BLOCK: new Uint8Array([0xFF, 0xD6, 0x00, 0x00, 0x10]),
  
  // Get UID
  GET_UID: new Uint8Array([0xFF, 0xCA, 0x00, 0x00, 0x00])
};

class ACR122UReader {
  private device: any = null;
  private isConnected = false;
  private isScanning = false;

  async initialize(): Promise<boolean> {
    try {
      // Simula inicialização do dispositivo USB
      // Em ambiente real, usaria Web USB API ou biblioteca nativa
      console.log('Inicializando ACR122U...');
      
      // Verificar se dispositivo está conectado
      const deviceInfo = await this.checkDeviceConnection();
      if (!deviceInfo) {
        throw new Error('ACR122U não encontrado');
      }

      this.isConnected = true;
      console.log('ACR122U inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar ACR122U:', error);
      this.isConnected = false;
      return false;
    }
  }

  private async checkDeviceConnection(): Promise<any> {
    // Simula verificação de conexão USB
    // Em implementação real, verificaria dispositivos USB disponíveis
    return {
      vendorId: 0x072F, // ACS vendor ID
      productId: 0x2200, // ACR122U product ID
      manufacturer: 'Advanced Card Systems Ltd.',
      product: 'ACR122U PICC Interface'
    };
  }

  async startScanning(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Dispositivo não conectado');
    }

    this.isScanning = true;
    console.log('Iniciando scanner RFID...');
  }

  async stopScanning(): Promise<void> {
    this.isScanning = false;
    console.log('Scanner RFID parado');
  }

  async scanForCard(): Promise<RFIDCard | null> {
    if (!this.isConnected || !this.isScanning) {
      return null;
    }

    try {
      // Simula leitura de cartão RFID
      // Em implementação real, enviaria comandos APDU via USB
      const cardPresent = Math.random() > 0.7; // 30% chance de detectar cartão
      
      if (!cardPresent) {
        return null;
      }

      // Simula UID de cartão MIFARE
      const uid = this.generateUID();
      const cardType = await this.detectCardType();
      
      return {
        uid,
        type: cardType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao ler cartão:', error);
      return null;
    }
  }

  private generateUID(): string {
    // Simula UID real de cartão MIFARE
    const bytes = new Uint8Array(7);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(':');
  }

  private async detectCardType(): Promise<string> {
    // Simula detecção de tipo de cartão
    const types = ['MIFARE Classic 1K', 'MIFARE Classic 4K', 'MIFARE Ultralight', 'NTAG213'];
    return types[Math.floor(Math.random() * types.length)];
  }

  async readCardData(uid: string, block: number = 1): Promise<string | null> {
    if (!this.isConnected) {
      throw new Error('Dispositivo não conectado');
    }

    try {
      // Simula leitura de dados do cartão
      // Em implementação real, usaria comandos APDU específicos
      console.log(`Lendo bloco ${block} do cartão ${uid}`);
      
      // Simula dados hexadecimais
      const data = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      return data;
    } catch (error) {
      console.error('Erro ao ler dados do cartão:', error);
      return null;
    }
  }

  async writeCardData(uid: string, block: number, data: string): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Dispositivo não conectado');
    }

    try {
      console.log(`Escrevendo no bloco ${block} do cartão ${uid}: ${data}`);
      
      // Simula escrita de dados
      // Em implementação real, usaria comandos APDU de escrita
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Erro ao escrever dados no cartão:', error);
      return false;
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      scanning: this.isScanning,
      firmware: 'v2.14', // Simula versão do firmware
      model: 'ACR122U-A9'
    };
  }

  async disconnect(): Promise<void> {
    this.isScanning = false;
    this.isConnected = false;
    this.device = null;
    console.log('ACR122U desconectado');
  }
}

const rfidReader = new ACR122UReader();

serve(async (req) => {
  const { method } = req;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (method === 'POST') {
      const body: ACR122UCommand = await req.json();
      
      switch (body.command) {
        case 'INIT':
          const initialized = await rfidReader.initialize();
          return new Response(
            JSON.stringify({ 
              success: initialized, 
              status: rfidReader.getStatus() 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'SCAN':
          await rfidReader.startScanning();
          const card = await rfidReader.scanForCard();
          
          if (card) {
            // Salvar no banco de dados
            const { error } = await supabase
              .from('rfid_logs')
              .insert({
                card_uid: card.uid,
                card_type: card.type,
                event_type: 'card_detected',
                timestamp: card.timestamp,
                raw_data: card.data
              });

            if (error) {
              console.error('Erro ao salvar log:', error);
            }
          }
          
          return new Response(
            JSON.stringify({ card, status: rfidReader.getStatus() }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'READ':
          if (!body.data) {
            throw new Error('UID do cartão é obrigatório');
          }
          const [uid, blockStr] = body.data.split(':');
          const block = parseInt(blockStr) || 1;
          const cardData = await rfidReader.readCardData(uid, block);
          
          return new Response(
            JSON.stringify({ data: cardData }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'WRITE':
          if (!body.data) {
            throw new Error('Dados para escrita são obrigatórios');
          }
          const [writeUid, writeBlock, writeData] = body.data.split(':');
          const writeSuccess = await rfidReader.writeCardData(
            writeUid, 
            parseInt(writeBlock), 
            writeData
          );
          
          return new Response(
            JSON.stringify({ success: writeSuccess }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'STATUS':
          return new Response(
            JSON.stringify({ status: rfidReader.getStatus() }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'STOP':
          await rfidReader.stopScanning();
          return new Response(
            JSON.stringify({ status: rfidReader.getStatus() }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        default:
          throw new Error('Comando inválido');
      }
    }

    if (method === 'GET') {
      return new Response(
        JSON.stringify({ status: rfidReader.getStatus() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Método não suportado');

  } catch (error) {
    console.error('Erro na edge function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});