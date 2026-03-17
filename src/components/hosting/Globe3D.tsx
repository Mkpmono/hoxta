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
  Vector3,
} from "three";
import ThreeGlobe from "three-globe";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

    // Scene
    const scene = new Scene();
    scene.fog = new Fog(0x000000, 400, 2000);

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Camera
    const cameraZ = 300;
    const camera = new PerspectiveCamera(50, aspect, 180, 1800);
    camera.position.set(0, 0, cameraZ);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = cameraZ;
    controls.maxDistance = cameraZ;
    controls.autoRotateSpeed = 0.6;
    controls.autoRotate = true;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    // Lights
    const ambientLight = new AmbientLight(0x000000, 0.6);
    const dLight = new DirectionalLight(0x000000, 0.6);
    dLight.position.set(-400, 100, 400);
    const dLight1 = new DirectionalLight(0xffffff, 1);
    dLight1.position.set(-200, 500, 200);
    const dLight2 = new PointLight(0xffffff, 0.8);
    dLight2.position.set(-200, 500, 200);
    camera.add(ambientLight, dLight, dLight1, dLight2);

    // Globe
    const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true });

    // Material
    const globeMaterial = globe.globeMaterial() as any;
    globeMaterial.color = new Color("#062056");
    globeMaterial.emissive = new Color("#000000");
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.9;

    // Points data
    const pointsData = buildPointsData();

    // Countries (hexPolygons)
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

    // Arcs + Points
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

    // Initial position - Europe focused
    const initCoords = globe.getCoords(40, 10, 0);
    const targetPos = { x: initCoords.x, y: initCoords.y, z: initCoords.z };
    new TWEEN.Tween(camera.position)
      .to(targetPos, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    // Animation loop
    const clock = new Clock();
    let deltaGlobe = 0;

    function animate() {
      const id = requestAnimationFrame(animate);
      if (worldRef.current) worldRef.current.animationId = id;

      TWEEN.update();
      controls.update();

      const delta = clock.getDelta();
      deltaGlobe += delta;
      if (deltaGlobe > 2) {
        const nums = genRandomNumbers(0, pointsData.length, Math.floor((pointsData.length * 4) / 5));
        globe.ringsData(pointsData.filter((_d, i) => nums.includes(i)));
        deltaGlobe = deltaGlobe % 2;
      }

      renderer.render(scene, camera);
    }

    worldRef.current = { renderer, animationId: null, globe };
    animate();

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => {
      cleanup?.();
      if (worldRef.current) {
        if (worldRef.current.animationId) {
          cancelAnimationFrame(worldRef.current.animationId);
        }
        worldRef.current.renderer.dispose();
        const canvas = worldRef.current.renderer.domElement;
        canvas.parentElement?.removeChild(canvas);
        worldRef.current = null;
      }
    };
  }, [init]);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[16/9] md:aspect-[2/1] relative"
      style={{ minHeight: 300 }}
    />
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
