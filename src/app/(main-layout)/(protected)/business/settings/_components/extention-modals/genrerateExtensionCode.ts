const mock = `http://192.168.1.20:3000`;
export const generateExtensionCode = (url: string) => {
  const path = mock || process.env.NEXT_PUBLIC_URL;
  return `
  <script src="${path}/chat-widget.js"></script>
  </script>
  <script>
      window.onload = function () {
          ChatWidget.init(\`${path}${url}\`);
      };
  </script>
  `;
};
