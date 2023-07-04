import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'i18n';
import 'styles/index.css';
import { App } from 'app';
import { store } from 'store';
import { ENV_PRODUCTION } from 'utils/env';
import { reportWebVitals } from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (!ENV_PRODUCTION) {
  // eslint-disable-next-line no-console
  reportWebVitals(console.log);
}
