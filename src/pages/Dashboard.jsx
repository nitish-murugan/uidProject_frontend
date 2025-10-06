import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamsAPI, playersAPI, gamesAPI } from '../services/api';
import { FiUsers, FiUser, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    upcomingGames: 0,
    completedGames: 0,
  });
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [teamsRes, playersRes, gamesRes] = await Promise.all([
        teamsAPI.getAll(),
        playersAPI.getAll(),
        gamesAPI.getAll(),
      ]);

      const teams = teamsRes.data.data;
      const players = playersRes.data.data;
      const games = gamesRes.data.data;

      setStats({
        teams: teams.length,
        players: players.length,
        upcomingGames: games.filter(g => g.status === 'scheduled').length,
        completedGames: games.filter(g => g.status === 'completed').length,
      });

      // Get recent games (last 5)
      setRecentGames(games.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Teams',
      value: stats.teams,
      icon: FiUsers,
      color: 'bg-blue-500',
      link: '/teams',
    },
    {
      title: 'Total Players',
      value: stats.players,
      icon: FiUser,
      color: 'bg-green-500',
      link: '/players',
    },
    {
      title: 'Upcoming Games',
      value: stats.upcomingGames,
      icon: FiCalendar,
      color: 'bg-yellow-500',
      link: '/games',
    },
    {
      title: 'Completed Games',
      value: stats.completedGames,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      link: '/games',
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="page-title">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your teams today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="text-white text-2xl" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Games */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0">Recent Games</h2>
              <Link to="/games" className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>

            {recentGames.length > 0 ? (
              <div className="space-y-3">
                {recentGames.map((game) => (
                  <div
                    key={game._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {game.team?.name} vs {game.opponent}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(game.date).toLocaleDateString()} at {game.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          game.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : game.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {game.status}
                      </span>
                      {game.status === 'completed' && (
                        <p className="text-sm font-bold mt-1">
                          {game.score.team} - {game.score.opponent}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No games scheduled yet</p>
            )}
          </div>

          {/* Quick Actions */}
          {(user?.role === 'admin' || user?.role === 'coach') && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/teams"
                className="card hover:shadow-lg transition-shadow text-center"
              >
                <FiUsers className="text-4xl text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Manage Teams</h3>
                <p className="text-sm text-gray-600 mt-1">Create and manage your teams</p>
              </Link>
              
              <Link
                to="/players"
                className="card hover:shadow-lg transition-shadow text-center"
              >
                <FiUser className="text-4xl text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Manage Players</h3>
                <p className="text-sm text-gray-600 mt-1">Add and update player information</p>
              </Link>
              
              <Link
                to="/games"
                className="card hover:shadow-lg transition-shadow text-center"
              >
                <FiCalendar className="text-4xl text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Schedule Games</h3>
                <p className="text-sm text-gray-600 mt-1">Create and manage game schedules</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
