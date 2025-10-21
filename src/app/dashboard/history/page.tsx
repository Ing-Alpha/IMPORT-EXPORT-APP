'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Download, Eye, Package } from 'lucide-react'

interface Label {
  id: string
  trackingId: string
  createdAt: string
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
  client: {
    id: string
    name: string
    company?: string
  }
  user: {
    name: string
  }
}

export default function LabelsHistoryPage() {
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLabels()
  }, [])

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/labels')
      if (response.ok) {
        const data = await response.json()
        setLabels(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étiquettes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLabels = labels.filter(label =>
    label.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownload = async (labelId: string) => {
    try {
      const response = await fetch(`/api/labels/${labelId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `etiquette-${labelId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    }
  }

  const handleView = async (labelId: string) => {
    try {
      const response = await fetch(`/api/labels/${labelId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture:', error)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Historique des étiquettes</h1>
        <p className="text-gray-600">Consultez toutes les étiquettes générées</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher</CardTitle>
          <CardDescription>
            Trouvez rapidement une étiquette par numéro de suivi, client ou société
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une étiquette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Labels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des étiquettes ({filteredLabels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLabels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Aucune étiquette trouvée' : 'Aucune étiquette générée'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro de suivi</TableHead>
                  <TableHead>Expéditeur</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Poids</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabels.map((label) => (
                  <TableRow key={label.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="font-mono">
                        {label.trackingId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{label.senderName}</div>
                        <div className="text-sm text-gray-500">{label.senderCity}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{label.recipientName}</div>
                        <div className="text-sm text-gray-500">{label.recipientCity}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{label.destination}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{label.weight} kg</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={label.paymentStatus === 'Payé' ? 'default' : 'destructive'}
                        className="bg-green-100 text-green-800"
                      >
                        {label.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(label.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(label.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(label.id)}
                        >
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total étiquettes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labels.length}</div>
            <p className="text-xs text-muted-foreground">
              Toutes les étiquettes générées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labels.filter(label => {
                const labelDate = new Date(label.createdAt)
                const now = new Date()
                return labelDate.getMonth() === now.getMonth() && 
                       labelDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Étiquettes générées ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients uniques</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(labels.map(label => label.client.id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Clients ayant des étiquettes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
