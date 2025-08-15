import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Usb, Shield, AlertTriangle } from "lucide-react";
import { useRFIDReader } from "@/hooks/useRFIDReader";
import { useToast } from "@/hooks/use-toast";

export default function RFIDDeviceStatus() {
  const { 
    status, 
    lastCard, 
    isLoading, 
    error, 
    initializeReader, 
    startScanning, 
    stopScanning,
    clearError 
  } = useRFIDReader();
  const { toast } = useToast();

  const handleInitialize = async () => {
    const success = await initializeReader();
    if (success) {
      toast({
        title: "Dispositivo Conectado",
        description: "ACR122U inicializado com sucesso",
      });
    } else {
      toast({
        title: "Erro de Conexão",
        description: error || "Não foi possível conectar ao dispositivo",
        variant: "destructive",
      });
    }
  };

  const handleScanToggle = async () => {
    try {
      if (status.scanning) {
        await stopScanning();
        toast({
          title: "Scanner Parado",
          description: "Detecção de cartões desativada",
        });
      } else {
        if (!status.connected) {
          toast({
            title: "Dispositivo Desconectado",
            description: "Conecte o ACR122U primeiro",
            variant: "destructive",
          });
          return;
        }
        await startScanning();
        toast({
          title: "Scanner Ativo",
          description: "Aguardando cartões RFID...",
        });
      }
    } catch (err) {
      toast({
        title: "Erro no Scanner",
        description: "Falha ao alterar estado do scanner",
        variant: "destructive",
      });
    }
  };

  // Exibir notificação quando cartão for detectado
  React.useEffect(() => {
    if (lastCard) {
      toast({
        title: "Cartão Detectado!",
        description: `UID: ${lastCard.uid} - Tipo: ${lastCard.type}`,
      });
    }
  }, [lastCard, toast]);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-rfid-gradient opacity-5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Usb className="h-5 w-5 text-rfid-primary" />
            Status do Dispositivo RFID
          </CardTitle>
          <Badge 
            variant={status.connected ? "default" : "destructive"}
            className={status.connected ? "bg-success" : ""}
          >
            {status.connected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {/* Botão de Inicialização */}
        {!status.connected && (
          <div className="flex justify-center">
            <Button 
              onClick={handleInitialize} 
              disabled={isLoading}
              className="bg-rfid-gradient hover:opacity-90"
            >
              {isLoading ? "Conectando..." : "Conectar ACR122U"}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {status.connected ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm">Conexão USB</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm">Criptografia AES-256</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Modelo: {status.model || "ACR122U NFC Reader"}
            </p>
            <p className="text-sm text-muted-foreground">
              Firmware: {status.firmware || "v2.14"}
            </p>
          </div>
        </div>

        {/* Scanner Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Scanner RFID</span>
            <Button
              variant={status.scanning ? "destructive" : "default"}
              size="sm"
              onClick={handleScanToggle}
              disabled={!status.connected || isLoading}
              className={status.scanning ? "animate-pulse-glow" : ""}
            >
              {status.scanning ? "Parar Scanner" : "Iniciar Scanner"}
            </Button>
          </div>
          
          {status.scanning && (
            <div className="relative">
              <div className="bg-muted rounded-lg p-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Aguardando cartão RFID...</span>
                </div>
                <div className="relative bg-border h-2 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 w-8 bg-rfid-gradient animate-scan-line rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Último cartão detectado */}
          {lastCard && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium text-success-foreground">
                  Último cartão detectado
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                <div>UID: {lastCard.uid}</div>
                <div>Tipo: {lastCard.type}</div>
                <div>Timestamp: {new Date(lastCard.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div className="flex-1">
              <p className="text-sm text-destructive-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearError}>
              Limpar
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="text-sm text-warning-foreground">
            Mantenha o dispositivo conectado para autenticação automática
          </p>
        </div>
      </CardContent>
    </Card>
  );
}