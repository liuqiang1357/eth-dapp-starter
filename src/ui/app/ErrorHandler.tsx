'use client';

import { notifications } from '@mantine/notifications';
import { useAtom } from 'jotai';
import { FC, useEffect, useRef } from 'react';
import { BaseError } from 'lib/errors/base';
import { lastErrorAtom } from 'lib/states/errors';

export const ErrorHandler: FC = () => {
  const [lastError, setLastError] = useAtom(lastErrorAtom);

  const recentMessages = useRef<Partial<Record<string, boolean>>>({});

  useEffect(() => {
    if (lastError != null) {
      setLastError(null);

      if (lastError instanceof BaseError) {
        setTimeout(() => {
          if (lastError.expose) {
            if (recentMessages.current[lastError.message] !== true) {
              recentMessages.current[lastError.message] = true;

              notifications.show({ message: lastError.message, color: 'red' });

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
  }, [lastError, setLastError]);

  return null;
};
