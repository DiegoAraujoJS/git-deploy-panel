import axios from 'axios';

const axiosInstance = axios.create({
    headers: {
        'Authorization': localStorage.getItem('password') || '',
    }
});

export default axiosInstance;
