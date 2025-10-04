import { useAuth } from '../hooks/useAuth';
import ProfileCard from '../components/ProfileCard';

/**
 * Example: Using ProfileCard Component
 * 
 * This file demonstrates various ways to use the ProfileCard component
 */

// Example 1: Basic usage with current user
export const BasicProfileCardExample = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Basic Profile Card</h2>
      <ProfileCard user={user} />
    </div>
  );
};

// Example 2: Profile card with edit functionality
export const EditableProfileCardExample = () => {
  const { user } = useAuth();

  const handleEdit = () => {
    console.log('Edit profile clicked');
    // Navigate to edit page or open modal
    alert('Edit profile functionality');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Editable Profile Card</h2>
      <ProfileCard 
        user={user} 
        editable={true}
        onEdit={handleEdit}
      />
    </div>
  );
};

// Example 3: Profile card without statistics
export const SimpleProfileCardExample = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Simple Profile Card (No Stats)</h2>
      <ProfileCard 
        user={user} 
        showStats={false}
      />
    </div>
  );
};

// Example 4: Profile card with custom statistics
export const CustomStatsProfileCardExample = () => {
  const { user } = useAuth();
  
  const customStats = {
    points: 1250,
    completedChallenges: 15
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Card with Custom Stats</h2>
      <ProfileCard 
        user={user} 
        stats={customStats}
      />
    </div>
  );
};

// Example 5: Profile card with minimal user data
export const MinimalProfileCardExample = () => {
  const minimalUser = {
    username: 'johndoe',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Minimal Profile Card</h2>
      <ProfileCard user={minimalUser} />
    </div>
  );
};

// Example 6: Profile card with GitHub data
export const GitHubProfileCardExample = () => {
  const githubUser = {
    login: 'octocat',
    name: 'The Octocat',
    avatar_url: 'https://github.com/octocat.png',
    html_url: 'https://github.com/octocat',
    bio: 'GitHub mascot and friendly robot',
    created_at: '2011-01-25T18:44:36Z'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>GitHub Profile Card</h2>
      <ProfileCard 
        user={githubUser}
        showStats={true}
        stats={{ points: 500, completedChallenges: 10 }}
      />
    </div>
  );
};

// Example 7: Multiple profile cards in a grid
export const ProfileCardGridExample = () => {
  const users = [
    {
      username: 'alice',
      name: 'Alice Johnson',
      avatar_url: 'https://github.com/alice.png',
      role: 'admin',
      points: 1500,
      completedChallenges: 20
    },
    {
      username: 'bob',
      name: 'Bob Smith',
      avatar_url: 'https://github.com/bob.png',
      points: 800,
      completedChallenges: 12
    },
    {
      username: 'charlie',
      name: 'Charlie Brown',
      avatar_url: 'https://github.com/charlie.png',
      points: 600,
      completedChallenges: 8
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Card Grid</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {users.map((user) => (
          <ProfileCard 
            key={user.username}
            user={user}
            showStats={true}
            stats={{ 
              points: user.points, 
              completedChallenges: user.completedChallenges 
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Example 8: Empty state
export const EmptyProfileCardExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Empty Profile Card</h2>
      <ProfileCard user={null} />
    </div>
  );
};

// Main component to display all examples
const ProfileCardExamples = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        ProfileCard Component Examples
      </h1>
      
      <BasicProfileCardExample />
      <hr style={{ margin: '40px 0' }} />
      
      <EditableProfileCardExample />
      <hr style={{ margin: '40px 0' }} />
      
      <SimpleProfileCardExample />
      <hr style={{ margin: '40px 0' }} />
      
      <CustomStatsProfileCardExample />
      <hr style={{ margin: '40px 0' }} />
      
      <MinimalProfileCardExample />
      <hr style={{ margin: '40px 0' }} />
      
      <GitHubProfileCardExample />
      <hr style={{ margin: '40px 0' }} />
      
      <ProfileCardGridExample />
      <hr style={{ margin: '40px 0' }} />
      
      <EmptyProfileCardExample />
    </div>
  );
};

export default ProfileCardExamples;
