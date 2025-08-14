import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      fog: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      pointLight: any;
      group: any;
    }
  }
}

export {};
