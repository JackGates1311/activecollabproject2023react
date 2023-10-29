import axios, {AxiosResponse} from 'axios';
import {SingleLabel, SingleTask, SingleTaskList, SingleUser} from "../types";

const API_URL = 'http://127.0.0.1:8000/api';

export const fetchTaskLists = async (): Promise<SingleTaskList[]> => {
    try {
        const response = await axios.get(API_URL + '/getTaskLists', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.task_lists;
    } catch (error) {
        throw error;
    }
};

export const fetchTasks = async (): Promise<SingleTask[]> => {
    try {
        const response = await axios.get(API_URL + '/getTasks', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.tasks;
    } catch (error) {
        throw error;
    }
};

export const fetchLabels = async (): Promise<SingleLabel[]> => {
    try {
        const response = await axios.get(API_URL + '/getLabels', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.labels;
    } catch (error) {
        throw error;
    }
};

export const fetchAssignee = async (): Promise<SingleUser[]> => {
    try {
        const response = await axios.get(API_URL + '/getAssignee', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.assignee;
    } catch (error) {
        throw error;
    }
};

export async function addNewTask(payload: SingleTask): Promise<AxiosResponse> {
    try {
        return await axios.post(`${API_URL}/addNewTask`, payload, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function addNewTaskList(payload: SingleTaskList): Promise<AxiosResponse> {
    try {
        return await axios.post(`${API_URL}/addNewTaskList`, payload, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function removeTaskList(payload: SingleTaskList): Promise<AxiosResponse> {
    try {
        return await axios.put(`${API_URL}/deleteTaskList`, payload, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    } catch (error) {
        throw error;
    }
}
export async function finishTaskList(id: number): Promise<AxiosResponse> {
    try {
        return await axios.patch(`${API_URL}/completeTaskList/${id}`, null, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    } catch (error) {
        throw error;
    }
}
export async function sortTaskList(payload: { [key: string]: number[] }): Promise<AxiosResponse> {
    try {
        return await axios.patch(`${API_URL}/sortTaskList`, payload, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function login(payload: SingleUser): Promise<AxiosResponse> {
    try {
        return await axios.post(`${API_URL}/login`, payload);
    } catch (error) {
        throw error;
    }
}