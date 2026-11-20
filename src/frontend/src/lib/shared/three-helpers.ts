import * as THREE from "three";

/**
 * Muted 3D palette literals from DESIGN.md (three.js cannot read CSS variables).
 */
export const SCENE_COLORS = {
  portfolioMetal: "#2B2F2D",
  portfolioRim: "#C2D0A8",
  clinicRed: "#9E3B3B",
  clinicLine: "#D8D4CC",
  jumpBall: "#E0623A",
  jumpNet: "#2F5D5A",
  archInk: "#0E0E0E",
  archPaper: "#F4F4F1",
  detailBody: "#16181B",
  detailCopper: "#C9733A",
  restoGlass: "#EFE3D3",
  restoWine: "#5C1F2B",
} as const;

type ColorInput = THREE.ColorRepresentation;

/** Matte stone/metal — the portfolio sculpture look. Needs an environment for reflections. */
export function stoneMetal(color: ColorInput = SCENE_COLORS.portfolioMetal) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.72,
    roughness: 0.48,
  });
}

/** Soft brushed metal with low sheen (car body, copper rims). */
export function brushedMetal(color: ColorInput, roughness = 0.35) {
  return new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness });
}

/** Chalky plaster, no specular highlights (architecture, clinic). */
export function mattePlaster(color: ColorInput) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0,
    roughness: 0.95,
  });
}

/** Soft rubber/foam (trampoline ball). */
export function softRubber(color: ColorInput) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.62,
    sheen: 0.4,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.3),
  });
}

/** Frosted glass. Transmission is costly — use on one mesh per scene. */
export function frostedGlass(color: ColorInput = SCENE_COLORS.restoGlass) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.18,
    transmission: 0.92,
    thickness: 0.6,
    ior: 1.45,
    transparent: true,
  });
}

/** Thin technical wire lines (architecture drawings, nets). */
export function wireLines(color: ColorInput, opacity = 0.85) {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
}

/** Turns any geometry into crisp edge lines with `wireLines`. */
export function edgesOf(
  geometry: THREE.BufferGeometry,
  color: ColorInput,
  thresholdAngle = 20,
) {
  return new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, thresholdAngle),
    wireLines(color),
  );
}

export interface LightSpec {
  color?: ColorInput;
  intensity?: number;
  position?: [number, number, number];
}

export interface LightingOptions {
  ambient?: { color?: ColorInput; intensity?: number };
  key?: LightSpec;
  rim?: LightSpec;
  fill?: LightSpec;
  /** Soft studio environment for metal reflections. 0 disables. Default 0.6. */
  environmentIntensity?: number;
}

/** Restrained three-point studio rig: dim warm key, cool fill, coloured rim. */
export function createStudioLights(opts: LightingOptions = {}): THREE.Group {
  const group = new THREE.Group();
  group.name = "studio-lights";

  const ambient = new THREE.AmbientLight(
    opts.ambient?.color ?? "#ECE8E1",
    opts.ambient?.intensity ?? 0.18,
  );
  group.add(ambient);

  const add = (spec: LightSpec | undefined, fallback: Required<LightSpec>) => {
    const light = new THREE.DirectionalLight(
      spec?.color ?? fallback.color,
      spec?.intensity ?? fallback.intensity,
    );
    light.position.set(...(spec?.position ?? fallback.position));
    group.add(light);
  };

  add(opts.key, { color: "#F1EADF", intensity: 1.4, position: [3, 4, 5] });
  add(opts.fill, { color: "#9FA8A3", intensity: 0.35, position: [-4, 1, 3] });
  add(opts.rim, {
    color: SCENE_COLORS.portfolioRim,
    intensity: 1.6,
    position: [-2, 3, -5],
  });
  return group;
}

/** Ready-made lighting presets with non-bright looks. */
export const LIGHTING_PRESETS = {
  portfolio: {
    rim: { color: SCENE_COLORS.portfolioRim, intensity: 1.8 },
  },
  clinic: {
    ambient: { color: "#F1EFEA", intensity: 0.5 },
    key: { color: "#FFF6EC", intensity: 1.6 },
    rim: { color: SCENE_COLORS.clinicLine, intensity: 0.8 },
  },
  jump: {
    ambient: { color: "#EFE9DD", intensity: 0.55 },
    key: { color: "#FFF1DE", intensity: 1.8 },
    rim: { color: SCENE_COLORS.jumpNet, intensity: 0.9 },
  },
  arch: {
    ambient: { color: "#F4F4F1", intensity: 0.7 },
    key: { color: "#FFFFFF", intensity: 1.2 },
    rim: { color: "#D9D9D4", intensity: 0.5 },
    environmentIntensity: 0.3,
  },
  detail: {
    ambient: { color: "#E6E6E3", intensity: 0.1 },
    key: { color: "#E6E6E3", intensity: 1.1 },
    rim: { color: SCENE_COLORS.detailCopper, intensity: 2.2 },
    environmentIntensity: 0.8,
  },
  resto: {
    ambient: { color: "#EFE3D3", intensity: 0.2 },
    key: { color: "#F3D9A8", intensity: 1.3 },
    rim: { color: "#D4A23A", intensity: 1.2 },
  },
} satisfies Record<string, LightingOptions>;

/** Disposes geometries, materials and textures under an object. */
export function disposeObject(root: THREE.Object3D) {
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
    for (const m of mats) {
      for (const value of Object.values(m)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      m.dispose();
    }
  });
}
