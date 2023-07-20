import { App } from 'antd';
import delay from 'delay';
import { remove } from 'lodash-es';
import { FC, useEffect, useRef } from 'react';
import { usePageVisibility } from 'react-page-visibility';
import { useSnapshot } from 'valtio';
import { clearError, errorsState, syncErrorsState } from 'states/errors';
import { BaseError } from 'utils/errors';

export const ErrorHandlder: FC = () => {
  const recentLocalMessages = useRef<string[]>([]);

  const { lastError } = useSnapshot(errorsState);

  useEffect(() => {
    return syncErrorsState();
  }, []);

  const pageVisible = usePageVisibility();

  const { message } = App.useApp();

  useEffect(() => {
    setTimeout(async () => {
      if (lastError) {
        clearError(lastError);
        if (lastError instanceof BaseError) {
          if (lastError.expose) {
            const localMessage = lastError.getLocalMessage();
            if (localMessage && pageVisible) {
              if (!recentLocalMessages.current.includes(localMessage)) {
                recentLocalMessages.current.push(localMessage);
                message.error(localMessage);
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
  }, [lastError, message, pageVisible]);

  return <></>;
};
