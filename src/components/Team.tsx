const Team = () => {
  const teams = [
    {
      name: "AI Assistant Team",
      description: "Developing AI-powered solutions and assistants",
      members: [
        {
          name: "Arun cs",
          role: "Designer",
          avatar: "https://github.com/aruncs31s.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/aruncs31s"
        },
        {
          name: "vyshnav kp",
          role: "Designer",
          avatar: "https://github.com/vyshnav8486.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/vyshnav8486"
        },
        {
          name: "Abhaya Govind",
          role: "Developer",
          avatar: "https://github.com/AbhayaGovind.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/AbhayaGovind"
        },
        {
          name: "Dhanashyam Babu",
          role: "Developer",
          avatar: "https://github.com/dhanashyam18.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/dhanashyam18"
        }
      ]
    },
    {
      name: "Hardware Team",
      description: "Building and designing hardware solutions",
      members: [
        {
          name: "Arun cs",
          role: "Designer",
          avatar: "https://github.com/aruncs31s.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/aruncs31s"
        },
        {
          name: "Meenakshi Poyyil",
          role: "Designer",
          avatar: "https://github.com/MeenakshiPoyyil.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/MeenakshiPoyyil"
        },
        {
          name: "Sangeeth Binu",
          role: "Designer",
          avatar: "https://github.com/Sangeeth-binu.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/Sangeeth-binu"
        }
      ]
    },
    {
      name: "Web Team",
      description: "Creating and maintaining web applications",
      members: [
        {
          name: "Arun cs",
          role: "Designer, Developer",
          avatar: "https://github.com/aruncs31s.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/aruncs31s"
        },
        {
          name: "sanjusathian",
          role: "Designer, Developer",
          avatar: "https://github.com/sanjusathian.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/sanjusathian"
        },
        {
          name: "the-unknown-monkey",
          role: "Designer, Developer",
          avatar: "https://github.com/the-unknown-monkey.png",
          github: "https://github.com/orgs/Embedded-Systems-GCEK/people/the-unknown-monkey"
        }
      ]
    }
  ];

  return (
    <section id="team" className="team">
      <div className="container">
        <div className="section-header">
          <h2>Our Team</h2>
          <p>Meet the passionate individuals driving ESDC forward</p>
        </div>

        {teams.map((team, teamIndex) => (
          <div key={teamIndex} className="team-category">
            <h3>{team.name}</h3>
            <p className="team-description">{team.description}</p>
            <div className="team-members">
              {team.members.map((member, memberIndex) => (
                <div key={memberIndex} className="team-card">
                  <div className="team-avatar">
                    {member.avatar.startsWith('http') ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      member.avatar
                    )}
                  </div>
                  <h4>{member.name}</h4>
                  <p className="team-role">{member.role}</p>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    GitHub
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;