import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Usb, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function RFIDDeviceStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanToggle = () => {
    setIsScanning(!isScanning);
  };

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
            variant={isConnected ? "default" : "destructive"}
            className={isConnected ? "bg-success" : ""}
          >
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isConnected ? (
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
              Modelo: ACR122U NFC Reader
            </p>
            <p className="text-sm text-muted-foreground">
              Firmware: v2.14
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Scanner RFID</span>
            <Button
              variant={isScanning ? "destructive" : "default"}
              size="sm"
              onClick={handleScanToggle}
              className={isScanning ? "animate-pulse-glow" : ""}
            >
              {isScanning ? "Parar Scanner" : "Iniciar Scanner"}
            </Button>
          </div>
          
          {isScanning && (
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
        </div>

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