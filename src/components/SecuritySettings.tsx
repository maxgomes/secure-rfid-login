import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Shield, Lock, Timer, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    encryptionEnabled: true,
    bruteForceProtection: true,
    autoLockTimeout: [30],
    maxFailedAttempts: [3],
    logRetentionDays: [90],
    requireCardPresence: true,
    enableAuditLog: true,
    allowMultipleSessions: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-rfid-primary" />
          Configurações de Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Segurança Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança Básica
          </h3>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Criptografia AES-256</Label>
                <p className="text-sm text-muted-foreground">
                  Criptografia de dados do cartão RFID
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.encryptionEnabled}
                  onCheckedChange={(checked) => updateSetting('encryptionEnabled', checked)}
                />
                <Badge className="bg-success">Ativo</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Proteção contra Força Bruta</Label>
                <p className="text-sm text-muted-foreground">
                  Bloqueia após múltiplas tentativas falhadas
                </p>
              </div>
              <Switch
                checked={settings.bruteForceProtection}
                onCheckedChange={(checked) => updateSetting('bruteForceProtection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Presença Obrigatória do Cartão</Label>
                <p className="text-sm text-muted-foreground">
                  Mantém sessão ativa apenas com cartão presente
                </p>
              </div>
              <Switch
                checked={settings.requireCardPresence}
                onCheckedChange={(checked) => updateSetting('requireCardPresence', checked)}
              />
            </div>
          </div>
        </div>

        {/* Timeouts e Limites */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Timeouts e Limites
          </h3>
          
          <div className="grid gap-6">
            <div className="space-y-3">
              <Label>Timeout de Bloqueio Automático: {settings.autoLockTimeout[0]} minutos</Label>
              <Slider
                value={settings.autoLockTimeout}
                onValueChange={(value) => updateSetting('autoLockTimeout', value)}
                max={120}
                min={5}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Tempo para bloqueio automático da sessão
              </p>
            </div>

            <div className="space-y-3">
              <Label>Máximo de Tentativas Falhadas: {settings.maxFailedAttempts[0]}</Label>
              <Slider
                value={settings.maxFailedAttempts}
                onValueChange={(value) => updateSetting('maxFailedAttempts', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Número de tentativas antes do bloqueio temporário
              </p>
            </div>

            <div className="space-y-3">
              <Label>Retenção de Logs: {settings.logRetentionDays[0]} dias</Label>
              <Slider
                value={settings.logRetentionDays}
                onValueChange={(value) => updateSetting('logRetentionDays', value)}
                max={365}
                min={30}
                step={30}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Período de armazenamento dos logs de segurança
              </p>
            </div>
          </div>
        </div>

        {/* Auditoria e Logs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Auditoria e Logs
          </h3>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Log de Auditoria Detalhado</Label>
                <p className="text-sm text-muted-foreground">
                  Registra todas as atividades do sistema
                </p>
              </div>
              <Switch
                checked={settings.enableAuditLog}
                onCheckedChange={(checked) => updateSetting('enableAuditLog', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Múltiplas Sessões Simultâneas</Label>
                <p className="text-sm text-muted-foreground">
                  Permite um cartão em múltiplas estações
                </p>
              </div>
              <Switch
                checked={settings.allowMultipleSessions}
                onCheckedChange={(checked) => updateSetting('allowMultipleSessions', checked)}
              />
            </div>
          </div>
        </div>

        {/* Chave de Criptografia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Chave de Criptografia
          </h3>
          
          <div className="space-y-3">
            <Label>Chave Mestra (SHA-256)</Label>
            <div className="flex gap-2">
              <Input
                type="password"
                value="••••••••••••••••••••••••••••••••"
                readOnly
                className="font-mono"
              />
              <Button variant="outline">Regenerar</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Chave usada para criptografia dos dados RFID
            </p>
          </div>
        </div>

        {/* Aviso de Segurança */}
        <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-warning-foreground">Aviso de Segurança</p>
            <p className="text-sm text-warning-foreground">
              Alterações nas configurações de segurança podem afetar o funcionamento do sistema.
              Certifique-se de testar todas as mudanças em um ambiente controlado.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Restaurar Padrões</Button>
          <Button className="bg-success hover:bg-success/90">Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  );
}