import {createHashRouter} from 'react-router-dom'
import Layout from "./Layout";

const router = createHashRouter([
    {path: '/', element: <Layout />}
    // {path: '*', element: <}
])
