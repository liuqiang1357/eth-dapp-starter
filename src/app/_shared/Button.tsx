import { Button as AntButton, ConfigProvider } from 'antd';
import { ComponentProps, ComponentRef, forwardRef, MouseEventHandler } from 'react';
import {
  LinkProps,
  useHref,
  useLinkClickHandler,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { omitUndefined } from 'utils/misc';
import { tm, tw } from 'utils/tailwind';

type AntButtonProps = ComponentProps<typeof AntButton>;

type Props = Omit<AntButtonProps, 'type' | 'loading'> &
  Omit<LinkProps, 'to'> & {
    type?: AntButtonProps['type'] | 'unstyled';
    colorPrimary?: string;
    colorText?: string;
    linkActiveClass?: string;
    linkInactiveClass?: string;
    loading?: boolean;
    to?: LinkProps['to'];
    onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  };

export const Button = forwardRef<ComponentRef<typeof AntButton>, Props>(
  (
    {
      className,
      type = 'unstyled',
      colorPrimary,
      colorText,
      linkActiveClass,
      linkInactiveClass,
      loading = false,
      disabled = false,
      href,
      target,
      to,
      replace,
      state,
      preventScrollReset,
      relative,
      onClick,
      ...rest
    },
    ref,
  ) => {
    let baseClassName = tw`inline-flex items-center justify-center no-underline`;

    let finalType: AntButtonProps['type'];
    const finalDisabled = loading || disabled;

    switch (type) {
      case 'unstyled':
        finalType = 'text';
        baseClassName += tw` rounded-none h-auto border-none p-0 text-[length:inherit] font-[number:inherit] text-[color:inherit] [text-align:inherit] ${
          finalDisabled ? tw`opacity-30` : tw`hover:opacity-60`
        }`;
        break;
      default:
        finalType = type;
    }

    const matchResult = useResolvedPath(to ?? '');
    const location = useLocation();

    const linkActive = to != null ? matchResult.pathname === location.pathname : null;
    if (linkActive != null) {
      baseClassName += ` ${linkActive ? linkActiveClass ?? '' : linkInactiveClass ?? ''}`;
    }

    let toHref: string | null = useHref(to ?? '');
    toHref = to != null ? toHref : null;

    const finalHref = finalDisabled ? null : toHref ?? href;

    let linkClickHandler: MouseEventHandler<HTMLElement> | null = useLinkClickHandler<HTMLElement>(
      to ?? '',
      {
        replace,
        state,
        target,
        preventScrollReset,
        relative,
      },
    );
    linkClickHandler = to != null ? linkClickHandler : null;

    const handleClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = event => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        linkClickHandler?.(event);
      }
    };

    return (
      <ConfigProvider
        theme={{
          token: omitUndefined({
            colorPrimary,
            colorText: type === 'unstyled' ? 'invalid' : colorText,
            colorTextDisabled: type === 'unstyled' ? 'invalid' : undefined,
            colorBgTextHover: type === 'unstyled' ? 'invalid' : undefined,
            colorBgTextActive: type === 'unstyled' ? 'invalid' : undefined,
          }),
        }}
      >
        <AntButton
          ref={ref}
          className={tm(baseClassName, className)}
          type={finalType}
          href={finalHref ?? undefined}
          target={target}
          loading={loading}
          disabled={finalDisabled}
          onClick={handleClick}
          {...rest}
        />
      </ConfigProvider>
    );
  },
);

Button.displayName = 'Button';
