'use client';

import { useNetworkStatus } from '@/utils/use-network-status';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
type Status = 'ONLINE' | 'OFFLINE' | undefined;
export default function Offline() {
  const { t } = useTranslation('common');
  const [status, setStatus] = useState<Status>();

  const { isOnline } = useNetworkStatus();
  useEffect(() => {
    if (isOnline && status == 'OFFLINE') {
      setStatus('ONLINE');
      window.location.reload();
    }
    if (!isOnline) {
      setStatus('OFFLINE');
    }
  }, [isOnline, status]);

  if(status !== 'OFFLINE') return null;
  return (
    <section className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950">
      <div className="mx-auto flex h-full max-w-[600px] flex-col items-center justify-center px-[5vw]">
        <div className="mx-auto w-[223px]">
          <svg
            width="287"
            height="300"
            viewBox="0 0 287 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <g clip-path="url(#clip0_4828_26188)">
              <path
                d="M178.462 216.777C238.324 216.777 286.851 168.249 286.851 108.388C286.851 48.5271 238.324 0 178.462 0C118.601 0 70.0742 48.5271 70.0742 108.388C70.0742 168.249 118.601 216.777 178.462 216.777Z"
                fill="#FAFAFA"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M171.109 165.788C171.109 161.825 174.322 158.613 178.284 158.613H178.356C182.319 158.613 185.531 161.825 185.531 165.788C185.531 169.75 182.319 172.963 178.356 172.963H178.284C174.322 172.963 171.109 169.75 171.109 165.788Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M178.284 65.3406C153.576 65.3406 129.734 74.4473 111.318 90.9195C108.364 93.5612 103.828 93.3084 101.187 90.3549C98.5448 87.4013 98.7975 82.8654 101.751 80.2237C122.798 61.3983 150.046 50.9907 178.284 50.9907C206.522 50.9907 233.769 61.3983 254.817 80.2237C257.77 82.8654 258.023 87.4013 255.381 90.3549C252.74 93.3084 248.204 93.5612 245.25 90.9195C226.834 74.4473 202.992 65.3406 178.284 65.3406Z"
                fill="#E6E6E6"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M178.282 101.216C161.38 101.216 145.151 107.843 133.08 119.675C130.25 122.449 125.708 122.404 122.934 119.574C120.16 116.744 120.205 112.201 123.035 109.427C137.789 94.9663 157.624 86.8662 178.282 86.8662C198.941 86.8662 218.776 94.9663 233.53 109.427C236.359 112.201 236.405 116.744 233.631 119.574C230.857 122.404 226.315 122.449 223.485 119.675C211.414 107.843 195.185 101.216 178.282 101.216Z"
                fill="#E6E6E6"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M178.283 137.086C170.771 137.086 163.558 140.031 158.194 145.29C155.364 148.064 150.821 148.018 148.047 145.188C145.273 142.358 145.319 137.816 148.149 135.042C156.196 127.154 167.015 122.736 178.283 122.736C189.552 122.736 200.371 127.154 208.418 135.042C211.248 137.816 211.294 142.358 208.52 145.188C205.746 148.018 201.203 148.064 198.373 145.29C193.008 140.031 185.796 137.086 178.283 137.086Z"
                fill="#E6E6E6"
              />
              <path
                d="M111.057 300C172.308 300 221.962 291.228 221.962 280.408C221.962 269.587 172.308 260.815 111.057 260.815C49.8061 260.815 0.152344 269.587 0.152344 280.408C0.152344 291.228 49.8061 300 111.057 300Z"
                fill="#EFEFEF"
              />
              <path
                d="M71.0326 118.088C71.0326 118.088 62.5111 142.075 66.2984 150.596C70.0858 159.118 76.0824 167.324 76.0824 167.324C76.0824 167.324 73.8731 119.666 71.0326 118.088Z"
                fill="#D0CDE1"
              />
              <path
                opacity="0.1"
                d="M71.0326 118.088C71.0326 118.088 62.5111 142.075 66.2984 150.596C70.0858 159.118 76.0824 167.324 76.0824 167.324C76.0824 167.324 73.8731 119.666 71.0326 118.088Z"
                fill="black"
              />
              <path
                d="M77.0324 173.636C77.0324 173.636 76.4012 179.632 76.0856 179.948C75.77 180.263 76.4012 180.895 76.0856 181.841C75.77 182.788 75.4544 184.051 76.0856 184.366C76.7168 184.682 72.6139 212.456 72.6139 212.456C72.6139 212.456 62.5144 225.711 66.6173 246.542L67.8797 267.688C67.8797 267.688 77.6637 268.319 77.6637 264.847C77.6637 264.847 77.0324 260.744 77.0324 258.85C77.0324 256.957 78.6105 256.957 77.6637 256.01C76.7168 255.063 76.7168 254.432 76.7168 254.432C76.7168 254.432 78.2949 253.169 77.9793 252.854C77.6637 252.538 80.8198 230.13 80.8198 230.13C80.8198 230.13 84.2915 226.658 84.2915 224.765V222.871C84.2915 222.871 85.8695 218.768 85.8695 218.452C85.8695 218.137 94.391 198.884 94.391 198.884L97.8628 212.771L101.65 232.655C101.65 232.655 103.544 250.645 107.331 257.588C107.331 257.588 113.959 280.312 113.959 279.681C113.959 279.05 125.005 277.472 124.69 274.631C124.374 271.791 118.062 232.024 118.062 232.024L119.64 173.004L77.0324 173.636Z"
                fill="#2F2E41"
              />
              <path
                d="M68.5082 266.11C68.5082 266.11 59.9867 282.837 65.6677 283.468C71.3487 284.099 73.558 284.099 76.0828 281.575C77.4632 280.194 80.2585 278.342 82.5091 276.947C83.8426 276.133 84.9199 274.96 85.6173 273.563C86.3148 272.165 86.6042 270.599 86.4524 269.044C86.2859 267.5 85.709 266.228 84.2887 266.11C80.5014 265.794 76.0828 262.322 76.0828 262.322L68.5082 266.11Z"
                fill="#2F2E41"
              />
              <path
                d="M115.536 278.419C115.536 278.419 107.014 295.146 112.695 295.777C118.376 296.408 120.585 296.409 123.11 293.884C124.491 292.503 127.286 290.651 129.536 289.256C130.87 288.442 131.947 287.27 132.645 285.872C133.342 284.474 133.632 282.908 133.48 281.354C133.313 279.809 132.736 278.537 131.316 278.419C127.529 278.103 123.11 274.631 123.11 274.631L115.536 278.419Z"
                fill="#2F2E41"
              />
              <path
                d="M106.529 90.7144C113.856 90.7144 119.796 84.7745 119.796 77.4473C119.796 70.1201 113.856 64.1802 106.529 64.1802C99.2016 64.1802 93.2617 70.1201 93.2617 77.4473C93.2617 84.7745 99.2016 90.7144 106.529 90.7144Z"
                fill="#FFB8B8"
              />
              <path
                d="M98.0003 81.8066C98.0003 81.8066 88.5238 99.2434 87.7657 99.2434C87.0076 99.2434 104.823 104.929 104.823 104.929C104.823 104.929 109.751 88.2507 110.509 86.7344L98.0003 81.8066Z"
                fill="#FFB8B8"
              />
              <path
                d="M112.537 100.887C112.537 100.887 93.6002 90.4722 91.7066 90.7878C89.8129 91.1034 69.6138 108.778 69.9294 116.037C70.2451 123.296 72.7699 135.289 72.7699 135.289C72.7699 135.289 73.7168 168.744 75.6104 169.059C77.5041 169.375 75.2948 175.056 75.926 175.056C76.5573 175.056 120.112 175.056 120.427 174.109C120.743 173.162 112.537 100.887 112.537 100.887Z"
                fill="#D0CDE1"
              />
              <path
                d="M123.109 175.845C123.109 175.845 129.106 194.151 124.056 193.519C119.006 192.888 116.797 177.739 116.797 177.739L123.109 175.845Z"
                fill="#FFB8B8"
              />
              <path
                d="M107.015 99.7828C107.015 99.7828 95.3375 102.308 97.2311 118.088C99.1248 133.869 102.597 149.649 102.597 149.649L114.274 175.214L115.537 179.948L124.058 177.739L117.746 141.128C117.746 141.128 115.537 101.992 112.696 100.73C110.905 99.966 108.957 99.6414 107.015 99.7828Z"
                fill="#D0CDE1"
              />
              <path
                opacity="0.1"
                d="M99.9141 149.176L114.432 175.056L102.2 147.786L99.9141 149.176Z"
                fill="black"
              />
              <path
                d="M119.737 73.5408L119.78 72.527L121.797 73.0289C121.776 72.7035 121.684 72.3866 121.528 72.1001C121.372 71.8137 121.155 71.5645 120.894 71.3698L123.042 71.2497C121.239 68.688 118.936 66.5183 116.271 64.8716C113.607 63.2248 110.636 62.1352 107.539 61.6686C102.892 60.9951 97.7179 61.9697 94.5314 65.4183C92.9859 67.0911 92.0147 69.2183 91.3239 71.3884C90.0516 75.3854 89.7923 80.1501 92.4454 83.399C95.1418 86.701 99.8518 87.3479 104.095 87.7565C105.588 87.9003 107.153 88.0341 108.537 87.4548C108.691 85.8678 108.487 84.2664 107.942 82.7681C107.715 82.3043 107.606 81.7913 107.626 81.2753C107.815 80.0129 109.499 79.6948 110.764 79.8654C112.029 80.0359 113.55 80.2969 114.381 79.3282C114.954 78.6609 114.92 77.6892 114.996 76.8132C115.202 74.4284 119.715 74.0407 119.737 73.5408Z"
                fill="#2F2E41"
              />
              <path
                d="M192.412 149.357C191.532 148.498 190.6 147.736 189.622 147.071L190.073 140.308L190.951 127.107L190.953 127.082L190.955 127.057C191.856 112.122 193.339 95.5409 195.409 77.3053C197.534 59.0945 198.684 47.1914 198.684 42.3094C198.684 38.9863 198.006 35.6129 196.225 32.5631C194.565 29.7218 192.141 27.3767 188.925 25.9977C187.116 25.1762 185.195 24.4996 183.223 24.1542C181.596 23.8053 179.945 23.6357 178.282 23.6357C176.635 23.6357 174.999 23.8147 173.386 24.1463C171.379 24.4924 169.424 25.1828 167.586 26.0213C164.464 27.4024 162.127 29.6971 160.465 32.3541L160.4 32.4576L160.338 32.5631C158.557 35.6129 157.879 38.9863 157.879 42.3094C157.879 46.4491 159.151 58.0219 161.459 76.093L161.461 76.1068L161.463 76.1207C163.844 94.2613 165.317 111.175 165.892 126.868L165.893 126.899L165.895 126.93L166.481 140.132L166.791 147.133C165.835 147.784 164.92 148.526 164.053 149.357C160.137 153.113 158.074 157.944 158.074 163.371C158.074 168.792 160.129 173.613 163.975 177.403L164.053 177.48L164.133 177.554C168.068 181.225 172.933 183.075 178.282 183.075C183.633 183.075 188.51 181.22 192.412 177.479C196.345 173.709 198.489 168.866 198.489 163.371C198.489 157.907 196.365 153.081 192.412 149.357Z"
                fill="#3D88ED"
                stroke="#FAFAFA"
                strokeWidth="16"
              />
              <path
                d="M82.524 73.3371L65.8518 70.0197M83.7349 70.2423L73.8212 65.7693M85.714 66.3706L65.2227 51.0483"
                stroke="#3D88ED"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_4828_26188">
                <rect
                  width="286.699"
                  height="300"
                  fill="white"
                  transform="translate(0.152344)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h1 className="mt-2 text-center text-[22px] font-semibold text-primary">
          {t('OFFLINE.TITLE')}
        </h1>
        <p className="mt-4 text-center">{t('OFFLINE.DESCRIPTION')}</p>
        <Button
          onClick={() => window.location.reload()}
          shape={'square'}
          size={'sm'}
          className="mx-auto mt-4 block"
        >
          {t('OFFLINE.REFRESH')}
        </Button>
      </div>
    </section>
  );
}
