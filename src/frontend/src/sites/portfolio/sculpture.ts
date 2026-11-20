import type { FrameState } from "@/components/shared";
import {
  SCENE_COLORS,
  brushedMetal,
  stoneMetal,
} from "@/lib/shared/three-helpers";
import * as THREE from "three";

/** Matte stone-metal trefoil with a hairline orbit and a small brushed satellite. */
export function createSculpture(): THREE.Object3D {
  const group = new THREE.Group();
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  group.scale.setScalar(narrow ? 0.62 : 0.92);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.34, 280, 40, 2, 3),
    stoneMetal(),
  );
  knot.name = "knot";
  knot.rotation.set(0.4, -0.3, 0.2);
  group.add(knot);

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.006, 6, 220),
    new THREE.MeshBasicMaterial({
      color: SCENE_COLORS.portfolioRim,
      transparent: true,
      opacity: 0.38,
    }),
  );
  orbit.name = "orbit";
  orbit.rotation.set(Math.PI / 2.4, 0.25, 0);
  group.add(orbit);

  const satellite = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 32, 32),
    brushedMetal("#8A8F8A", 0.3),
  );
  satellite.name = "satellite";
  orbit.add(satellite);

  return group;
}

export function animateSculpture(model: THREE.Object3D, state: FrameState) {
  const knot = model.getObjectByName("knot");
  const satellite = model.getObjectByName("satellite");
  if (knot) {
    knot.rotation.z += state.delta * 0.09;
    knot.rotation.x = 0.4 + state.pointer.y * 0.18;
  }
  if (satellite) {
    const a = state.time * 0.35;
    satellite.position.set(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0);
  }
}
