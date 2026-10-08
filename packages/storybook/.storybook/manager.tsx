import { addons } from "@storybook/manager-api";

import theme from "./theme";

const image = document.createElement("img") as HTMLImageElement;
image.src = "https://matomo.ouestware.com/matomo.php?idsite=26&rec=1&action_name=Storybook&send_image=0";
document.body.append(image);

const BANNER_HEIGHT = "2rem";
const style = document.createElement("style");
style.textContent = `
  .version-notice {
    position: fixed; top: 0; left: 0; right: 0; height: ${BANNER_HEIGHT};
    display: flex; align-items: center; justify-content: center; gap: 0.5em;
    background: #f9f7ed; border-bottom: 1px solid #ccc;
    font-family: "Nunito Sans", sans-serif; font-size: 0.85rem;
  }
  .version-notice a { color: #e22653; }
  /* Fit the manager layout below the banner */
  #root { position: fixed; top: ${BANNER_HEIGHT}; left: 0; right: 0; bottom: 0; }
  #root > * { height: 100% !important; }
`;
document.head.append(style);

const banner = document.createElement("div");
banner.className = "version-notice";
banner.innerHTML =
  'This is the archived Storybook for sigma.js <strong>v3</strong>. <a href="https://www.sigmajs.org" target="_top">Go to the current <strong>v4</strong> website</a>';
document.body.prepend(banner);

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
