'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Edit, Package, Download, Eye } from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  company?: string
  address: string
  country: string
  phone?: string
  email?: string
  notes?: string
  createdAt: string
  labels: Label[]
}

interface Label {
  id: string
  trackingId: string
  createdAt: string
  pdfUrl?: string
}

export default function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingLabel, setGeneratingLabel] = useState(false)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchClient(params.id as string)
    }
  }, [params.id])

  const fetchClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setClient(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du client:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateLabel = async () => {
    if (!client) return

    setGeneratingLabel(true)
    try {
      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: client.id
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `etiquette-${client.name}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // Rafraîchir les données du client
        fetchClient(client.id)
      }
    } catch (error) {
      console.error('Erreur lors de la génération de l\'étiquette:', error)
    } finally {
      setGeneratingLabel(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">Client non trouvé</h2>
        <p className="text-gray-600">Le client demandé n'existe pas.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/clients">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Détails du client</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/clients/${client.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          <Button onClick={generateLabel} disabled={generatingLabel}>
            <Package className="h-4 w-4 mr-2" />
            {generatingLabel ? 'Génération...' : 'Générer une étiquette'}
          </Button>
        </div>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nom</label>
              <p className="text-lg">{client.name}</p>
            </div>
            {client.company && (
              <div>
                <label className="text-sm font-medium text-gray-500">Société</label>
                <p className="text-lg">{client.company}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Adresse</label>
              <p className="text-lg">{client.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pays</label>
              <p className="text-lg">{client.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.email && (
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{client.email}</p>
              </div>
            )}
            {client.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-lg">{client.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Date d'ajout</label>
              <p className="text-lg">{new Date(client.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Labels History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des étiquettes ({client.labels.length})</CardTitle>
          <CardDescription>
            Toutes les étiquettes générées pour ce client
          </CardDescription>
        </CardHeader>
        <CardContent>
          {client.labels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune étiquette générée pour ce client
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro de suivi</TableHead>
                  <TableHead>Date de génération</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.labels.map((label) => (
                  <TableRow key={label.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{label.trackingId}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(label.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
