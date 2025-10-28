'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { translateStatus } from '@/lib/status-translations'
import { Package, User, MapPin, Phone, Weight, Ruler, ArrowLeft } from 'lucide-react'

interface Client {
  id: string
  name: string
  company?: string
  address: string
  country: string
  phone?: string
  email?: string
}

interface LabelData {
  id: string
  trackingId: string
  status: string
  paymentStatus: string
  clientId: string
  senderName: string
  senderCity: string
  senderPhone: string
  recipientName: string
  recipientCity: string
  recipientPhone: string
  destination: string
  weight: number
  length: number
  width: number
  height: number
  serviceCode: string
  serviceType: string
  cost?: number
  client: {
    id: string
    name: string
    company?: string
  }
}

interface EditLabelPageProps {
  params: Promise<{ id: string }>
}

export default function EditLabelPage({ params }: EditLabelPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const labelId = resolvedParams.id
  
  const [label, setLabel] = useState<LabelData | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    clientId: '',
    senderName: '',
    senderCity: '',
    senderPhone: '',
    recipientName: '',
    recipientCity: '',
    recipientPhone: '',
    destination: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    serviceCode: '',
    serviceType: '',
    cost: ''
  })

  useEffect(() => {
    if (labelId) {
      fetchLabel()
      fetchClients()
    }
  }, [labelId])

  const fetchLabel = async () => {
    try {
      const response = await fetch(`/api/labels/${labelId}`)
      if (response.ok) {
        const data = await response.json()
        setLabel(data)
        
        // Remplir le formulaire avec les données existantes
        setFormData({
          clientId: data.clientId,
          senderName: data.senderName,
          senderCity: data.senderCity,
          senderPhone: data.senderPhone,
          recipientName: data.recipientName,
          recipientCity: data.recipientCity,
          recipientPhone: data.recipientPhone,
          destination: data.destination,
          weight: data.weight.toString(),
          length: data.length.toString(),
          width: data.width.toString(),
          height: data.height.toString(),
          serviceCode: data.serviceCode,
          serviceType: data.serviceType,
          cost: data.cost ? data.cost.toString() : ''
        })
      } else {
        console.error('Erreur lors du chargement de l\'étiquette')
        router.push('/dashboard/labels')
      }
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/dashboard/labels')
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        const clientsArray = data.clients || data
        setClients(Array.isArray(clientsArray) ? clientsArray : [])
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
      const response = await fetch(`/api/labels/${labelId}`, {
        method: 'PUT',
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
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/labels/${labelId}`)
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour de l\'étiquette')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'GENERATED': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || !label) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Éditer l'étiquette {label.trackingId}
            </h1>
            <p className="text-gray-600">
              Client: {label.client.name} {label.client.company && `(${label.client.company})`}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(label.status)}>
            {translateStatus(label.status)}
          </Badge>
          <Badge variant="outline" className="mt-1">
            {label.paymentStatus}
          </Badge>
        </div>
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
              Modifier le client pour cette expédition
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
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.company && `(${client.company})`}
                      </SelectItem>
                    ))}
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Nom de l'expéditeur *</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderCity">Ville *</Label>
                <Input
                  id="senderCity"
                  value={formData.senderCity}
                  onChange={(e) => handleInputChange('senderCity', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderPhone">Téléphone *</Label>
                <Input
                  id="senderPhone"
                  value={formData.senderPhone}
                  onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                  required
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nom du destinataire *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientCity">Ville *</Label>
                <Input
                  id="recipientCity"
                  value={formData.recipientCity}
                  onChange={(e) => handleInputChange('recipientCity', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Téléphone *</Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
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
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Dimensions et poids */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              Dimensions et poids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Longueur (cm) *</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Largeur (cm) *</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Hauteur (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  required
                />
              </div>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceCode">Code service</Label>
                <Input
                  id="serviceCode"
                  value={formData.serviceCode}
                  onChange={(e) => handleInputChange('serviceCode', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Type de service</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
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
            {submitting ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </div>
  )
}
