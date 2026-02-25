import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/lib/auth";
import { auth, db } from "@/lib/firebase";
import { useLocation } from "wouter";

// Map Firebase error codes to French user-friendly messages
export function getFirebaseErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Cette adresse email est déjà utilisée",
    "auth/invalid-email": "Adresse email invalide",
    "auth/user-not-found": "Aucun compte associé à cet email",
    "auth/wrong-password": "Mot de passe incorrect",
    "auth/invalid-credential": "Email ou mot de passe incorrect",
    "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères",
    "auth/network-request-failed":
      "Problème de connexion réseau. Vérifiez votre connexion internet",
    "auth/too-many-requests":
      "Trop de tentatives échouées. Veuillez réessayer plus tard",
    "auth/user-disabled": "Ce compte a été désactivé",
    "auth/operation-not-allowed": "Opération non autorisée",
    "auth/requires-recent-login":
      "Veuillez vous reconnecter pour effectuer cette opération",
    "auth/popup-closed-by-user": "Connexion annulée",
  };
  return (
    messages[code] ||
    (error instanceof Error ? error.message : "Une erreur est survenue")
  );
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  isAdmin: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  const login = async (email: string, password: string): Promise<boolean> => {
    // Step 1: Firebase authentication
    let credential;
    try {
      credential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error));
    }

    // Step 2: Check user status in Firestore before allowing access
    try {
      const userSnap = await getDoc(doc(db, "users", credential.user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.status === "pending") {
          await signOut(auth);
          throw new Error(
            "Votre compte est en attente de validation par l'administrateur. Vous serez notifié par email."
          );
        }
        if (data.status === "rejected") {
          await signOut(auth);
          throw new Error(
            "Votre demande d'inscription a été refusée. Contactez l'administrateur pour plus d'informations."
          );
        }
        if (data.status === "suspended") {
          await signOut(auth);
          throw new Error(
            "Votre compte a été suspendu. Contactez l'administrateur."
          );
        }
      }
    } catch (error) {
      // Re-throw our domain errors directly
      if (
        error instanceof Error &&
        (error.message.includes("attente") ||
          error.message.includes("refusée") ||
          error.message.includes("suspendu"))
      ) {
        throw error;
      }
      // Firestore read failure — fail open (let the user in, onAuthStateChanged will handle state)
      console.warn("Could not check user status in Firestore:", error);
    }

    return true;
  };

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

          // Redirection si sur page de login ou register
          const currentPath = window.location.pathname;
          if (
            currentPath === "/login" ||
            currentPath === "/auth/login" ||
            currentPath === "/"
          ) {
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
    <AuthContext.Provider value={{ firebaseUser, user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
