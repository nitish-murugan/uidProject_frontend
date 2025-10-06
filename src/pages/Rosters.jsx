import React, { useState, useEffect } from 'react';
import { rostersAPI, teamsAPI, playersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';

const Rosters = () => {
  const { user } = useAuth();
  const [rosters, setRosters] = useState([]);
  const [teams, setTeams] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    type: 'active',
    season: '',
    notes: '',
  });

  const rosterTypes = ['active', 'injured', 'suspended', 'reserve', 'starting'];

  useEffect(() => {
    fetchData();
  }, [selectedTeam]);

  const fetchData = async () => {
    try {
      const params = selectedTeam ? { team: selectedTeam } : {};
      const [rostersRes, teamsRes, playersRes] = await Promise.all([
        rostersAPI.getAll(params),
        teamsAPI.getAll(),
        playersAPI.getAll(),
      ]);
      
      setRosters(rostersRes.data.data);
      setTeams(teamsRes.data.data);
      setPlayers(playersRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingRoster) {
        await rostersAPI.update(editingRoster._id, formData);
      } else {
        await rostersAPI.create(formData);
      }
      
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving roster:', error);
      alert(error.response?.data?.message || 'Error saving roster');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this roster?')) {
      try {
        await rostersAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting roster:', error);
        alert(error.response?.data?.message || 'Error deleting roster');
      }
    }
  };

  const openModal = (roster = null) => {
    if (roster) {
      setEditingRoster(roster);
      setFormData({
        name: roster.name,
        team: roster.team._id || roster.team,
        type: roster.type,
        season: roster.season,
        notes: roster.notes || '',
      });
    } else {
      setEditingRoster(null);
      setFormData({
        name: '',
        team: teams[0]?._id || '',
        type: 'active',
        season: '',
        notes: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRoster(null);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'starting': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'injured': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="page-title mb-0">Rosters</h1>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
              <select
                className="input-field py-2"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              
              {canModify && (
                <button
                  onClick={() => openModal()}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <FiPlus />
                  <span>Create Roster</span>
                </button>
              )}
            </div>
          </div>

          {rosters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rosters.map((roster) => (
                <div key={roster._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{roster.name}</h3>
                      <p className="text-sm text-gray-600">{roster.team?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(roster.type)}`}>
                      {roster.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Season:</span> {roster.season}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiUsers className="mr-1" />
                      <span className="font-medium">{roster.players?.length || 0} Players</span>
                    </p>
                    {roster.notes && (
                      <p className="text-sm text-gray-600 italic">{roster.notes}</p>
                    )}
                  </div>

                  {canModify && (
                    <div className="border-t pt-4 flex space-x-2">
                      <button
                        onClick={() => openModal(roster)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FiEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(roster._id)}
                        className="flex items-center justify-center btn-danger px-3 py-2 text-sm"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">No rosters found</p>
              {canModify && (
                <button onClick={() => openModal()} className="btn-primary">
                  Create Your First Roster
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Roster Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingRoster ? 'Edit Roster' : 'Create New Roster'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roster Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Starting XI"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team *
            </label>
            <select
              required
              className="input-field"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              required
              className="input-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {rosterTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
              Notes
            </label>
            <textarea
              rows="3"
              className="input-field"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              {editingRoster ? 'Update Roster' : 'Create Roster'}
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

export default Rosters;
