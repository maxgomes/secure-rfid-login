import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RFIDDeviceStatus from "@/components/RFIDDeviceStatus";
import RFIDCardManager from "@/components/RFIDCardManager";
import RFIDCardDetector from "@/components/RFIDCardDetector";
import SecurityLogs from "@/components/SecurityLogs";
import SecuritySettings from "@/components/SecuritySettings";
import { Shield, CreditCard, Activity, Settings, Zap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rfid-gradient rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">RFID Auth System</h1>
                <p className="text-sm text-muted-foreground">
                  Sistema de Autenticação RFID Seguro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">Sistema Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="device" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="device" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Dispositivo</span>
            </TabsTrigger>
            <TabsTrigger value="detector" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Detector</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Cartões</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="device" className="space-y-6">
            <RFIDDeviceStatus />
          </TabsContent>

          <TabsContent value="detector" className="space-y-6">
            <RFIDCardDetector />
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <RFIDCardManager />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <SecurityLogs />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}