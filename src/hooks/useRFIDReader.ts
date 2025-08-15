import { useState, useEffect, useCallback } from 'react';

// Simulando cliente Supabase para demonstração
const supabaseClient = {
  functions: {
    invoke: async (functionName: string, options: any) => {
      // Simula comunicação com edge function
      console.log(`Chamando função: ${functionName}`, options.body);
      
      const { command, data } = options.body;
      
      // Simula respostas da edge function
      switch (command) {
        case 'INIT':
          return {
            data: {
              success: true,
              status: {
                connected: true,
                scanning: false,
                firmware: 'v2.14',
                model: 'ACR122U-A9'
              }
            },
            error: null
          };
          
        case 'SCAN':
          const hasCard = Math.random() > 0.7; // 30% chance
          return {
            data: {
              card: hasCard ? {
                uid: '04:3A:B2:C1:5D:80',
                type: 'MIFARE Classic 1K',
                timestamp: new Date().toISOString()
              } : null,
              status: {
                connected: true,
                scanning: true,
                firmware: 'v2.14',
                model: 'ACR122U-A9'
              }
            },
            error: null
          };
          
        case 'STOP':
          return {
            data: {
              status: {
                connected: true,
                scanning: false,
                firmware: 'v2.14',
                model: 'ACR122U-A9'
              }
            },
            error: null
          };
          
        case 'READ':
          return {
            data: {
              data: 'FF00FF00FF00FF00FF00FF00FF00FF00'
            },
            error: null
          };
          
        case 'WRITE':
          return {
            data: {
              success: true
            },
            error: null
          };
          
        case 'STATUS':
          return {
            data: {
              status: {
                connected: true,
                scanning: false,
                firmware: 'v2.14',
                model: 'ACR122U-A9'
              }
            },
            error: null
          };
          
        default:
          return {
            data: null,
            error: { message: 'Comando inválido' }
          };
      }
    }
  }
};

export interface RFIDCard {
  uid: string;
  type: string;
  data?: string;
  timestamp: string;
}

export interface RFIDStatus {
  connected: boolean;
  scanning: boolean;
  firmware?: string;
  model?: string;
}

export interface RFIDReaderHook {
  status: RFIDStatus;
  lastCard: RFIDCard | null;
  isLoading: boolean;
  error: string | null;
  initializeReader: () => Promise<boolean>;
  startScanning: () => Promise<void>;
  stopScanning: () => Promise<void>;
  readCard: (uid: string, block?: number) => Promise<string | null>;
  writeCard: (uid: string, block: number, data: string) => Promise<boolean>;
  clearError: () => void;
}

export const useRFIDReader = (): RFIDReaderHook => {
  const [status, setStatus] = useState<RFIDStatus>({
    connected: false,
    scanning: false
  });
  const [lastCard, setLastCard] = useState<RFIDCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para chamar a edge function
  const callRFIDFunction = useCallback(async (command: string, data?: string) => {
    try {
      const { data: result, error: funcError } = await supabaseClient.functions.invoke('rfid-reader', {
        body: { command, data }
      });

      if (funcError) {
        throw new Error(funcError.message);
      }

      return result;
    } catch (err) {
      console.error('Erro na comunicação RFID:', err);
      throw err;
    }
  }, []);

  // Inicializar leitor RFID
  const initializeReader = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callRFIDFunction('INIT');
      
      if (result.success) {
        setStatus(result.status);
        return true;
      } else {
        throw new Error('Falha ao inicializar dispositivo ACR122U');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao inicializar: ${errorMsg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [callRFIDFunction]);

  // Iniciar scanner
  const startScanning = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callRFIDFunction('SCAN');
      setStatus(result.status);
      
      if (result.card) {
        setLastCard(result.card);
        
        // Disparar evento customizado para outras partes da aplicação
        window.dispatchEvent(new CustomEvent('rfid-card-detected', {
          detail: result.card
        }));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao escanear';
      setError(`Erro no scanner: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [callRFIDFunction]);

  // Parar scanner
  const stopScanning = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callRFIDFunction('STOP');
      setStatus(result.status);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao parar scanner';
      setError(`Erro: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [callRFIDFunction]);

  // Ler dados do cartão
  const readCard = useCallback(async (uid: string, block: number = 1): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callRFIDFunction('READ', `${uid}:${block}`);
      return result.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao ler cartão';
      setError(`Erro na leitura: ${errorMsg}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callRFIDFunction]);

  // Escrever dados no cartão
  const writeCard = useCallback(async (uid: string, block: number, data: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callRFIDFunction('WRITE', `${uid}:${block}:${data}`);
      return result.success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao escrever no cartão';
      setError(`Erro na escrita: ${errorMsg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [callRFIDFunction]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar status periodicamente quando conectado
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (status.connected) {
      interval = setInterval(async () => {
        try {
          const result = await callRFIDFunction('STATUS');
          setStatus(result.status);
        } catch (err) {
          console.error('Erro ao verificar status:', err);
        }
      }, 5000); // Verificar a cada 5 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status.connected, callRFIDFunction]);

  // Scanner automático quando ativo
  useEffect(() => {
    let scanInterval: NodeJS.Timeout | null = null;
    
    if (status.connected && status.scanning) {
      scanInterval = setInterval(async () => {
        try {
          await startScanning();
        } catch (err) {
          console.error('Erro no scanner automático:', err);
        }
      }, 1000); // Escanear a cada 1 segundo
    }

    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [status.connected, status.scanning, startScanning]);

  return {
    status,
    lastCard,
    isLoading,
    error,
    initializeReader,
    startScanning,
    stopScanning,
    readCard,
    writeCard,
    clearError
  };
};