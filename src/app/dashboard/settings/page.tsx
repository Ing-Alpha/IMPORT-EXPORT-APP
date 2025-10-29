'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, LogOut, Save } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Ici vous pourriez ajouter une API pour mettre à jour le profil
    setTimeout(() => {
      setMessage('Profil mis à jour avec succès')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et votre profil</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Informations du profil
          </CardTitle>
          <CardDescription>
            Modifiez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  defaultValue={session?.user?.name || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={session?.user?.email || ''}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Input
                id="role"
                defaultValue={session?.user?.role || 'USER'}
                disabled
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions du compte</CardTitle>
          <CardDescription>
            Gestion de votre compte utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Déconnexion</h3>
              <p className="text-sm text-gray-500">
                Déconnectez-vous de votre compte
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Changer le mot de passe</h3>
              <p className="text-sm text-gray-500">
                Modifiez votre mot de passe de connexion
              </p>
            </div>
            <Button variant="outline" disabled>
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l&apos;application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Version</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Dernière mise à jour</span>
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Environnement</span>
            <span className="text-sm font-medium">Développement</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
