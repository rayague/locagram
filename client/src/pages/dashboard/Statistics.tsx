import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Statistics = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Statistiques</h2>
            <p className="text-muted-foreground">
              Analysez les performances de vos annonces
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={timeFrame === 'day' ? 'default' : 'outline'} 
              onClick={() => setTimeFrame('day')}
              size="sm"
            >
              Jour
            </Button>
            <Button 
              variant={timeFrame === 'week' ? 'default' : 'outline'} 
              onClick={() => setTimeFrame('week')}
              size="sm"
            >
              Semaine
            </Button>
            <Button 
              variant={timeFrame === 'month' ? 'default' : 'outline'} 
              onClick={() => setTimeFrame('month')}
              size="sm"
            >
              Mois
            </Button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des vues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">127</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +12% par rapport à la semaine précédente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8.7%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +2.1% par rapport à la semaine précédente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Annonces actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sur 10 annonces autorisées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vues par jour</CardTitle>
              <CardDescription>
                Nombre de vues quotidiennes pour vos annonces
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Bar dataKey="views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
              <CardDescription>
                Vues vs contacts sur vos annonces
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8B5CF6" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contacts" 
                    stroke="#10B981" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par catégorie</CardTitle>
            <CardDescription>
              Répartition des vues par catégorie d'annonces
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <Bar dataKey="total" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Listings Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des annonces</CardTitle>
            <CardDescription>
              Détails de performance pour chacune de vos annonces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Titre de l'annonce</th>
                    <th className="py-3 text-left">Catégorie</th>
                    <th className="py-3 text-right">Vues</th>
                    <th className="py-3 text-right">Contacts</th>
                    <th className="py-3 text-right">Taux de conversion</th>
                    <th className="py-3 text-center">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {listingsPerformance.map((listing) => (
                    <tr key={listing.id} className="border-b">
                      <td className="py-3 font-medium">{listing.title}</td>
                      <td className="py-3">{listing.category}</td>
                      <td className="py-3 text-right">{listing.views}</td>
                      <td className="py-3 text-right">{listing.contacts}</td>
                      <td className="py-3 text-right">{listing.conversionRate}%</td>
                      <td className="py-3 text-center">
                        {listing.trend === 'up' && (
                          <span className="text-green-600">↑</span>
                        )}
                        {listing.trend === 'down' && (
                          <span className="text-red-600">↓</span>
                        )}
                        {listing.trend === 'stable' && (
                          <span className="text-amber-600">→</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
