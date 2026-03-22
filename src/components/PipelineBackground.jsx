import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PipelineBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Scene / Camera ───────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 40);

    // ── Mouse tracking ───────────────────────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // Unproject to a z=0 plane
      mouseWorld.set(mouse.x, mouse.y, 0.5).unproject(camera);
      const dir = mouseWorld.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      mouseWorld.copy(camera.position).addScaledVector(dir, dist);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Colour palette ───────────────────────────────────────────────────────────
    const COLORS = {
      pipe: new THREE.Color(0x00f0ff),
      packet: new THREE.Color(0x7000ff),
      node: new THREE.Color(0x00f0ff),
      glow: new THREE.Color(0x00f0ff),
    };

    // ── Build pipe network ───────────────────────────────────────────────────────
    // We create a set of curved tubes connecting random nodes in 3D space.
    const NODE_COUNT = 14;
    const PIPE_COUNT = 20;
    const SPREAD = 30;

    // Generate nodes
    const nodes = Array.from({ length: NODE_COUNT }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD * 2,
        (Math.random() - 0.5) * SPREAD,
        (Math.random() - 0.5) * SPREAD * 0.4
      )
    );

    // Node spheres
    const nodeObjects = nodes.map((pos) => {
      const geo = new THREE.SphereGeometry(0.35, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: COLORS.node });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      // Glow ring around each node
      const ringGeo = new THREE.RingGeometry(0.5, 0.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: COLORS.glow,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      scene.add(ring);

      return { mesh, ring, pos };
    });

    // Build pipes (tubes) between random node pairs
    const pipes = [];
    const usedPairs = new Set();
    let attempts = 0;
    while (pipes.length < PIPE_COUNT && attempts < 200) {
      attempts++;
      const a = Math.floor(Math.random() * NODE_COUNT);
      let b = Math.floor(Math.random() * NODE_COUNT);
      if (a === b) continue;
      const key = [Math.min(a, b), Math.max(a, b)].join('-');
      if (usedPairs.has(key)) continue;
      usedPairs.add(key);

      const start = nodes[a];
      const end = nodes[b];
      // Mid control point with slight bend
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2 + (Math.random() - 0.5) * 6,
        (start.y + end.y) / 2 + (Math.random() - 0.5) * 6,
        (start.z + end.z) / 2 + (Math.random() - 0.5) * 3
      );
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.06, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: COLORS.pipe,
        transparent: true,
        opacity: 0.18,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Data packets travelling along the pipe
      const packetCount = Math.floor(Math.random() * 2) + 1;
      const packets = Array.from({ length: packetCount }, (_, idx) => {
        const geo2 = new THREE.SphereGeometry(0.13, 8, 8);
        const mat2 = new THREE.MeshBasicMaterial({ color: COLORS.packet });
        const mesh2 = new THREE.Mesh(geo2, mat2);
        scene.add(mesh2);
        return {
          mesh: mesh2,
          t: (idx / packetCount),   // staggered start along curve
          speed: 0.0012 + Math.random() * 0.0015,
          curve,
        };
      });

      pipes.push({ tube, tubeMat, curve, packets, nodeA: a, nodeB: b });
    }

    // ── Ambient floating particles ───────────────────────────────────────────────
    const PARTICLE_COUNT = 120;
    const partPositions = new Float32Array(PARTICLE_COUNT * 3);
    const partVels = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: 0,
    }));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      partPositions[i * 3]     = (Math.random() - 0.5) * SPREAD * 2.2;
      partPositions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      partPositions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: COLORS.pipe,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // ── Mouse influence group ────────────────────────────────────────────────────
    // We tilt the whole scene slightly toward the mouse
    const sceneGroup = new THREE.Group();
    nodes.forEach((_, i) => {
      sceneGroup.add(nodeObjects[i].mesh);
      sceneGroup.add(nodeObjects[i].ring);
    });
    pipes.forEach(p => {
      sceneGroup.add(p.tube);
      p.packets.forEach(pk => sceneGroup.add(pk.mesh));
    });
    sceneGroup.add(particles);
    scene.add(sceneGroup);

    // Target rotation for smooth lerp
    const targetRot = new THREE.Vector2(0, 0);

    // ── Animation loop ───────────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Tilt scene toward mouse (subtle parallax)
      targetRot.x = mouse.y * 0.08;
      targetRot.y = mouse.x * 0.12;
      sceneGroup.rotation.x += (targetRot.x - sceneGroup.rotation.x) * 0.05;
      sceneGroup.rotation.y += (targetRot.y - sceneGroup.rotation.y) * 0.05;

      // Animate node rings (scale pulse)
      nodeObjects.forEach((n, i) => {
        const s = 1 + 0.15 * Math.sin(t * 1.5 + i);
        n.ring.scale.set(s, s, 1);
        n.ring.rotation.z = t * 0.4 + i;
        // Boost opacity of nodes near mouse
        const dist = n.pos.distanceTo(mouseWorld);
        n.mesh.material.opacity = 1;
        n.ring.material.opacity = dist < 8 ? 0.7 : 0.25;
      });

      // Move data packets along pipes
      pipes.forEach((pipe) => {
        // Highlight pipes near mouse
        const startPos = pipe.curve.getPoint(0);
        const dist = startPos.distanceTo(mouseWorld);
        pipe.tubeMat.opacity = dist < 12 ? 0.45 : 0.18;

        pipe.packets.forEach((pk) => {
          pk.t = (pk.t + pk.speed) % 1;
          const pos = pk.curve.getPoint(pk.t);
          pk.mesh.position.copy(pos);
        });
      });

      // Drift ambient particles
      const positions = partGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3]     += partVels[i].x;
        positions[i * 3 + 1] += partVels[i].y;
        // Wrap around
        if (positions[i * 3] >  SPREAD * 1.1) positions[i * 3] = -SPREAD * 1.1;
        if (positions[i * 3] < -SPREAD * 1.1) positions[i * 3] =  SPREAD * 1.1;
        if (positions[i * 3 + 1] >  SPREAD * 0.6) positions[i * 3 + 1] = -SPREAD * 0.6;
        if (positions[i * 3 + 1] < -SPREAD * 0.6) positions[i * 3 + 1] =  SPREAD * 0.6;
      }
      partGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handling ──────────────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ──────────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default PipelineBackground;
