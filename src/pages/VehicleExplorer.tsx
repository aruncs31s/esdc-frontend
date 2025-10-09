import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Plane, Text, Torus } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import * as THREE from 'three';

function Vehicle({ position, rotation }) {
  return (
    <group position={position} rotation={rotation} castShadow>
      {/* Car body */}
      <Box args={[2, 0.8, 4]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial 
          color="#e63946" 
          metalness={0.8} 
          roughness={0.2}
        />
      </Box>
      
      {/* Car roof */}
      <Box args={[1.8, 0.6, 2]} position={[0, 1.1, -0.3]} castShadow>
        <meshStandardMaterial 
          color="#e63946" 
          metalness={0.8} 
          roughness={0.2}
        />
      </Box>
      
      {/* Windows */}
      <Box args={[1.7, 0.5, 1.9]} position={[0, 1.1, -0.3]}>
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.5} 
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Wheels */}
      <Cylinder args={[0.4, 0.4, 0.3]} position={[-1.1, 0.4, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.3]} position={[1.1, 0.4, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.3]} position={[-1.1, 0.4, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.3]} position={[1.1, 0.4, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </Cylinder>
      
      {/* Headlights */}
      <Sphere args={[0.15]} position={[-0.6, 0.5, 2.1]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffeb3b" 
          emissiveIntensity={3}
          metalness={0.9}
        />
      </Sphere>
      <Sphere args={[0.15]} position={[0.6, 0.5, 2.1]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffeb3b" 
          emissiveIntensity={3}
          metalness={0.9}
        />
      </Sphere>
      {/* Headlight beams */}
      <spotLight 
        position={[-0.6, 0.5, 2.1]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={2} 
        distance={15}
        color="#ffeb3b"
        target-position={[-0.6, 0, 10]}
      />
      <spotLight 
        position={[0.6, 0.5, 2.1]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={2} 
        distance={15}
        color="#ffeb3b"
        target-position={[0.6, 0, 10]}
      />
    </group>
  );
}

function Building({ position, size, color }) {
  return (
    <group position={position}>
      <Box args={size} castShadow receiveShadow>
        <meshStandardMaterial 
          color={color} 
          roughness={0.7}
          metalness={0.1}
        />
      </Box>
      {/* Roof */}
      <Box args={[size[0], 0.2, size[2]]} position={[0, size[1] / 2 + 0.1, 0]} castShadow>
        <meshStandardMaterial 
          color="#3a3a3a" 
          roughness={0.6}
        />
      </Box>
      {/* Windows */}
      {Array.from({ length: Math.floor(size[1] / 2) }).map((_, floor) => (
        Array.from({ length: 3 }).map((_, col) => (
          <Box 
            key={`window-${floor}-${col}`}
            args={[0.6, 0.8, 0.05]} 
            position={[
              -size[0]/3 + col * size[0]/3,
              -size[1]/2 + 1 + floor * 2,
              size[2]/2 + 0.05
            ]}
          >
            <meshStandardMaterial 
              color="#89b4fa" 
              emissive="#89b4fa"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </Box>
        ))
      ))}
    </group>
  );
}

function ProjectBuilding({ position, text, color, icon }) {
  const doorRef = useRef();
  const signRef = useRef();
  
  useFrame((state) => {
    if (signRef.current) {
      signRef.current.position.y = 5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Main building */}
      <Box args={[6, 5, 6]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      
      {/* Roof */}
      <Box args={[6.5, 0.5, 6.5]} position={[0, 5.25, 0]}>
        <meshStandardMaterial color="#585b70" />
      </Box>
      
      {/* Door frame */}
      <Box args={[2, 3, 0.2]} position={[0, 1.5, 3.1]}>
        <meshStandardMaterial color="#313244" />
      </Box>
      
      {/* Door */}
      <Box ref={doorRef} args={[1.8, 2.8, 0.15]} position={[0, 1.4, 3.15]}>
        <meshStandardMaterial color="#1e1e2e" metalness={0.3} />
      </Box>
      
      {/* Door handle */}
      <Sphere args={[0.1]} position={[0.7, 1.4, 3.25]}>
        <meshStandardMaterial color="#f9e2af" metalness={1} />
      </Sphere>
      
      {/* Windows */}
      {[-1.5, 1.5].map((x, i) => (
        <Box key={`window-${i}`} args={[1.2, 1.5, 0.1]} position={[x, 3.5, 3.05]}>
          <meshStandardMaterial color="#89b4fa" transparent opacity={0.6} emissive="#89b4fa" emissiveIntensity={0.3} />
        </Box>
      ))}
      
      {/* Sign above door */}
      <Box ref={signRef} args={[3, 0.8, 0.1]} position={[0, 5, 3.1]}>
        <meshStandardMaterial color="#313244" />
      </Box>
      
      <Text
        position={[0, 5, 3.2]}
        fontSize={0.35}
        color="#cdd6f4"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#1e1e2e"
      >
        {text}
      </Text>
      
      {/* Icon above sign */}
      <Text
        position={[0, 5.8, 3.1]}
        fontSize={0.6}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>
      
      {/* Lights on sides */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={`light-${i}`}>
          <Cylinder args={[0.15, 0.15, 0.4]} position={[x, 3, 3.1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#f9e2af" emissive="#f9e2af" emissiveIntensity={1} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

function UserAvatar({ position, username, color }) {
  const avatarRef = useRef();
  const [bobPhase] = useState(Math.random() * Math.PI * 2);
  
  useFrame((state) => {
    if (avatarRef.current) {
      avatarRef.current.position.y = 1 + Math.sin(state.clock.getElapsedTime() * 2 + bobPhase) * 0.1;
      avatarRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });
  
  return (
    <group position={position}>
      {/* Avatar body */}
      <group ref={avatarRef}>
        <Cylinder args={[0.3, 0.4, 1.2]} position={[0, 0.6, 0]} castShadow>
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        </Cylinder>
        
        {/* Avatar head */}
        <Sphere args={[0.35]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        </Sphere>
        
        {/* Eyes */}
        <Sphere args={[0.08]} position={[-0.12, 1.55, 0.3]} castShadow>
          <meshStandardMaterial color="#1e1e2e" />
        </Sphere>
        <Sphere args={[0.08]} position={[0.12, 1.55, 0.3]} castShadow>
          <meshStandardMaterial color="#1e1e2e" />
        </Sphere>
        
        {/* Smile */}
        <Torus args={[0.12, 0.03, 8, 16, Math.PI]} position={[0, 1.4, 0.3]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#1e1e2e" />
        </Torus>
        
        {/* Arms */}
        <Cylinder args={[0.1, 0.1, 0.6]} position={[-0.5, 0.8, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        </Cylinder>
        <Cylinder args={[0.1, 0.1, 0.6]} position={[0.5, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        </Cylinder>
        

      </group>
      
      {/* Username label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color="#cdd6f4"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#1e1e2e"
      >
        {username}
      </Text>
      
      {/* Shadow circle */}
      <Cylinder args={[0.4, 0.4, 0.05]} position={[0, 0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#1e1e2e" transparent opacity={0.3} />
      </Cylinder>
    </group>
  );
}

function ChatbotShop({ position }) {
  const botRef = useRef();
  
  useFrame((state) => {
    if (botRef.current) {
      botRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * 0.3;
    }
  });
  
  return (
    <group position={position}>
      {/* Shop building */}
      <Box args={[8, 6, 8]} position={[0, 3, 0]}>
        <meshStandardMaterial color="#cba6f7" roughness={0.6} />
      </Box>
      
      {/* Roof */}
      <Box args={[8.5, 0.6, 8.5]} position={[0, 6.3, 0]}>
        <meshStandardMaterial color="#585b70" />
      </Box>
      
      {/* Large entrance */}
      <Box args={[4, 4, 0.2]} position={[0, 2, 4.1]}>
        <meshStandardMaterial color="#313244" />
      </Box>
      
      {/* Glass door */}
      <Box args={[3.8, 3.8, 0.1]} position={[0, 2, 4.15]}>
        <meshStandardMaterial color="#89b4fa" transparent opacity={0.4} />
      </Box>
      
      {/* Shop sign */}
      <Box args={[6, 1.2, 0.15]} position={[0, 6.8, 4.1]}>
        <meshStandardMaterial color="#313244" />
      </Box>
      
      <Text
        position={[0, 6.8, 4.25]}
        fontSize={0.5}
        color="#a6e3a1"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#1e1e2e"
      >
        💬 Help Desk
      </Text>
      
      {/* Chatbot sitting at desk inside (visible through window) */}
      <group position={[0, 1.5, 0]} ref={botRef}>
        {/* Desk */}
        <Box args={[2, 0.1, 1]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#6c7086" />
        </Box>
        
        {/* Bot body */}
        <Box args={[0.6, 0.8, 0.6]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#89b4fa" metalness={0.6} />
        </Box>
        
        {/* Bot head */}
        <Sphere args={[0.4]} position={[0, 2.3, 0]}>
          <meshStandardMaterial color="#89b4fa" metalness={0.6} />
        </Sphere>
        
        {/* Bot eyes */}
        <Sphere args={[0.08]} position={[-0.15, 2.35, 0.35]}>
          <meshStandardMaterial color="#a6e3a1" emissive="#a6e3a1" emissiveIntensity={2} />
        </Sphere>
        <Sphere args={[0.08]} position={[0.15, 2.35, 0.35]}>
          <meshStandardMaterial color="#a6e3a1" emissive="#a6e3a1" emissiveIntensity={2} />
        </Sphere>
        
        {/* Bot antenna */}
        <Cylinder args={[0.03, 0.03, 0.3]} position={[0, 2.8, 0]}>
          <meshStandardMaterial color="#f9e2af" />
        </Cylinder>
        <Sphere args={[0.08]} position={[0, 2.95, 0]}>
          <meshStandardMaterial color="#f38ba8" emissive="#f38ba8" emissiveIntensity={1} />
        </Sphere>
      </group>
      
      {/* Welcome mat */}
      <Box args={[3, 0.05, 1.5]} position={[0, 0.03, 5.5]}>
        <meshStandardMaterial color="#f38ba8" />
      </Box>
    </group>
  );
}

function Scene({ vehiclePos, vehicleRot, onlineUsers }) {
  const buildings = [
    { position: [-12, 0, -15], text: 'Projects Hub', link: '/community-projects', color: '#89b4fa', icon: '💻' },
    { position: [12, 0, 0], text: 'Shop', link: '/products', color: '#f38ba8', icon: '🛍️' },
    { position: [-12, 0, 15], text: 'Library', link: '/resources', color: '#a6e3a1', icon: '📚' },
    { position: [12, 0, 30], text: 'Events Hall', link: '/events', color: '#fab387', icon: '🎉' }
  ];
  
  return (
    <>
      {/* Ground with grass texture */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial 
          color="#3a8028" 
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>
      
      {/* Road with asphalt texture */}
      <Plane args={[8, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial 
          color="#2d2d2d" 
          roughness={0.95}
          metalness={0.05}
        />
      </Plane>
      
      {/* Road lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Box key={i} args={[0.3, 0.02, 2]} position={[0, 0.02, -40 + i * 5]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#f9e2af"
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
      
      {/* Decorative Buildings with shadows */}
      <Building position={[-20, 3, -25]} size={[5, 6, 5]} color="#4a5568" />
      <Building position={[20, 4, -20]} size={[6, 8, 5]} color="#5a6478" />
      <Building position={[-22, 2.5, 35]} size={[4, 5, 4]} color="#6b7280" />
      <Building position={[22, 3.5, 40]} size={[5, 7, 5]} color="#7c8594" />
      
      {/* Interactive Project Buildings */}
      {buildings.map((building, i) => (
        <ProjectBuilding 
          key={i} 
          position={building.position} 
          text={building.text}
          link={building.link}
          color={building.color}
          icon={building.icon}
        />
      ))}
      
      {/* Chatbot Help Desk Shop */}
      <ChatbotShop position={[0, 0, -30]} />
      
      {/* Online Users Avatars */}
      {onlineUsers.map((user) => (
        <UserAvatar
          key={user.id}
          position={user.position}
          username={user.username}
          color={user.color}
        />
      ))}
      
      {/* Trees - Fixed positions */}
      {[
        [-25, 0, -20], [-30, 0, -10], [-28, 0, 5], [-32, 0, 20], [-26, 0, 35],
        [25, 0, -18], [30, 0, -8], [28, 0, 8], [32, 0, 22], [26, 0, 38],
        [-15, 0, -35], [-18, 0, -28], [15, 0, -32], [18, 0, -25],
        [-20, 0, 45], [-24, 0, 50], [20, 0, 48], [24, 0, 52],
        [-35, 0, -5], [-38, 0, 10], [35, 0, -3], [38, 0, 12],
        [-22, 0, -15], [22, 0, -12], [-25, 0, 25], [25, 0, 28]
      ].map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Tree trunk */}
          <Cylinder args={[0.3, 0.4, 2]} position={[0, 1, 0]} castShadow>
            <meshStandardMaterial 
              color="#4a3728" 
              roughness={0.9}
            />
          </Cylinder>
          {/* Tree foliage */}
          <Sphere args={[1.5]} position={[0, 3, 0]} castShadow>
            <meshStandardMaterial 
              color="#2d5016" 
              roughness={0.8}
            />
          </Sphere>
          {/* Additional foliage layers for depth */}
          <Sphere args={[1.2]} position={[0.5, 3.5, 0.3]} castShadow>
            <meshStandardMaterial 
              color="#3a6b1f" 
              roughness={0.8}
            />
          </Sphere>
          <Sphere args={[1.0]} position={[-0.4, 3.8, -0.2]} castShadow>
            <meshStandardMaterial 
              color="#2d5016" 
              roughness={0.8}
            />
          </Sphere>
        </group>
      ))}
      
      <Vehicle position={vehiclePos} rotation={vehicleRot} />
    </>
  );
}

function Camera({ vehiclePos, vehicleRot }) {
  useFrame(({ camera }) => {
    const offset = new THREE.Vector3(0, 3, -8);
    offset.applyEuler(new THREE.Euler(vehicleRot[0], vehicleRot[1], vehicleRot[2]));
    
    camera.position.lerp(
      new THREE.Vector3(vehiclePos[0] + offset.x, vehiclePos[1] + offset.y, vehiclePos[2] + offset.z),
      0.1
    );
    camera.lookAt(vehiclePos[0], vehiclePos[1] + 1, vehiclePos[2]);
  });
  
  return null;
}

const VehicleExplorer = () => {
  const navigate = useNavigate();
  const { user: _user, isAuthenticated: _isAuthenticated } = useContext(AuthContext);
  const [vehiclePos, setVehiclePos] = useState([0, 0, 0]);
  const [vehicleRot, setVehicleRot] = useState([0, 0, 0]);
  const [speed, setSpeed] = useState(0);
  const [nearPortal, setNearPortal] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const keysPressed = useRef({});
  
  // Generate random users for demo
  useEffect(() => {
    const colors = ['#89b4fa', '#f38ba8', '#a6e3a1', '#fab387', '#cba6f7', '#89dceb'];
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    
    const users = [];
    
    // Add random online users (not including current user to avoid complexity)
    const numUsers = 4;
    for (let i = 0; i < numUsers; i++) {
      users.push({
        id: `user-${i}`,
        username: names[i],
        position: [
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 40
        ],
        color: colors[i]
      });
    }
    
    setOnlineUsers(users);
  }, []); // Only run once on mount
  
  const buildings = useMemo(() => [
    { position: [-12, 0, -15], text: 'Projects Hub', link: '/community-projects' },
    { position: [12, 0, 0], text: 'Shop', link: '/products' },
    { position: [-12, 0, 15], text: 'Library', link: '/resources' },
    { position: [12, 0, 30], text: 'Events Hall', link: '/events' },
    { position: [0, 0, -30], text: 'Help Desk', link: '#chatbot' }
  ], []);
  
  const handlePortalEnter = useCallback((link) => {
    navigate(link);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      
      // Check if near building and E is pressed
      if (e.key.toLowerCase() === 'e' && nearPortal) {
        if (nearPortal === '#chatbot') {
          // Open chatbot
          const chatbotBtn = document.querySelector('.chatbot-toggle');
          if (chatbotBtn) chatbotBtn.click();
        } else {
          handlePortalEnter(nearPortal);
        }
      }
    };
    
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const interval = setInterval(() => {
      let newSpeed = speed;
      let newRot = [...vehicleRot];
      
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        newSpeed = Math.min(newSpeed + 0.01, 0.3);
      } else if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        newSpeed = Math.max(newSpeed - 0.01, -0.15);
      } else {
        newSpeed *= 0.95;
      }
      
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        newRot[1] += 0.03;
      }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        newRot[1] -= 0.03;
      }
      
      const newPos = [
        vehiclePos[0] + Math.sin(newRot[1]) * newSpeed,
        vehiclePos[1],
        vehiclePos[2] + Math.cos(newRot[1]) * newSpeed
      ];
      
      // Check proximity to buildings
      let closestBuilding = null;
      let minDistance = Infinity;
      
      buildings.forEach((building) => {
        const distance = Math.sqrt(
          Math.pow(newPos[0] - building.position[0], 2) +
          Math.pow(newPos[2] - building.position[2], 2)
        );
        
        if (distance < 8 && distance < minDistance) {
          minDistance = distance;
          closestBuilding = building.link;
        }
      });
      
      setNearPortal(closestBuilding);
      setVehiclePos(newPos);
      setVehicleRot(newRot);
      setSpeed(newSpeed);
    }, 16);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [vehiclePos, vehicleRot, speed, buildings, handlePortalEnter, nearPortal]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 100%)' }}>
      <Canvas shadows camera={{ position: [0, 5, -10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[20, 30, 20]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <hemisphereLight intensity={0.3} groundColor="#40a02b" />
        <pointLight position={[-10, 10, -10]} intensity={0.3} color="#f9e2af" />
        
        <Scene 
          vehiclePos={vehiclePos} 
          vehicleRot={vehicleRot} 
          onlineUsers={onlineUsers}
        />
        <Camera vehiclePos={vehiclePos} vehicleRot={vehicleRot} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(30, 30, 46, 0.9)',
        padding: '1rem 2rem',
        borderRadius: '12px',
        color: 'var(--text)',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Controls</p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          W/↑ - Forward | S/↓ - Backward | A/← - Left | D/→ - Right | E - Enter Building
        </p>
      </div>
      
      {nearPortal && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(166, 227, 161, 0.95)',
          padding: '1.5rem 3rem',
          borderRadius: '16px',
          color: '#1e1e2e',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          fontSize: '1.5rem',
          fontWeight: '700',
          animation: 'pulse 1s infinite'
        }}>
          Press E to Enter Building
        </div>
      )}
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(30, 30, 46, 0.9)',
        padding: '1rem',
        borderRadius: '12px',
        color: 'var(--text)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>ESDC Explorer</h3>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--subtext0)' }}>
          Drive around and explore!
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--green)'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#a6e3a1',
            animation: 'pulse 2s infinite'
          }} />
          {onlineUsers.length} users online
        </div>
      </div>
    </div>
  );
};

export default VehicleExplorer;

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(style);
