import {useState, useEffect} from 'react'
import {
    getAllStudents,
    deleteStudent} from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Radio,
    Table, Spin, Empty, Button, Badge, Tag, Popconfirm
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, DownloadOutlined, PlusCircleOutlined, PlusOutlined
} from '@ant-design/icons';

import './StudentDrawerForm';
import './App.css';
import StudentDrawerForm from "./StudentDrawerForm";
import Avatar from "antd/es/avatar/avatar";
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const TheAvatar =({name}) => {
    let trim = name.trim();
    if (trim.length === 0){
        return <Avatar icon={<UserOutlined/>} />
    }

    const split = trim.split(" ");
    if (split.length ===1){
        return <Avatar>{name.charAt(0)}</Avatar>
    }

    return <Avatar>
        {`${split[0].charAt(0)} ${split[1].charAt(0)}`}
        </Avatar>

}

// remove function which binds the studentId and callback that updates the state
const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(()=>{
        successNotification("Student Deleted", `Student with ID ${studentId} was deleted.`);
        // after deletion, we call fetchStudent to update the state:
        callback();
    });
}

// Update table to include delete options
const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
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
    {
        // DELETE - EDIT COLUMN
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure you want to delete ${student.name}?`}
                    onConfirm={()=> removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No' >
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
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

            }).catch(err => {
                // error handling from server error
                console.log(err.response);
                err.response.json().then(res => {
                    // use the json error payload:
                    errorNotification("There was an internal server error",
                        `${res.message} [statusCode:${res.status}]`
                    )
                });
        }).finally(()=>setFetching(false));

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon} />
        }
        if (students.length <= 0) {
            // In case no data is return, show the following components
            return <>
                <Button
                    onClick={()=> setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                    />
                <Empty />
                </>
        }

        // Added the "<></> to return more than one component and add the Antd drawer
        // state is managed with the button component
        return <>
            <StudentDrawerForm
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
            fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Button
                        // add drawer button event
                        onClick={() => setShowDrawer(!showDrawer)}
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        shape="round"
                        size="small">
                        Add new Student
                        </Button>
                        <Tag style={{marginLeft: "15px"}}>Number Of Students</Tag>
                        <Badge count={students.length} className="site-badge-count-4" />
                    </>
                }
                pagination={{ pageSize: 40 }}
                scroll={{ y: 1000 }}
            />
        </>
    }

    // this.setState is equivalent to call directly the setX() method
    return <Layout style={{minHeight: '150vh'}}>
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
