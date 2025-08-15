import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Plus, Trash2, Shield, User } from "lucide-react";
import { useState } from "react";

interface RFIDCard {
  id: string;
  uid: string;
  userName: string;
  accessLevel: "admin" | "user" | "guest";
  isActive: boolean;
  lastUsed: string;
}

export default function RFIDCardManager() {
  const [cards, setCards] = useState<RFIDCard[]>([
    {
      id: "1",
      uid: "04:3A:B2:C1:5D:80",
      userName: "João Silva",
      accessLevel: "admin",
      isActive: true,
      lastUsed: "Há 2 minutos"
    },
    {
      id: "2", 
      uid: "04:7F:1E:A9:C4:22",
      userName: "Maria Santos",
      accessLevel: "user",
      isActive: true,
      lastUsed: "Há 1 hora"
    },
    {
      id: "3",
      uid: "04:8B:F3:D7:11:45",
      userName: "Pedro Costa",
      accessLevel: "guest",
      isActive: false,
      lastUsed: "Há 2 dias"
    }
  ]);

  const [newCardName, setNewCardName] = useState("");

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "admin": return "bg-destructive";
      case "user": return "bg-success"; 
      case "guest": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const handleAddCard = () => {
    if (newCardName.trim()) {
      const newCard: RFIDCard = {
        id: Date.now().toString(),
        uid: "04:XX:XX:XX:XX:XX",
        userName: newCardName,
        accessLevel: "user",
        isActive: true,
        lastUsed: "Nunca"
      };
      setCards([...cards, newCard]);
      setNewCardName("");
    }
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-rfid-primary" />
          Gerenciamento de Cartões RFID
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Nome do usuário para novo cartão"
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddCard} className="bg-success hover:bg-success/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cartão
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UID do Cartão</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Nível de Acesso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-mono text-sm">{card.uid}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {card.userName}
                  </TableCell>
                  <TableCell>
                    <Badge className={getAccessLevelColor(card.accessLevel)}>
                      {card.accessLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={card.isActive ? "default" : "secondary"}>
                      {card.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {card.lastUsed}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
          <Shield className="h-4 w-4 text-rfid-primary" />
          <p className="text-sm">
            Total de cartões: <strong>{cards.length}</strong> | 
            Ativos: <strong>{cards.filter(c => c.isActive).length}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}