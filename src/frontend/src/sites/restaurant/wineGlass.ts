import type { FrameState } from "@/components/shared";
import { SCENE_COLORS, frostedGlass } from "@/lib/shared/three-helpers";
import * as THREE from "three";

const v = (x: number, y: number) => new THREE.Vector2(x, y);

/** Outer wall, rim, then inner wall back down — one closed lathe silhouette. */
const GLASS_PROFILE = [
  v(0, -1.3),
  v(0.6, -1.3),
  v(0.63, -1.27),
  v(0.12, -1.2),
  v(0.055, -1.08),
  v(0.045, -0.22),
  v(0.1, -0.08),
  v(0.3, 0.02),
  v(0.52, 0.22),
  v(0.62, 0.52),
  v(0.63, 0.86),
  v(0.58, 1.24),
  v(0.565, 1.3),
  v(0.545, 1.3),
  v(0.56, 1.24),
  v(0.605, 0.86),
  v(0.595, 0.52),
  v(0.5, 0.25),
  v(0.29, 0.07),
  v(0, 0.04),
];

const WINE_PROFILE = [
  v(0, 0.06),
  v(0.28, 0.09),
  v(0.48, 0.27),
  v(0.575, 0.52),
  v(0.58, 0.56),
  v(0, 0.56),
];

/** Frosted wine glass with a pour of red, built from two lathes. */
export function createWineGlass(): THREE.Object3D {
  const group = new THREE.Group();

  const glass = new THREE.Mesh(
    new THREE.LatheGeometry(GLASS_PROFILE, 96),
    frostedGlass(SCENE_COLORS.restoGlass),
  );
  (glass.material as THREE.MeshPhysicalMaterial).side = THREE.DoubleSide;
  group.add(glass);

  const wine = new THREE.Mesh(
    new THREE.LatheGeometry(WINE_PROFILE, 72),
    new THREE.MeshPhysicalMaterial({
      color: SCENE_COLORS.restoWine,
      roughness: 0.12,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      sheen: 0.4,
      sheenColor: new THREE.Color("#D4A23A"),
    }),
  );
  wine.name = "wine";
  group.add(wine);

  group.scale.setScalar(1.15);
  group.rotation.z = 0.06;
  return group;
}

/** Wine leans against the cursor like liquid with inertia; the glass sways a little. */
export function swirlWine(
  model: THREE.Object3D,
  { time, pointer }: FrameState,
) {
  model.rotation.z = 0.06 + Math.sin(time * 0.55) * 0.025;
  const wine = model.getObjectByName("wine");
  if (!wine) return;
  wine.rotation.z = -pointer.x * 0.05;
  wine.rotation.x = pointer.y * 0.04;
}
