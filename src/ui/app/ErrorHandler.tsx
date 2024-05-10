'use client';

import { useAtom } from 'jotai';
import { FC, useEffect, useRef } from 'react';
import { BaseError } from 'lib/errors/base';
import { lastErrorAtom } from 'lib/states/errors';
import { useToast } from 'ui/shadcn/use-toast';

export const ErrorHandler: FC = () => {
  const [lastError, setLastError] = useAtom(lastErrorAtom);

  const recentMessages = useRef<Partial<Record<string, boolean>>>({});

  const { toast } = useToast();

  useEffect(() => {
    if (lastError != null) {
      setLastError(null);

      if (lastError instanceof BaseError) {
        setTimeout(() => {
          if (lastError.expose) {
            if (recentMessages.current[lastError.message] !== true) {
              recentMessages.current[lastError.message] = true;

              toast({ variant: 'destructive', description: lastError.message });

              setTimeout(() => {
                delete recentMessages.current[lastError.message];
              }, 3000);
            }
          }
        });
        lastError.printTraceStack();
      } else {
        console.error(lastError);
      }
    }
  }, [lastError, setLastError, toast]);

  return null;
};
