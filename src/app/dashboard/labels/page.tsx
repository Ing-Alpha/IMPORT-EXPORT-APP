'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Package, History, Download } from 'lucide-react'

interface Label {
  id: string
  trackingId: string
  createdAt: string
  senderName: string
  recipientName: string
  destination: string
  weight: number
  paymentStatus: string
  client: {
    name: string
  }
}

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabels()
  }, [])

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/labels')
      if (response.ok) {
        const data = await response.json()
        setLabels(data.slice(0, 5)) // Afficher seulement les 5 dernières
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étiquettes:', error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Étiquettes</h1>
          <p className="text-gray-600">Gérez vos étiquettes d'expédition</p>
        </div>
        <Link href="/dashboard/labels/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle étiquette
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
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
            <CardTitle className="text-sm font-medium">Payées</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labels.filter(label => label.paymentStatus === 'Payé').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Étiquettes payées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dernières étiquettes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dernières étiquettes</CardTitle>
              <CardDescription>
                Les 5 dernières étiquettes générées
              </CardDescription>
            </div>
            <Link href="/dashboard/history">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Voir tout l'historique
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : labels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune étiquette générée</p>
              <Link href="/dashboard/labels/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre première étiquette
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="font-mono">
                        {label.trackingId}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          {label.senderName} → {label.recipientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {label.destination} • {label.weight} kg
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={label.paymentStatus === 'Payé' ? 'default' : 'destructive'}
                      className="bg-green-100 text-green-800"
                    >
                      {label.paymentStatus}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(label.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Link href={`/dashboard/labels/${label.id}`}>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}