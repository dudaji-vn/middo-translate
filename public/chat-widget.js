window.ChatWidget = {
  init: function (n, e = 'default') {
    const t = document.createElement('div'),
      i = `\n      <style>\n        :root {\n          --grey-color: ${{ default: '#3D88ED', halloween: '#ff5e00', rose: '#ff005e', violet: '#5e00ff', sky: '#00b3ff', forest: '#139e70', lemon: '#e3df00' }[e]};\n        }\n      .ping-container {\n        color: #3c3c3c;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        position: absolute;\n        top: 1.65rem;\n        right: 1.65rem;\n        \n      }\n\n        .dot {\n        position: relative;\n        width: fit-content;\n        background: var(--grey-color);\n        border-radius: 40px;\n        width: 1rem;\n        height: 1rem;\n      }\n\n      .heartbeat {\n        position: absolute;\n        width: fit-content;\n        background-color: var(--grey-color);\n        border-radius: 40px;\n        width: 1rem;\n        height: 1rem;\n        opacity: 0.75;\n        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;\n      }\n     \n      @keyframes ping {\n        75%,\n        100% {\n          transform: scale(2);\n          opacity: 0;\n        }\n      }\n      @keyframes rotate-load {\n        0% { transform: rotate(0deg); }\n        100% { transform: rotate(360deg); }\n      }\n      @keyframes appear {\n        0% { opacity: 0; transform: translateY(500px) scaleY(0.5); }\n        100% { opacity: 1; transform: translateY(0) scaleY(1); }\n      }\n      @keyframes shrink-chat {\n            0% { height: 500px,transform: translateY(100%) scaleY(0.5); }\n            100% { height: 280px !important; transform: translateY(0) scaleY(1); }\n      }\n      @keyframes scale-to-0 {\n        0% { transform: translateY(0) scaleY(1); opacity: 1; }\n        100% { transform: translateY(100%) scaleY(0); opacity: 0; }\n      }\n      @keyframes scale-to-100 {\n        0% { opacity: 0; transform: translateY(100%) scaleY(0.5); }\n        100% { opacity: 1; transform: translateY(0) scaleY(1); }\n      }\n      #chat-widget {\n        position: fixed; bottom: 10px; right: 20px; display: grid; z-index: 999999999 !important;\n      }\n    \n      #chat-messages {\n        height: auto; padding: 10px; overflow-y: auto;\n      }\n      #floating-icon-btn {\n        box-sizing: border-box; margin-left: auto; margin-top: auto; display: inline-flex;\n        height: 64px; width: 64px; align-items: center; justify-content: center; border-radius: 9999px;\n        cursor: pointer; background-color: white; color: var(--grey-color); border-style: none;\n      }\n    \n      #loading-icon {\n        animation: rotate-load 1s linear infinite;\n      }\n      .h-7 { height: 1.75rem; }\n      .w-7 { width: 1.75rem; }\n      .rounded-lg { border-radius: 20px; }\n      .ring-1 {\n        --tw-ring-color: rgb(17 24 39 / 0.05); --tw-ring-shadow: 0 0 #0000;\n        --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0\n        var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),\n        var(--tw-shadow, 0 0 #0000);\n      }\n      #widget-chat-frame {\n        display: none; width: 400px; height: 500px; transform-origin: 95% 100%;\n      }\n      #widget-chat-frame.active {\n        display: block; animation: scale-to-100 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);\n      }      \n      #widget-chat-frame.deactive {\n        display: block; animation: scale-to-0 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);\n      }\n      #widget-chat-frame.hidden {\n        display: none;\n      }\n      #widget-chat-frame.active.shrink {\n        height: 280px !important; animation: scale-to-100 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);\n    \n      }\n      #widget-chat-frame.deactive.shrink {\n        height: 280px !important;\n      }\n     \n     \n      .iframe_inset {\n        inset: auto 15px 106px auto;\n      }\n      #widget_triangle {\n        display: none;\n      }\n      #widget_triangle.active {\n        display: block; position: absolute; inset: auto 36px 88px auto;\n        animation: appear 0.5s ease forwards; animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1.3);\n        stroke: white; fill: white; z-index: 999999999;\n      }\n      #chat-messages-ping {\n        display: none;\n  }\n      #chat-messages-ping.active {\n        display: flex;\n      }\n        \n      @media (max-width: 768px) {\n        .iframe_inset {\n          inset: auto 0px 108px 0px;\n        }\n        #widget-chat-frame {\n          transform-origin: 85% 100%; width: 100vw; height: 70vh;\n        }\n      }\n      </style>\n    `,
      o = {
        icon_close:
          '\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">\n          <line x1="24" x2="8" y1="8" y2="24"></line>\n          <line x1="8" x2="24" y1="8" y2="24"></line>\n        </svg>\n      ',
        icon_message:
          '\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square w-8 h-8">\n          <path d="M18.667 12a2.667 2.667 0 0 1-2.667 2.667H8l-5.333 5.333V5.333c0-1.467 1.2-2.667 2.667-2.667h10.667a2.667 2.667 0 0 1 2.667 2.667v7Z"></path>\n          <path d="M24 12h2.667a2.667 2.667 0 0 1 2.667 2.667v14.667L24 24h-8a2.667 2.667 0 0 1-2.667-2.667v-1.333"></path>\n        </svg>\n      ',
        loading:
          '\n        <svg id="loading-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6667" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle">\n          <path d="M28 16a12 12 0 1 1-8.292-11.413"/>\n        </svg>\n      ',
      },
      a = window.location.host;
    t.id = 'chat-widget';
    const r = `${n}?domain=${a}`,
      s = `${n}/widget-notification`;
    (t.innerHTML = `\n      <iframe id="widget-chat-frame" src="${r}" class="ring-1 rounded-lg iframe_inset" \n        style="box-shadow: 2px 4px 16px 2px #1616161A; border: none; position: fixed; background: white !important; margin: 0px; max-height: 100vh; max-width: 100vw; transform: translateY(0); z-index: 999999999 !important;">\n      </iframe>\n      <svg fill="#000000" id="widget_triangle" height="12" width="12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve" stroke="#ffffff">\n        <g><polygon points="245,456.701 490,33.299 0,33.299 "></polygon></g>\n      </svg>\n      <div id="iframe-trigger-container" style="position: fixed; \n      bottom: 0; right: 0; width: 120px; height: 120px;">\n        <iframe id="floating-button-iframe" src="${s}" style="position: fixed; bottom: 0; right: 0; width: 120px; height: 120px;\n        border-radius: 50%;\n        border: none;"\n        ></iframe>\n\n        <button id="floating-icon-btn" style="position: absolute; bottom: 28px; right: 28px; width: 64px; height: 64px; opacity: 1; font-size: 32px;">\n          ${o.loading}\n         </button>\n          <div \n          id="chat-messages-ping"\n          class="ping-container">\n            <span class="heartbeat"></span>\n            <span class="dot"></span>\n          </div>\n      </div> \n    `),
      document.head.insertAdjacentHTML('beforeend', i),
      document.body.appendChild(t);
    const d = document.getElementById('floating-icon-btn'),
      c = document.getElementById('widget-chat-frame'),
      l = document.getElementById('widget_triangle');
    document.getElementById('floating-button-iframe').style.display = 'none';
    const g = document.getElementById('iframe-trigger-container');
    c.classList.add('shrink'),
      window.addEventListener('message', (n) => {
        document.getElementById('iframe-trigger-container');
        const e = document.getElementById('chat-messages-ping');
        switch ((console.log('event', n), n.data)) {
          case 'open-chat-widget':
          case 'close-chat-widget':
          default:
            break;
          case 'ping':
            e.classList.add('active');
            break;
          case 'no-ping':
            e.classList.remove('active');
            break;
          case 'show-form':
          case 'room-found':
            console.log('room-found or on-start'), c.classList.remove('shrink');
            break;
          case 'room-end':
            console.log('room-end'), c.classList.add('shrink');
        }
        n.data;
      }),
      g.addEventListener('click', () => {
        d.innerHTML !== o.icon_close
          ? ((d.innerHTML = o.icon_close),
            c.classList.remove('deactive'),
            c.classList.add('active'),
            l.classList.add('active'))
          : ((d.innerHTML = o.icon_message),
            c.classList.remove('active'),
            c.classList.add('deactive'),
            l.classList.remove('active'));
      }),
      (g.disabled = !0),
      fetch(`${n}/check-host?host=${a}`, {
        mode: 'no-cors',
        method: 'GET',
        headers: { Accept: 'Content-Type' },
      })
        .then((n) => {
          console.log('response', n),
            setTimeout(() => {
              (d.innerHTML = o.icon_message),
                (g.disabled = !1),
                console.log('widgetChatFrame loaded');
            }, 200);
        })
        .catch((n) => {
          t.remove();
        }),
      c.addEventListener('load', () => {
        console.log('widgetChatFrame loaded');
      });
  },
};
