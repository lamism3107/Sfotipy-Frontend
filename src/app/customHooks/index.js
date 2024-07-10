"use client";

import { useRef, useState } from "react";

export const useDebounce = (func, delay) => {
  let timeout = useRef(null);
  if (timeout.current) {
    clearTimeout(timeout.current);
  }
  timeout.current = setTimeout(() => func(), delay);
};
