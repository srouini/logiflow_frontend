import { useState, useEffect } from 'react';
import { SizeType } from 'antd/es/config-provider/SizeContext';

const useScreenSize = () => {
  const [size, setSize] = useState<SizeType>("small");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920) {
        setSize("middle");
      } else {
        setSize("small");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size based on current window size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default useScreenSize;