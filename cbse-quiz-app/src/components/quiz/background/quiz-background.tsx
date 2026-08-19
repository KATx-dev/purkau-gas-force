// src/components/background/quiz-background.tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three/webgpu";
import { PostProcessing, Scene } from "@/components/ui/hero-futuristic";

export function QuizBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Canvas
        flat
        dpr={[1, 2]}
        className="h-full w-full"
        gl={
          (async (props: any) => {
            const renderer = new THREE.WebGPURenderer(props);
            await renderer.init();
            return renderer;
          }) as any
        }
      >
        <Suspense fallback={null}>
          <PostProcessing fullScreenEffect />
          <Scene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/75" />
    </div>
  );
}