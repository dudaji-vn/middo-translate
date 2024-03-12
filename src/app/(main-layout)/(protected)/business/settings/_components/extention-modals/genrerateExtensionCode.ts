export const generateExtensionCode = () => {
    // TODO: Implement the code generation logic
  return `
    <script>
    window.onload = function() {
      var notify = new Notify({
        language: 'en',
        firstMessage: 'Hello there! 👋🏼\n\nHow can we help you today?',
        theme: 'light',
      });
      notify.init();
    }
    </script>
    `;
};
