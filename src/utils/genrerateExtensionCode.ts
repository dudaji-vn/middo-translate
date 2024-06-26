import { extensionsCustomThemeOptions } from "@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options";

export const generateExtensionCode = (url: string, theme?: string) => {
  const path = process.env.NEXT_PUBLIC_URL;
  const themeName =
    extensionsCustomThemeOptions.find(
      (th) => th.name === theme || th.hex === theme,
    )?.name || 'default';
  return `
  <script src="${path}/chat-widget.js">
  </script>
  <script>
      window.onload = function () {
          ChatWidget.init(\`${path}${url}\`, \'${themeName}\');
      };
  </script>
  `;
};
