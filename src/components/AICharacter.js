import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
    const { scene } = useGLTF("/cute_robot_companion_glb.glb"); // Load the model
    return <primitive object={scene} scale={1.2} position={[0, -1, 0]} />;
};

export default function AICharacter() {
    return (
        <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} />
            <Model />
            <OrbitControls />
        </Canvas>
    );
}
