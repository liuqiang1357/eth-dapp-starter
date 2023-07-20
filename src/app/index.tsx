import { App as AntApp } from 'antd';
import { FC, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from 'app/home';
import { syncSettings } from 'states/settings';
import { registerWeb3Listeners } from 'states/web3';
import { ErrorHandlder } from './ErrorHandler';

export const App: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    return syncSettings();
  }, []);

  useEffect(() => {
    return registerWeb3Listeners();
  }, []);

  return (
    <AntApp className="flex min-h-0 grow flex-col">
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ErrorHandlder />
    </AntApp>
  );
};
