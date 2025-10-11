import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { 
  FaChartLine, 
  FaEye, 
  FaDownload, 
  FaUsers,
  FaServer,
  FaNetworkWired,
  FaDatabase,
  FaClock
} from 'react-icons/fa';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalPageViews: 0,
    totalDownloads: 0,
    totalViews: 0,
    activeUsers: 0,
    serverUptime: 0,
    totalResources: 0,
    totalProjects: 0,
    totalChallenges: 0
  });
  const [topResources, setTopResources] = useState([]);
  const [trafficData, setTrafficData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [statsData, resourcesData, trafficStats] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getTopResources(),
        analyticsAPI.getTrafficStats()
      ]);

      setStats(statsData);
      setTopResources(Array.isArray(resourcesData) ? resourcesData : []);
      setTrafficData(trafficStats);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page" style={{ minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div className="analytics-header" style={{ marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: 'var(--subtext0)', fontSize: '1.1rem' }}>
            Server statistics, traffic metrics, and performance insights
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Page Views</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                  {formatNumber(stats.totalPageViews)}
                </h3>
              </div>
              <FaEye style={{ fontSize: '2.5rem', color: 'var(--blue)' }} />
            </div>
          </div>

          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Downloads</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                  {formatNumber(stats.totalDownloads)}
                </h3>
              </div>
              <FaDownload style={{ fontSize: '2.5rem', color: 'var(--green)' }} />
            </div>
          </div>

          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Active Users</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                  {formatNumber(stats.activeUsers)}
                </h3>
              </div>
              <FaUsers style={{ fontSize: '2.5rem', color: 'var(--lavender)' }} />
            </div>
          </div>

          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Server Uptime</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                  {formatUptime(stats.serverUptime)}
                </h3>
              </div>
              <FaClock style={{ fontSize: '2.5rem', color: 'var(--yellow)' }} />
            </div>
          </div>
        </div>

        {/* Traffic Stats */}
        <div className="traffic-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' }}>
            <FaNetworkWired style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Traffic Statistics
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Daily Traffic</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--blue)' }}>
                {formatNumber(trafficData.daily)}
              </h3>
              <p style={{ color: 'var(--subtext0)', fontSize: '0.8rem', marginTop: '0.5rem' }}>requests/day</p>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Weekly Traffic</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--green)' }}>
                {formatNumber(trafficData.weekly)}
              </h3>
              <p style={{ color: 'var(--subtext0)', fontSize: '0.8rem', marginTop: '0.5rem' }}>requests/week</p>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Monthly Traffic</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--lavender)' }}>
                {formatNumber(trafficData.monthly)}
              </h3>
              <p style={{ color: 'var(--subtext0)', fontSize: '0.8rem', marginTop: '0.5rem' }}>requests/month</p>
            </div>
          </div>
        </div>

        {/* Server Resources */}
        <div className="server-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' }}>
            <FaServer style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Server Resources
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Resources</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                    {stats.totalResources}
                  </h3>
                </div>
                <FaDatabase style={{ fontSize: '2.5rem', color: 'var(--peach)' }} />
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Projects</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                    {stats.totalProjects}
                  </h3>
                </div>
                <FaChartLine style={{ fontSize: '2.5rem', color: 'var(--teal)' }} />
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Challenges</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                    {stats.totalChallenges}
                  </h3>
                </div>
                <FaChartLine style={{ fontSize: '2.5rem', color: 'var(--mauve)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Resources */}
        <div className="top-resources-section">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' }}>
            <FaChartLine style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Top Resources
          </h2>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            {topResources.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--surface1)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)', fontWeight: '600' }}>
                        Rank
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)', fontWeight: '600' }}>
                        Resource
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--subtext0)', fontWeight: '600' }}>
                        Views
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--subtext0)', fontWeight: '600' }}>
                        Downloads
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--subtext0)', fontWeight: '600' }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topResources.map((resource, index) => (
                      <tr 
                        key={index} 
                        style={{ 
                          borderBottom: '1px solid var(--surface1)',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: '1rem', color: 'var(--text)' }}>
                          <span style={{ 
                            display: 'inline-block',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: index < 3 ? 'var(--blue)' : 'var(--surface2)',
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: '30px',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text)' }}>
                          {resource.title || 'Untitled Resource'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text)' }}>
                          <FaEye style={{ marginRight: '0.3rem', color: 'var(--blue)' }} />
                          {formatNumber(resource.view_count || 0)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text)' }}>
                          <FaDownload style={{ marginRight: '0.3rem', color: 'var(--green)' }} />
                          {formatNumber(resource.download_count || 0)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text)', fontWeight: 'bold' }}>
                          {formatNumber((resource.view_count || 0) + (resource.download_count || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--subtext0)' }}>
                <p>No resource data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
