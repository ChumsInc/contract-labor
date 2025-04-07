import {createHashRouter} from 'react-router'
import Layout from "./Layout";

const router = createHashRouter([
    {path: '/', element: <Layout />}
    // {path: '*', element: <}
])
