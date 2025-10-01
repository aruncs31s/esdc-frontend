import React from 'react';
// Import icons from different icon libraries available in react-icons
import { 
  FaReact, FaGithub, FaLinkedin, FaTwitter, FaInstagram, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowUp 
} from 'react-icons/fa';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiExternalLink,
  FiGithub, FiLinkedin, FiTwitter, FiInstagram
} from 'react-icons/fi';
import { 
  MdEmail, MdPhone, MdLocationOn, MdArrowUpward,
  MdDarkMode, MdLightMode, MdMenu, MdClose
} from 'react-icons/md';
import { 
  AiOutlineHome, AiOutlineUser, AiOutlineProject,
  AiOutlineTeam, AiOutlinePhone, AiOutlineMail
} from 'react-icons/ai';
import { 
  BiHome, BiUser, BiFolder, BiTeam, BiPhone, BiEnvelope 
} from 'react-icons/bi';
import { 
  HiOutlineHome, HiOutlineUser, HiOutlineFolder,
  HiOutlineUserGroup, HiOutlinePhone, HiOutlineMail
} from 'react-icons/hi';

const IconExamples = () => {
  return (
    <div className="icon-examples">
      <h2>React Icons Examples</h2>
      
      {/* Font Awesome Icons */}
      <section>
        <h3>Font Awesome Icons (FA)</h3>
        <div className="icon-grid">
          <div className="icon-item">
            <FaReact size={32} color="#61dafb" />
            <span>React</span>
          </div>
          <div className="icon-item">
            <FaGithub size={32} />
            <span>GitHub</span>
          </div>
          <div className="icon-item">
            <FaLinkedin size={32} color="#0077b5" />
            <span>LinkedIn</span>
          </div>
          <div className="icon-item">
            <FaPhone size={32} color="#25d366" />
            <span>Phone</span>
          </div>
          <div className="icon-item">
            <FaEnvelope size={32} color="#ea4335" />
            <span>Email</span>
          </div>
        </div>
      </section>

      {/* Feather Icons */}
      <section>
        <h3>Feather Icons (FI)</h3>
        <div className="icon-grid">
          <div className="icon-item">
            <FiUser size={32} />
            <span>User</span>
          </div>
          <div className="icon-item">
            <FiMail size={32} />
            <span>Mail</span>
          </div>
          <div className="icon-item">
            <FiPhone size={32} />
            <span>Phone</span>
          </div>
          <div className="icon-item">
            <FiMapPin size={32} />
            <span>Location</span>
          </div>
          <div className="icon-item">
            <FiExternalLink size={32} />
            <span>External Link</span>
          </div>
        </div>
      </section>

      {/* Material Design Icons */}
      <section>
        <h3>Material Design Icons (MD)</h3>
        <div className="icon-grid">
          <div className="icon-item">
            <MdEmail size={32} color="#ea4335" />
            <span>Email</span>
          </div>
          <div className="icon-item">
            <MdPhone size={32} color="#25d366" />
            <span>Phone</span>
          </div>
          <div className="icon-item">
            <MdLocationOn size={32} color="#ea4335" />
            <span>Location</span>
          </div>
          <div className="icon-item">
            <MdDarkMode size={32} />
            <span>Dark Mode</span>
          </div>
          <div className="icon-item">
            <MdLightMode size={32} color="#ffd700" />
            <span>Light Mode</span>
          </div>
        </div>
      </section>

      {/* Ant Design Icons */}
      <section>
        <h3>Ant Design Icons (AI)</h3>
        <div className="icon-grid">
          <div className="icon-item">
            <AiOutlineHome size={32} />
            <span>Home</span>
          </div>
          <div className="icon-item">
            <AiOutlineUser size={32} />
            <span>User</span>
          </div>
          <div className="icon-item">
            <AiOutlineProject size={32} />
            <span>Projects</span>
          </div>
          <div className="icon-item">
            <AiOutlineTeam size={32} />
            <span>Team</span>
          </div>
          <div className="icon-item">
            <AiOutlineMail size={32} />
            <span>Mail</span>
          </div>
        </div>
      </section>

      {/* BoxIcons */}
      <section>
        <h3>BoxIcons (BI)</h3>
        <div className="icon-grid">
          <div className="icon-item">
            <BiHome size={32} />
            <span>Home</span>
          </div>
          <div className="icon-item">
            <BiUser size={32} />
            <span>User</span>
          </div>
          <div className="icon-item">
            <BiFolder size={32} />
            <span>Folder</span>
          </div>
          <div className="icon-item">
            <BiTeam size={32} />
            <span>Team</span>
          </div>
          <div className="icon-item">
            <BiEnvelope size={32} />
            <span>Envelope</span>
          </div>
        </div>
      </section>

      {/* Heroicons */}
      <section>
        <h3>Heroicons (HI)</h3>
        <div className="icon-grid">
          <div className="icon-item">
            <HiOutlineHome size={32} />
            <span>Home</span>
          </div>
          <div className="icon-item">
            <HiOutlineUser size={32} />
            <span>User</span>
          </div>
          <div className="icon-item">
            <HiOutlineFolder size={32} />
            <span>Folder</span>
          </div>
          <div className="icon-item">
            <HiOutlineUserGroup size={32} />
            <span>User Group</span>
          </div>
          <div className="icon-item">
            <HiOutlineMail size={32} />
            <span>Mail</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .icon-examples {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .icon-examples h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
        }
        
        .icon-examples h3 {
          margin: 2rem 0 1rem 0;
          color: #555;
          border-bottom: 2px solid #eee;
          padding-bottom: 0.5rem;
        }
        
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .icon-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .icon-item span {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default IconExamples;