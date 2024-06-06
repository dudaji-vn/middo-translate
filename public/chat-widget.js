(function () {
  function intChatInterface(chatSRC, primaryColor = 'default') {
    const colorMap = {
      default: '#3D88ED',
      halloween: '#ff5e00',
      rose: '#ff005e',
      violet: '#5e00ff',
      sky: '#00b3ff',
      forest: '#139e70',
      lemon: '#e3df00',
    };

    const chatWidget = document.createElement('div');
    const styleTag = `
          <style>
              :root {
                  --grey-color: ${colorMap[primaryColor]};
              }
              @keyframes appear {
                  0% {
                      opacity: 0;
                  }
                  100% {
                      opacity: 1;
                  }
              }
              @keyframes scale-to-0 {
                  0% {
                      transform: scale(1);
                  }
                  100% {
                      display: none;
                      transform: scale(0);
                  }
              }
      
              @keyframes scale-to-100 {
                  0% {
                      display: block;
                      transform: scale(0);
                  }
                  100% {
                      transform: scale(1);
                  }
              }
              #chat-widget {
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  display: grid;
                  z-index: 999999999 !important;
              }
              #chat-messages {
                  height: auto;
                  padding: 10px;
                  overflow-y: auto;
              }
              #btn-trigger-chat {
                  box-sizing: border-box;
                  margin-left: auto;
                  margin-top: auto;
                  display: inline-flex;
                  height: 3rem;
                  width: 3rem;
                  align-items: center;
                  justify-content: center;
                  border-radius: 9999px;
                  color: white;
                  cursor: pointer;
                  // background-color: var(--grey-color); /* Use custom color variable */
                  border-style: none;
              }
              .h-7 {
                  height: 1.75rem;
              }
              .w-7 {
                  width: 1.75rem;
              }
              .rounded-lg {
                  border-radius: 12px;
              }
              .ring-1 {
                  --tw-ring-color: rgb(17 24 39 / 0.05);
                  --tw-ring-shadow: 0 0 #0000;
                  --tw-ring-offset-color: #fff;
                  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
                      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                      calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
                      var(--tw-shadow, 0 0 #0000);
              }
              #chat-frame-widget {
                transform-origin: 95% 100%;
                animation: scale-to-0 0.3s ease forwards;
              }
              #chat-frame-widget.active {
                  display: block;
                  animation: scale-to-100 0.3s ease forwards;
              }
              .iframe_inset {
                  inset: auto 15px 85px auto;
              }   
              #widget_triangle {
                  display: none;
              }
              #widget_triangle.active {
                  display: block;
                  position: absolute;
                  inset: auto 20px 55px auto;
                  animation: appear 0.3s ease forwards;
                  stroke: white;
                  fill: white;
                  z-index: 999999999;
              }
              @media (max-width: 500px) {
                .iframe_inset {
                  inset: auto 0px 85px auto;
                }
                #chat-frame-widget {
                  transform-origin: 85% 100%;
                }

              }
           
          </style>
      `;
    const components = {
      icon_close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>`,
      icon_message: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square w-6 h-6"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>`,
    };

    const domain = window.location.host;
    chatWidget.id = 'chat-widget';
    const srcWithDomain = `${chatSRC}?domain=${domain}`;
    chatWidget.innerHTML = `
              <iframe 
                id="chat-frame-widget"
                src="${srcWithDomain}"
                class="ring-1 rounded-lg iframe_inset" 
                style="
                  border: none; 
                  position: fixed; 
                  width: 400px;
                  height: 640px; 
                  opacity: 1; 
                  color-scheme: none; 
                  background: margin: 0px; max-height: 100vh;
                  max-width: 100vw; transform: translateY(0px);                   
                  visibility: visible; 
                  z-index: 999999999 !important;">
                  </iframe>
              `;

    document.head.insertAdjacentHTML('beforeend', styleTag);
    document.body.appendChild(chatWidget);

    // const btn = document.getElementById('btn-trigger-chat');
    const frameWidget = document.getElementById('chat-frame-widget');
    // const triangleWidget = document.getElementById('widget_triangle');
    // frameWidget.style.display = 'none';
    // btn.addEventListener('click', () => {
    //   if (btn.innerHTML === components.icon_message) {
    //     btn.innerHTML = components.icon_close;
    frameWidget.classList.add('active');
    //     triangleWidget.classList.add('active');
    //   } else {
    //     btn.innerHTML = components.icon_message;
    //     frameWidget.classList.remove('active');
    //     triangleWidget.classList.remove('active');
    //   }
    // });
  }

  window.ChatWidget = {
    init: intChatInterface,
  };
})();
