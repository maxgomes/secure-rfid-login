import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Eye, Download, Zap } from "lucide-react";
import { useRFIDReader, RFIDCard } from "@/hooks/useRFIDReader";
import { useToast } from "@/hooks/use-toast";

export default function RFIDCardDetector() {
  const { status, lastCard, readCard, writeCard } = useRFIDReader();
  const { toast } = useToast();
  const [cardData, setCardData] = React.useState<string | null>(null);
  const [isReading, setIsReading] = React.useState(false);

  const handleReadCard = async (card: RFIDCard) => {
    if (!card) return;
    
    setIsReading(true);
    try {
      const data = await readCard(card.uid, 1); // Ler bloco 1
      setCardData(data);
      
      toast({
        title: "Dados Lidos",
        description: `Dados do cartão ${card.uid} obtidos com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro na Leitura",
        description: "Não foi possível ler os dados do cartão",
        variant: "destructive",
      });
    } finally {
      setIsReading(false);
    }
  };

  const handleWriteTestData = async (card: RFIDCard) => {
    if (!card) return;

    try {
      // Dados de teste para escrever (32 caracteres hex = 16 bytes)
      const testData = "48656C6C6F20524649442041757468210000"; // "Hello RFID Auth!" + padding
      
      const success = await writeCard(card.uid, 1, testData);
      
      if (success) {
        toast({
          title: "Dados Escritos",
          description: `Dados de teste gravados no cartão ${card.uid}`,
        });
      } else {
        throw new Error("Falha na escrita");
      }
    } catch (error) {
      toast({
        title: "Erro na Escrita",
        description: "Não foi possível escrever no cartão",
        variant: "destructive",
      });
    }
  };

  const exportCardData = () => {
    if (!lastCard || !cardData) return;

    const exportData = {
      card: lastCard,
      data: cardData,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rfid_card_${lastCard.uid.replace(/:/g, '')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-rfid-gradient opacity-5" />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-rfid-primary" />
          Detector de Cartões RFID
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Status do Scanner */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              status.scanning ? 'bg-success animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span className="font-medium">
              {status.scanning ? 'Scanner Ativo' : 'Scanner Inativo'}
            </span>
          </div>
          <Badge variant={status.connected ? "default" : "secondary"}>
            {status.connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>

        {/* Cartão Detectado */}
        {lastCard ? (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-success-foreground">
                  Cartão RFID Detectado
                </h3>
                <Badge className="bg-success">
                  <Zap className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">UID:</span>
                    <div className="font-mono text-sm bg-background/50 p-2 rounded mt-1">
                      {lastCard.uid}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Tipo:</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {lastCard.type}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Detectado em:</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(lastCard.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReadCard(lastCard)}
                      disabled={isReading}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {isReading ? 'Lendo...' : 'Ler Dados'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWriteTestData(lastCard)}
                    >
                      Gravar Teste
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Cartão */}
            {cardData && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Dados do Cartão (Bloco 1)</h4>
                  <Button size="sm" variant="outline" onClick={exportCardData}>
                    <Download className="h-3 w-3 mr-1" />
                    Exportar
                  </Button>
                </div>
                
                <div className="font-mono text-sm bg-background/50 p-3 rounded overflow-x-auto">
                  {cardData.match(/.{1,2}/g)?.join(' ') || cardData}
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Dados em formato hexadecimal (32 caracteres = 16 bytes)
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum cartão detectado</p>
            <p className="text-sm">
              {status.scanning 
                ? 'Aproxime um cartão RFID do leitor' 
                : 'Ative o scanner para detectar cartões'
              }
            </p>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Instruções de Uso
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Certifique-se de que o ACR122U está conectado</li>
            <li>• Ative o scanner na aba "Dispositivo"</li>
            <li>• Aproxime o cartão RFID do leitor (distância: ~5cm)</li>
            <li>• Os dados serão detectados automaticamente</li>
            <li>• Use "Ler Dados" para obter informações do cartão</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}