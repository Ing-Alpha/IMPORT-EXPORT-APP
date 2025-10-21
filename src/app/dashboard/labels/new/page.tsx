'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Package, User, MapPin, Phone, Weight, Ruler } from 'lucide-react'

interface Client {
  id: string
  name: string
  company?: string
  address: string
  country: string
  phone?: string
  email?: string
}

interface Package {
  description: string
  weight: number
  length: number
  width: number
  height: number
  value?: number
  contents: string
}

export default function NewLabelPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [formData, setFormData] = useState({
    clientId: '',
    senderName: 'Import-Export Marseille SARL',
    senderCity: 'Marseille',
    senderPhone: '+33760248507',
    recipientName: '',
    recipientCity: '',
    recipientPhone: '',
    destination: '',
    weight: '1.0',
    length: '30',
    width: '20',
    height: '10',
    serviceCode: '1049.00',
    serviceType: 'Sous 1 semaine | Colisso',
    cost: ''
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        console.log('Clients reçus:', data)
        console.log('Type de data:', typeof data, 'Est un array:', Array.isArray(data))
        
        // L'API retourne { clients: [...], count: number }
        const clientsArray = data.clients || data
        setClients(Array.isArray(clientsArray) ? clientsArray : [])
      } else {
        console.error('Erreur de réponse:', response.status)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight) || 1.0,
          length: parseInt(formData.length) || 30,
          width: parseInt(formData.width) || 20,
          height: parseInt(formData.height) || 10,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          packages: packages
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Résultat de création:', result)
        // L'API retourne directement l'étiquette ou dans result.label
        const labelId = result.id || result.label?.id
        if (labelId) {
          router.push(`/dashboard/labels/${labelId}`)
        } else {
          console.error('ID de l\'étiquette non trouvé dans la réponse:', result)
          alert('Étiquette créée mais impossible de rediriger')
        }
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'étiquette:', error)
      alert('Erreur lors de la création de l\'étiquette')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addPackage = () => {
    setPackages(prev => [...prev, {
      description: '',
      weight: 1.0,
      length: 30,
      width: 20,
      height: 10,
      value: undefined,
      contents: ''
    }])
  }

  const removePackage = (index: number) => {
    setPackages(prev => prev.filter((_, i) => i !== index))
  }

  const updatePackage = (index: number, field: keyof Package, value: string | number) => {
    setPackages(prev => prev.map((pkg, i) => 
      i === index ? { ...pkg, [field]: value } : pkg
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle étiquette</h1>
        <p className="text-gray-600">Créer une nouvelle étiquette d'expédition</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Client
            </CardTitle>
            <CardDescription>
              Sélectionnez le client pour cette expédition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(clients) && clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.company && `(${client.company})`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-clients" disabled>
                        Aucun client disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations expéditeur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Expéditeur
            </CardTitle>
            <CardDescription>
              Informations de l'expéditeur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Nom de l'expéditeur *</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  placeholder="Nom complet"
                  className="bg-gray-100"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderCity">Ville *</Label>
                <Input
                  id="senderCity"
                  value={formData.senderCity}
                  onChange={(e) => handleInputChange('senderCity', e.target.value)}
                  placeholder="Ville"
                  className="bg-gray-100"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderPhone">Téléphone *</Label>
                <Input
                  id="senderPhone"
                  value={formData.senderPhone}
                  onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                  placeholder="+33760248507"
                  className="bg-gray-100"
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations destinataire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Destinataire
            </CardTitle>
            <CardDescription>
              Informations du destinataire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nom du destinataire *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="Nom complet"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientCity">Ville *</Label>
                <Input
                  id="recipientCity"
                  value={formData.recipientCity}
                  onChange={(e) => handleInputChange('recipientCity', e.target.value)}
                  placeholder="Ville"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Téléphone *</Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                  placeholder="+224610674667"
                  required
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="Pays - Région (ex: Guinée - Matoto)"
                required
              />
            </div>
          </CardContent>
        </Card>


        {/* Gestion des colis multiples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Colis multiples
            </CardTitle>
            <CardDescription>
              Ajoutez plusieurs colis à cette étiquette (optionnel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={addPackage}
                className="w-full"
              >
                + Ajouter un colis
              </Button>
              
              {packages.map((pkg, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Colis {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePackage(index)}
                    >
                      Supprimer
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={pkg.description}
                        onChange={(e) => updatePackage(index, 'description', e.target.value)}
                        placeholder="Description du contenu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contenu détaillé</Label>
                      <Input
                        value={pkg.contents}
                        onChange={(e) => updatePackage(index, 'contents', e.target.value)}
                        placeholder="Détails du contenu"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Poids (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={pkg.weight}
                        onChange={(e) => updatePackage(index, 'weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longueur (cm)</Label>
                      <Input
                        type="number"
                        value={pkg.length}
                        onChange={(e) => updatePackage(index, 'length', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Largeur (cm)</Label>
                      <Input
                        type="number"
                        value={pkg.width}
                        onChange={(e) => updatePackage(index, 'width', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hauteur (cm)</Label>
                      <Input
                        type="number"
                        value={pkg.height}
                        onChange={(e) => updatePackage(index, 'height', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Valeur (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pkg.value || ''}
                      onChange={(e) => updatePackage(index, 'value', e.target.value ? parseFloat(e.target.value) : 0)}
                      placeholder="Valeur déclarée"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service et coût */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Service
            </CardTitle>
            <CardDescription>
              Type de service et coût
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceCode">Code service</Label>
                <Input
                  id="serviceCode"
                  value={formData.serviceCode}
                  onChange={(e) => handleInputChange('serviceCode', e.target.value)}
                  placeholder="1049.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Type de service</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  placeholder="Sous 1 semaine | Colisso"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Coût (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="25.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Création...' : 'Créer l\'étiquette'}
          </Button>
        </div>
      </form>
    </div>
  )
}
