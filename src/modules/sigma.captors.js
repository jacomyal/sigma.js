import MouseCaptor from "../classes/MouseCaptor";
import TouchCaptor from "../classes/TouchCaptor";

export default sigma => {
  sigma.register("sigma.captors.mouse", MouseCaptor(sigma));
  sigma.register("sigma.captors.touch", TouchCaptor(sigma));
};
