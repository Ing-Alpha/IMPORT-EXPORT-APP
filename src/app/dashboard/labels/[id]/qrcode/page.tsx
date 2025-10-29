'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, ArrowLeft, RefreshCw } from 'lucide-react'

interface LabelPageProps {
  params: Promise<{ id: string }>
}

export default function QRCodePage({ params }: LabelPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [trackingId, setTrackingId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabelInfo()
  }, [resolvedParams.id])

  const fetchLabelInfo = async () => {
    try {
      const response = await fetch(`/api/labels/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setTrackingId(data.trackingId)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'étiquette:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = async () => {
    try {
      const response = await fetch(`/api/qrcode/${trackingId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `qrcode-${trackingId}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du QR Code:', error)
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code de suivi</h1>
          <p className="text-gray-600">Numéro de suivi: {trackingId}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* QR Code */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">QR Code de suivi</CardTitle>
          <CardDescription className="text-center">
            Scannez ce code pour accéder aux informations de suivi
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            {trackingId && (
              <img
                src={`/api/qrcode/${trackingId}`}
                alt={`QR Code pour ${trackingId}`}
                className="mx-auto border rounded-lg"
                width={200}
                height={200}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Numéro de suivi:</strong>
            </p>
            <p className="font-mono text-lg font-bold">{trackingId}</p>
          </div>

          <div className="mt-6 space-y-2">
            <Button
              onClick={downloadQRCode}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le QR Code
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open(`/track/${trackingId}`, '_blank')}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Voir la page de suivi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Comment utiliser ce QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Impression</h4>
              <p className="text-sm text-gray-600">
                Imprimez ce QR Code sur l&apos;étiquette d&apos;expédition pour permettre au destinataire de suivre son colis.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Scan</h4>
              <p className="text-sm text-gray-600">
                Le destinataire peut scanner ce code avec son smartphone pour accéder aux informations de suivi.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">3. Suivi</h4>
              <p className="text-sm text-gray-600">
                La page de suivi affiche toutes les informations de l&apos;expédition : expéditeur, destinataire, statut, etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
