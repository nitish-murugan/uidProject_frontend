import React, { useState, useEffect } from 'react';
import { gamesAPI, teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

const Games = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [filterTeam, setFilterTeam] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [formData, setFormData] = useState({
    team: '',
    opponent: '',
    date: '',
    time: '',
    location: '',
    isHomeGame: true,
    season: '',
  });

  const statuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'];

  useEffect(() => {
    fetchData();
  }, [filterTeam, filterStatus]);

  const fetchData = async () => {
    try {
      const params = {};
      if (filterTeam) params.team = filterTeam;
      if (filterStatus) params.status = filterStatus;

      const [gamesRes, teamsRes] = await Promise.all([
        gamesAPI.getAll(params),
        teamsAPI.getAll(),
      ]);
      
      setGames(gamesRes.data.data);
      setTeams(teamsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGame) {
        await gamesAPI.update(editingGame._id, formData);
      } else {
        await gamesAPI.create(formData);
      }
      
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving game:', error);
      alert(error.response?.data?.message || 'Error saving game');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await gamesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting game:', error);
        alert(error.response?.data?.message || 'Error deleting game');
      }
    }
  };

  const openModal = (game = null) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        team: game.team._id || game.team,
        opponent: game.opponent,
        date: game.date.split('T')[0],
        time: game.time,
        location: game.location,
        isHomeGame: game.isHomeGame,
        season: game.season,
      });
    } else {
      setEditingGame(null);
      setFormData({
        team: teams[0]?._id || '',
        opponent: '',
        date: '',
        time: '',
        location: '',
        isHomeGame: true,
        season: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGame(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'win': return 'text-green-600';
      case 'loss': return 'text-red-600';
      case 'draw': return 'text-yellow-600';
      default: return 'text-gray-600';
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
            <h1 className="page-title mb-0">Games Schedule</h1>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-600" />
                <select
                  className="input-field py-2"
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                
                <select
                  className="input-field py-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              {canModify && (
                <button
                  onClick={() => openModal()}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <FiPlus />
                  <span>Schedule Game</span>
                </button>
              )}
            </div>
          </div>

          {games.length > 0 ? (
            <div className="space-y-4">
              {games.map((game) => (
                <div key={game._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                          {game.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {format(new Date(game.date), 'MMMM dd, yyyy')} at {game.time}
                        </span>
                      </div>
                      
                      <div className="text-lg font-semibold text-gray-800 mb-1">
                        {game.team?.name} vs {game.opponent}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {game.location}
                        <span className="mx-2">•</span>
                        <span className={game.isHomeGame ? 'text-green-600' : 'text-blue-600'}>
                          {game.isHomeGame ? 'Home' : 'Away'}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Season: {game.season}</span>
                      </div>

                      {game.status === 'completed' && (
                        <div className={`mt-2 text-xl font-bold ${getResultColor(game.result)}`}>
                          Score: {game.score.team} - {game.score.opponent}
                          <span className="text-sm ml-2">
                            ({game.result.toUpperCase()})
                          </span>
                        </div>
                      )}
                    </div>

                    {canModify && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(game)}
                          className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <FiEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(game._id)}
                          className="flex items-center btn-danger px-4 py-2 text-sm"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">No games scheduled</p>
              {canModify && (
                <button onClick={() => openModal()} className="btn-primary">
                  Schedule Your First Game
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Game Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingGame ? 'Edit Game' : 'Schedule New Game'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Opponent *
              </label>
              <input
                type="text"
                required
                placeholder="Opponent team name"
                className="input-field"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                required
                className="input-field"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="Stadium or venue"
                className="input-field"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Type *
              </label>
              <select
                required
                className="input-field"
                value={formData.isHomeGame}
                onChange={(e) => setFormData({ ...formData, isHomeGame: e.target.value === 'true' })}
              >
                <option value="true">Home Game</option>
                <option value="false">Away Game</option>
              </select>
            </div>

            <div className="md:col-span-2">
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
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              {editingGame ? 'Update Game' : 'Schedule Game'}
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

export default Games;
