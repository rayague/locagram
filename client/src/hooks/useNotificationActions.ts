import { useNotifications, NotificationType } from '@/contexts/NotificationContext';

export const useNotificationActions = () => {
  const { createNotification } = useNotifications();

  const notifyUserRegistration = (userId: string, userName: string) => {
    createNotification({
      type: 'user_registered',
      title: 'Nouvelle inscription',
      message: `${userName} s'est inscrit sur la plateforme`,
      userId,
      userName
    });
  };

  const notifyUserUpdate = (userId: string, userName: string, changes: string[]) => {
    createNotification({
      type: 'user_updated',
      title: 'Mise à jour utilisateur',
      message: `${userName} a mis à jour son profil (${changes.join(', ')})`,
      userId,
      userName
    });
  };

  const notifyUserStatusChange = (userId: string, userName: string, newStatus: string) => {
    createNotification({
      type: 'user_status_changed',
      title: 'Changement de statut utilisateur',
      message: `Le statut de ${userName} a été changé en "${newStatus}"`,
      userId,
      userName
    });
  };

  const notifyListingCreation = (listingId: string, listingTitle: string, userId: string, userName: string) => {
    createNotification({
      type: 'listing_created',
      title: 'Nouvelle annonce',
      message: `${userName} a créé une nouvelle annonce : "${listingTitle}"`,
      listingId,
      listingTitle,
      userId,
      userName
    });
  };

  const notifyListingUpdate = (listingId: string, listingTitle: string, userId: string, userName: string, changes: string[]) => {
    createNotification({
      type: 'listing_updated',
      title: 'Mise à jour d\'annonce',
      message: `${userName} a mis à jour l'annonce "${listingTitle}" (${changes.join(', ')})`,
      listingId,
      listingTitle,
      userId,
      userName
    });
  };

  const notifyListingDeletion = (listingId: string, listingTitle: string, userId: string, userName: string) => {
    createNotification({
      type: 'listing_deleted',
      title: 'Suppression d\'annonce',
      message: `${userName} a supprimé l'annonce "${listingTitle}"`,
      listingId,
      listingTitle,
      userId,
      userName
    });
  };

  const notifyListingStatusChange = (listingId: string, listingTitle: string, userId: string, userName: string, newStatus: string) => {
    createNotification({
      type: 'listing_status_changed',
      title: 'Changement de statut d\'annonce',
      message: `Le statut de l'annonce "${listingTitle}" a été changé en "${newStatus}"`,
      listingId,
      listingTitle,
      userId,
      userName
    });
  };

  const notifySubscriptionCreation = (userId: string, userName: string, subscriptionType: string) => {
    createNotification({
      type: 'subscription_created',
      title: 'Nouvel abonnement',
      message: `${userName} a souscrit à l'abonnement "${subscriptionType}"`,
      userId,
      userName,
      data: { subscriptionType }
    });
  };

  const notifySubscriptionUpdate = (userId: string, userName: string, oldType: string, newType: string) => {
    createNotification({
      type: 'subscription_updated',
      title: 'Mise à jour d\'abonnement',
      message: `${userName} a changé son abonnement de "${oldType}" à "${newType}"`,
      userId,
      userName,
      data: { oldType, newType }
    });
  };

  const notifySubscriptionExpiration = (userId: string, userName: string, subscriptionType: string) => {
    createNotification({
      type: 'subscription_expired',
      title: 'Expiration d\'abonnement',
      message: `L'abonnement "${subscriptionType}" de ${userName} a expiré`,
      userId,
      userName,
      data: { subscriptionType }
    });
  };

  return {
    notifyUserRegistration,
    notifyUserUpdate,
    notifyUserStatusChange,
    notifyListingCreation,
    notifyListingUpdate,
    notifyListingDeletion,
    notifyListingStatusChange,
    notifySubscriptionCreation,
    notifySubscriptionUpdate,
    notifySubscriptionExpiration
  };
}; 