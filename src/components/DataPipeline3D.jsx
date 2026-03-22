import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DataPipeline3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const colors = {
      primary: 0x00f0ff,
      secondary: 0x7000ff,
      tertiary: 0xffbd2e,
      packet: 0xffffff,
      bg: 0x0a0a12
    };

    // --- Node Helpers ---
    const createSource = () => {
      const group = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const geo = new THREE.BoxGeometry(0.8, 0.25, 0.8);
        const mat = new THREE.MeshPhongMaterial({ color: colors.primary, transparent: true, opacity: 0.8 });
        const rack = new THREE.Mesh(geo, mat);
        rack.position.y = (i - 1) * 0.4;
        group.add(rack);
        
        // Glow line
        const lineGeo = new THREE.BoxGeometry(0.82, 0.05, 0.82);
        const lineMat = new THREE.MeshBasicMaterial({ color: colors.packet });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.y = rack.position.y;
        group.add(line);
      }
      return group;
    };

    const createPipeline = () => {
      const group = new THREE.Group();
      const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
      const ringMat = new THREE.MeshPhongMaterial({ color: colors.primary, wireframe: true });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.rotation.x = Math.PI / 2;
      group.add(ring1, ring2);
      
      const coreGeo = new THREE.OctahedronGeometry(0.3);
      const coreMat = new THREE.MeshStandardMaterial({ color: colors.secondary, emissive: colors.secondary, emissiveIntensity: 2 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);
      return { group, ring1, ring2, core };
    };

    const createModel = () => {
      const group = new THREE.Group();
      const boxGeo = new THREE.BoxGeometry(1, 1, 1);
      const boxMat = new THREE.MeshBasicMaterial({ color: colors.primary, wireframe: true, transparent: true, opacity: 0.3 });
      const box = new THREE.Mesh(boxGeo, boxMat);
      group.add(box);
      
      const brainGeo = new THREE.IcosahedronGeometry(0.5, 1);
      const brainMat = new THREE.MeshPhongMaterial({ color: colors.secondary, wireframe: true });
      const brain = new THREE.Mesh(brainGeo, brainMat);
      group.add(brain);
      return { group, brain };
    };

    const createInsights = () => {
      const group = new THREE.Group();
      const bars = [];
      for (let i = 0; i < 3; i++) {
        const h = 0.5 + Math.random();
        const geo = new THREE.BoxGeometry(0.2, h, 0.2);
        const mat = new THREE.MeshPhongMaterial({ color: colors.tertiary });
        const bar = new THREE.Mesh(geo, mat);
        bar.position.x = (i - 1) * 0.35;
        bar.position.y = h/2 - 0.5;
        group.add(bar);
        bars.push({ mesh: bar, baseH: h });
      }
      return { group, bars };
    };

    // --- Build Nodes ---
    const nodes = [
      { name: "Source", pos: new THREE.Vector3(-7, 0, 0), obj: createSource() },
      { name: "Pipeline", pos: new THREE.Vector3(-2.3, 0, 0), obj: createPipeline() },
      { name: "Model", pos: new THREE.Vector3(2.3, 0, 0), obj: createModel() },
      { name: "Insights", pos: new THREE.Vector3(7, 0, 0), obj: createInsights() }
    ];

    nodes.forEach(node => {
      const wrapper = (node.obj.group || node.obj);
      wrapper.position.copy(node.pos);
      scene.add(wrapper);
    });

    // --- Define Pipes & Packets ---
    const packetGroups = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const start = nodes[i].pos;
      const end = nodes[i + 1].pos;
      
      // Tube
      const curve = new THREE.LineCurve3(start, end);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: colors.primary, transparent: true, opacity: 0.1 });
      scene.add(new THREE.Mesh(tubeGeo, tubeMat));

      // Packets
      const packets = [];
      for (let j = 0; j < 4; j++) {
        const pGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
        const pMat = new THREE.MeshBasicMaterial({ color: colors.packet });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        scene.add(pMesh);
        packets.push({ mesh: pMesh, progress: j / 4, speed: 0.006 + Math.random() * 0.004 });
      }
      packetGroups.push({ packets, start, end });
    }

    // --- Particles Background ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 400;
    const posArr = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) posArr[i] = (Math.random() - 0.5) * 50;
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(starGeo, starMat));

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(10, 10, 10);
    scene.add(light);

    // --- Mouse ---
    const mouse = new THREE.Vector2();
    const targetRot = new THREE.Vector2();
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
    };
    mount.addEventListener('mousemove', handleMouse);

    // --- Animation ---
    const animate = () => {
      const time = Date.now() * 0.001;
      requestAnimationFrame(animate);

      targetRot.x = mouse.y * 0.15;
      targetRot.y = mouse.x * 0.25;
      scene.rotation.x += (targetRot.x - scene.rotation.x) * 0.05;
      scene.rotation.y += (targetRot.y - scene.rotation.y) * 0.05;

      // Animate Source
      nodes[0].obj.children.forEach((c, i) => {
        if(i % 2 === 1) c.material.opacity = 0.5 + Math.sin(time * 5 + i) * 0.5;
        c.position.y += Math.sin(time * 2 + i) * 0.001;
      });

      // Animate Pipeline
      const pipe = nodes[1].obj;
      pipe.ring1.rotation.y = time;
      pipe.ring2.rotation.z = -time * 1.5;
      pipe.core.scale.setScalar(1 + Math.sin(time * 4) * 0.2);

      // Animate Model
      const model = nodes[2].obj;
      model.brain.rotation.y = time * 0.5;
      model.brain.rotation.x = time * 0.3;
      model.brain.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      // Animate Insights
      const insights = nodes[3].obj;
      insights.bars.forEach((b, i) => {
        const h = b.baseH + Math.sin(time * 4 + i) * 0.3;
        b.mesh.scale.y = h / b.baseH;
        b.mesh.position.y = (h / 2) - 0.5;
      });

      // Packets
      packetGroups.forEach(g => {
        g.packets.forEach(p => {
          p.progress = (p.progress + p.speed) % 1;
          p.mesh.position.lerpVectors(g.start, g.end, p.progress);
          p.mesh.position.y += Math.sin(time * 8 + p.progress * 5) * 0.05;
          p.mesh.rotation.x += 0.1;
        });
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mount.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      className="pipeline-3d-box"
      style={{ 
        width: '100%', 
        height: '350px', 
        marginTop: '2rem',
        position: 'relative',
        borderRadius: '24px',
        background: 'radial-gradient(circle at center, rgba(15, 15, 30, 0.8) 0%, rgba(5, 5, 10, 0.95) 100%)',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0, 240, 255, 0.05)',
        overflow: 'hidden'
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Decorative corners */}
      <div className="corner corners-tl" style={{ position: 'absolute', top: '15px', left: '15px', width: '20px', height: '20px', borderTop: '2px solid var(--accent-primary)', borderLeft: '2px solid var(--accent-primary)', opacity: 0.5 }}></div>
      <div className="corner corners-tr" style={{ position: 'absolute', top: '15px', right: '15px', width: '20px', height: '20px', borderTop: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)', opacity: 0.5 }}></div>
      
      {/* Telemetry overlay */}
      <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '20px',
          color: 'var(--accent-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '1px',
          opacity: 0.4,
          pointerEvents: 'none'
      }}>
          STATUS: ONLINE // STREAMING_DATA_ACTIVE
      </div>
    </div>
  );
};

export default DataPipeline3D;
