import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, MapPin, Phone, Calendar, Truck } from 'lucide-react'

interface TrackingPageProps {
  params: Promise<{ trackingId: string }>
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { trackingId } = await params

  // Récupérer l'étiquette avec toutes ses informations
  const label = await prisma.label.findUnique({
    where: { trackingId },
    include: {
      client: {
        select: {
          name: true,
          company: true
        }
      },
      user: {
        select: {
          name: true
        }
      },
      packages: true
    }
  })

  if (!label) {
    notFound()
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Brouillon'
      case 'PENDING': return 'En attente'
      case 'GENERATED': return 'Générée'
      case 'SHIPPED': return 'Expédiée'
      case 'DELIVERED': return 'Livrée'
      case 'CANCELLED': return 'Annulée'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi d'expédition
          </h1>
          <p className="text-gray-600">
            Numéro de suivi: <span className="font-mono font-bold">{label.trackingId}</span>
          </p>
        </div>

        {/* Statut */}
        <div className="text-center mb-8">
          <Badge className={`${getStatusColor(label.status)} text-lg px-6 py-2`}>
            {getStatusText(label.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations expéditeur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Expéditeur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nom:</strong> {label.senderName}</p>
              <p><strong>Ville:</strong> {label.senderCity}</p>
              <p><strong>Téléphone:</strong> {label.senderPhone}</p>
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
            <CardContent className="space-y-2">
              <p><strong>Nom:</strong> {label.recipientName}</p>
              <p><strong>Ville:</strong> {label.recipientCity}</p>
              <p><strong>Téléphone:</strong> {label.recipientPhone}</p>
              <p><strong>Destination:</strong> {label.destination}</p>
            </CardContent>
          </Card>
        </div>

        {/* Détails de l'expédition */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Détails de l'expédition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Type de service</p>
              <p className="font-medium">{label.serviceType}</p>
            </div>
          </CardContent>
        </Card>

        {/* Colis multiples */}
        {label.packages && label.packages.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Colis ({label.packages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {label.packages.map((pkg, index) => (
                  <div key={pkg.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Colis {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {pkg.description && (
                        <div>
                          <p className="text-gray-600">Description</p>
                          <p className="font-medium">{pkg.description}</p>
                        </div>
                      )}
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

        {/* Informations de suivi */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informations de suivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium">{label.client.name} {label.client.company && `(${label.client.company})`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Créée le</p>
                <p className="font-medium">{new Date(label.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut de paiement</p>
                <Badge variant="outline">{label.paymentStatus}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coût</p>
                <p className="font-medium">{label.cost ? `${label.cost}€` : 'Non défini'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Import-Export Marseille SARL</p>
          <p className="text-sm">Suivi automatique via QR Code</p>
        </div>
      </div>
    </div>
  )
}
