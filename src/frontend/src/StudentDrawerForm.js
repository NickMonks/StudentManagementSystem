import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import {addNewStudent} from "./client";
import { LoadingOutlined } from '@ant-design/icons';
import {useState} from "react";
import {successNotification, errorNotification} from "./Notification";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const {Option} = Select;

function StudentDrawerForm({showDrawer, setShowDrawer, fetchStudents}) {
    const onCLose = () => setShowDrawer(false);

    const [Submit, setSubmit] = useState(false);

    const onFinish = student => {
        // when is submitted reload the page by changing the state:
        setSubmit(true)

        console.log(JSON.stringify(student))
        addNewStudent(student)
            .then(()=> {
                console.log("student added succesfully")
                setSubmit(false)
                onCLose() // to close the drawer and change the state
                successNotification("Student succesfully added",
                    `${student.name} was added to the system!`) // Notification for success
                fetchStudents() // reload the table
            })
            .catch(err => {
                console.log(err)
                err.response.json().then(res => {
                    // use the json error payload:
                    // change placement to bottomLeft
                    errorNotification("There was an internal server error",
                        `${res.message} [statusCode:${res.status}]`,
                        "bottomLeft"
                    )
                })
            })
            .finally(()=>{
                setSubmit(false)
            })
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title="Create new student"
        width={720}
        onClose={onCLose}
        visible={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter student name'}]}
                    >
                        <Input placeholder="Please enter student name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: 'Please enter student email'}]}
                    >
                        <Input placeholder="Please enter student email"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="gender"
                        rules={[{required: true, message: 'Please select a gender'}]}
                    >
                        <Select placeholder="Please select a gender">
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {Submit && <Spin indicator={antIcon} /> }
            </Row>
        </Form>
    </Drawer>
}

export default StudentDrawerForm;