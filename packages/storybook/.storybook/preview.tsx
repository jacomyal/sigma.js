import { Preview } from "@storybook/html";

const forceReloadDecorator: Preview["decorators"] = (storyFn, context) => {
  if (context.globals.shouldReload) {
    // Change search params of the iframe
    const searchParams = new URLSearchParams(window.parent.location.search);
    searchParams.set(
      "args",
      Object.keys(context.args)
        .map((k) => `${k}:${context.args[k]}`)
        .join(";"),
    );
    history.pushState(null, "", "?" + searchParams.toString());

    // reload iframe
    window.location.reload();

    // The reload is fired, but the story renderer is already started.
    // To avoid blink effect and console error, we return the template inside a full
    // invisible div
    return `<div style="height:100%;width:100%;visibility:hidden">${storyFn()}</div>`;
  }

  context.globals.shouldReload = true;
  return storyFn();
};

const preview: Preview = {
  decorators: [forceReloadDecorator],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
