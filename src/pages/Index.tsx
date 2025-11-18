import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

type Role = "patient" | "doctor" | "admin" | "director" | "nurse" | "support" | "project_admin";

interface RoleConfig {
  name: string;
  icon: string;
  color: string;
}

interface User {
  email: string;
  fullName: string;
  roles: Role[];
  activeRole: Role;
}

const roles: Record<Role, RoleConfig> = {
  patient: { name: "Пациент", icon: "User", color: "bg-blue-500" },
  doctor: { name: "Врач", icon: "Stethoscope", color: "bg-green-500" },
  admin: { name: "Администратор", icon: "Settings", color: "bg-purple-500" },
  director: { name: "Директор", icon: "Briefcase", color: "bg-orange-500" },
  nurse: { name: "Медсестра", icon: "Heart", color: "bg-pink-500" },
  support: { name: "Техподдержка", icon: "Wrench", color: "bg-gray-500" },
  project_admin: { name: "Администратор проекта", icon: "Shield", color: "bg-red-500" }
};

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('https://functions.poehali.dev/3e32cfd0-383e-4c3c-8acf-94461bb4feef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Ошибка входа');
        return;
      }
      
      setUser(data.user);
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      setUser({ ...user, activeRole: newRole });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Activity" size={40} className="text-primary" />
              <h1 className="text-3xl font-bold text-foreground">DentalCRM</h1>
            </div>
            <p className="text-muted-foreground">Вход в систему</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={!email || !password || isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const activeRoleConfig = roles[user.activeRole];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Activity" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold">DentalCRM</h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <div className={`${activeRoleConfig.color} p-1.5 rounded-full`}>
                    <Icon name={activeRoleConfig.icon} size={16} className="text-white" />
                  </div>
                  {activeRoleConfig.name}
                  <Icon name="ChevronDown" size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user.roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => switchRole(role)}
                    className="gap-2 cursor-pointer"
                  >
                    <div className={`${roles[role].color} p-1.5 rounded-full`}>
                      <Icon name={roles[role].icon} size={14} className="text-white" />
                    </div>
                    {roles[role].name}
                    {role === user.activeRole && (
                      <Icon name="Check" size={16} className="ml-auto text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Добро пожаловать, {user.fullName}!</h2>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Активная роль:</span>
            <Badge className={`${activeRoleConfig.color} text-white`}>
              {activeRoleConfig.name}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Icon name="Calendar" size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Расписание</h3>
            </div>
            <p className="text-muted-foreground text-sm">Просмотр и управление записями</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Icon name="Users" size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Пациенты</h3>
            </div>
            <p className="text-muted-foreground text-sm">База данных пациентов</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Icon name="FileText" size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Документы</h3>
            </div>
            <p className="text-muted-foreground text-sm">Медицинские карты и отчеты</p>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h3 className="font-semibold text-lg mb-4">Ваши роли в системе</h3>
          <div className="flex flex-wrap gap-3">
            {user.roles.map((role) => (
              <div
                key={role}
                className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg"
              >
                <div className={`${roles[role].color} p-2 rounded-full`}>
                  <Icon name={roles[role].icon} size={18} className="text-white" />
                </div>
                <span className="font-medium">{roles[role].name}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;