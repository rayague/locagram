import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { useLocation } from "wouter";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  isAdmin: false,
  isLoading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  const logout = async () => {
    try {
      await auth.signOut();
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log("AuthProvider: Auth state changed", firebaseUser?.email || "No user");
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Vérifier si l'utilisateur est un admin et construire l'objet User
        try {
          const token = await firebaseUser.getIdTokenResult();
          const isUserAdmin = !!token.claims.admin;
          setIsAdmin(isUserAdmin);

          // Construire l'objet User avec la propriété role
          const appUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Utilisateur',
            role: isUserAdmin ? 'admin' : 'demarcheur'
          };
          setUser(appUser);

          // Redirection si sur page de login
          const currentPath = window.location.pathname;
          if (currentPath === "/login" || currentPath === "/") {
            const targetPath = isUserAdmin ? "/admin/users" : "/dashboard";
            setLocation(targetPath);
          }
        } catch (error) {
          console.error("Error getting token:", error);
          setIsAdmin(false);
          setUser(null);
        }
      } else {
        setIsAdmin(false);
        setUser(null);
        // Redirection vers login si pas connecté et sur page protégée
        const currentPath = window.location.pathname;
        const protectedPaths = ["/dashboard", "/admin"];
        const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
        
        if (isProtectedPath && currentPath !== "/login") {
          setLocation("/login");
        }
      }

      setIsLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth state listener");
      unsubscribe();
    };
  }, [setLocation]);

  return (
    <AuthContext.Provider value={{ firebaseUser, user, isAdmin, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
