import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, UserCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileButton = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    // Mobile view - compact buttons
    if (isMobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <UserCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/login')}>
              Log in
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/signup')}>
              Sign up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    // Desktop view - regular buttons
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/login')}
        >
          Log in
        </Button>
        <Button 
          size="sm"
          onClick={() => navigate('/signup')}
        >
          Sign up
        </Button>
      </div>
    );
  }

  // Generate avatar url for email-password users if not available
  const avatarUrl = user?.avatar || user?.avatar_url || 
    (user?.email ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` : null);
  
  const userInitials = user?.name?.substring(0, 2).toUpperCase() || 'U';

  // Authenticated user view (same for mobile and desktop)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={user.name} />
            ) : (
              <AvatarFallback>
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            {user?.provider && (
              <p className="text-xs leading-none text-muted-foreground mt-1">
                Via {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
