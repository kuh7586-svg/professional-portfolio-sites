import type { FrameState } from "@/components/shared";
import {
  SCENE_COLORS,
  brushedMetal,
  frostedGlass,
  softRubber,
} from "@/lib/shared/three-helpers";
import * as THREE from "three";

const BODY_WIDTH = 1.7;
const WHEEL_X = [-1.25, 1.3];
const WHEEL_R = 0.36;

function extrude(shape: THREE.Shape, depth: number, bevel: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

/** Side profile of the lower body with two wheel arches. */
function bodyShape() {
  const s = new THREE.Shape();
  s.moveTo(-2.05, 0.3);
  s.absarc(WHEEL_X[0], 0.3, 0.44, Math.PI, 0, true);
  s.absarc(WHEEL_X[1], 0.3, 0.44, Math.PI, 0, true);
  s.lineTo(2.05, 0.3);
  s.lineTo(2.12, 0.52);
  s.lineTo(2.02, 0.74);
  s.lineTo(0.9, 0.9);
  s.lineTo(-1.55, 0.93);
  s.lineTo(-2.04, 0.84);
  s.lineTo(-2.1, 0.52);
  s.closePath();
  return s;
}

/** Fastback glasshouse sitting on the shoulder line. */
function cabinShape() {
  const s = new THREE.Shape();
  s.moveTo(0.86, 0.9);
  s.quadraticCurveTo(0.45, 1.25, 0.1, 1.38);
  s.lineTo(-0.85, 1.4);
  s.quadraticCurveTo(-1.3, 1.25, -1.62, 0.93);
  s.closePath();
  return s;
}

function createWheel(rubber: THREE.Material, rim: THREE.Material) {
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.26, 40),
    rubber,
  );
  tire.rotation.x = Math.PI / 2;
  wheel.add(tire);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.27, 32),
    rim,
  );
  disc.rotation.x = Math.PI / 2;
  wheel.add(disc);

  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.29), rim);
    spoke.rotation.z = (i / 5) * Math.PI;
    wheel.add(spoke);
  }
  return wheel;
}

/** Stylised graphite coupe: extruded body, tinted glasshouse, copper rims. */
export function createCar(): THREE.Object3D {
  const root = new THREE.Group();
  const car = new THREE.Group();
  car.position.y = -0.55;
  car.rotation.y = -0.55;
  car.scale.setScalar(0.62);
  root.add(car);

  const paint = brushedMetal(SCENE_COLORS.detailBody, 0.28);
  const body = new THREE.Mesh(extrude(bodyShape(), BODY_WIDTH, 0.09), paint);
  car.add(body);

  const glass = new THREE.Mesh(
    extrude(cabinShape(), BODY_WIDTH - 0.34, 0.06),
    frostedGlass("#3A4048"),
  );
  car.add(glass);

  // Copper beltline and light bars.
  const copper = brushedMetal(SCENE_COLORS.detailCopper, 0.32);
  const belt = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.02, 0.02), copper);
  for (const z of [-1, 1]) {
    const line = belt.clone();
    line.position.set(-0.3, 0.92, z * (BODY_WIDTH / 2 + 0.06));
    car.add(line);
  }
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.05, BODY_WIDTH - 0.1),
    new THREE.MeshBasicMaterial({ color: "#E6E6E3" }),
  );
  head.position.set(2.1, 0.66, 0);
  car.add(head);
  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.05, BODY_WIDTH - 0.1),
    new THREE.MeshBasicMaterial({ color: "#7A2E1A" }),
  );
  tail.position.set(-2.12, 0.76, 0);
  car.add(tail);

  const rubber = softRubber("#0E0F11");
  const wheels: THREE.Object3D[] = [];
  for (const x of WHEEL_X) {
    for (const z of [-1, 1]) {
      const wheel = createWheel(rubber, copper);
      wheel.position.set(x, 0.3, z * (BODY_WIDTH / 2 - 0.02));
      car.add(wheel);
      wheels.push(wheel);
    }
  }
  root.userData.wheels = wheels;

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1, 48),
    new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(2.5, 1.2, 1);
  shadow.position.y = -0.05;
  car.add(shadow);

  return root;
}

/** Wheels roll slowly; the body leans a touch into the cursor. */
export function animateCar(model: THREE.Object3D, state: FrameState) {
  const wheels = model.userData.wheels as THREE.Object3D[] | undefined;
  if (wheels) {
    for (const wheel of wheels) wheel.rotation.z -= state.delta * 0.9;
  }
  model.rotation.z = state.pointer.x * -0.03;
}
