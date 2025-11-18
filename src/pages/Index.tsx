import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

type Role = "patient" | "doctor" | "admin" | "director" | "nurse" | "support" | "project_admin";

interface RoleConfig {
  name: string;
  icon: string;
  color: string;
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!selectedRole || !email || !password) return;
    console.log("Login:", { role: selectedRole, email });
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Activity" size={40} className="text-primary" />
              <h1 className="text-4xl font-bold text-foreground">DentalCRM</h1>
            </div>
            <p className="text-muted-foreground text-lg">Выберите роль для входа</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(roles) as Role[]).map((role) => (
              <Card
                key={role}
                className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`${roles[role].color} p-4 rounded-full`}>
                    <Icon name={roles[role].icon} size={32} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{roles[role].name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <button
          onClick={() => setSelectedRole(null)}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          Назад
        </button>

        <div className="text-center mb-8">
          <div className={`${roles[selectedRole].color} p-4 rounded-full inline-block mb-4`}>
            <Icon name={roles[selectedRole].icon} size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Вход для {roles[selectedRole].name}</h2>
          <p className="text-muted-foreground">Введите данные для входа</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
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
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={!email || !password}
          >
            Войти
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
