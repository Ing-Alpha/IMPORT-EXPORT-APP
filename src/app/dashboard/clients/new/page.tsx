'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewClientPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    address: '',
    country: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard/clients')
      } else {
        const data = await response.json()
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau client</h1>
          <p className="text-gray-600">Ajoutez un nouveau client à votre base de données</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du client</CardTitle>
          <CardDescription>
            Remplissez les informations nécessaires pour créer un nouveau client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Société</Label>
                <Input
                  id="company"
                  placeholder="Entreprise SARL"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Textarea
                id="address"
                placeholder="123 Rue de la Paix, 75001 Paris"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Pays *</Label>
                <Input
                  id="country"
                  placeholder="France"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Informations supplémentaires..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/clients">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Création...' : 'Créer le client'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
