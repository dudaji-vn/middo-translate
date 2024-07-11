(function () {
  function initChatInterface(chatSRC, primaryColor = 'default') {
    const INF = 999999999;
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
          --primary-color: ${colorMap[primaryColor]};
        }
      .ping-container {
        color: #3c3c3c;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 1.65rem;
        right: 1.65rem;
        
      }

        .dot {
        position: relative;
        width: fit-content;
        background: var(--primary-color);
        border-radius: 40px;
        width: 1rem;
        height: 1rem;
      }

      .heartbeat {
        position: absolute;
        width: fit-content;
        background-color: var(--primary-color);
        border-radius: 40px;
        width: 1rem;
        height: 1rem;
        opacity: 0.75;
        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
     
      @keyframes ping {
        75%,
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      @keyframes grow-to-full-screen {
        0% { opacity: 0; transform: translateY(50%)}
        100% { opacity: 1; transform: translateY(0)}
      }
      @keyframes rotate-load {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes appear {
        0% { opacity: 0; transform: translateY(500px) scaleY(0.5); }
        100% { opacity: 1; transform: translateY(0) scaleY(1); }
      }
      @keyframes shrink-chat {
            0% { height: 500px,transform: translateY(100%) scaleY(0.5); }
            100% { height: 256px !important; transform: translateY(0) scaleY(1); }
      }
      @keyframes scale-to-0 {
        0% { transform: translateY(0) scaleY(1); opacity: 1; }
        100% { transform: translateY(100%) scaleY(0); opacity: 0; }
      }
      @keyframes scale-to-100 {
        0% { opacity: 0; transform: translateY(100%) scaleY(0.5); }
        100% { opacity: 1; transform: translateY(0) scaleY(1); }
      }
      #chat-widget {
        position: fixed; bottom: 10px; right: 20px; display: grid; z-index: 999999999 !important;
      }
    
      #chat-messages {
        height: auto; padding: 10px; overflow-y: auto;
      }
      #floating-icon-btn {
        box-sizing: border-box; margin-left: auto; margin-top: auto; display: inline-flex;
        height: 64px; width: 64px; align-items: center; justify-content: center; border-radius: 9999px;
        cursor: pointer; background-color: white; color: var(--primary-color); border-style: none;
      }
    
      #loading-icon {
        color: #f1f1f1;
        animation: rotate-load 1s linear infinite;
      }
      .h-7 { height: 1.75rem; }
      .w-7 { width: 1.75rem; }
      .rounded-lg { border-radius: 20px; }
      .ring-1 {
        --tw-ring-color: rgb(17 24 39 / 0.05); --tw-ring-shadow: 0 0 #0000;
        --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
        var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
        var(--tw-shadow, 0 0 #0000);
      }
      #widget-chat-frame {
        display: none; width: 400px; height: 500px; transform-origin: 95% 100%;
      }
      #widget-chat-frame.active {
        display: block; animation: scale-to-100 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
      }      
      #widget-chat-frame.deactive {
        display: block; animation: scale-to-0 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
      }
      #widget-chat-frame.hidden {
        display: none;
      }
      #widget-chat-frame.active.shrink {
        height: 256px !important; animation: scale-to-100 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
    
      }
      #widget-chat-frame.deactive.shrink {
        height: 256px !important;
      }
     
     
      .iframe_inset {
        inset: auto 15px 106px auto;
      }
      #widget_triangle {
        display: none;
      }
      #widget_triangle.active {
        display: block; position: absolute; inset: auto 36px 88px auto;
        animation: appear 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);
        stroke: white; fill: white; z-index: 999999999;
      }
      #chat-messages-ping {
        display: none;
        }
      #chat-messages-ping.active {
        display: flex;
      }
      #widget-chat-frame.fullscreen {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999999 !important; background-color: rgba(0, 0, 0, 0.15);
          transform-origin: 95% 100%;
          animation: grow-to-full-screen 0.3s ease forwards;
      }
        
      @media (max-width: 768px) {

        @keyframes grow-to-full-screen {
            0% { height: 70vh; }
            100% { height: 100vh; }
        }
      
        .iframe_inset {
          inset: auto 0px 108px 0px;
        }
        #widget-chat-frame {
          transform-origin: 85% 100%; width: 100vw; height: 70vh;
        }
      }
      </style>
    `;

    const components = {
      icon_close: `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
          <line x1="24" x2="8" y1="8" y2="24"></line>
          <line x1="8" x2="24" y1="8" y2="24"></line>
        </svg>
      `,
      icon_message: `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square w-8 h-8">
          <path d="M18.667 12a2.667 2.667 0 0 1-2.667 2.667H8l-5.333 5.333V5.333c0-1.467 1.2-2.667 2.667-2.667h10.667a2.667 2.667 0 0 1 2.667 2.667v7Z"></path>
          <path d="M24 12h2.667a2.667 2.667 0 0 1 2.667 2.667v14.667L24 24h-8a2.667 2.667 0 0 1-2.667-2.667v-1.333"></path>
        </svg>
      `,
      loading: `
        <svg id="loading-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle">
          <path d="M28 16a12 12 0 1 1-8.292-11.413"/>
        </svg>
      `,
    };

    const domain = window.location.host;
    chatWidget.id = 'chat-widget';
    const srcWithDomain = `${chatSRC}?domain=${domain}`;
    const srcButton = `${chatSRC}/widget-notification`;
    chatWidget.innerHTML = `
      <iframe id="widget-chat-frame" src="${srcWithDomain}" class="ring-1 rounded-lg iframe_inset" 
        style="box-shadow: 2px 4px 16px 2px #1616161A; border: none; position: fixed; background: white !important; margin: 0px; max-height: 100vh; max-width: 100vw; transform: translateY(0); z-index: 999999999 !important;">
      </iframe>
      <svg fill="#000000" id="widget_triangle" height="12" width="12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve" stroke="#ffffff">
        <g><polygon points="245,456.701 490,33.299 0,33.299 "></polygon></g>
      </svg>
      <div id="iframe-trigger-container" style="position: fixed; 
      bottom: 0; right: 0; width: 120px; height: 120px;">
        <iframe id="floating-button-iframe" src="${srcButton}" style="position: fixed; bottom: 0; right: 0; width: 120px; height: 120px;
        border-radius: 50%;
        border: none;"
        ></iframe>
        <button id="floating-icon-btn" style="position: absolute; bottom: 28px; right: 28px; width: 64px; height: 64px; opacity: 1; font-size: 32px;">
          ${components.loading}
         </button>
          <div 
          id="chat-messages-ping"
          class="ping-container">
            <span class="heartbeat"></span>
            <span class="dot"></span>
          </div>
      </div> 
    `;

    document.head.insertAdjacentHTML('beforeend', styleTag);
    document.body.appendChild(chatWidget);

    const floatingIcon = document.getElementById('floating-icon-btn');
    const widgetChatFrame = document.getElementById('widget-chat-frame');
    floatingIcon.style.color = colorMap['rose'];

    const theTriangle = document.getElementById('widget_triangle');
    const floatingButtonFrame = document.getElementById(
      'floating-button-iframe',
    );
    floatingButtonFrame.style.display = 'none';
    const divTrigger = document.getElementById('iframe-trigger-container');
    widgetChatFrame.classList.add('shrink');
    window.addEventListener('message', (event) => {
      const trigger = document.getElementById('iframe-trigger-container');
      const p = document.getElementById('chat-messages-ping');
      const { type, payload } = event.data;

      console.log('event.data -- ', type, event.data);
      switch (type) {
        case 'open-chat-widget':
        case 'close-chat-widget':
          // trigger.click();
          break;
        case 'ping':
          p.classList.add('active');
          break;
        case 'no-ping':
          p.classList.remove('active');
          break;
        case 'show-form':
        case 'room-found':
          console.log('room-found or on-start');
          widgetChatFrame.classList.remove('shrink');
          break;
        case 'hide-form':
        case 'room-end':
          widgetChatFrame.classList.add('shrink');
          break;
        case 'media-show':
          widgetChatFrame.classList.add('fullscreen');
          theTriangle.style.zIndex = 0;
          break;
        case 'media-close':
          if (widgetChatFrame.classList.contains('fullscreen')) {
            widgetChatFrame.classList.remove('fullscreen');
            theTriangle.style.zIndex = INF;
          }
          break;
        case 'update-primary-color':
          const { themeColor } = payload;
          alert(themeColor);
          if (colorMap[themeColor]) {
            floatingIcon.style.color = colorMap[themeColor];
          }
          break;
        default:
          break;
      }
      if (event.data === 'toggle-chat-widget') {
        // document.getElementById('floating-icon-btn').click();
      }
    });

    divTrigger.addEventListener('click', () => {
      if (divTrigger.disabled === true) return;
      if (floatingIcon.innerHTML !== components.icon_close) {
        floatingIcon.innerHTML = components.icon_close;
        widgetChatFrame.classList.remove('deactive');
        widgetChatFrame.classList.add('active');
        theTriangle.classList.add('active');
      } else {
        floatingIcon.innerHTML = components.icon_message;
        widgetChatFrame.classList.remove('active');
        widgetChatFrame.classList.add('deactive');
        theTriangle.classList.remove('active');
      }
    });

    divTrigger.disabled = true;
    fetch(`${chatSRC}/check-host?host=${domain}`, {
      mode: 'no-cors',
      method: 'GET',
      headers: { Accept: 'Content-Type' },
    })
      .then((response) => {
        console.log('response', response);
        setTimeout(() => {
          floatingIcon.innerHTML = components.icon_message;
          divTrigger.disabled = false;
          console.log('widgetChatFrame loaded');
        }, 1800);
      })
      .catch((error) => {
        chatWidget.remove();
      });
    widgetChatFrame.addEventListener('load', () => {
      console.log('widgetChatFrame loaded');

      // floatingButtonFrame.style.display = 'block';
    });
  }

  window.ChatWidget = { init: initChatInterface };
})();
