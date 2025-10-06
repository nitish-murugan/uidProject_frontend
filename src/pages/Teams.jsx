import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sportType: 'Soccer',
    season: '',
    division: '',
    description: '',
  });

  const sportTypes = ['Soccer', 'Basketball', 'Baseball', 'Football', 'Hockey', 'Volleyball', 'Cricket', 'Rugby', 'Tennis', 'Other'];

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getAll();
      setTeams(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTeam) {
        await teamsAPI.update(editingTeam._id, formData);
      } else {
        await teamsAPI.create(formData);
      }
      
      fetchTeams();
      closeModal();
    } catch (error) {
      console.error('Error saving team:', error);
      alert(error.response?.data?.message || 'Error saving team');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamsAPI.delete(id);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert(error.response?.data?.message || 'Error deleting team');
      }
    }
  };

  const openModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        sportType: team.sportType,
        season: team.season,
        division: team.division || '',
        description: team.description || '',
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        sportType: 'Soccer',
        season: '',
        division: '',
        description: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTeam(null);
  };

  const canModify = user?.role === 'admin' || user?.role === 'coach';

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-title mb-0">Teams</h1>
            {canModify && (
              <button
                onClick={() => openModal()}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus />
                <span>Add Team</span>
              </button>
            )}
          </div>

          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div key={team._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                      <p className="text-sm text-gray-600">{team.sportType}</p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-medium">
                      {team.season}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {team.division && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Division:</span> {team.division}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Coach:</span> {team.coach?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Players:</span> {team.players?.length || 0}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs mb-4">
                      <div>
                        <p className="font-bold text-green-600">{team.statistics.wins}</p>
                        <p className="text-gray-600">Wins</p>
                      </div>
                      <div>
                        <p className="font-bold text-red-600">{team.statistics.losses}</p>
                        <p className="text-gray-600">Losses</p>
                      </div>
                      <div>
                        <p className="font-bold text-yellow-600">{team.statistics.draws}</p>
                        <p className="text-gray-600">Draws</p>
                      </div>
                      <div>
                        <p className="font-bold text-blue-600">
                          {team.statistics.goalsFor}-{team.statistics.goalsAgainst}
                        </p>
                        <p className="text-gray-600">Goals</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/teams/${team._id}`}
                        className="flex-1 flex items-center justify-center space-x-1 btn-secondary text-sm"
                      >
                        <FiEye />
                        <span>View</span>
                      </Link>
                      {canModify && (
                        <>
                          <button
                            onClick={() => openModal(team)}
                            className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <FiEdit />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(team._id)}
                            className="flex items-center justify-center btn-danger px-3 py-2 text-sm"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">No teams found</p>
              {canModify && (
                <button onClick={() => openModal()} className="btn-primary">
                  Create Your First Team
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Team Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTeam ? 'Edit Team' : 'Create New Team'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sport Type *
            </label>
            <select
              required
              className="input-field"
              value={formData.sportType}
              onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
            >
              {sportTypes.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 2024 Spring"
              className="input-field"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <input
              type="text"
              placeholder="e.g., Premier League"
              className="input-field"
              value={formData.division}
              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              className="input-field"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              {editingTeam ? 'Update Team' : 'Create Team'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teams;
