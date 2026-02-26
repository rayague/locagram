import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  FC,
  ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, signUp } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes

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
  return messages[code] || "Une erreur est survenue. Veuillez réessayer.";
}

export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: "admin" | "demarcheur";
  status: "active" | "inactive" | "pending" | "suspended" | "rejected";
  phone?: string;
  zone?: string;
  categories?: string[];
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  experience?: string;
  specialties?: string[];
  photoURL?: string;
  isAdmin?: boolean;
  isOwner?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  trialExpiresAt?: Date;
  subscriptionType?: string;
  cipNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Legacy compatibility
  firebaseUser: null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  signOut: () => void;
  updateUser: () => Promise<void>;
  LogoutDialog: React.FC;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  firebaseUser: null,
  isAdmin: false,
  isLoading: true,
  login: async () => {},
  register: async () => false,
  logout: async () => {},
  signOut: () => {},
  updateUser: async () => {},
  LogoutDialog: () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const auth = getAuth();
  const [, setLocation] = useLocation();

  // Inactivity timer
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (user) {
          toast({
            title: "Session expirée",
            description: "Vous avez été déconnecté pour inactivité.",
            variant: "destructive",
          });
          handleSignOut();
        }
      }, INACTIVITY_TIMEOUT);
    };
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((e) => document.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (!data.role || (data.role !== "admin" && data.role !== "demarcheur")) {
              setUser(null);
              setIsLoading(false);
              return;
            }
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: data.name || "",
              role: data.role,
              status: data.status || "active",
              phone: data.phone,
              zone: data.zone,
              categories: data.categories,
              company: data.company,
              address: data.address,
              city: data.city,
              country: data.country,
              bio: data.bio,
              website: data.website,
              linkedin: data.linkedin,
              experience: data.experience,
              specialties: data.specialties,
              photoURL: data.photoURL,
              isAdmin: data.isAdmin,
              isOwner: data.isOwner,
              createdAt: data.createdAt?.toDate(),
              lastLoginAt: data.lastLoginAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              trialExpiresAt: data.trialExpiresAt?.toDate(),
              subscriptionType: data.subscriptionType,
              cipNumber: data.cipNumber,
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("AuthProvider: Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        const currentPath = window.location.pathname;
        const protectedPaths = ["/dashboard", "/admin"];
        if (protectedPaths.some((p) => currentPath.startsWith(p)) && currentPath !== "/login") {
          setLocation("/login");
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth, setLocation]);

  const handleSignOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setShowLogoutDialog(false);
      setLocation("/login");
      toast({ title: "Déconnexion réussie", description: "Vous avez été déconnecté avec succès." });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({ title: "Erreur de déconnexion", description: "Une erreur est survenue.", variant: "destructive" });
    }
  }, [auth, setLocation]);

  const signOut = useCallback(() => setShowLogoutDialog(true), []);
  const logout = useCallback(async () => handleSignOut(), [handleSignOut]);

  const LogoutDialog: FC = () => (
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white">
            Se déconnecter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        await firebaseSignOut(auth);
        throw new Error("Compte utilisateur non trouvé");
      }
      const data = userDoc.data();
      if (!data.role || (data.role !== "admin" && data.role !== "demarcheur")) {
        await firebaseSignOut(auth);
        throw new Error("Rôle utilisateur invalide");
      }
      if (data.status === "suspended") { await firebaseSignOut(auth); throw new Error("Votre compte a été suspendu. Veuillez contacter le support."); }
      if (data.status === "inactive") { await firebaseSignOut(auth); throw new Error("Votre compte est inactif. Veuillez contacter le support."); }
      if (data.status === "pending") { await firebaseSignOut(auth); throw new Error("Votre compte est en attente de validation par l'administrateur."); }
      if (data.status === "rejected") { await firebaseSignOut(auth); throw new Error("Votre demande d'inscription a été refusée. Contactez l'administrateur."); }
      setUser({
        id: userCredential.user.uid, uid: userCredential.user.uid,
        email: userCredential.user.email || "", name: data.name || "",
        role: data.role, status: data.status,
        phone: data.phone, zone: data.zone, categories: data.categories,
        company: data.company, address: data.address, city: data.city, country: data.country,
        bio: data.bio, website: data.website, linkedin: data.linkedin,
        experience: data.experience, specialties: data.specialties, photoURL: data.photoURL,
        isAdmin: data.isAdmin, isOwner: data.isOwner,
        createdAt: data.createdAt?.toDate(), lastLoginAt: data.lastLoginAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(), trialExpiresAt: data.trialExpiresAt?.toDate(),
        subscriptionType: data.subscriptionType, cipNumber: data.cipNumber,
      });
      setLocation(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (error: unknown) {
      throw error instanceof Error ? error : new Error(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await signUp(email, password, userData as Record<string, unknown>);
      if (userCredential.user) {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({ id: userCredential.user.uid, uid: userCredential.user.uid, email: userCredential.user.email || "", name: data.name || "", role: data.role || "demarcheur", status: data.status || "pending", ...data } as User);
        }
      }
      return true;
    } catch (error: unknown) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (): Promise<void> => {
    if (!user) return;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUser({ ...user, ...data, id: user.uid, uid: user.uid, createdAt: data.createdAt?.toDate(), lastLoginAt: data.lastLoginAt?.toDate(), updatedAt: data.updatedAt?.toDate(), trialExpiresAt: data.trialExpiresAt?.toDate() });
    }
  };

  const value: AuthContextType = {
    user, loading: isLoading, firebaseUser: null,
    isAdmin: user?.role === "admin", isLoading,
    login, register, logout, signOut, updateUser, LogoutDialog,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
