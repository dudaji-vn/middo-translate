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
              @keyframes rotate-load {
                  0% {
                      transform: rotate(0deg);
                  }
                  100% {
                      transform: rotate(360deg);
                  }
                }
              @keyframes appear {
                 0% {
                  display: block;
                      opacity: 0;
                      transform: translateY(500px) scaleY(0.5);
                  
                  }
                  100% {
                      opacity: 1;
                      transform: translateY(0px) scaleY(1);
                  }
              }
              @keyframes scale-to-0 {
                    0% {
                        transform: translateY(0px) scaleY(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100%) scaleY(0);
                        opacity: 0;
                    }
              }
      
              @keyframes scale-to-100 {
                  0% {
                  display: block;
                      opacity: 0;
                      transform: translateY(100%) scaleY(0.5);
                  
                  }
                  100% {
                      opacity: 1;
                      transform: translateY(0px) scaleY(1);
                  }
              }
              #chat-widget {
                  position: fixed;
                  bottom: 10px;
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
                  height: 64px;
                  width: 64px;  
                  align-items: center;
                  justify-content: center;
                  border-radius: 9999px;
                  color: white;
                  cursor: pointer;
                  background-color: white;
                  color: var(--grey-color);
                  border-style: none;
              }

              #loading-icon {
                  animation: rotate-load 1s linear infinite;
              }
              .h-7 {
                  height: 1.75rem;
              }
              .w-7 {
                  width: 1.75rem;
              }
              .rounded-lg {
                  border-radius: 20px;
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
                   display: none;
                  width: 400px;
                  height: 500px; 
                  transform-origin: 95% 100%;
              }
              #chat-frame-widget.active {
                  display: block;
                  animation: scale-to-100 0.5s ease forwards;
                  animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
              }              
              #chat-frame-widget.deactive {
                  display: block;
                  animation: scale-to-0 0.5s ease forwards;
                  animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
              }              
         
             chat-frame-widget.hidden {
                  display: none;
                  }
              .iframe_inset {
                  inset: auto 15px 106px auto;
              }   
              #widget_triangle {
                  display: none;
              }
              #widget_triangle.active {
                  display: block;
                  position: absolute;
                  inset: auto 36px 88px auto;
                  animation: appear 0.5s ease forwards;
                  animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
                  stroke: white;
                  fill: white;
                  z-index: 999999999;
              }
              @media (max-width: 768px) {
                .iframe_inset {
                  inset: auto 0px 108px 0px;
                }
                #chat-frame-widget {
                  transform-origin: 85% 100%;
                  width: 100vw;
                  height: 70vh;
                }
              }
           
          </style>
      `;

    const components = {
      icon_close: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><line x1="24" x2="8" y1="8" y2="24"></line><line x1="8" x2="24" y1="8" y2="24"></line></svg>
`,
      icon_message: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square w-8 h-8"><path d="M18.667 12a2.667 2.667 0 0 1-2.667 2.667H8l-5.333 5.333V5.333c0-1.467 1.2-2.667 2.667-2.667h10.667a2.667 2.667 0 0 1 2.667 2.667v7Z"></path><path d="M24 12h2.667a2.667 2.667 0 0 1 2.667 2.667v14.667L24 24h-8a2.667 2.667 0 0 1-2.667-2.667v-1.333"></path></svg>
`,
      loading: `<svg 
      id = "loading-icon"
      xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle"><path d="M28 16a12 12 0 1 1-8.292-11.413"/></svg>`,
    };
    const domain = window.location.host;
    chatWidget.id = 'chat-widget';
    const srcWithDomain = `${chatSRC}?domain=${domain}`;
    const srcButton = `${chatSRC}/widget-notification`;
    chatWidget.innerHTML = `
              <iframe 
                id="chat-frame-widget" 
                src='${srcWithDomain}'
                class="ring-1 rounded-lg iframe_inset" 
                  style="box-shadow: 2px 4px 16px 2px #1616161A; 
                  border: none; 
                  position: fixed; 
                  color-scheme: none; 
                  background: white !important; margin: 0px; max-height: 100vh;
                  max-width: 100vw; transform: translateY(0px);      
                  z-index: 999999999 !important;">
                  </iframe>
                <svg fill="#000000" id="widget_triangle" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="245,456.701 490,33.299 0,33.299 "></polygon> </g></svg>
                <div
                  id="iframe-trigger" style="position: fixed; bottom: 0px;  right:  0px; width: 200px; height: 200px;
                  ">
                    <iframe
                    id="btn-trigger-chat-iframe"
                    src="${srcButton}"
                     style="position: fixed; bottom: 0px;  right:  0px; width: 110px; height: 110px; border: none;  ">
                    </iframe>
                    <button id="btn-trigger-chat"
                     style="position: absolute; bottom:  35px;  right:  35px; 
                     width: 50px; height: 50px;
                     opacity: 1; 
                     font-size:32px; "
                    >
                        ${components.loading}
                    </button>
                </div>
              `;

    document.head.insertAdjacentHTML('beforeend', styleTag);
    document.body.appendChild(chatWidget);

    const btn = document.getElementById('btn-trigger-chat');
    const frameWidget = document.getElementById('chat-frame-widget');
    const triangleWidget = document.getElementById('widget_triangle');
    const btnIframe = document.getElementById('btn-trigger-chat-iframe');
    btnIframe.style.display = 'none';
    const divTrigger = document.getElementById('iframe-trigger');

    divTrigger.addEventListener('click', () => {
      if (btn.innerHTML !== components.icon_close) {
        btn.innerHTML = components.icon_close;
        frameWidget.classList.remove('deactive');
        frameWidget.classList.add('active');
        triangleWidget.classList.add('active');
      } else {
        btn.innerHTML = components.icon_message;
        frameWidget.classList.remove('active');
        frameWidget.classList.add('deactive');
        triangleWidget.classList.remove('active');
      }
    });

    divTrigger.disabled = true;
    fetch(`${chatSRC}/check-host?host=${domain}`, {
      mode: 'no-cors',
      method: 'GET',
      headers: {
        Accept: 'Content-Type',
      },
    })
      .then((response) => {
        console.log('response', response);
        setTimeout(() => {
          // btn.style.opacity = 0;
          btn.innerHTML = components.icon_message;
          divTrigger.disabled = false;
          console.log('frameWidget loaded');
        }, 200);
      })
      .catch((error) => {
        chatWidget.remove();
      });
    frameWidget.addEventListener('load', () => {
      btnIframe.style.display = 'block';
    });
  }
  window.addEventListener('message', (event) => {
    // if (event.origin !== 'http://localhost:3000') return;
    console.log('event.data', event.data);
    if (event.data === 'toggle-chat-widget') {
      document.getElementById('btn-trigger-chat').click();
    }
  });
  window.ChatWidget = {
    init: intChatInterface,
  };
})();
