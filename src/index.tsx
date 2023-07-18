import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'i18n';
import 'styles/index.css';
import { App } from 'app';
import { antdTheme } from 'utils/antdTheme';
import { ENV_PRODUCTION } from 'utils/env';
import { queryClient } from 'utils/queryClient';
import { reportWebVitals } from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </QueryClientProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (!ENV_PRODUCTION) {
  // eslint-disable-next-line no-console
  reportWebVitals(console.log);
}
