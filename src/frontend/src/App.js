import {useState, useEffect} from 'react'
import {getAllStudents} from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Table, Spin, Empty, Button
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, DownloadOutlined, PlusCircleOutlined
} from '@ant-design/icons';

import './StudentDrawerForm';
import './App.css';
import StudentDrawerForm from "./StudentDrawerForm";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// functional-style component
function App() {

    // React Hook. Takes the initial state as an argument and returns the state and how to set it. is "hooked"
    // or managed by react, so it will persist even if App ends.
    const [showDrawer, setShowDrawer] = useState(false);
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);

                /*
                What does useEffect do? By using this Hook, you tell React that your component
                needs to do something after render. React will remember the function you passed
                (we’ll refer to it as our “effect”), and call it later after performing the DOM updates
                 */

                setStudents(data);
                setFetching(false);
            })

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon} />
        }
        if (students.length <= 0) {
            return <Empty />;
        }

        // Added the "<></> to return more than one component and add the Antd drawer
        // state is managed with the button component
        return <>
            <StudentDrawerForm
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
            />
            <Table
                dataSource={students}
                columns={columns}
                bordered
                title={() => <Button
                    // add drawer button event
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" icon={<PlusCircleOutlined />} size="large">
                    Add new Student
                </Button>}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 240 }}
            />;
        </>
    }

    // this.setState is equivalent to call directly the setX() method
    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>By NickMonks</Footer>
        </Layout>
    </Layout>
}

export default App;
