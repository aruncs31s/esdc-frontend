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
  BiHome, BiUser, BiFolder, BiPhone, BiEnvelope 
} from 'react-icons/bi';
import { 
  HiOutlineHome, HiOutlineUser, HiOutlineFolder,
  HiOutlineUserGroup, HiOutlinePhone, HiOutlineMail
} from 'react-icons/hi';

const IconExamples = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-center mb-8 text-gray-800">React Icons Examples</h2>
      
      {/* Font Awesome Icons */}
      <section>
        <h3 className="my-8 text-gray-600 border-b-2 border-gray-200 pb-2">Font Awesome Icons (FA)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FaReact size={32} color="#61dafb" />
            <span className="mt-2 text-sm text-gray-600 text-center">React</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FaGithub size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">GitHub</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FaLinkedin size={32} color="#0077b5" />
            <span className="mt-2 text-sm text-gray-600 text-center">LinkedIn</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FaPhone size={32} color="#25d366" />
            <span className="mt-2 text-sm text-gray-600 text-center">Phone</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FaEnvelope size={32} color="#ea4335" />
            <span className="mt-2 text-sm text-gray-600 text-center">Email</span>
          </div>
        </div>
      </section>

      {/* Feather Icons */}
      <section>
        <h3 className="my-8 text-gray-600 border-b-2 border-gray-200 pb-2">Feather Icons (FI)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FiUser size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">User</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FiMail size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Mail</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FiPhone size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Phone</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FiMapPin size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Location</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <FiExternalLink size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">External Link</span>
          </div>
        </div>
      </section>

      {/* Material Design Icons */}
      <section>
        <h3 className="my-8 text-gray-600 border-b-2 border-gray-200 pb-2">Material Design Icons (MD)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <MdEmail size={32} color="#ea4335" />
            <span className="mt-2 text-sm text-gray-600 text-center">Email</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <MdPhone size={32} color="#25d366" />
            <span className="mt-2 text-sm text-gray-600 text-center">Phone</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <MdLocationOn size={32} color="#ea4335" />
            <span className="mt-2 text-sm text-gray-600 text-center">Location</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <MdDarkMode size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Dark Mode</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <MdLightMode size={32} color="#ffd700" />
            <span className="mt-2 text-sm text-gray-600 text-center">Light Mode</span>
          </div>
        </div>
      </section>

      {/* Ant Design Icons */}
      <section>
        <h3 className="my-8 text-gray-600 border-b-2 border-gray-200 pb-2">Ant Design Icons (AI)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <AiOutlineHome size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Home</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <AiOutlineUser size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">User</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <AiOutlineProject size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Projects</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <AiOutlineTeam size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Team</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <AiOutlineMail size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Mail</span>
          </div>
        </div>
      </section>

      {/* BoxIcons */}
      <section>
        <h3 className="my-8 text-gray-600 border-b-2 border-gray-200 pb-2">BoxIcons (BI)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <BiHome size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Home</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <BiUser size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">User</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <BiFolder size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Folder</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <HiOutlineUserGroup size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Team</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <BiEnvelope size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Envelope</span>
          </div>
        </div>
      </section>

      {/* Heroicons */}
      <section>
        <h3 className="my-8 text-gray-600 border-b-2 border-gray-200 pb-2">Heroicons (HI)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <HiOutlineHome size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Home</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <HiOutlineUser size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">User</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <HiOutlineFolder size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Folder</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <HiOutlineUserGroup size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">User Group</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <HiOutlineMail size={32} />
            <span className="mt-2 text-sm text-gray-600 text-center">Mail</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IconExamples;