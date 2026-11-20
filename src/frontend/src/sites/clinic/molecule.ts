import {
  SCENE_COLORS,
  mattePlaster,
  stoneMetal,
  wireLines,
} from "@/lib/shared/three-helpers";
import * as THREE from "three";

/** Atoms around a heart-red nucleus, joined by thin bonds; one faint orbit ring. */
const ATOMS: { pos: [number, number, number]; r: number; red?: boolean }[] = [
  { pos: [0, 0, 0], r: 0.62, red: true },
  { pos: [1.25, 0.55, 0.2], r: 0.34 },
  { pos: [-1.1, 0.8, -0.3], r: 0.4 },
  { pos: [-0.5, -1.25, 0.45], r: 0.3 },
  { pos: [0.75, -0.95, -0.7], r: 0.26, red: true },
  { pos: [2.05, 1.25, -0.25], r: 0.2 },
  { pos: [-1.9, 1.55, 0.35], r: 0.22 },
  { pos: [-1.05, -2.0, -0.15], r: 0.18 },
];

const BONDS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export function createMolecule(): THREE.Object3D {
  const root = new THREE.Group();
  const spin = new THREE.Group();
  spin.name = "spin";
  root.add(spin);

  const red = stoneMetal(SCENE_COLORS.clinicRed);
  red.metalness = 0.25;
  red.roughness = 0.42;
  const pale = mattePlaster(SCENE_COLORS.clinicLine);
  const bondMat = mattePlaster("#B9B2A6");

  for (const atom of ATOMS) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(atom.r, 48, 32),
      atom.red ? red : pale,
    );
    mesh.position.set(...atom.pos);
    spin.add(mesh);
  }

  const up = new THREE.Vector3(0, 1, 0);
  for (const [a, b] of BONDS) {
    const start = new THREE.Vector3(...ATOMS[a].pos);
    const end = new THREE.Vector3(...ATOMS[b].pos);
    const dir = end.clone().sub(start);
    const bond = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, dir.length(), 12),
      bondMat,
    );
    bond.position.copy(start).add(dir.multiplyScalar(0.5));
    bond.quaternion.setFromUnitVectors(up, end.clone().sub(start).normalize());
    spin.add(bond);
  }

  const ringPoints = new THREE.EllipseCurve(0, 0, 2.6, 2.6, 0, Math.PI * 2)
    .getPoints(128)
    .map((p) => new THREE.Vector3(p.x, p.y, 0));
  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(ringPoints),
    wireLines(SCENE_COLORS.clinicRed, 0.35),
  );
  ring.name = "ring";
  ring.rotation.set(1.2, 0.3, 0);
  root.add(ring);

  root.scale.setScalar(0.82);
  return root;
}

/** Slow self-rotation plus a heartbeat-like double pulse of the nucleus. */
export function animateMolecule(
  model: THREE.Object3D,
  { time, delta }: { time: number; delta: number },
) {
  const spin = model.getObjectByName("spin");
  const ring = model.getObjectByName("ring");
  if (spin) {
    spin.rotation.y += delta * 0.18;
    const nucleus = spin.children[0];
    const beat = time % 1.4;
    const pulse =
      Math.exp(-((beat - 0.1) ** 2) / 0.004) * 0.07 +
      Math.exp(-((beat - 0.35) ** 2) / 0.004) * 0.045;
    nucleus.scale.setScalar(1 + pulse);
  }
  if (ring) ring.rotation.z += delta * 0.1;
}
