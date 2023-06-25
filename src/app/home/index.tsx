import { FC } from 'react';
import { Button } from 'app/_shared/Button';

export const Home: FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-[40px] py-[20px]">
        <h2>Home Page</h2>
        <Button type="primary">Button</Button>
      </div>
    </div>
  );
};
