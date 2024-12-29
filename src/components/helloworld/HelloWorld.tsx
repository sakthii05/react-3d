"use client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { DoubleSide, Mesh, TextureLoader } from "three";
import EarthDayMap from "../../../public/images/textures/earth/8k_earth_specular_map.jpg";
import { OrbitControls, Stars } from "@react-three/drei";

const HelloWorld = () => {
  function Earth(props: JSX.IntrinsicElements["mesh"]) {
    // This reference will give us direct access to the THREE.Mesh object
    const earthref = useRef<Mesh>(null!);
    const cloudref = useRef<Mesh>(null!);
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(({ clock }) => {
      const elapsedTime = clock.getElapsedTime();
      earthref.current.rotation.y = elapsedTime / 20;
      cloudref.current.rotation.y = elapsedTime / 20;
    });

    const [colormap, cloudmap, normalmap, specularmap] = useLoader(
      TextureLoader,
      [
        "/images/textures/earth/8k_earth_daymap.jpg",
        "/images/textures/earth/8k_earth_clouds.jpg",
        "/images/textures/earth/8k_earth_normal_map.jpg",
        "/images/textures/earth/8k_earth_specular_map.jpg",
      ]
    );

    return (
      <>
        <mesh {...props} ref={cloudref}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial
            map={cloudmap}
            opacity={0.4}
            transparent={true}
            depthWrite={true}
            side={DoubleSide}
          />
        </mesh>
        <mesh {...props} ref={earthref}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial specularMap={specularmap} />
          <meshStandardMaterial map={colormap} normalMap={normalmap} />
        </mesh>
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#010718]">
      <Canvas>
        <Suspense fallback={null}>
          <pointLight intensity={20} position={[2, 0, 2]} color="#f6f3ae" />
          <Stars radius={240} />
          <Earth scale={1.5} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            rotateSpeed={0.4}
            panSpeed={0.5}
            zoomSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HelloWorld;
