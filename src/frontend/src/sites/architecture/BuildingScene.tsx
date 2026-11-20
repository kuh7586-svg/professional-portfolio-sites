import { CursorScene } from "@/components/shared";
import {
  LIGHTING_PRESETS,
  SCENE_COLORS,
  edgesOf,
  mattePlaster,
  wireLines,
} from "@/lib/shared/three-helpers";
import * as THREE from "three";

/** [width, height, depth, x, y, z] — stacked offset volumes, like a massing model. */
const VOLUMES: [number, number, number, number, number, number][] = [
  [2.4, 0.5, 1.6, 0, -1.1, 0],
  [1.5, 0.55, 1.9, -0.35, -0.58, 0.15],
  [2.0, 0.45, 1.1, 0.4, -0.08, -0.2],
  [1.0, 0.75, 1.0, -0.5, 0.52, 0.1],
  [0.55, 1.1, 0.55, 0.62, 0.7, -0.3],
];

function createBuilding() {
  const root = new THREE.Group();
  const fill = mattePlaster(SCENE_COLORS.archPaper);
  VOLUMES.forEach(([w, h, d, x, y, z], i) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, fill);
    mesh.position.set(x, y, z);
    mesh.name = `volume-${i}`;
    mesh.add(edgesOf(geo, SCENE_COLORS.archInk));
    root.add(mesh);
  });

  // Floor slab lines across the tower — a drawing, not a render.
  const slabs: THREE.Vector3[] = [];
  for (let k = 1; k < 5; k++) {
    const y = 0.15 + k * 0.22;
    slabs.push(
      new THREE.Vector3(0.345, y, -0.02),
      new THREE.Vector3(0.895, y, -0.02),
    );
  }
  root.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(slabs),
      wireLines(SCENE_COLORS.archInk, 0.5),
    ),
  );

  // Site grid under the model.
  const grid = new THREE.GridHelper(5, 20, 0x0e0e0e, 0x0e0e0e);
  grid.position.y = -1.36;
  const gridMat = grid.material as THREE.Material;
  gridMat.transparent = true;
  gridMat.opacity = 0.14;
  root.add(grid);

  root.rotation.set(0.42, -0.6, 0);
  return root;
}

export function BuildingScene() {
  return (
    <CursorScene
      create={createBuilding}
      lighting={LIGHTING_PRESETS.arch}
      maxTurn={0.9}
      maxTilt={0.3}
      offset={[1.9, -0.1]}
      mobileOffset={[0.5, 1.4]}
      cameraZ={7.5}
      onFrame={(model, { time }) => {
        // The top volume slides like a drawer in a study model.
        const tower = model.getObjectByName("volume-3");
        if (tower) tower.position.x = -0.5 + Math.sin(time * 0.5) * 0.12;
      }}
    />
  );
}
