import { useEffect, useState } from "react";
import { Button } from '@/components/actions';
import Image from 'next/image';
import { useAppStore } from "@/stores/app.store";
const DOWNLOAD_LINK = {
    'mac': 'https://github.com/dudaji-vn/middo-desktop-native-app/releases/latest/download/Middo.dmg',
    'window': 'https://github.com/dudaji-vn/middo-desktop-native-app/releases/latest/download/Middo.exe',
    'ios': 'https://apps.apple.com/app/middo/id6479731975',
    'android': 'https://play.google.com/store/apps/details?id=com.dudajivn.middo',
}
export default function DownloadAppButton() {
    const [system, setSystem] = useState<'mac' | 'window' | 'ios' | 'android'>();
    const downloadApp = () => {
        if(system && DOWNLOAD_LINK[system]) {
            window.open(DOWNLOAD_LINK[system], '_blank');
        }
    };
    useEffect(() => {
        const userAgent = window.navigator.userAgent;
        if(userAgent.indexOf('Mac') !== -1) {
            setSystem('mac');
        }
        if(userAgent.indexOf('Windows') !== -1) {
            setSystem('window');
        }
        if(userAgent.indexOf('iPhone') !== -1) {
            setSystem('ios');
        }
        if(userAgent.indexOf('Android') !== -1) {
            setSystem('android');
        }
    }, []);


    switch (system) {
        case 'mac':
            return <MacDownloadButton onClick={downloadApp}/>;
        case 'window':
            return <WindowDownloadButton onClick={downloadApp}/>;
        case 'ios':
            return <AppStoreDownloadButton onClick={downloadApp}/>;
        case 'android':
            return <PlayStoreDownloadButton onClick={downloadApp}/>;
        default:
            return null;
    }

}

const MacDownloadButton = ({...props}) => {
    return <Button
    size="lg"
    shape="square"
    variant="default"
    color="primary"
    {...props}
  >
    <div className="relative bottom-[2px] mr-2">
        <Image
          src="/landing-page/apple.svg"
          width="20"
          height="20"
          alt="Apple"
        />
      </div>
    Download App
  </Button>
}

const WindowDownloadButton = ({...props}) => {
    return <Button
    size="lg"
    shape="square"
    variant="default"
    color="primary"
    {...props}
  >
    <div className="mr-2">
        <Image
          src="/landing-page/window.svg"
          width="20"
          height="20"
          alt="Window"
        />
      </div>
    Download App
  </Button>
}

const AppStoreDownloadButton = ({...props}) => {
  const theme = useAppStore(state=>state.theme)
    return <button
      className="active:opacity-80 transition-all"
    {...props}
  >
    <Image
        src={theme == 'dark' ? "/landing-page/app-store-dark.svg" : "/landing-page/app-store.svg"}
        width="200"
        height="50"
        alt="Download on the App Store"
    />
  </button>
}

const PlayStoreDownloadButton = ({...props}) => {
  const theme = useAppStore(state=>state.theme)
    return <button
    className="active:opacity-80 transition-all"
    {...props}
  >
    <Image
        src={theme == 'dark' ? "/landing-page/chplay-dark.svg" : "/landing-page/chplay.svg"}
        width="200"
        height="50"
        alt="Download on the Play Store"
    />
  </button>
}