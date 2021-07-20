import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8080"
})

const headers = {
    'Content-Type':'Application/json'
}

export const ShelfAPI = {
    getAll: () => {
        return axiosInstance.request({
            method:"GET",
            url:`/shelves`,
            headers: headers
        })
    }
}