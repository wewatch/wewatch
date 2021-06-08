import { Text, TextProps, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const OverflowText = ({ children, ...rest }: TextProps): JSX.Element => {
  const [showToolTip, setShowTooltip] = useState<boolean>(false);
  const elementRef = useRef<null | HTMLParagraphElement>(null);

  const compareSize = () => {
    if (!elementRef.current) {
      return;
    }

    const compare =
      elementRef.current.scrollWidth > elementRef.current.clientWidth ||
      elementRef.current.scrollHeight > elementRef.current.clientHeight;

    setShowTooltip(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);

    return () => window.removeEventListener("resize", compareSize);
  }, []);

  return (
    <Tooltip label={children} isDisabled={!showToolTip} hasArrow>
      <Text {...rest} ref={elementRef}>
        {children}
      </Text>
    </Tooltip>
  );
};

export default OverflowText;
