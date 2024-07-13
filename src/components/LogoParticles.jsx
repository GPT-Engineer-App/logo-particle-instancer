import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LogoParticles = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 5;

    // Load texture
    const loader = new THREE.TextureLoader();
    loader.load('/logo.png', (texture) => {
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

      for (let y = 0; y < canvas.height; y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
          const index = (y * canvas.width + x) * 4;
          const alpha = imageData.data[index + 3];
          if (alpha > 0) {
            const posX = (canvas.width / 2 - x) / 50;
            const posY = (canvas.height / 2 - y) / 50;
            const posZ = 0;
            positions.push(posX, posY, posZ);
            colors.push(
              imageData.data[index] / 255,
              imageData.data[index + 1] / 255,
              imageData.data[index + 2] / 255
            );
          }
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();
    });

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default LogoParticles;