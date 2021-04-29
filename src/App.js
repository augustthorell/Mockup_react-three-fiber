import React, { useState, useRef, useEffect, useMemo } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import './style.css'
import * as THREE from 'three'
import JSONfont from "./fonts/Cascadia_Code.json";
import fonts from "./fonts";
import { Text } from "troika-three-text";
/* import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' */
import Model from './Scene'


extend({ OrbitControls, Text });

const textDescription = 'This site was a test site to mess around with React-three-fiber and see how it would be to display mockups as 3D objects.'


const Controls = () => {
    const orbitRef = useRef();
    const { camera, gl } = useThree();


    useFrame(() => {
        orbitRef.current.update()
    })
    return (
        <orbitControls
            maxPolarAngle={Math.PI / 4} // Change viewing angle here
            minPolarAngle={Math.PI / 4} // And here
            args={[camera, gl.domElement]}
            ref={orbitRef}

        />
    )
}

const Plane = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeBufferGeometry
            attach='geometry'
            args={[10000, 10000]}

        />
        <meshPhysicalMaterial attach='material' color='red' />
    </mesh>
)

const Title = () => {
    const font = new THREE.FontLoader().parse(JSONfont);

    // configure font geometry
    const textOptions = {
        font,
        size: 20,
        height: 5
    };

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-90, 0, -95]}
            castShadow
        >
            <textGeometry attach='geometry' args={['Pomodoro App', textOptions]} />
            <meshStandardMaterial attach='material' />
        </mesh>

    )
}
const Description = () => {
    const font = new THREE.FontLoader().parse(JSONfont);
    const [rotation, setRotation] = useState([0, 0, 0, 0]);
    const [opts, setOpts] = useState({
        font: font,
        fontSize: 12,
        color: "#99ccff",
        maxWidth: 100,
        lineHeight: 1,
        letterSpacing: 0,
        textAlign: "left",
        materialType: "MeshPhongMaterial"
    });
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[95, 0.1, 2]}
        >
            <text
                {...opts}
                text={textDescription}
                font={fonts[opts.font]}
                anchorX="center"
                anchorY="middle"
            >
                {opts.materialType === "MeshPhongMaterial" ? (
                    <meshPhongMaterial attach="material" color={opts.color} />
                ) : null}
            </text>
        </mesh>
    )
}



const Phone = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const props = useSpring({
        scale: [7, 1, 12],
        color: 'blue',
    })
    return (
        <a.mesh
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setActive(!active)}
            castShadow
            scale={props.scale}
            position={[0, 0, 4]}
        >
            <boxBufferGeometry
                attach='geometry'
                args={[1, 1, 1]}

            />
            <a.meshPhysicalMaterial attach='material' color={props.color} />
        </a.mesh>
    )
}

const Button = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const font = new THREE.FontLoader().parse(JSONfont);

    // configure font geometry
    const textOptions = {
        font,
        size: 5,
        height: 5
    };
    const props = useSpring({
        scale: active ? [30, 15, 1] : [30, 15, 30],
        color: hovered ? 'hotpink' : 'blue',
    })
    const text = useSpring({
        scale: active ? [1, 1, 0.1] : [1, 1, 3],

    })


    function click() { setTimeout((() => setActive(false)), 400); }
    return (
        <group position={[0, 0, 100]} >
            <a.mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                castShadow
                onClick={() => {
                    setActive(!active)
                    click();
                }}
                scale={props.scale}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow

            >
                <boxBufferGeometry
                    attach='geometry'
                    args={[1, 1, 1]}
                />
                <a.meshPhysicalMaterial attach='material' color={props.color} />

            </a.mesh>
            <a.mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-10, 1, 2]}
                castShadow
                scale={text.scale}
            >
                <textGeometry attach='geometry' args={['CLICK', textOptions]} castShadow />
                <meshStandardMaterial attach='material' />
            </a.mesh>
        </group>
    )
}

const App = () => {
    return (
        <Canvas
            camera={{ position: [-50, 10, 300] }}
            onCreated={({ gl }) => {
                gl.shadowMap.enabled = true
                gl.shadowMap.type = THREE.PCFSoftShadowMap
            }}
        >
            <ambientLight intensity={0.4} />
            <spotLight position={[150, 200, 100]} penumbra={1} castShadow />
            <fog attach="fog" args={["black", 100, 800]} />
            <Controls />
            <Plane />
            <Title />
            <Description />
            <Button />
            <Model />
        </Canvas>
    )
}

export default App
