import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeLoader = ({ dataStream }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // --- Scene ---
    const scene = new THREE.Scene();

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Colors ---
    const C_CYAN = new THREE.Color(0x00f0ff);
    const C_PURPLE = new THREE.Color(0x7000ff);
    const C_WHITE = new THREE.Color(0xffffff);

    // === 1. STAR-FIELD background ===
    const starGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: C_WHITE, size: 0.08, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(starGeo, starMat));

    // === 2. FLOATING DATA NODES (spheres) ===
    const nodeData = [];
    const nodePositions = [
      [-7, 3, 0], [7, 3, 0], [-5, -4, 1], [5, -4, 1],
      [0, 6, -1], [-9, -1, -2], [9, -1, -2], [0, -7, 0]
    ];
    nodePositions.forEach((pos) => {
      const geo = new THREE.SphereGeometry(0.35, 16, 16);
      const mat = new THREE.MeshPhongMaterial({
        color: C_CYAN,
        emissive: C_CYAN,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(0.65, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({ color: C_CYAN, transparent: true, opacity: 0.08 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...pos);
      scene.add(halo);

      nodeData.push({ mesh, halo, speed: 0.3 + Math.random() * 0.6, offset: Math.random() * Math.PI * 2 });
    });

    // === 3. EDGE LINES connecting nodes ===
    const edges = [
      [0, 1], [0, 4], [1, 4], [0, 2], [1, 3],
      [2, 3], [2, 5], [3, 6], [4, 0], [4, 1],
      [5, 7], [6, 7], [2, 7], [3, 7]
    ];
    const lineMeshes = [];
    edges.forEach(([a, b]) => {
      const posA = new THREE.Vector3(...nodePositions[a]);
      const posB = new THREE.Vector3(...nodePositions[b]);
      const points = [posA, posB];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: C_CYAN, transparent: true, opacity: 0.15 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      lineMeshes.push(line);
    });

    // === 4. ANIMATED DATA PACKETS along paths ===
    const packets = [];
    edges.slice(0, 6).forEach(([a, b]) => {
      const posA = new THREE.Vector3(...nodePositions[a]);
      const posB = new THREE.Vector3(...nodePositions[b]);
      const geo = new THREE.SphereGeometry(0.12, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: C_PURPLE });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      packets.push({ mesh, posA, posB, t: Math.random(), speed: 0.004 + Math.random() * 0.006 });
    });

    // === 5. ORBITING RING ===
    const ringGeo = new THREE.TorusGeometry(12, 0.04, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: C_CYAN, transparent: true, opacity: 0.12 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(9, 0.03, 8, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: C_PURPLE, transparent: true, opacity: 0.1 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.z = Math.PI / 4;
    scene.add(ring2);

    // === 6. BAR CHART (3D) ===
    const barGroup = new THREE.Group();
    const barHeights = [0.8, 1.4, 1.0, 1.8, 1.2, 2.2, 1.6, 2.5];
    const barColors = [C_CYAN, C_PURPLE, C_CYAN, C_PURPLE, C_CYAN, C_PURPLE, C_CYAN, C_PURPLE];
    barHeights.forEach((h, i) => {
      const geo = new THREE.BoxGeometry(0.3, h, 0.3);
      const mat = new THREE.MeshPhongMaterial({
        color: barColors[i],
        emissive: barColors[i],
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85
      });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(i * 0.45 - 1.6, h / 2 - 2.5, 5);
      barGroup.add(bar);
    });
    barGroup.rotation.y = -0.3;
    scene.add(barGroup);

    // === 7. SCATTER PLOT dots (small spheres) ===
    const scatterGeo = new THREE.BufferGeometry();
    const scatterPositions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      scatterPositions[i * 3] = (Math.random() - 0.5) * 8 - 5;
      scatterPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      scatterPositions[i * 3 + 2] = 3 + Math.random() * 2;
    }
    scatterGeo.setAttribute('position', new THREE.BufferAttribute(scatterPositions, 3));
    const scatterMat = new THREE.PointsMaterial({ color: C_CYAN, size: 0.15, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(scatterGeo, scatterMat));

    // === 8. LIGHTS ===
    scene.add(new THREE.AmbientLight(0x222244, 2));
    const dirLight = new THREE.DirectionalLight(0x00f0ff, 3);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    const purpleLight = new THREE.PointLight(0x7000ff, 4, 30);
    purpleLight.position.set(-8, -5, 3);
    scene.add(purpleLight);

    // === Animation Loop ===
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Pulse nodes
      nodeData.forEach(({ mesh, halo, speed, offset }) => {
        const scale = 1 + 0.2 * Math.sin(elapsed * speed + offset);
        mesh.scale.setScalar(scale);
        halo.scale.setScalar(scale * 1.1);
        halo.material.opacity = 0.04 + 0.06 * Math.sin(elapsed * speed + offset);
      });

      // Move packets along edges
      packets.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        p.mesh.position.lerpVectors(p.posA, p.posB, p.t);
      });

      // Rotate rings
      ring.rotation.z += 0.003;
      ring2.rotation.y += 0.004;
      ring2.rotation.z -= 0.002;

      // Animate bar chart (breathing)
      barGroup.children.forEach((bar, i) => {
        const targetH = barHeights[i] * (1 + 0.15 * Math.sin(elapsed * 1.5 + i * 0.7));
        bar.scale.y = targetH / barHeights[i];
        bar.position.y = (barHeights[i] * bar.scale.y) / 2 - 2.5;
      });

      // Gentle camera sway
      camera.position.x = Math.sin(elapsed * 0.15) * 1.5;
      camera.position.y = Math.cos(elapsed * 0.1) * 0.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} ref={mountRef} />
  );
};

export default ThreeLoader;
