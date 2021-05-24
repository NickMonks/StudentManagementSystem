import fetch from 'unfetch';

// Added functionality to include error handling from server-side:
const checkStatus = response => {
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

export const getAllStudents = () =>
    fetch("api/v1/students")
        .then(checkStatus);

// Add method to take the body client POST request to our backend:
export const addNewStudent = student =>
    fetch("api/v1/students", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(student)})
        .then(checkStatus)

export const deleteStudent = studentId =>
    fetch(`api/v1/students/${studentId}`, {
        method: 'DELETE'
    }).then(checkStatus);