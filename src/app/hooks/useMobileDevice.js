import { useState, useEffect } from "react";

export default function useMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      const isMultiTouch = maxTouchPoints > 2;

      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const isMobilePlatform = /Android|iPhone|iPad|iPod/i.test(
        navigator.platform
      );

      const isMacUA = /Macintosh/i.test(navigator.userAgent);
      const isIpadPro = isMacUA && isMultiTouch;

      return isMobileUA || isMobilePlatform || isIpadPro;
    };

    setIsMobileDevice(checkIfMobile());
  }, []);

  return isMobileDevice;
}
