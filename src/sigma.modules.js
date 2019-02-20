import MouseCaptor from "./classes/MouseCaptor";
import TouchCaptor from "./classes/TouchCaptor";
import Camera from "./classes/Camera";
import Configurable from "./classes/Configurable";
import Dispatcher from "./classes/Dispatcher";

export default sigma => {
  // Register Classes
  sigma.register("sigma.classes.dispatcher", Dispatcher);
  sigma.register("sigma.classes.configurable", Configurable);
  sigma.register("sigma.classes.camera", Camera(sigma));

  // Register Captors
  sigma.register("sigma.captors.mouse", MouseCaptor(sigma));
  sigma.register("sigma.captors.touch", TouchCaptor(sigma));
};
