import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text, Sphere } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';
import '../styles/threeLanding.css';

// Intel-style CPU
function IntelCPU({ mouse, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const pinsRef = useRef([]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.5, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouse.y * 0.3, 0.1);
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }

    // Animate pins when clicked
    if (clicked) {
      pinsRef.current.forEach((pin, i) => {
        if (pin) {
          const pulse = Math.sin(state.clock.elapsedTime * 5 + i * 0.1) * 0.5 + 0.5;
          pin.material.emissive.setHex(0xffaa00);
          pin.material.emissiveIntensity = pulse * 0.5;
        }
      });
    }
  });

  const handleClick = () => {
    setClicked(!clicked);
    onClick?.();
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        scale={hovered ? 1.1 : 1}
        rotation={[Math.PI * 0.15, 0, 0]}
        style={{ cursor: 'pointer' }}
      >
        {/* CPU Substrate (green PCB) */}
        <mesh castShadow>
          <boxGeometry args={[2, 0.1, 2]} />
          <meshStandardMaterial color="#1a5c2e" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* IHS (Integrated Heat Spreader) - Silver metal top */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 1.8]} />
          <meshStandardMaterial 
            color={clicked ? "#ff6b35" : hovered ? "#d8d8d8" : "#b8b8b8"} 
            roughness={0.2} 
            metalness={0.9}
            emissive={clicked ? "#ff4500" : "#000000"}
            emissiveIntensity={clicked ? 0.3 : 0}
          />
        </mesh>

        {/* Heat glow when active */}
        {clicked && (
          <pointLight position={[0, 0.3, 0]} color="#ff6b35" intensity={2} distance={3} />
        )}

        {/* Intel logo area */}
        <mesh position={[0, 0.23, 0.5]}>
          <boxGeometry args={[0.8, 0.01, 0.3]} />
          <meshStandardMaterial color="#0071c5" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* CPU Text */}
        <Text
          position={[0, 0.24, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ESDC
        </Text>

        {/* Core i9 style text */}
        <Text
          position={[0, 0.24, -0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.12}
          color="#333333"
          anchorX="center"
          anchorY="middle"
        >
          Core X9
        </Text>

        {/* LGA Pins (Land Grid Array - small gold contacts) */}
        {Array.from({ length: 20 }).map((_, i) =>
          Array.from({ length: 20 }).map((_, j) => {
            const index = i * 20 + j;
            return (
              <mesh
                key={`pin-${i}-${j}`}
                ref={(el) => (pinsRef.current[index] = el)}
                position={[-0.9 + i * 0.095, -0.05, -0.9 + j * 0.095]}
              >
                <boxGeometry args={[0.04, 0.02, 0.04]} />
                <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
              </mesh>
            );
          })
        )}

        {/* Corner notch (Intel CPUs have a corner cut) */}
        <mesh position={[-0.85, 0.15, -0.85]}>
          <boxGeometry args={[0.2, 0.16, 0.2]} />
          <meshStandardMaterial color="#1a5c2e" roughness={0.4} />
        </mesh>

        {/* Capacitors on substrate */}
        {[[-0.7, -0.6], [0.7, -0.6], [-0.7, 0.6], [0.7, 0.6]].map((pos, i) => (
          <mesh key={`cap-${i}`} position={[pos[0], 0.08, pos[1]]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08]} />
            <meshStandardMaterial color="#2c2c2c" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Orbiting particles
function OrbitingParticles() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i) * 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial
              color={['#89b4fa', '#cba6f7', '#a6e3a1', '#fab387'][i % 4]}
              emissive={['#89b4fa', '#cba6f7', '#a6e3a1', '#fab387'][i % 4]}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Simple background
function Background() {
  return (
    <mesh position={[0, 0, -8]} scale={[20, 20, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#1e1e2e" />
    </mesh>
  );
}

// Mouse tracker
function MouseTracker({ onMouseMove }) {
  useFrame((state) => {
    onMouseMove({ x: state.mouse.x, y: state.mouse.y });
  });
  return null;
}

// 3D Scene
function Scene({ mouse, onCPUClick }) {
  return (
    <>
      <color attach="background" args={['#11111b']} />
      <fog attach="fog" args={['#11111b', 8, 25]} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, 3, -5]} intensity={1} color="#89b4fa" />
      <pointLight position={[5, 3, -5]} intensity={1} color="#cba6f7" />

      <Suspense fallback={null}>
        <IntelCPU mouse={mouse} onClick={onCPUClick} />
        <OrbitingParticles />
        <Background />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

// Main Component
const ThreeLanding = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [cpuActive, setCpuActive] = useState(false);
  const [clubStats, setClubStats] = useState({ members: 0, projects: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch all stats in parallel
        const [usersRes, projectsRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/projects`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/events`).catch(() => ({ data: [] }))
        ]);

        setClubStats({
          members: usersRes.data?.length || 0,
          projects: projectsRes.data?.length || 0,
          events: eventsRes.data?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default values
        setClubStats({ members: 150, projects: 45, events: 28 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCPUClick = () => {
    setCpuActive(!cpuActive);
  };

  return (
    <div className="three-landing-container">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }} 
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <MouseTracker onMouseMove={setMouse} />
        <Scene mouse={mouse} onCPUClick={handleCPUClick} />
      </Canvas>

      {/* Club Stats Overlay */}
      {cpuActive && (
        <div style={{
          position: 'absolute',
          bottom: '150px',
          right: '50px',
          background: 'rgba(17, 17, 27, 0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '2px solid #89b4fa',
          boxShadow: '0 8px 32px rgba(137, 180, 250, 0.3)',
          animation: 'fadeInUp 0.5s ease-out',
          pointerEvents: 'none'
        }}>
          <h3 style={{ color: '#89b4fa', marginBottom: '1rem', fontSize: '1.2rem' }}>Club Stats</h3>
          {loading ? (
            <div style={{ color: '#bac2de', textAlign: 'center' }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ color: '#cdd6f4' }}>
                <span style={{ color: '#bac2de' }}>Total Members:</span>{' '}
                <span style={{ color: '#89b4fa', fontWeight: 'bold' }}>
                  {clubStats.members}
                </span>
              </div>
              <div style={{ color: '#cdd6f4' }}>
                <span style={{ color: '#bac2de' }}>Active Projects:</span>{' '}
                <span style={{ color: '#a6e3a1', fontWeight: 'bold' }}>{clubStats.projects}</span>
              </div>
              <div style={{ color: '#cdd6f4' }}>
                <span style={{ color: '#bac2de' }}>Events Hosted:</span>{' '}
                <span style={{ color: '#fab387', fontWeight: 'bold' }}>{clubStats.events}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interaction Hint */}

      <div className="three-landing-overlay">
        <div className="three-landing-hero">
          <h1 className="three-landing-title">ESDC</h1>
          <div className="three-landing-divider" />
          <p className="three-landing-subtitle">Embedded Systems Design Club</p>
          <p className="three-landing-description">
            Building the future with microcontrollers, IoT, and embedded systems
          </p>

          <div className="three-landing-cta">
            <Link to="/projects" className="three-landing-btn-primary">
              Explore Projects
            </Link>
            <Link to="/contact" className="three-landing-btn-secondary">
              Join Us
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ThreeLanding;
