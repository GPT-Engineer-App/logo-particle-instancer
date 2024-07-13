import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LogoParticles = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Set background to transparent
    mountRef.current.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 5;

    // Load texture
    const loader = new THREE.TextureLoader();
    loader.load('/new-logo.png', (texture) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = texture.image.width;
      canvas.height = texture.image.height;
      context.drawImage(texture.image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Create particles
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          const index = (y * canvas.width + x) * 4;
          const alpha = imageData.data[index + 3];
          if (alpha > 0) {
            const posX = (x - canvas.width / 2) / 50;
            const posY = (canvas.height / 2 - y) / 50;
            const posZ = (Math.random() - 0.5) * 0.5;
            positions.push(posX, posY, posZ);
            colors.push(1, 1, 1); // White particles
          }
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        renderer.render(scene, camera);
      };
      animate();

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        mountRef.current.removeChild(renderer.domElement);
      };
    });
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default LogoParticles;