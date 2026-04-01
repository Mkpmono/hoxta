import { useEffect, useRef, useCallback } from "react";
import {
  Fog,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Color,
  Clock,
  Group,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Float32BufferAttribute,
  Vector3,
  CylinderGeometry,
  BoxGeometry,
  RingGeometry,
  DoubleSide,
} from "three";
import ThreeGlobe from "three-globe";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TWEEN from "@tweenjs/tween.js";
import countries from "@/assets/globe/countries.json";

/* ── arc / flight data ── */
const flights = [
  { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: "#06b6d4" },
  { order: 1, startLat: -19.8856, startLng: -43.9512, endLat: -1.3034, endLng: 36.8524, arcAlt: 0.5, color: "#06b6d4" },
  { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: "#3b82f6" },
  { order: 2, startLat: -15.7855, startLng: -47.909, endLat: 36.1628, endLng: -115.1194, arcAlt: 0.3, color: "#3b82f6" },
  { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: "#06b6d4" },
  { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: "#3b82f6" },
  { order: 4, startLat: -34.6037, startLng: -58.3816, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.7, color: "#06b6d4" },
  { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: "#3b82f6" },
  { order: 5, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: "#06b6d4" },
  { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: "#3b82f6" },
  { order: 6, startLat: -15.4326, startLng: 28.3159, endLat: 1.0941, endLng: -63.3455, arcAlt: 0.7, color: "#06b6d4" },
  { order: 6, startLat: 37.5665, startLng: 126.978, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.1, color: "#3b82f6" },
  { order: 7, startLat: 52.52, startLng: 13.405, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: "#06b6d4" },
  { order: 8, startLat: -8.8332, startLng: 13.2648, endLat: -33.9361, endLng: 18.4365, arcAlt: 0.2, color: "#3b82f6" },
  { order: 8, startLat: 1.3521, startLng: 103.8198, endLat: 40.7128, endLng: -74.006, arcAlt: 0.5, color: "#06b6d4" },
  { order: 9, startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.1, color: "#3b82f6" },
  { order: 10, startLat: -6.2088, startLng: 106.8456, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.3, color: "#06b6d4" },
  { order: 11, startLat: -22.9068, startLng: -43.1729, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.1, color: "#3b82f6" },
  { order: 12, startLat: -33.9361, startLng: 18.4365, endLat: 21.3956, endLng: 39.8838, arcAlt: 0.3, color: "#06b6d4" },
];

/* ── Satellite orbit configs ── */
const satelliteOrbits = [
  { radius: 130, speed: 0.3, tiltX: 0.4, tiltZ: 0.2, phase: 0 },
  { radius: 140, speed: -0.25, tiltX: -0.3, tiltZ: 0.5, phase: Math.PI * 0.5 },
  { radius: 125, speed: 0.35, tiltX: 0.6, tiltZ: -0.3, phase: Math.PI },
  { radius: 135, speed: -0.2, tiltX: -0.5, tiltZ: -0.4, phase: Math.PI * 1.5 },
  { radius: 145, speed: 0.22, tiltX: 0.2, tiltZ: 0.6, phase: Math.PI * 0.3 },
];

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 255, g: 255, b: 255 };
}

function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  const safeCount = Math.min(count, max - min);
  while (arr.length < safeCount) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}

function createSatellite() {
  const group = new Group();

  // Main cylindrical body
  const bodyGeo = new CylinderGeometry(0.8, 0.8, 4, 8);
  const bodyMat = new MeshPhongMaterial({ color: 0xc0c8d4, emissive: 0x222833, shininess: 80 });
  const body = new Mesh(bodyGeo, bodyMat);
  body.rotation.z = Math.PI / 4;
  group.add(body);

  // Body bands/rings
  const bandGeo = new CylinderGeometry(0.9, 0.9, 0.3, 8);
  const bandMat = new MeshPhongMaterial({ color: 0x8899aa, emissive: 0x111822 });
  for (const yOff of [-1.2, 0, 1.2]) {
    const band = new Mesh(bandGeo, bandMat);
    band.rotation.z = Math.PI / 4;
    band.position.set(yOff * Math.cos(Math.PI / 4) * -1, yOff * Math.cos(Math.PI / 4), 0);
    group.add(band);
  }

  // Solar panels (flat boxes with grid look)
  const panelGeo = new BoxGeometry(5, 0.15, 2.8);
  const panelMat = new MeshPhongMaterial({ color: 0x1e3a5f, emissive: 0x0a1628, shininess: 40 });
  const panelFrameMat = new MeshPhongMaterial({ color: 0x8899aa });

  // Panel 1 (right)
  const panel1 = new Mesh(panelGeo, panelMat);
  panel1.position.set(4.5, 0, 0);
  group.add(panel1);
  // Panel frame
  const frame1 = new Mesh(new BoxGeometry(5.2, 0.2, 3), panelFrameMat);
  frame1.position.set(4.5, 0, 0);
  group.add(frame1);
  // Panel grid lines
  for (let i = -2; i <= 2; i++) {
    const lineH = new Mesh(new BoxGeometry(5, 0.22, 0.04), panelFrameMat);
    lineH.position.set(4.5, 0, i * 0.65);
    group.add(lineH);
    const lineV = new Mesh(new BoxGeometry(0.04, 0.22, 2.8), panelFrameMat);
    lineV.position.set(4.5 + i * 1.1, 0, 0);
    group.add(lineV);
  }

  // Panel 2 (left)
  const panel2 = new Mesh(panelGeo, panelMat);
  panel2.position.set(-4.5, 0, 0);
  group.add(panel2);
  const frame2 = new Mesh(new BoxGeometry(5.2, 0.2, 3), panelFrameMat);
  frame2.position.set(-4.5, 0, 0);
  group.add(frame2);
  for (let i = -2; i <= 2; i++) {
    const lineH = new Mesh(new BoxGeometry(5, 0.22, 0.04), panelFrameMat);
    lineH.position.set(-4.5, 0, i * 0.65);
    group.add(lineH);
    const lineV = new Mesh(new BoxGeometry(0.04, 0.22, 2.8), panelFrameMat);
    lineV.position.set(-4.5 + i * 1.1, 0, 0);
    group.add(lineV);
  }

  // Panel arms connecting to body
  const armGeo = new CylinderGeometry(0.12, 0.12, 2, 6);
  const armMat = new MeshPhongMaterial({ color: 0x8899aa });
  const arm1 = new Mesh(armGeo, armMat);
  arm1.rotation.z = Math.PI / 2;
  arm1.position.set(2, 0, 0);
  group.add(arm1);
  const arm2 = new Mesh(armGeo, armMat);
  arm2.rotation.z = Math.PI / 2;
  arm2.position.set(-2, 0, 0);
  group.add(arm2);

  // Satellite dish (parabolic antenna)
  const dishGeo = new SphereGeometry(1.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.5);
  const dishMat = new MeshPhongMaterial({ color: 0xd8dde4, emissive: 0x222833, side: DoubleSide, shininess: 60 });
  const dish = new Mesh(dishGeo, dishMat);
  dish.rotation.x = -Math.PI / 2;
  dish.position.set(0, 2.8, 0);
  group.add(dish);

  // Dish antenna rod
  const rodGeo = new CylinderGeometry(0.06, 0.06, 2, 4);
  const rodMat = new MeshPhongMaterial({ color: 0x06b6d4 });
  const rod = new Mesh(rodGeo, rodMat);
  rod.position.set(0, 3.5, 0);
  group.add(rod);

  // Dish antenna cross-supports
  for (let a = 0; a < 3; a++) {
    const supportGeo = new CylinderGeometry(0.04, 0.04, 2.2, 4);
    const support = new Mesh(supportGeo, rodMat);
    const angle = (a / 3) * Math.PI * 2;
    support.position.set(Math.cos(angle) * 0.5, 3.2, Math.sin(angle) * 0.5);
    support.rotation.z = Math.cos(angle) * 0.4;
    support.rotation.x = Math.sin(angle) * 0.4;
    group.add(support);
  }

  // Small glow around satellite
  const glowGeo = new SphereGeometry(3, 8, 8);
  const glowMat = new MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.08 });
  group.add(new Mesh(glowGeo, glowMat));

  // Scale down for orbit
  group.scale.setScalar(0.6);

  return group;
}

function tiltPoint(x: number, y: number, z: number, tiltX: number, tiltZ: number) {
  const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  const cosZ = Math.cos(tiltZ), sinZ = Math.sin(tiltZ);
  const x2 = x * cosZ - y1 * sinZ;
  const y2 = x * sinZ + y1 * cosZ;
  return { x: x2, y: y2, z: z1 };
}

function createOrbitLine(radius: number, tiltX: number, tiltZ: number) {
  const segments = 128;
  const positions: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const p = tiltPoint(Math.cos(angle) * radius, 0, Math.sin(angle) * radius, tiltX, tiltZ);
    positions.push(p.x, p.y, p.z);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const mat = new LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.06 });
  return new Line(geo, mat);
}

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<{
    renderer: WebGLRenderer;
    animationId: number | null;
    globe: ThreeGlobe;
  } | null>(null);

  const init = useCallback(() => {
    const container = containerRef.current;
    if (!container || worldRef.current) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    const scene = new Scene();
    scene.fog = new Fog(0x000000, 400, 2000);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const cameraZ = 300;
    const camera = new PerspectiveCamera(50, aspect, 1, 2000);
    camera.position.set(0, 0, cameraZ);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = cameraZ;
    controls.maxDistance = cameraZ;
    controls.autoRotateSpeed = 0.6;
    controls.autoRotate = true;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    const ambientLight = new AmbientLight(0x111122, 0.8);
    const dLight = new DirectionalLight(0x0066ff, 0.4);
    dLight.position.set(-400, 100, 400);
    const dLight1 = new DirectionalLight(0xffffff, 1);
    dLight1.position.set(-200, 500, 200);
    const dLight2 = new PointLight(0xffffff, 0.8);
    dLight2.position.set(-200, 500, 200);
    camera.add(ambientLight, dLight, dLight1, dLight2);

    const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true });
    const globeMaterial = globe.globeMaterial() as any;
    globeMaterial.color = new Color("#062056");
    globeMaterial.emissive = new Color("#000000");
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.9;

    const pointsData = buildPointsData();

    setTimeout(() => {
      globe
        .hexPolygonsData(countries.features.filter((d: any) => d.properties.ISO_A2 !== "AQ"))
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor("#ffffff")
        .atmosphereAltitude(0.1)
        .hexPolygonColor(() => "rgba(255,255,255,0.7)");
    }, 1000);

    setTimeout(() => {
      globe
        .arcsData(flights)
        .arcStartLat((d: any) => d.startLat)
        .arcStartLng((d: any) => d.startLng)
        .arcEndLat((d: any) => d.endLat)
        .arcEndLng((d: any) => d.endLng)
        .arcColor((d: any) => d.color)
        .arcAltitude((d: any) => d.arcAlt)
        .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
        .arcDashLength(0.9)
        .arcDashInitialGap((d: any) => d.order)
        .arcDashGap(15)
        .arcDashAnimateTime(() => 1000)
        .pointsData(pointsData)
        .pointColor((d: any) => d.color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(0.25)
        .ringsData([])
        .ringColor((e: any) => (t: any) => e.color(t))
        .ringMaxRadius(3)
        .ringPropagationSpeed(3)
        .ringRepeatPeriod((1000 * 0.9) / 1);
    }, 1000);

    scene.add(camera, globe);

    // ── Satellites & orbit lines ──
    const satellites: { mesh: Group; orbit: typeof satelliteOrbits[0] }[] = [];
    satelliteOrbits.forEach((orbit) => {
      const sat = createSatellite();
      scene.add(sat);
      satellites.push({ mesh: sat, orbit });
      scene.add(createOrbitLine(orbit.radius, orbit.tiltX, orbit.tiltZ));
    });

    // Initial position - Europe focused
    const initCoords = globe.getCoords(40, 10, 0);
    new TWEEN.Tween(camera.position)
      .to({ x: initCoords.x, y: initCoords.y, z: initCoords.z }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    const clock = new Clock();
    let deltaGlobe = 0;
    let elapsed = 0;

    function animate() {
      const id = requestAnimationFrame(animate);
      if (worldRef.current) worldRef.current.animationId = id;

      TWEEN.update();
      controls.update();

      const delta = clock.getDelta();
      elapsed += delta;
      deltaGlobe += delta;

      if (deltaGlobe > 2) {
        const nums = genRandomNumbers(0, pointsData.length, Math.floor((pointsData.length * 4) / 5));
        globe.ringsData(pointsData.filter((_d, i) => nums.includes(i)));
        deltaGlobe = deltaGlobe % 2;
      }

      // Update satellites
      satellites.forEach(({ mesh, orbit }) => {
        const angle = elapsed * orbit.speed + orbit.phase;
        const p = tiltPoint(
          Math.cos(angle) * orbit.radius,
          0,
          Math.sin(angle) * orbit.radius,
          orbit.tiltX,
          orbit.tiltZ
        );
        mesh.position.set(p.x, p.y, p.z);
        mesh.lookAt(0, 0, 0);
      });

      renderer.render(scene, camera);
    }

    worldRef.current = { renderer, animationId: null, globe };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => {
      cleanup?.();
      if (worldRef.current) {
        if (worldRef.current.animationId) cancelAnimationFrame(worldRef.current.animationId);
        worldRef.current.renderer.dispose();
        worldRef.current.renderer.domElement.parentElement?.removeChild(worldRef.current.renderer.domElement);
        worldRef.current = null;
      }
    };
  }, [init]);

  return (
    <div className="relative w-full">
      {/* Deep space background blending into theme */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, hsl(195 100% 55% / 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 30% 40%, hsl(210 60% 30% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 70% 60%, hsl(200 100% 45% / 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, hsl(210 60% 6%) 0%, hsl(210 50% 4%) 100%)
          `,
        }}
      />
      {/* Nebula-like subtle color wash */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 40% 30% at 20% 30%, hsl(195 100% 55% / 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 35% 25% at 80% 70%, hsl(210 60% 40% / 0.06) 0%, transparent 70%)
          `,
        }}
      />
      {/* Star field */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, hsl(210 20% 95% / 0.4) 50%, transparent 50%),
            radial-gradient(1px 1px at 30% 65%, hsl(210 20% 95% / 0.25) 50%, transparent 50%),
            radial-gradient(1px 1px at 55% 15%, hsl(195 100% 55% / 0.35) 50%, transparent 50%),
            radial-gradient(1px 1px at 70% 80%, hsl(210 20% 95% / 0.2) 50%, transparent 50%),
            radial-gradient(1px 1px at 85% 35%, hsl(210 20% 95% / 0.35) 50%, transparent 50%),
            radial-gradient(1px 1px at 15% 90%, hsl(210 20% 95% / 0.15) 50%, transparent 50%),
            radial-gradient(1px 1px at 45% 45%, hsl(195 100% 55% / 0.3) 50%, transparent 50%),
            radial-gradient(1px 1px at 90% 60%, hsl(210 20% 95% / 0.25) 50%, transparent 50%),
            radial-gradient(1px 1px at 25% 40%, hsl(210 20% 95% / 0.2) 50%, transparent 50%),
            radial-gradient(1px 1px at 60% 90%, hsl(195 100% 55% / 0.2) 50%, transparent 50%),
            radial-gradient(1px 1px at 5% 55%, hsl(210 20% 95% / 0.3) 50%, transparent 50%),
            radial-gradient(1px 1px at 75% 10%, hsl(210 20% 95% / 0.2) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 40% 75%, hsl(195 100% 55% / 0.3) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 20% 50%, hsl(210 20% 95% / 0.35) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 65% 25%, hsl(195 100% 55% / 0.25) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 80% 70%, hsl(210 20% 95% / 0.3) 50%, transparent 50%)
          `,
        }}
      />
      {/* Edge vignette to blend into surrounding section */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        style={{
          boxShadow: "inset 0 0 80px 40px hsl(210 60% 6%)",
        }}
      />
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/10] z-10"
        style={{ minHeight: 300 }}
      />
    </div>
  );
}

function buildPointsData() {
  const points: { size: number; order: number; color: (t: number) => string; lat: number; lng: number }[] = [];
  for (const arc of flights) {
    const rgb = hexToRgb(arc.color);
    const colorFn = (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;
    points.push({ size: 1, order: arc.order, color: colorFn, lat: arc.startLat, lng: arc.startLng });
    points.push({ size: 1, order: arc.order, color: colorFn, lat: arc.endLat, lng: arc.endLng });
  }
  return points.filter(
    (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
  );
}
