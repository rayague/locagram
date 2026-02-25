import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth, type User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  Shield,
  Briefcase,
  Globe,
  Tag,
  Plus,
  X,
  Edit2,
  Check,
  X as XIcon,
  Linkedin,
  Globe as GlobeIcon,
  Map,
  Home,
  Briefcase as BriefcaseIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const categories = [
  { id: "auberge", name: "Auberge", icon: Building },
  { id: "maison", name: "Maison à louer", icon: Building },
  { id: "manoir", name: "Manoir", icon: Building },
  { id: "atelier", name: "Atelier", icon: Building },
  { id: "villa", name: "Villa", icon: Building },
  { id: "chalet", name: "Chalet", icon: Building },
  { id: "loft", name: "Loft", icon: Building },
  { id: "studio", name: "Studio", icon: Building },
  { id: "pavillon", name: "Pavillon", icon: Building },
  { id: "mobilhome", name: "Mobil-home", icon: Building },
  { id: "appartement-meuble", name: "Appartement meublé", icon: Building },
  { id: "duplex", name: "Duplex", icon: Building },
  { id: "penthouse", name: "Penthouse", icon: Building },
  { id: "chambre-hotel", name: "Chambre d'hôtel", icon: Building },
  { id: "loft-industriel", name: "Loft industriel", icon: Building },
  { id: "caravane", name: "Caravane", icon: Building },
  { id: "hotel-ville", name: "Hôtel de ville", icon: Building },
  { id: "parcelle-vendre", name: "Parcelle à vendre", icon: Building },
  { id: "residence-etudiante", name: "Résidence étudiante", icon: Building },
  { id: "famille-accueil", name: "Famille d'accueil", icon: Building },
  { id: "colocation", name: "Colocation", icon: Building },
  {
    id: "internat-universitaire",
    name: "Internat universitaire",
    icon: Building,
  },
  { id: "boutique", name: "Boutique", icon: Building },
  { id: "bureau", name: "Bureau", icon: Building },
  { id: "hangar", name: "Hangar", icon: Building },
  { id: "entrepot", name: "Entrepôt", icon: Building },
  { id: "terrain-agricole", name: "Terrain agricole", icon: Building },
  { id: "salle-reception", name: "Salle de réception", icon: Building },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    zone: user?.zone || "",
    categories: user?.categories || [],
    company: user?.company || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    bio: user?.bio || "",
    website: user?.website || "",
    linkedin: user?.linkedin || "",
    experience: user?.experience || "",
    specialties: user?.specialties || [],
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (!user?.uid) {
        throw new Error(
          "Vous devez être connecté pour mettre à jour votre profil"
        );
      }

      // Mettre à jour le profil dans Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      // Mettre à jour le contexte d'authentification
      await updateUser({
        ...user,
        ...formData,
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const currentCategories = prev.categories || [];
      const newCategories = currentCategories.includes(categoryId)
        ? currentCategories.filter((id) => id !== categoryId)
        : [...currentCategories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const selectedCategories = categories.filter((cat) =>
    formData.categories?.includes(cat.id)
  );

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error(
          "Vous devez être connecté pour changer votre mot de passe"
        );
      }

      // Réauthentifier l'utilisateur
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Mettre à jour le mot de passe
      await updatePassword(user, passwordData.newPassword);

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès",
      });

      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast({
        title: "Erreur",
        description:
          error.message ||
          "Impossible de changer le mot de passe. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Mon Profil
            </h2>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "gap-2",
              isEditing
                ? "hover:bg-red-50 hover:text-red-600"
                : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            )}
          >
            {isEditing ? (
              <>
                <XIcon className="h-4 w-4" />
                Annuler
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Modifier le profil
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-green-600" />
                Informations de base
              </CardTitle>
              <CardDescription>
                Vos informations personnelles principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Votre nom"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="votre@email.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">À propos</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                  placeholder="Présentez-vous en quelques mots..."
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Informations de contact
              </CardTitle>
              <CardDescription>
                Vos coordonnées et réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="+237 XXX XXX XXX"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <div className="relative">
                    <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="https://votre-site.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="https://linkedin.com/in/votre-profil"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-600" />
                Adresse
              </CardTitle>
              <CardDescription>Votre adresse professionnelle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Votre adresse"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Votre ville"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Votre pays"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone d'activité</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="zone"
                      value={formData.zone}
                      onChange={(e) =>
                        setFormData({ ...formData, zone: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Votre zone d'activité"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations professionnelles */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5 text-green-600" />
                Informations professionnelles
              </CardTitle>
              <CardDescription>
                Vos informations professionnelles et expérience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Nom de votre entreprise"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                      placeholder="Nombre d'années d'expérience"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Catégories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Catégories d'activité</Label>
                  {isEditing && (
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez vos catégories
                    </p>
                  )}
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => {
                      const isSelected = formData.categories?.includes(
                        category.id
                      );
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
                            isSelected
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "border-border hover:border-green-200 hover:bg-green-50/50",
                            "hover-lift ripple-effect"
                          )}
                        >
                          <category.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 ml-auto text-green-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.length > 0 ? (
                      selectedCategories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <category.icon className="h-3 w-3 mr-1" />
                          {category.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Aucune catégorie sélectionnée
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez votre mot de passe et vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Changer le mot de passe"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white ripple-effect hover-glow transition-all-smooth"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
