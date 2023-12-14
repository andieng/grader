'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppstoreOutlined, TeamOutlined, ContactsOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import Header from '@/components/Header';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/SideMenu.module.scss';
import Link from 'next/link';

const cx = classnames.bind(styles);

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

function transformData(data) {
  let transformedData = {};
  if (data != undefined && data.error) return {};
  if (data)
    Object.keys(data).forEach((key) => {
      transformedData[key] = data[key].map((item) => ({
        label: item.className,
        key: item.classId,
      }));
    });
  return transformedData;
}

const SidebarHeader = ({ children, lang, isInDashboard, isLoggedIn }) => {
  const [current, setCurrent] = useState('0');
  const [openKeys, setOpenKeys] = useState([]);
  const [hasUser, setHasUser] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  if (isLoggedIn)
    isLoggedIn.then((isLogin) => {
      if (hasUser !== isLogin) setHasUser(isLogin);
    });

  let parts = pathname.split('/');
  let classId = parts[parts.length - 1];

  const sidebarClickHandler = (event) => {
    if (event.key !== '0') {
      router.push(`/${lang}/d/${event.key}`);
    }
  };

  const d = useMemo(() => {
    return getDictionary(lang, 'components/SideBar');
  }, [lang]);

  const { data, isLoading, error } = useSWR('/api/user/profile', fetcher);
  const classes = useSWR('/api/classes', fetcher);

  const afterTransforming = transformData(classes.data);

  if (classId != 'dashboard' && current != classId) {
    // chưa open được sub menu
    // if (afterTransforming.teaching != undefined && afterTransforming.teaching.length != 0) {
    //   console.log('hrtr', afterTransforming.teaching);
    //   const isTeachingItem = afterTransforming.teaching.some((item) =>
    //     String(clickedItemKey).startsWith(String(classId)),
    //   );

    //   if (isTeachingItem) {
    //     setOpenKeys(['teaching']);
    //   } else {
    //     setOpenKeys(['enrolled']);
    //   }
    // }
    setCurrent(classId);
  }
  const items = [
    {
      label: (
        <Link href={`/${lang}/dashboard`}>
          <p className={cx('user-item')}>{d.dashboard}</p>
        </Link>
      ),
      key: '0',
      icon: <AppstoreOutlined />,
    },
    {
      type: 'divider',
    },
    getItem(`${d.teaching}`, 'teaching', <TeamOutlined />, afterTransforming.teaching),
    {
      type: 'divider',
    },
    getItem(`${d.enrolled}`, 'enrolled', <ContactsOutlined />, afterTransforming.enrolled),
  ];

  if (isLoading || d === null || classes.isLoading) return <Spin size="large" />;
  if (error || classes.error)
    return (
      <div>
        {error?.message}
        {classes?.error.message}
      </div>
    );

  return (
    <>
      {hasUser && (
        <>
          <Header
            user={data.user}
            lang={lang}
            isInDashboard={isInDashboard}
          />
          <div className={cx('container')}>
            <div>
              <Menu
                className={cx('menu')}
                onClick={sidebarClickHandler}
                selectedKeys={[current]}
                defaultOpenKeys={openKeys}
                mode="inline"
                items={items}
              />
            </div>
            {children}
          </div>
        </>
      )}
      {!hasUser && children}
    </>
  );
};

export default SidebarHeader;
