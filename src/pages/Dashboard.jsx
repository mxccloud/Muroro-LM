import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useUserId } from '@nhost/react'
import { Users, Egg, Wheat, TrendingUp } from 'lucide-react'

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($userId: uuid!) {
    animals_aggregate(where: {user_id: {_eq: $userId}}) {
      aggregate {
        count
      }
    }
    eggs_aggregate(where: {user_id: {_eq: $userId}}) {
      aggregate {
        sum {
          quantity
        }
      }
    }
    feeds_aggregate(where: {user_id: {_eq: $userId}}) {
      aggregate {
        sum {
          quantity
        }
      }
    }
    animals(where: {user_id: {_eq: $userId}, health_status: {_eq: "sick"}}) {
      id
      name
      type
      health_status
    }
  }
`

const Dashboard = () => {
  const userId = useUserId()
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS, {
    variables: { userId },
    skip: !userId
  })

  if (!userId) {
    return (
      <div className="page">
        <div className="card">
          <h2>Welcome to Muroro Livestock Management</h2>
          <p>Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>
  if (error) return <div className="page">Error: {error.message}</div>

  const stats = [
    {
      name: 'Total Animals',
      value: data?.animals_aggregate.aggregate?.count || 0,
      icon: Users,
      color: 'var(--royal-blue)'
    },
    {
      name: 'Eggs Collected',
      value: data?.eggs_aggregate.aggregate?.sum?.quantity || 0,
      icon: Egg,
      color: 'var(--success)'
    },
    {
      name: 'Feed Stock',
      value: `${data?.feeds_aggregate.aggregate?.sum?.quantity || 0} kg`,
      icon: Wheat,
      color: 'var(--warning)'
    }
  ]

  const sickAnimals = data?.animals || []

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your livestock management</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon color="white" size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Health Alerts</h2>
        {sickAnimals.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Type</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {sickAnimals.map((animal) => (
                  <tr key={animal.id}>
                    <td>{animal.name || 'Unnamed'}</td>
                    <td>{animal.type}</td>
                    <td>
                      <span className="status-badge sick">Sick</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--success)', textAlign: 'center', padding: '2rem' }}>
            All animals are healthy! 🎉
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard