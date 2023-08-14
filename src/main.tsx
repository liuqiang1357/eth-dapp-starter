import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'i18n';
import 'styles/index.css';
import { App } from 'app';
import { antdTheme } from 'utils/antdTheme';
import { queryClient } from 'utils/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </QueryClientProvider>,
);
