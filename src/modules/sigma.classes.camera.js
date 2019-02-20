import Camera from "../classes/Camera";

export default function configure(sigma) {
  sigma.register("sigma.classes.camera", Camera(sigma));
}
