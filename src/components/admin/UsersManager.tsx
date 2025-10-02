import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, User as UserIcon, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

const UsersManager = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Form state for new user
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
    role: "admin" as 'admin' | 'superadmin',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin-users-list.php', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/admin-users-create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully",
        });
        setIsCreateDialogOpen(false);
        setNewUser({ email: "", name: "", password: "", role: "admin" });
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin-users-update.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: userId,
          is_active: !currentStatus,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        });
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading admin users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Admin Users</CardTitle>
              <CardDescription className="text-white/70">
                Manage admin access and permissions
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-electric-blue/20 rounded-full">
                        {user.role === 'superadmin' ? (
                          <Shield className="h-6 w-6 text-electric-blue" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-white/70" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold">{user.name}</h3>
                          {user.role === 'superadmin' && (
                            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/50">
                              Superadmin
                            </Badge>
                          )}
                          {user.is_active ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/60 text-sm">{user.email}</p>
                        <p className="text-white/40 text-xs mt-1">
                          Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-deep-purple border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Admin User</DialogTitle>
            <DialogDescription className="text-white/70">
              Add a new administrator with @elektr-ame.com email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@elektr-ame.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: 'admin' | 'superadmin') => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isCreating}
              className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
            >
              {isCreating ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManager;

