import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, Lock, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-rfid-gradient opacity-10" />
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-muted/50 backdrop-blur-sm border rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-rfid-primary" />
              <span className="text-sm font-medium">Sistema de Autenticação RFID</span>
              <Badge className="bg-success">v2.0</Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Autenticação RFID
              <span className="block text-rfid-primary">Ultra Segura</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sistema avançado de autenticação por cartões RFID com criptografia AES-256 
              e proteção contra ataques cibernéticos. Conecte via USB e autentique em qualquer tela.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-rfid-gradient hover:opacity-90 text-white px-8 py-3">
                  <Shield className="h-5 w-5 mr-2" />
                  Acessar Sistema
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Lock className="h-5 w-5 mr-2" />
                Ver Documentação
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos de Segurança</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta para máxima proteção e facilidade de uso
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-border/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-rfid-gradient" />
              <CardHeader>
                <div className="w-12 h-12 bg-rfid-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-rfid-primary" />
                </div>
                <CardTitle>Criptografia AES-256</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Proteção militar com criptografia AES-256 para todos os dados RFID.
                  Impossível de quebrar com tecnologia atual.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Certificado ISO 27001</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-rfid-gradient" />
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Gestão de Cartões</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema completo para registrar, ativar e gerenciar cartões RFID 
                  com diferentes níveis de acesso.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Controle Total</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-rfid-gradient" />
              <CardHeader>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-warning" />
                </div>
                <CardTitle>Conectividade USB</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conexão direta via USB com qualquer computador. 
                  Funciona em qualquer tela de login aberta.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Plug & Play</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-rfid-gradient opacity-5" />
            <CardContent className="p-12 relative">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-rfid-primary mb-2">256-bit</div>
                  <p className="text-muted-foreground">Criptografia</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-success mb-2">99.9%</div>
                  <p className="text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-warning mb-2">&lt;1s</div>
                  <p className="text-muted-foreground">Tempo de Resposta</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-destructive mb-2">0</div>
                  <p className="text-muted-foreground">Brechas de Segurança</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Configure seu sistema de autenticação RFID em minutos e tenha segurança empresarial.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-rfid-gradient hover:opacity-90 text-white px-8 py-3">
              <Shield className="h-5 w-5 mr-2" />
              Configurar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
