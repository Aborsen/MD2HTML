'use client';

import { Title } from '@radix-ui/react-dialog';
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

interface DialogTitleFallbackProps {
  children?: ReactNode;
}

export function DialogTitleFallback({ children }: DialogTitleFallbackProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleIdRef = useRef<string | null>(null);
  const [isRendered, setIsRendered] = useState(true);

  useLayoutEffect(() => {
    const titleId = titleRef.current?.id ?? titleIdRef.current;
    if (!titleId) return;

    titleIdRef.current = titleId;

    const title = document.getElementById(titleId);
    setIsRendered(title === null || title === titleRef.current);
  });

  if (!isRendered) return null;

  const hasLabel =
    children !== undefined && children !== null && children !== '';

  return (
    <Title
      ref={titleRef}
      hidden={!hasLabel}
      className={hasLabel ? 'sr-only' : undefined}
    >
      {children}
    </Title>
  );
}

DialogTitleFallback.displayName = 'DialogTitleFallback';
