import { addons } from "@storybook/manager-api";

import theme from "./theme";

const image = document.createElement("img") as HTMLImageElement;
image.src = "https://matomo.ouestware.com/matomo.php?idsite=26&rec=1&action_name=Storybook&send_image=0";
document.body.append(image);

addons.setConfig({
  theme,
  showToolbar: false,
  panelPosition: "bottom",
  bottomPanelHeight: 380,
  sidebar: {
    renderLabel(item) {
      return item.name.replace(/--/g, "/");
    },
  },
});
