import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { User } from '@/types/user';
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

const plans = [
  {
    id: 'trial',
    name: "Essai",
    description: "Idéal pour commencer",
    price: 0,
    duration: "2 mois",
    features: [
      "5 annonces maximum",
      "Visibilité standard",
      "Support par email",
    ],
    isPopular: false,
    buttonText: "Actif",
  },
  {
    id: 'basic',
    name: "Basic",
    description: "Pour les démarcheurs occasionnels",
    price: 1000,
    duration: "Par mois",
    features: [
      "10 annonces maximum",
      "Visibilité améliorée",
      "Support par email",
      "Statistiques détaillées",
    ],
    isPopular: true,
    buttonText: "Choisir ce forfait",
  },
  {
    id: 'premium',
    name: "Premium",
    description: "Pour les professionnels",
    price: 5000,
    duration: "Par mois",
    features: [
      "Annonces illimitées",
      "Visibilité maximale",
      "Support prioritaire",
      "Statistiques avancées",
      "Badge vérifié",
      "Annonces en tête de liste",
    ],
    isPopular: false,
    buttonText: "Choisir ce forfait",
  },
];

const Subscription = () => {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer les données utilisateur depuis Firestore
  useEffect(() => {
    if (!authUser?.uid) return;

    const userRef = doc(db, "users", authUser.uid);
    const unsubscribe = onSnapshot(userRef, 
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as User);
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de votre compte",
          variant: "destructive"
        });
      }
    );

    return () => unsubscribe();
  }, [authUser]);

  const daysLeft = () => {
    if (!userData?.subscriptionEnd) return 0;
    const today = new Date();
    const endDate = new Date(userData.subscriptionEnd);
    const diffTime = Math.abs(endDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === 'trial') {
      return; // Already on trial plan
    }
    setSelectedPlan(planId);
    setShowConfirmation(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan || !authUser?.uid || !userData) {
      console.error("Données manquantes:", { 
        selectedPlan, 
        userId: authUser?.uid, 
        userData: !!userData 
      });
      toast({
        title: "Erreur",
        description: "Données utilisateur incomplètes. Veuillez rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Début de la création de la demande de souscription");
      console.log("Données utilisateur:", {
        userId: authUser.uid,
        userEmail: userData.email,
        userName: userData.name,
        plan: selectedPlan
      });

      // Vérifier si une demande en attente existe déjà
      const subscriptionRequestsRef = collection(db, "subscriptionRequests");
      const subscriptionRequest = {
        userId: authUser.uid,
        userEmail: userData.email,
        userName: userData.name,
        plan: selectedPlan,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        paymentStatus: 'pending',
        amount: plans.find(p => p.id === selectedPlan)?.price || 0,
        userPhone: userData.phone || '',
        userZone: userData.zone || '',
        userCountry: userData.country || '',
      };

      console.log("Tentative d'ajout de la demande:", subscriptionRequest);

      // Ajouter la demande
      const docRef = await addDoc(subscriptionRequestsRef, subscriptionRequest);
      console.log("Demande créée avec succès, ID:", docRef.id);

      toast({
        title: "Demande envoyée",
        description: "Votre demande de souscription a été enregistrée. Un administrateur la traitera dans les plus brefs délais.",
      });

      setShowConfirmation(false);
      setSelectedPlan(null);
    } catch (error: any) {
      console.error("Erreur détaillée lors de la création de la demande:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      let errorMessage = "Une erreur est survenue lors de l'enregistrement de votre demande.";
      
      // Messages d'erreur plus spécifiques
      if (error.code === 'permission-denied') {
        errorMessage = "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
      } else if (error.code === 'unavailable') {
        errorMessage = "Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.";
      } else if (error.code === 'already-exists') {
        errorMessage = "Une demande de souscription est déjà en cours de traitement pour votre compte.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Forfaits</h2>
          <p className="text-muted-foreground">
            Choisissez le forfait qui correspond à vos besoins
          </p>
        </div>

        {/* Current Subscription Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mon abonnement actuel</CardTitle>
            <CardDescription>
              Détails de votre abonnement en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-medium text-lg">Forfait Essai</h3>
                <p className="text-sm text-muted-foreground">
                  Votre période d'essai se termine dans {daysLeft()} jours.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Actif
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isPlanActive = (plan.id === 'trial' && daysLeft() > 0);
            
            return (
              <Card 
                key={plan.id} 
                className={`flex flex-col ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 transform translate-x-2 -translate-y-2">
                    <span className="bg-primary text-white text-xs px-3 py-1 rounded-full uppercase font-bold">
                      Populaire
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price} FCFA</span>
                    <span className="text-muted-foreground ml-1">{plan.duration}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={isPlanActive ? "outline" : plan.isPopular ? "default" : "outline"}
                    disabled={isPlanActive}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isPlanActive ? "Actif" : plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de paiement</CardTitle>
            <CardDescription>
              Comment fonctionne le paiement des forfaits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Moyens de paiement acceptés</h3>
              <p className="text-sm text-muted-foreground">
                Actuellement, nous acceptons les paiements par Mobile Money (Orange Money, MTN Mobile Money) et en espèces à nos bureaux.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Procédure de paiement</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Sélectionnez votre forfait préféré</li>
                <li>Effectuez le paiement via Mobile Money au numéro: +237 6XX XXX XXX (Référence: votre email)</li>
                <li>Contactez notre service client pour confirmer votre paiement</li>
                <li>Votre forfait sera activé dans les 24h après confirmation</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Besoin d'aide?</h3>
              <p className="text-sm text-muted-foreground">
                Notre équipe est disponible pour vous aider. Contactez-nous à support@demarcheur-hub.com ou appelez au +237 6XX XXX XXX.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer votre choix</AlertDialogTitle>
              <AlertDialogDescription>
                Vous êtes sur le point de souscrire au forfait {plans.find(p => p.id === selectedPlan)?.name}.
                Un administrateur validera votre demande après réception du paiement.
                Voulez-vous continuer ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmSubscription}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Envoi en cours..." : "Confirmer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
