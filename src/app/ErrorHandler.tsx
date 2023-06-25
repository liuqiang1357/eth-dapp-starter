import { App } from 'antd';
import delay from 'delay';
import { remove } from 'lodash-es';
import { FC, useEffect, useRef } from 'react';
import { usePageVisibility } from 'react-page-visibility';
import { clearError, registerErrorHandler, selectLastError } from 'store/slices/errors';
import { BaseError } from 'utils/errors';
import { useDispatch, useSelector } from 'utils/hooks/redux';

export const ErrorHandlder: FC = () => {
  const recentLocalMessages = useRef<string[]>([]);

  const error = useSelector(selectLastError);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(registerErrorHandler()).unwrap();
    })();
  }, [dispatch]);

  const pageVisible = usePageVisibility();

  const { message } = App.useApp();

  useEffect(() => {
    setTimeout(async () => {
      if (error) {
        dispatch(clearError(error));
        if (error instanceof BaseError) {
          if (error.expose) {
            const localMessage = error.getLocalMessage();
            if (localMessage && pageVisible) {
              if (!recentLocalMessages.current.includes(localMessage)) {
                recentLocalMessages.current.push(localMessage);
                message.error(localMessage);
                await delay(1000);
                remove(recentLocalMessages.current, item => item === localMessage);
              }
            }
            error.printTraceStack();
          }
          return;
        }
        console.error(error);
      }
    });
  }, [dispatch, error, message, pageVisible]);

  return <></>;
};
