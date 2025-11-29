import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LLMConfigTab from './LLMConfigTab';
import ProxyConfigTab from './ProxyConfigTab';
import AdvancedTab from './AdvancedTab';

const Settings = () => {


  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Configure application preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="llm" className="w-full" >
          <TabsList className="grid w-full grid-cols-3 w-[]">
            <TabsTrigger value="llm">LLM Config</TabsTrigger>
            <TabsTrigger value="proxy">Proxy</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>


          <TabsContent value="llm" className="space-y-4">
            <LLMConfigTab />
          </TabsContent>

          <TabsContent value="proxy" className="space-y-4">
            <ProxyConfigTab />
          </TabsContent>

   


          <TabsContent value="advanced">
            <AdvancedTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Settings;
