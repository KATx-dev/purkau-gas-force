"use client";

import { extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/tsl"; 

import {
  abs,
  add,
  float,
  mix,
  mod,
  mx_cell_noise_float,
  oneMinus,
  pass,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3
} from "three/tsl";

extend(THREE as any);

// FIX 1: Added the missing texture map variables
const TEXTUREMAP = {
  src: "https://images.unsplash.com/photo-1634017839464-5c339afa60f0?auto=format&fit=crop&q=80&w=1200"
};

const DEPTHMAP = {
  src: "https://images.unsplash.com/photo-1557683316-973603aaf5b3?auto=format&fit=crop&q=80&w=1200"
};

export function PostProcessing({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef<any>({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);

    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    const scanPos = float(uScanProgress);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const redOverlay = vec3(1, 0, 0)
      .mul(oneMinus(scanLine))
      .mul(0.4);

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    progressRef.current.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;

    render.renderAsync();
  }, 1);

  return null;
}

export function Scene() {
  const [rawMap, depthMap] = useTexture([
    TEXTUREMAP.src,
    DEPTHMAP.src
  ]);

  const meshRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(300).div(300);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap;

    const flow = oneMinus(
      smoothstep(0, 0.02, abs(depth.sub(uProgress)))
    );

    const mask = dot.mul(flow).mul(vec3(10, 0, 0));

    // FIX 2: Replaced blendScreen with add to prevent the import error
    const final = add(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress
      }
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(300, 300);

  useFrame(({ clock }) => {
    uniforms.uProgress.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;

    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as any;

      if ("opacity" in material) {
        material.opacity = THREE.MathUtils.lerp(
          material.opacity,
          visible ? 1 : 0,
          0.07
        );
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  return (
    <mesh
      ref={meshRef}
      scale={[w * 0.42, h * 0.42, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
  );
}
