'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { translateStatus } from '@/lib/status-translations'
import { Package, User, MapPin, Weight, Ruler, Download, Edit, Trash2, QrCode } from 'lucide-react'

interface Label {
  id: string
  trackingId: string
  status: string
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
  paymentStatus: string
  createdAt: string
  client: {
    id: string
    name: string
    company?: string
  }
  packages: Array<{
    id: string
    description?: string
    weight: number
    length: number
    width: number
    height: number
    value?: number
    contents?: string
  }>
}

interface LabelPageProps {
  params: Promise<{ id: string }>
}

export default function LabelPage({ params }: LabelPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [label, setLabel] = useState<Label | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabel()
  }, [resolvedParams.id])

  const fetchLabel = async () => {
    try {
      const response = await fetch(`/api/labels/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setLabel(data)
      } else {
        console.error('Erreur lors du chargement de l\'étiquette')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/labels/${resolvedParams.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `etiquette-${label?.trackingId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    }
  }

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) {
      try {
        const response = await fetch(`/api/labels/${resolvedParams.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          router.push('/dashboard/labels')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!label) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Étiquette non trouvée</h2>
        <p className="text-gray-600">L&apos;étiquette demandée n&apos;existe pas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Étiquette {label.trackingId}</h1>
          <p className="text-gray-600">Client: {label.client.name} {label.client.company && `(${label.client.company})`}</p>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(label.status)}>
            {translateStatus(label.status)}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/labels/${resolvedParams.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/labels/${resolvedParams.id}/qrcode`)}
          disabled={label.paymentStatus !== 'Payé'}
          className={label.paymentStatus !== 'Payé' ? 'opacity-50 cursor-not-allowed' : ''}
          title={label.paymentStatus !== 'Payé' ? 'QR Code disponible uniquement pour les étiquettes payées' : ''}
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          disabled={label.paymentStatus !== 'Payé'}
          className={label.paymentStatus !== 'Payé' ? 'opacity-50 cursor-not-allowed' : ''}
          title={label.paymentStatus !== 'Payé' ? 'PDF disponible uniquement pour les étiquettes payées' : ''}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expéditeur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Expéditeur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nom:</strong> {label.senderName}</p>
            <p><strong>Ville:</strong> {label.senderCity}</p>
            <p><strong>Téléphone:</strong> {label.senderPhone}</p>
          </CardContent>
        </Card>

        {/* Destinataire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Destinataire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nom:</strong> {label.recipientName}</p>
            <p><strong>Ville:</strong> {label.recipientCity}</p>
            <p><strong>Téléphone:</strong> {label.recipientPhone}</p>
            <p><strong>Destination:</strong> {label.destination}</p>
          </CardContent>
        </Card>
      </div>

      {/* Détails du colis principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Weight className="h-5 w-5" />
            Détails du colis principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Poids</p>
              <p className="font-medium">{label.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dimensions</p>
              <p className="font-medium">{label.length} × {label.width} × {label.height} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-medium">{label.serviceCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Coût</p>
              <p className="font-medium">{label.cost ? `${label.cost}€` : 'Non défini'}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Type de service</p>
            <p className="font-medium">{label.serviceType}</p>
          </div>
        </CardContent>
      </Card>

      {/* Colis multiples */}
      {label.packages && label.packages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Colis multiples ({label.packages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {label.packages.map((pkg, index) => (
                <div key={pkg.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Colis {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Description</p>
                      <p className="font-medium">{pkg.description || 'Non définie'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Poids</p>
                      <p className="font-medium">{pkg.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dimensions</p>
                      <p className="font-medium">{pkg.length} × {pkg.width} × {pkg.height} cm</p>
                    </div>
                    {pkg.value && (
                      <div>
                        <p className="text-gray-600">Valeur</p>
                        <p className="font-medium">{pkg.value}€</p>
                      </div>
                    )}
                    {pkg.contents && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Contenu</p>
                        <p className="font-medium">{pkg.contents}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations de service */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Informations de service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Statut de paiement</p>
              <Badge variant="outline" className="mt-1">{label.paymentStatus}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de création</p>
              <p className="font-medium">{new Date(label.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}