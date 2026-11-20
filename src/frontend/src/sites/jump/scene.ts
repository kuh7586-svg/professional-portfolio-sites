import type { FrameState } from "@/components/shared";
import { SCENE_COLORS, softRubber } from "@/lib/shared/three-helpers";
import * as THREE from "three";

const BALL_RADIUS = 0.55;
const NET_Y = -1.15;

/** Trampoline with a rubber ball. Parts are found by name in `bounceFrame`. */
export function createTrampoline(): THREE.Object3D {
  const root = new THREE.Group();
  root.scale.setScalar(0.78);
  root.rotation.x = 0.32;

  const frameMat = new THREE.MeshStandardMaterial({
    color: "#1C1C1A",
    roughness: 0.7,
    metalness: 0.2,
  });

  const pad = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.13, 20, 80),
    softRubber(SCENE_COLORS.jumpNet),
  );
  pad.rotation.x = Math.PI / 2;
  pad.position.y = NET_Y;
  root.add(pad);

  const net = new THREE.Mesh(
    new THREE.CircleGeometry(1.42, 64),
    new THREE.MeshStandardMaterial({
      color: "#2A2A27",
      roughness: 0.95,
      side: THREE.DoubleSide,
    }),
  );
  net.name = "net";
  net.rotation.x = -Math.PI / 2;
  net.position.y = NET_Y;
  root.add(net);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 40),
    new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    }),
  );
  shadow.name = "shadow";
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = NET_Y + 0.01;
  root.add(shadow);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.7, 10),
      frameMat,
    );
    leg.position.set(Math.cos(a) * 1.5, NET_Y - 0.38, Math.sin(a) * 1.5);
    root.add(leg);
  }

  const ball = new THREE.Group();
  ball.name = "ball";
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_RADIUS, 48, 32),
    softRubber(SCENE_COLORS.jumpBall),
  );
  sphere.name = "sphere";
  const seam = new THREE.Mesh(
    new THREE.TorusGeometry(BALL_RADIUS * 1.003, 0.022, 10, 64),
    softRubber(SCENE_COLORS.jumpNet),
  );
  seam.rotation.y = Math.PI / 2;
  sphere.add(seam);
  ball.add(sphere);
  root.add(ball);

  root.userData.phase = 0;
  return root;
}

/** Squash-and-stretch bounce. Cursor height sets jump height, cursor x drifts the ball. */
export function bounceFrame(model: THREE.Object3D, state: FrameState) {
  const ball = model.getObjectByName("ball");
  const sphere = model.getObjectByName("sphere");
  const net = model.getObjectByName("net");
  const shadow = model.getObjectByName("shadow");
  if (!ball || !sphere || !net || !shadow) return;

  const lift = (state.pointer.y + 1) / 2; // 0 bottom .. 1 top
  const height = 0.9 + lift * 1.2;
  const period = 0.85 + lift * 0.35;
  const phase = ((model.userData.phase as number) + state.delta / period) % 1;
  model.userData.phase = phase;

  const h = 4 * phase * (1 - phase); // 0 on the net, 1 at the top
  const squash = Math.exp(-h * 16) * 0.3;
  const stretch = Math.abs(1 - 2 * phase) * 0.14 * (1 - squash / 0.3);
  const sy = 1 - squash + stretch;
  const sxz = 1 + squash * 0.7 - stretch * 0.45;

  sphere.scale.set(sxz, sy, sxz);
  sphere.rotation.z -= state.delta * (1.2 + state.pointer.x * 2);

  const dip = squash * 0.75;
  ball.position.y = NET_Y - dip + BALL_RADIUS * sy + h * height;
  ball.position.x += (state.pointer.x * 0.45 - ball.position.x) * 0.06;
  ball.position.z = 0;

  net.position.y = NET_Y - dip * 0.6;
  shadow.position.set(ball.position.x, net.position.y + 0.01, 0);
  shadow.scale.setScalar(1.15 - h * 0.55);
  const mat = (shadow as THREE.Mesh).material as THREE.MeshBasicMaterial;
  mat.opacity = 0.4 - h * 0.28;
}
