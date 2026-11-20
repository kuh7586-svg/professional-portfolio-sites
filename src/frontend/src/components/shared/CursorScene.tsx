import {
  type LightingOptions,
  createStudioLights,
  disposeObject,
} from "@/lib/shared/three-helpers";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface FrameState {
  time: number;
  delta: number;
  /** Eased pointer in -1..1 (x right, y up). */
  pointer: { x: number; y: number };
}

export interface CursorSceneProps {
  /** Builds the model once on mount. Everything it returns is disposed on unmount. */
  create: () => THREE.Object3D;
  lighting?: LightingOptions;
  /** Per-frame hook for model-specific animation (spin of a part, bob, morph). */
  onFrame?: (model: THREE.Object3D, state: FrameState) => void;
  /** Max yaw toward the cursor, radians. */
  maxTurn?: number;
  /** Max pitch toward the cursor, radians. */
  maxTilt?: number;
  /** Model position in world units on wide screens / under 768px. */
  offset?: [number, number];
  mobileOffset?: [number, number];
  cameraZ?: number;
  fov?: number;
  maxDpr?: number;
  /** fixed (default) pins the canvas to the viewport behind content; absolute fills the parent. */
  position?: "fixed" | "absolute";
  className?: string;
}

/**
 * Background three.js canvas whose model turns toward the cursor with spring inertia.
 * Touch: slow auto-rotation. Reduced motion: one static frame. Pauses on hidden tabs.
 * Content above it needs `relative z-10`.
 */
export function CursorScene({
  create,
  lighting,
  onFrame,
  maxTurn = 0.7,
  maxTilt = 0.4,
  offset = [1.6, 0],
  mobileOffset = [0, 0.6],
  cameraZ = 6,
  fov = 35,
  maxDpr = 1.5,
  position = "fixed",
  className,
}: CursorSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const config = useRef({
    create,
    lighting,
    onFrame,
    maxTurn,
    maxTilt,
    offset,
    mobileOffset,
    cameraZ,
    fov,
    maxDpr,
  });
  config.current = {
    create,
    lighting,
    onFrame,
    maxTurn,
    maxTilt,
    offset,
    mobileOffset,
    cameraZ,
    fov,
    maxDpr,
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const cfg = config.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return; // No WebGL: content stays readable without the background.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(cfg.fov, 1, 0.1, 100);
    camera.position.set(0, 0, cfg.cameraZ);

    let envTexture: THREE.Texture | null = null;
    const envIntensity = cfg.lighting?.environmentIntensity ?? 0.6;
    if (envIntensity > 0) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      scene.environmentIntensity = envIntensity;
      pmrem.dispose();
    }
    scene.add(createStudioLights(cfg.lighting));

    const pivot = new THREE.Group();
    const model = cfg.create();
    pivot.add(model);
    scene.add(pivot);

    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqTouch = window.matchMedia("(hover: none), (pointer: coarse)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const [ox, oy] = mqMobile.matches ? cfg.mobileOffset : cfg.offset;
      pivot.position.set(ox, oy, 0);
    };
    resize();

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const rot = { x: 0, y: 0, vx: 0, vy: 0 };
    let autoAngle = 0;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;

    const step = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      const live = config.current;

      if (mqTouch.matches) {
        autoAngle += delta * 0.25;
        pivot.rotation.set(Math.sin(time * 0.3) * 0.12, autoAngle, 0);
      } else {
        // Damped spring: settles past the target slightly, like a heavy object.
        const k = 22;
        const c = 7.5;
        const tx = target.y * live.maxTilt * -1;
        const ty = target.x * live.maxTurn;
        rot.vx += (tx - rot.x) * k * delta;
        rot.vy += (ty - rot.y) * k * delta;
        rot.vx *= Math.exp(-c * delta);
        rot.vy *= Math.exp(-c * delta);
        rot.x += rot.vx * delta;
        rot.y += rot.vy * delta;
        pivot.rotation.set(rot.x, rot.y, rot.y * -0.12);
      }
      const ease = 1 - Math.exp(-4 * delta);
      eased.x += (target.x - eased.x) * ease;
      eased.y += (target.y - eased.y) * ease;
      model.position.y = Math.sin(time * 0.8) * 0.06;

      live.onFrame?.(model, { time, delta, pointer: eased });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || document.hidden || mqReduced.matches) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const renderStatic = () => {
      pivot.rotation.set(-0.08, 0.35, 0);
      renderer.render(scene, camera);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onReducedChange = () => {
      if (mqReduced.matches) {
        stop();
        renderStatic();
      } else start();
    };
    const onResize = () => {
      resize();
      if (!running) renderStatic();
    };

    document.addEventListener("visibilitychange", onVisibility);
    mqReduced.addEventListener("change", onReducedChange);
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    if (mqReduced.matches) renderStatic();
    else start();

    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduced.removeEventListener("change", onReducedChange);
      disposeObject(scene);
      envTexture?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-ocid="scene.canvas_target"
      className={cn(
        position === "fixed" ? "fixed inset-0" : "absolute inset-0",
        "pointer-events-none z-0",
        className,
      )}
    />
  );
}
