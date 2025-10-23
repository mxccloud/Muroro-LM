import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useUserId } from '@nhost/react'
import { Plus, Edit, Trash2 } from 'lucide-react'

const GET_ANIMALS = gql`
  query GetAnimals($userId: uuid!) {
    animals(where: {user_id: {_eq: $userId}}, order_by: {created_at: desc}) {
      id
      type
      breed
      name
      birth_date
      acquisition_date
      status
      health_status
      notes
      created_at
    }
  }
`

const INSERT_ANIMAL = gql`
  mutation InsertAnimal($object: animals_insert_input!) {
    insert_animals_one(object: $object) {
      id
      type
      breed
      name
      birth_date
      acquisition_date
      status
      health_status
      notes
      created_at
    }
  }
`

const DELETE_ANIMAL = gql`
  mutation DeleteAnimal($id: uuid!) {
    delete_animals_by_pk(id: $id) {
      id
    }
  }
`

const Animals = () => {
  const userId = useUserId()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    breed: '',
    name: '',
    birth_date: '',
    acquisition_date: '',
    status: 'active',
    health_status: 'healthy',
    notes: ''
  })

  const { data, loading, error, refetch } = useQuery(GET_ANIMALS, {
    variables: { userId },
    skip: !userId
  })
  
  const [insertAnimal] = useMutation(INSERT_ANIMAL)
  const [deleteAnimal] = useMutation(DELETE_ANIMAL)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await insertAnimal({
        variables: {
          object: {
            ...formData,
            user_id: userId
          }
        }
      })
      setShowForm(false)
      setFormData({
        type: '',
        breed: '',
        name: '',
        birth_date: '',
        acquisition_date: '',
        status: 'active',
        health_status: 'healthy',
        notes: ''
      })
      refetch()
    } catch (error) {
      console.error('Error adding animal:', error)
      alert('Error adding animal. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await deleteAnimal({ variables: { id } })
        refetch()
      } catch (error) {
        console.error('Error deleting animal:', error)
        alert('Error deleting animal. Please try again.')
      }
    }
  }

  const animalTypes = ['Cow', 'Goat', 'Chicken', 'Roadrunner', 'Sheep', 'Pig']
  const healthStatuses = ['healthy', 'sick', 'injured', 'under_treatment']
  const statuses = ['active', 'sold', 'deceased', 'transferred']

  if (!userId) {
    return (
      <div className="page">
        <div className="card">
          <h2>Please sign in to manage animals</h2>
        </div>
      </div>
    )
  }

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>
  if (error) return <div className="page">Error: {error.message}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Animals</h1>
          <p>Manage your livestock animals</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Add Animal
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Animal</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select 
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="">Select Type</option>
                    {animalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Breed *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Optional"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Acquisition Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.acquisition_date}
                    onChange={(e) => setFormData({...formData, acquisition_date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Health Status</label>
                  <select 
                    className="form-input"
                    value={formData.health_status}
                    onChange={(e) => setFormData({...formData, health_status: e.target.value})}
                  >
                    {healthStatuses.map(status => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes about the animal..."
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Animal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {data?.animals.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No animals added yet</h3>
            <p>Get started by adding your first animal.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              style={{ marginTop: '1rem' }}
            >
              <Plus size={20} />
              Add Your First Animal
            </button>
          </div>
        </div>
      ) : (
        <div className="animals-grid">
          {data?.animals.map((animal) => (
            <div key={animal.id} className="animal-card">
              <div className="animal-header">
                <h3>{animal.name || 'Unnamed'}</h3>
                <span className={`status-badge ${animal.health_status}`}>
                  {animal.health_status.replace('_', ' ')}
                </span>
              </div>
              <div className="animal-details">
                <p><strong>Type:</strong> {animal.type}</p>
                <p><strong>Breed:</strong> {animal.breed}</p>
                <p><strong>Status:</strong> {animal.status}</p>
                {animal.birth_date && (
                  <p><strong>Birth Date:</strong> {new Date(animal.birth_date).toLocaleDateString()}</p>
                )}
                {animal.notes && (
                  <p><strong>Notes:</strong> {animal.notes}</p>
                )}
              </div>
              <div className="animal-actions">
                <button className="btn-icon">
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => handleDelete(animal.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Animals