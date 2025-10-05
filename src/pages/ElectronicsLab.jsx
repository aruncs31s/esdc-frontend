import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

function Arduino({ position, mousePos }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = mousePos.x * 0.5;
      ref.current.rotation.x = -mousePos.y * 0.3;
    }
  });
  return (
    <group ref={ref} position={position} scale={1.5}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#006699" />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.7, 0.15, 0.5]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} position={[-0.9, -0.05, -0.65 + i * 0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.15]} />
          <meshStandardMaterial color="#ffd700" metalness={1} />
        </mesh>
      ))}
    </group>
  );
}

function LED({ position, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 2 + Math.sin(state.clock.getElapsedTime() * 3) * 0.8;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

function Computer({ position, mousePos }) {
  const screenRef = useRef();
  const groupRef = useRef();
  useFrame((state) => {
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = mousePos.x * 0.2;
    }
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.11]}>
        <boxGeometry args={[1.8, 1.3, 0.02]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#1e3a8a" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 0.3, 0.12]} fontSize={0.15} color="#00ff00">ESDC LAB</Text>
      <Text position={[0, 0, 0.12]} fontSize={0.1} color="#00ff00">System Ready</Text>
      <Text position={[0, -0.2, 0.12]} fontSize={0.08} color="#888888">Mouse: {mousePos.x.toFixed(2)}, {mousePos.y.toFixed(2)}</Text>
      <mesh position={[0, -0.85, 0.3]}>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, -0.9, 0.5]}>
        <boxGeometry args={[1, 0.05, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function Oscilloscope({ position, mousePos }) {
  const ref = useRef();
  const waveRef = useRef([]);
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.4 + Math.sin(state.clock.getElapsedTime() * 4) * 0.2;
    }
    waveRef.current.forEach((point, i) => {
      if (point) {
        const wave = Math.sin(state.clock.getElapsedTime() * 3 + i * 0.3 + mousePos.x * 2) * 0.2;
        point.position.y = wave;
      }
    });
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.2, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh ref={ref} position={[0, 0.1, 0.41]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#001a00" emissive="#00ff00" emissiveIntensity={0.4} />
      </mesh>
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={i} ref={(el) => (waveRef.current[i] = el)} position={[-0.55 + i * 0.04, 0.1, 0.42]}>
          <sphereGeometry args={[0.015]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
        </mesh>
      ))}
      <Text position={[0, -0.5, 0.41]} fontSize={0.1} color="#ffffff">SCOPE</Text>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-0.4 + i * 0.4, -0.5, 0.41]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.05]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      ))}
    </group>
  );
}

function Soldering({ position, mousePos }) {
  const tipRef = useRef();
  const groupRef = useRef();
  useFrame((state) => {
    if (tipRef.current) {
      tipRef.current.material.emissiveIntensity = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z = -Math.PI / 6 + mousePos.x * 0.3;
      groupRef.current.rotation.x = mousePos.y * 0.3;
    }
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.5]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh ref={tipRef} position={[0, -0.8, 0]}>
        <coneGeometry args={[0.05, 0.2]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}

function Multimeter({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color="#ffcc00" />
      </mesh>
      <mesh position={[0, 0.3, 0.11]}>
        <boxGeometry args={[0.6, 0.4, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#00ff00" emissiveIntensity={0.3} />
      </mesh>
      <Text position={[0, 0.3, 0.12]} fontSize={0.12} color="#00ff00">3.3V</Text>
    </group>
  );
}

function RaspberryPi({ position }) {
  return (
    <group position={position} scale={1.2}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.08, 1]} />
        <meshStandardMaterial color="#00aa00" />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <Text position={[0, 0.05, 0]} fontSize={0.08} color="#ffffff">RPi</Text>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[-0.6, 0.04, -0.4 + i * 0.04]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.08]} />
          <meshStandardMaterial color="#ffd700" metalness={1} />
        </mesh>
      ))}
    </group>
  );
}

function ESP32({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.06, 0.6]} />
        <meshStandardMaterial color="#1a5c2e" />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.4]} />
        <meshStandardMaterial color="#c0c0c0" metalness={1} />
      </mesh>
      <Text position={[0, 0.1, 0]} fontSize={0.06} color="#000000">ESP32</Text>
    </group>
  );
}

function Sensor({ position, color, label }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.15, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.08, 0.16]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <Text position={[0, -0.1, 0.16]} fontSize={0.05} color="#ffffff">{label}</Text>
    </group>
  );
}

function WiFiRouter({ position }) {
  const antennaRef = useRef([]);
  useFrame((state) => {
    antennaRef.current.forEach((ant, i) => {
      if (ant) {
        ant.rotation.z = Math.sin(state.clock.getElapsedTime() + i) * 0.1;
      }
    });
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (antennaRef.current[i] = el)} position={[-0.3 + i * 0.3, 0.15, -0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-0.2 + i * 0.2, 0.16, 0.31]}>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

function StorageShelf({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 3, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -1.2 + i * 0.8, 0.26]} castShadow>
          <boxGeometry args={[2.9, 0.05, 0.48]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-1.2 + (i % 4) * 0.8, -0.8 + Math.floor(i / 4) * 0.8, 0.3]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'][i % 4]} />
        </mesh>
      ))}
    </group>
  );
}

function Workbench({ position, width = 4 }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, 2]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[width - 0.2, 0.9, 1.8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {[-width/2 + 0.2, width/2 - 0.2].map((x, i) => (
        <mesh key={i} position={[x, -0.95, 0.8]} castShadow>
          <boxGeometry args={[0.1, 1.8, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}

function CeilingLight({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial color="#e0e0e0" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <rectAreaLight intensity={3} width={2} height={0.5} color="#ffffff" />
    </group>
  );
}

function SafetyPoster({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1, 1.4, 0.02]} />
        <meshStandardMaterial color="#ffcc00" />
      </mesh>
      <Text position={[0, 0.5, 0.02]} fontSize={0.15} color="#000000">SAFETY</Text>
      <Text position={[0, 0.2, 0.02]} fontSize={0.08} color="#000000">FIRST</Text>
    </group>
  );
}

function Student({ position, color = '#4a90e2', rotation = [0, 0, 0] }) {
  const headRef = useRef();
  const armRef = useRef();
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2;
      headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 2) * 0.15 - 0.3;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={headRef} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.25]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0, 0.35, 0.15]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={armRef} position={[-0.35, -0.1, 0.1]} rotation={[-0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.35, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.15, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.5]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.15, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.5]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
}

function Chair({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, 0.3, -0.15]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function Laptop({ position, rotation }) {
  const screenRef = useRef();
  useFrame((state) => {
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.02, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh ref={screenRef} position={[0, 0.3, -0.25]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.78, 0.55, 0.02]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#1e3a8a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function CoffeeMug({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.15]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.09, 0, 0]} castShadow>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  );
}

function Cables({ position }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.15 - 0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.8]} />
          <meshStandardMaterial color={['#ff0000', '#00ff00', '#0000ff'][i]} />
        </mesh>
      ))}
    </group>
  );
}

function ToolBox({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#c0392b" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.1, 0.02, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

function Monitor({ position, rotation }) {
  const screenRef = useRef();
  useFrame((state) => {
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.4 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[1.1, 0.7, 0.02]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#1e3a8a" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

function Keyboard({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.03, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[-0.35 + (i % 10) * 0.08, 0.02, -0.1 + Math.floor(i / 10) * 0.1]} castShadow>
          <boxGeometry args={[0.06, 0.01, 0.06]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  );
}

function Notebook({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.02, 0.5]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.1, 0.015 + i * 0.002, 0]} castShadow>
          <boxGeometry args={[0.3, 0.001, 0.45]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
      ))}
    </group>
  );
}

function Pen({ position }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.01, 0.01, 0.25]} />
      <meshStandardMaterial color="#2980b9" />
    </mesh>
  );
}

function WaterBottle({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3]} />
        <meshPhysicalMaterial color="#3498db" transparent opacity={0.6} roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.03]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
}

function ProjectPoster({ position, rotation, title }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.6, 0.02]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <Text position={[0, 0.6, 0.02]} fontSize={0.12} color="#2c3e50">{title}</Text>
      <mesh position={[0, 0.2, 0.02]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.01]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
    </group>
  );
}

function Whiteboard({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[3, 2, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <Text position={[0, 0.6, 0.03]} fontSize={0.2} color="#0000ff">IoT Architecture</Text>
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.03]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.01]} />
          <meshStandardMaterial color={['#ff6b6b', '#4ecdc4', '#ffe66d'][i]} />
        </mesh>
      ))}
    </group>
  );
}

function LabScene({ mousePos, scrollOffset }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <hemisphereLight intensity={0.5} groundColor="#444444" />
      
      <mesh position={[0, -2, scrollOffset * 15]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 120]} />
        <meshStandardMaterial color="#1e1e2e" roughness={0.9} />
      </mesh>
      
      <group position={[0, 0, scrollOffset * 15]}>
        <mesh position={[0, 2, -15]} receiveShadow>
          <boxGeometry args={[30, 6, 0.3]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        
        <CeilingLight position={[0, 4, -5]} />
        <CeilingLight position={[0, 4, 5]} />
        <CeilingLight position={[0, 4, 15]} />
        
        <SafetyPoster position={[-7, 1, -14.8]} rotation={[0, 0, 0]} />
        <SafetyPoster position={[7, 1, -14.8]} rotation={[0, 0, 0]} />
        
        <StorageShelf position={[-8, 0, -10]} />
        <StorageShelf position={[8, 0, -10]} />
        <StorageShelf position={[-8, 0, 5]} />
        <StorageShelf position={[8, 0, 5]} />
        
        <Workbench position={[-4, -1.5, -5]} width={6} />
        <Workbench position={[4, -1.5, -5]} width={6} />
        <Workbench position={[-4, -1.5, 5]} width={6} />
        <Workbench position={[4, -1.5, 5]} width={6} />
        
        <Chair position={[-4, -1.5, -3.5]} />
        <Chair position={[1, -1.5, -3.5]} />
        <Chair position={[-4, -1.5, 6.5]} />
        <Chair position={[4, -1.5, 6.5]} />
        <Chair position={[-6, -1.5, 3]} />
        
        <Student position={[-4, -0.8, -4]} color="#3498db" rotation={[0, 0, 0]} />
        <Student position={[1, -0.8, -4]} color="#e74c3c" rotation={[0, Math.PI, 0]} />
        <Student position={[-4, -0.8, 6]} color="#2ecc71" rotation={[0, Math.PI / 4, 0]} />
        <Student position={[4, -0.8, 6]} color="#9b59b6" rotation={[0, -Math.PI / 4, 0]} />
        <Student position={[-6, -0.8, 3]} color="#f39c12" rotation={[0, Math.PI / 2, 0]} />
        
        <Monitor position={[-4, -0.5, -5.5]} rotation={[0, 0, 0]} />
        <Keyboard position={[-4, -1, -4.8]} rotation={[0, 0, 0]} />
        <Monitor position={[1, -0.5, -5.5]} rotation={[0, 0, 0]} />
        <Keyboard position={[1, -1, -4.8]} rotation={[0, 0, 0]} />
        
        <Laptop position={[-3.5, -1, 5]} rotation={[0, Math.PI / 4, 0]} />
        <Laptop position={[4.5, -1, 5]} rotation={[0, -Math.PI / 6, 0]} />
        
        <CoffeeMug position={[-4.8, -1, -5]} />
        <CoffeeMug position={[0.3, -1, -5]} />
        <WaterBottle position={[-3.2, -1, 5]} />
        <WaterBottle position={[5.2, -1, 5]} />
        
        <Notebook position={[-4.5, -1, -4.5]} rotation={[0, 0.3, 0]} />
        <Notebook position={[1.5, -1, -4.5]} rotation={[0, -0.2, 0]} />
        <Pen position={[-4.3, -0.98, -4.3]} />
        <Pen position={[1.7, -0.98, -4.3]} />
        
        <ToolBox position={[-5, -1, 5]} />
        <ToolBox position={[3, -1, 5]} />
        
        <Computer position={[-4, -0.5, -5]} mousePos={mousePos} />
        <Oscilloscope position={[-2, -1, -5]} mousePos={mousePos} />
        <Multimeter position={[0, -1, -5]} />
        
        <Arduino position={[2, -1, -5]} mousePos={mousePos} />
        <RaspberryPi position={[4, -1, -5]} />
        <ESP32 position={[6, -1, -5]} />
        
        <Soldering position={[-4, -0.8, 5]} mousePos={mousePos} />
        <WiFiRouter position={[-2, -1, 5]} />
        <Cables position={[-1, -1, 5]} />
        
        <Whiteboard position={[0, 1, -14.8]} rotation={[0, 0, 0]} />
        <ProjectPoster position={[-5, 1, -14.8]} rotation={[0, 0, 0]} title="Smart Home IoT" />
        <ProjectPoster position={[5, 1, -14.8]} rotation={[0, 0, 0]} title="Robotics Project" />
        
        <Sensor position={[0, -1, 5]} color="#4a90e2" label="TEMP" />
        <Sensor position={[1.5, -1, 5]} color="#e24a4a" label="PIR" />
        <Sensor position={[3, -1, 5]} color="#4ae24a" label="DIST" />
        
        <mesh position={[5, -1, 5]}>
          <boxGeometry args={[3, 0.15, 2]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
        
        <LED position={[4.5, -0.9, 5]} color="#ff0000" />
        <LED position={[5, -0.9, 5]} color="#00ff00" />
        <LED position={[5.5, -0.9, 5]} color="#0000ff" />
        
        <group position={[0, -1, 15]}>
          <mesh castShadow>
            <boxGeometry args={[4, 2, 1]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
          <Text position={[0, 0.8, 0.51]} fontSize={0.2} color="#00ff00">3D PRINTER</Text>
          <Text position={[0, 0.4, 0.51]} fontSize={0.12} color="#888888">Prusa i3 MK3S+</Text>
          <mesh position={[0, 0, 0.51]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1.5} />
          </mesh>
        </group>
        
        <Text position={[0, 3, -14.5]} fontSize={0.6} color="#ffffff">ESDC ELECTRONICS LAB</Text>
        <Text position={[0, 2.3, -14.5]} fontSize={0.2} color="#aaaaaa">Embedded Systems Design Club</Text>
      </group>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

const ElectronicsLab = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    });
  };

  const handleWheel = (e) => {
    setScrollOffset((prev) => {
      const newOffset = prev + e.deltaY * 0.001;
      return Math.max(-1.5, Math.min(1.5, newOffset));
    });
  };

  return (
    <section className="electronics-lab-page" onMouseMove={handleMouseMove} onWheel={handleWheel}>
      <div className="lab-header">
        <h1>Electronics & IoT Lab</h1>
        <p>Move cursor to interact • Scroll to explore</p>
      </div>
      
      <div className="lab-canvas-container">
        <Canvas
          shadows
          camera={{ position: [15, 10, 15], fov: 60 }}
        >
          <LabScene mousePos={mousePos} scrollOffset={scrollOffset} />
        </Canvas>
      </div>

      <div className="lab-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>🔧 Interactive 3D Lab</h3>
              <p>Explore our virtual electronics lab with realistic components and equipment</p>
            </div>
            <div className="info-card">
              <h3>📡 Arduino & ESP32</h3>
              <p>Learn microcontroller programming with hands-on projects</p>
            </div>
            <div className="info-card">
              <h3>⚡ Circuit Design</h3>
              <p>Build and test circuits using breadboards and components</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectronicsLab;
