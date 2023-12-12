import { Button, Dropdown, Space } from 'antd';
import { useMemo, useCallback } from 'react';
import { LogoutOutlined, DownOutlined, GlobalOutlined, BellOutlined, TeamOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import { useRouter, usePathname } from 'next/navigation';
import { FlagUSA, FlagVietnam } from '@/assets/icons';
import getDictionary from '@/utils/language';
import HomeButton from '@/components/HomeButton';
import styles from '@/styles/components/Header.module.scss';
import Link from 'next/link';

const cx = classnames.bind(styles);

const languageItems = [
  {
    label: <p className={cx('language-item')}>English</p>,
    key: '0',
    icon: <FlagUSA className={cx('dropdown-icon')} />,
  },
  {
    label: <p className={cx('language-item')}>Tiếng Việt</p>,
    key: '1',
    icon: <FlagVietnam className={cx('dropdown-icon')} />,
  },
];

export default function Header({ user, lang }) {
  const router = useRouter();
  const pathname = usePathname();

  let redirectLocale = '';

  if (pathname.includes('/en')) redirectLocale = '/en/dashboard';
  else redirectLocale = '/vi/dashboard';

  const d = useMemo(() => {
    return getDictionary(lang, 'components/Header');
  }, [lang]);

  const userItems = useMemo(
    () => [
      {
        label: (
          <Link href={redirectLocale}>
            <p className={cx('user-item')}>{d.my_classes}</p>
          </Link>
        ),
        key: '0',
        icon: <TeamOutlined className={cx('dropdown-icon')} />,
      },
      {
        label: <a className={cx('user-item')}>{d.notifications}</a>,
        key: '1',
        icon: <BellOutlined className={cx('dropdown-icon')} />,
      },
      {
        type: 'divider',
      },
      {
        label: (
          <a
            href={`http://localhost:3000/${lang}/api/auth/logout`}
            className={cx('user-item')}
          >
            {d.logout}
          </a>
        ),
        key: '3',
        icon: <LogoutOutlined className={cx('dropdown-icon')} />,
      },
    ],
    [d, lang],
  );

  const switchLanguagesHandler = useCallback(
    (event) => {
      let updatePathname = '';

      switch (event.key) {
        case '0': //en
          updatePathname = pathname.replace(/\/vi(\/|$)/, '/en$1');
          router.push(updatePathname);
          break;
        case '1': //vi
          updatePathname = pathname.replace(/\/en(\/|$)/, '/vi$1');
          router.push(updatePathname);
          break;
      }
    },
    [pathname, router],
  );

  return (
    <header className={cx('header')}>
      <HomeButton />
      <nav></nav>
      <div className={cx('auth')}>
        {!user && (
          <>
            <Button
              type="transparent"
              className={cx('login-btn')}
              href={`${lang}/api/auth/login`}
            >
              {d.login}
            </Button>
            <Button
              type="primary"
              className={cx('signup-btn')}
              href={`${lang}/api/auth/signup`}
            >
              {d.signup}
            </Button>
          </>
        )}

        {user && (
          <Dropdown
            menu={{
              items: userItems,
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <a
              className={cx('avatar')}
              onClick={(e) => e.preventDefault()}
            >
              <img
                src={user.avatar || user.picture}
                alt="User"
              />
            </a>
          </Dropdown>
        )}
        <Dropdown
          menu={{
            items: languageItems,
            onClick: switchLanguagesHandler,
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <a
            className={cx('language')}
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              <GlobalOutlined />

              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </header>
  );
}
