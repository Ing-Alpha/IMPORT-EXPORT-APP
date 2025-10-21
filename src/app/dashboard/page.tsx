'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, Package, History, Plus, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface DashboardStats {
  totalClients: number
  totalLabels: number
  labelsThisMonth: number
  clientsGrowth: number
  labelsGrowth: number
  revenue: number
  revenueGrowth: number
}

interface ChartData {
  name: string
  labels: number
  clients: number
  revenue: number
}

interface StatusData {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalLabels: 0,
    labelsThisMonth: 0,
    clientsGrowth: 0,
    labelsGrowth: 0,
    revenue: 0,
    revenueGrowth: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch clients
      const clientsResponse = await fetch('/api/clients')
      const clientsData = await clientsResponse.json()
      const totalClients = clientsData.clients?.length || clientsData.length || 0

      // Fetch labels
      const labelsResponse = await fetch('/api/labels')
      const labelsData = await labelsResponse.json()
      const totalLabels = labelsData.labels?.length || labelsData.length || 0

      // Calculate this month's labels
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const labelsThisMonth = labelsData.labels?.filter((label: any) => {
        const labelDate = new Date(label.createdAt)
        return labelDate.getMonth() === currentMonth && labelDate.getFullYear() === currentYear
      }).length || 0

      // Generate mock chart data for the last 6 months
      const mockChartData = generateChartData()
      
      // Generate mock status data
      const mockStatusData = generateStatusData(labelsData.labels || labelsData || [])

      // Calculate growth (mock data for now)
      const clientsGrowth = Math.floor(Math.random() * 20) - 10
      const labelsGrowth = Math.floor(Math.random() * 30) - 15
      const revenue = totalLabels * 25 // Mock revenue calculation
      const revenueGrowth = Math.floor(Math.random() * 25) - 12

      setStats({
        totalClients,
        totalLabels,
        labelsThisMonth,
        clientsGrowth,
        labelsGrowth,
        revenue,
        revenueGrowth
      })
      setChartData(mockChartData)
      setStatusData(mockStatusData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (): ChartData[] => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
    return months.map((month, index) => ({
      name: month,
      labels: Math.floor(Math.random() * 50) + 10,
      clients: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 1000) + 500
    }))
  }

  const generateStatusData = (labels: any[]): StatusData[] => {
    const statusCounts = labels.reduce((acc: any, label: any) => {
      acc[label.status] = (acc[label.status] || 0) + 1
      return acc
    }, {})

    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: status,
      value: count as number,
      color: COLORS[index % COLORS.length]
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0
    return {
      value: `${isPositive ? '+' : ''}${growth}%`,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      icon: isPositive ? TrendingUp : TrendingDown
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
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre espace de gestion des étiquettes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className={`text-xs ${formatGrowth(stats.clientsGrowth).color} flex items-center gap-1`}>
              {formatGrowth(stats.clientsGrowth).value} depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étiquettes générées</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLabels}</div>
            <p className={`text-xs ${formatGrowth(stats.labelsGrowth).color} flex items-center gap-1`}>
              {formatGrowth(stats.labelsGrowth).value} depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.labelsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Étiquettes générées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className={`text-xs ${formatGrowth(stats.revenueGrowth).color} flex items-center gap-1`}>
              {formatGrowth(stats.revenueGrowth).value} depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Étiquettes générées */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des étiquettes</CardTitle>
            <CardDescription>
              Nombre d'étiquettes générées par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="labels" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Nouveaux clients</CardTitle>
            <CardDescription>
              Nombre de nouveaux clients par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clients" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - Statuts des étiquettes */}
        <Card>
          <CardHeader>
            <CardTitle>Statuts des étiquettes</CardTitle>
            <CardDescription>
              Répartition par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du chiffre d'affaires</CardTitle>
            <CardDescription>
              Chiffre d'affaires par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques rapides</CardTitle>
            <CardDescription>
              Indicateurs clés de performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Taux de conversion</span>
              <span className="text-lg font-semibold">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Temps moyen de traitement</span>
              <span className="text-lg font-semibold">2.3h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Satisfaction client</span>
              <span className="text-lg font-semibold">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Étiquettes en attente</span>
              <span className="text-lg font-semibold">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/dashboard/labels/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle étiquette
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau client
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/labels">
                <Package className="mr-2 h-4 w-4" />
                Voir toutes les étiquettes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/clients">
                <Users className="mr-2 h-4 w-4" />
                Gérer les clients
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Vos dernières activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalLabels > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Étiquette générée</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Nouveau client ajouté</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 4h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Étiquette mise à jour</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 6h</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Commencez par créer votre première étiquette</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
