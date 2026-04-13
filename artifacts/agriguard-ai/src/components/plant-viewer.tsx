import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function CssPlantFallback() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center" style={{ perspective: '600px' }}>
      <div
        className="relative"
        style={{
          width: '160px',
          height: '280px',
          animation: 'plantRotate 8s linear infinite',
        }}
      >
        <style>{`
          @keyframes plantRotate {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          @keyframes leafSway {
            0%, 100% { transform: rotateZ(-8deg); }
            50% { transform: rotateZ(8deg); }
          }
          @keyframes leafSway2 {
            0%, 100% { transform: rotateZ(8deg); }
            50% { transform: rotateZ(-8deg); }
          }
        `}</style>

        {/* Stem */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '180px',
            background: 'linear-gradient(to top, #2e7d32, #4caf50)',
            borderRadius: '5px',
          }}
        />

        {/* Leaves */}
        {[
          { bottom: '40px', left: '55px', rotate: '-30deg', delay: '0s', sway: 'leafSway' },
          { bottom: '70px', left: '12px', rotate: '30deg', delay: '0.5s', sway: 'leafSway2' },
          { bottom: '100px', left: '55px', rotate: '-25deg', delay: '1s', sway: 'leafSway' },
          { bottom: '130px', left: '10px', rotate: '25deg', delay: '1.5s', sway: 'leafSway2' },
          { bottom: '158px', left: '40px', rotate: '-15deg', delay: '0.2s', sway: 'leafSway' },
        ].map((leaf, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: leaf.bottom,
              left: leaf.left,
              width: '60px',
              height: '28px',
              background: `linear-gradient(135deg, #66bb6a, #2e7d32)`,
              borderRadius: '50% 10% 50% 10%',
              transform: `rotate(${leaf.rotate})`,
              animation: `${leaf.sway} 3s ease-in-out ${leaf.delay} infinite`,
              boxShadow: '0 2px 8px rgba(46,125,50,0.3)',
            }}
          />
        ))}

        {/* Top bud */}
        <div
          style={{
            position: 'absolute',
            bottom: '180px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '22px',
            height: '30px',
            background: 'linear-gradient(to top, #a5d6a7, #66bb6a)',
            borderRadius: '50% 50% 20% 20%',
          }}
        />

        {/* Soil pot */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '30px',
            background: 'linear-gradient(to bottom, #8d6e63, #6d4c41)',
            borderRadius: '0 0 12px 12px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90px',
            height: '12px',
            background: 'linear-gradient(to bottom, #a1887f, #8d6e63)',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}

export function PlantViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 12;
    camera.position.y = 2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setWebglFailed(true);
      return;
    }

    if (!renderer.getContext()) {
      renderer.dispose();
      setWebglFailed(true);
      return;
    }

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const plantGroup = new THREE.Group();
    const stemGeom = new THREE.CylinderGeometry(0.1, 0.15, 6, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8, metalness: 0.1 });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    plantGroup.add(stem);

    const leafGeom = new THREE.SphereGeometry(1, 16, 16);
    leafGeom.scale(0.3, 0.1, 1);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.6, metalness: 0.1 });

    for (let i = 0; i < 5; i++) {
      const leafPivot = new THREE.Group();
      leafPivot.position.set(0, -2 + i * 1.2, 0);
      leafPivot.rotation.y = (i * Math.PI) / 2.5;
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.position.set(0, 0, 1);
      leaf.rotation.x = Math.PI / 6;
      leafPivot.add(leaf);
      plantGroup.add(leafPivot);
    }

    plantGroup.position.y = -1;
    scene.add(plantGroup);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      plantGroup.rotation.y += 0.005;
      plantGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      try {
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      } catch {}
      renderer.dispose();
      stemGeom.dispose();
      stemMat.dispose();
      leafGeom.dispose();
      leafMat.dispose();
    };
  }, []);

  if (webglFailed) {
    return <CssPlantFallback />;
  }

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />;
}
