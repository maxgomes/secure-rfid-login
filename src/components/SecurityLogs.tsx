import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, CheckCircle, XCircle, Download } from "lucide-react";
import { useState } from "react";

interface SecurityLog {
  id: string;
  timestamp: string;
  event: "login_success" | "login_failed" | "card_registered" | "suspicious_activity";
  cardUid: string;
  userName: string;
  location: string;
  details: string;
}

export default function SecurityLogs() {
  const [logs] = useState<SecurityLog[]>([
    {
      id: "1",
      timestamp: "2024-01-15 14:32:15",
      event: "login_success",
      cardUid: "04:3A:B2:C1:5D:80",
      userName: "João Silva",
      location: "Workstation-01",
      details: "Autenticação RFID bem-sucedida"
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:28:42",
      event: "login_failed",
      cardUid: "04:XX:XX:XX:XX:XX",
      userName: "Desconhecido",
      location: "Workstation-03",
      details: "Cartão RFID não autorizado"
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:15:33",
      event: "card_registered",
      cardUid: "04:7F:1E:A9:C4:22",
      userName: "Maria Santos",
      location: "Admin-Panel",
      details: "Novo cartão RFID registrado no sistema"
    },
    {
      id: "4",
      timestamp: "2024-01-15 13:45:18",
      event: "suspicious_activity",
      cardUid: "04:8B:F3:D7:11:45",
      userName: "Pedro Costa",
      location: "Workstation-02",
      details: "Múltiplas tentativas de acesso com cartão inativo"
    },
    {
      id: "5",
      timestamp: "2024-01-15 13:22:07",
      event: "login_success",
      cardUid: "04:7F:1E:A9:C4:22",
      userName: "Maria Santos",
      location: "Workstation-02",
      details: "Autenticação RFID bem-sucedida"
    }
  ]);

  const getEventIcon = (event: string) => {
    switch (event) {
      case "login_success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "login_failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "card_registered":
        return <Shield className="h-4 w-4 text-rfid-primary" />;
      case "suspicious_activity":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getEventBadge = (event: string) => {
    switch (event) {
      case "login_success":
        return <Badge className="bg-success">Sucesso</Badge>;
      case "login_failed":
        return <Badge variant="destructive">Falha</Badge>;
      case "card_registered":
        return <Badge className="bg-rfid-primary">Registro</Badge>;
      case "suspicious_activity":
        return <Badge className="bg-warning">Suspeito</Badge>;
      default:
        return <Badge variant="secondary">Outro</Badge>;
    }
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Evento,UID do Cartão,Usuário,Localização,Detalhes\n"
      + logs.map(log => 
          `${log.timestamp},${log.event},${log.cardUid},${log.userName},${log.location},"${log.details}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-rfid-primary" />
            Logs de Segurança
          </CardTitle>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>UID do Cartão</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEventIcon(log.event)}
                      {getEventBadge(log.event)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.cardUid}
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Exibindo {logs.length} registros de segurança</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{logs.filter(l => l.event === "login_success").length} sucessos</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-destructive" />
              <span>{logs.filter(l => l.event === "login_failed").length} falhas</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-warning" />
              <span>{logs.filter(l => l.event === "suspicious_activity").length} suspeitos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}