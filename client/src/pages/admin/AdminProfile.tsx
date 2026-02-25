import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth, type User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, User as UserIcon, Mail, Phone, MapPin, Building, Save, Shield, Briefcase, Globe, Tag, Plus, X, Edit2, Check, X as XIcon, Camera, Linkedin, Globe as GlobeIcon, Map, Home, Briefcase as BriefcaseIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const CATEGORIES = [
  "Immobilier",
  "Automobile",
  "Électronique",
  "Mode",
  "Services",
  "Alimentation",
  "Santé",
  "Éducation",
  "Loisirs",
  "Autres"
];

const ZONES = [
  "Cotonou",
  "Porto-Novo",
  "Parakou",
  "Abomey-Calavi",
  "Natitingou",
  "Djougou",
  "Lokossa",
  "Ouidah",
  "Tous"
];

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    zone: user?.zone || '',
    categories: user?.categories || [],
    company: user?.company || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    experience: user?.experience || '',
    specialties: user?.specialties || [],
  });
  const [newCategory, setNewCategory] = useState('');
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      await updateUser();

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Chargement du profil...</h2>
            <p className="mt-2 text-gray-600">Veuillez patienter pendant le chargement de vos informations.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {/* En-tête du profil */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profil Administrateur</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos informations personnelles et professionnelles
              </p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "gap-2",
                isEditing ? "hover:bg-red-50 hover:text-red-600" : "bg-primary hover:bg-primary/90"
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
            {/* Photo de profil et informations de base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Informations de base
                </CardTitle>
                <CardDescription>
                  Vos informations personnelles principales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background shadow-md hover:bg-primary/10"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 flex-1 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-9"
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
                          value={formData.email || ''}
                          className="pl-9 bg-muted"
                          placeholder="votre@email.com"
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">À propos</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Présentez-vous en quelques mots..."
                    disabled={!isEditing}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  Informations de contact
                </CardTitle>
                <CardDescription>
                  Vos coordonnées et réseaux sociaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-9"
                        placeholder="+229 XX XX XX XX"
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
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="pl-9"
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
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="pl-9"
                        placeholder="https://linkedin.com/in/votre-profil"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations professionnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BriefcaseIcon className="h-5 w-5 text-primary" />
                  Informations professionnelles
                </CardTitle>
                <CardDescription>
                  Vos informations professionnelles et expérience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="pl-9"
                        placeholder="Nom de votre entreprise"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Expérience</Label>
                    <div className="relative">
                      <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="pl-9"
                        placeholder="Années d'expérience"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Spécialités</Label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.specialties || []).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {specialty}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecialties = [...(formData.specialties || [])];
                              newSpecialties.splice(index, 1);
                              setFormData({ ...formData, specialties: newSpecialties });
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          const specialty = prompt("Ajouter une spécialité");
                          if (specialty) {
                            setFormData({
                              ...formData,
                              specialties: [...(formData.specialties || []), specialty],
                            });
                          }
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Ajouter
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catégories et Zones card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5 text-primary" />
                  Catégories et Zones
                </CardTitle>
                <CardDescription>
                  Gérez vos catégories d'intervention et zones géographiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Catégories</Label>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => setOpenCategoryDialog(true)}
                        >
                          <Plus className="h-3 w-3" />
                          Modifier les catégories
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.categories || []).map((category, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {category}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {
                                const newCategories = [...(formData.categories || [])];
                                newCategories.splice(index, 1);
                                setFormData({ ...formData, categories: newCategories });
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zone">Zone d'intervention</Label>
                    <Select
                      value={formData.zone}
                      onValueChange={(value) => setFormData({ ...formData, zone: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {ZONES.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nouvelle carte pour les informations administratives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Informations Administratives
                </CardTitle>
                <CardDescription>
                  Informations spécifiques à votre rôle d'administrateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cipNumber">Numéro CIP</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cipNumber"
                        value={formData.cipNumber || ''}
                        onChange={(e) => setFormData({ ...formData, cipNumber: e.target.value })}
                        className="pl-9"
                        placeholder="Numéro CIP"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionType">Type d'abonnement</Label>
                    <div className="relative">
                      <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="subscriptionType"
                        value={formData.subscriptionType || 'admin'}
                        className="pl-9 bg-muted"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Statut du compte</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {formData.status === 'active' ? 'Actif' : formData.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Dernière connexion: {formData.lastLoginAt ? new Date(formData.lastLoginAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dialog de sélection des catégories */}
            <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Modifier les catégories</DialogTitle>
                  <DialogDescription>
                    Sélectionnez les catégories qui vous intéressent
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={formData.categories?.includes(category)}
                          onCheckedChange={(checked) => {
                            const newCategories = [...(formData.categories || [])];
                            if (checked) {
                              if (!newCategories.includes(category)) {
                                newCategories.push(category);
                              }
                            } else {
                              const index = newCategories.indexOf(category);
                              if (index > -1) {
                                newCategories.splice(index, 1);
                              }
                            }
                            setFormData({ ...formData, categories: newCategories });
                          }}
                        />
                        <label
                          htmlFor={category}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => setOpenCategoryDialog(false)}>
                    Terminé
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isEditing && (
              <div className="flex justify-end gap-4 sticky bottom-0 bg-background py-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
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
      </div>
    </AdminLayout>
  );
};

export default AdminProfile; 