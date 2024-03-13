
export const generateExtensionCode = (url: string) => {
  const path = process.env.NEXT_PUBLIC_URL;
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
