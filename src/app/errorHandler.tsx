'use client';

import { notifications } from '@mantine/notifications';
import delay from 'delay';
import { remove } from 'lodash-es';
import { FC, useEffect, useRef } from 'react';
import { usePageVisibility } from 'react-page-visibility';
import { useSnapshot } from 'valtio';
import { clearError, errorsState, syncErrorsState } from 'lib/states/errors';
import { BaseError } from 'lib/utils/errors';

export const ErrorHandler: FC = () => {
  const recentLocalMessages = useRef<string[]>([]);

  const { lastError } = useSnapshot(errorsState);

  useEffect(() => {
    return syncErrorsState();
  }, []);

  const pageVisible = usePageVisibility();

  useEffect(() => {
    setTimeout(async () => {
      if (lastError != null) {
        clearError(lastError);
        if (lastError instanceof BaseError) {
          if (lastError.expose) {
            const localMessage = lastError.getLocalMessage();
            if (localMessage !== '' && pageVisible) {
              if (!recentLocalMessages.current.includes(localMessage)) {
                recentLocalMessages.current.push(localMessage);
                notifications.show({ message: localMessage, color: 'red' });

                await delay(1000);
                remove(recentLocalMessages.current, item => item === localMessage);
              }
            }
            lastError.printTraceStack();
          }
          return;
        }
        console.error(lastError);
      }
    });
  }, [lastError, pageVisible]);

  return <></>;
};
