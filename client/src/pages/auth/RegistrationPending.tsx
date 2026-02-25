import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const RegistrationPending = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Inscription en attente</CardTitle>
          <CardDescription>
            Votre compte a été créé et est en attente de validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600">
              Un administrateur va examiner votre demande d'inscription. Vous recevrez un email dès que votre compte sera validé.
            </p>
            <p className="font-medium text-gray-700 mt-4">
              Merci de votre patience!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Retour à la page de connexion
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Des questions? Contactez-nous à support@demarcheur-hub.com
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationPending;
