import React, { useEffect, useRef, useState } from 'react';

const useCooldown = <T>(
  cooldownTime: number,
  updateCallback: (args: T) => void,
  initialValue: T
): React.Dispatch<React.SetStateAction<T>> => {
  const [instandVal, callUpdateWithCooldown] = useState<T>(initialValue);
  const searchTimeoutRef: { current: NodeJS.Timeout | null } = useRef(null);

  // Setup a useEffect to have a search query change setup a timeout
  // so that the search is only sent when the user is done typing
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    // Timeout to send the search update
    searchTimeoutRef.current = setTimeout(() => {
      updateCallback(instandVal);
    }, cooldownTime);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [instandVal]);

  return callUpdateWithCooldown;
};

export default useCooldown;
