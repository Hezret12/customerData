import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Body from './Body';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Witdh', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '19')]),
  getItem('Files', '9', <FileOutlined />),
  getItem('Filter', 'sub1', <UserOutlined />, [
    getItem(<div><input type='text' placeholder='currency ID' className='h-5 active:outline-none focus:outline-none'/></div>,'23'),
    getItem(<div><input type='text' placeholder='city ID' className='h-5 active:outline-none focus:outline-none'/></div>,'22'),
    getItem(<div><input type='text' placeholder='filter K'/></div>,'27'),
    
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
];

const Main: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer},
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '1vh',background: colorBgContainer }}>
      <Sider collapsible collapsed={collapsed} width={220} theme='light' onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
            <Body/>
        {/* <Footer style={{ textAlign: 'center' }}> */}
          {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
        {/* </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Main;