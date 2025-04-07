import React, {useEffect} from 'react';
import {useNavigate} from 'react-router'

export default function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/entry");
    }, []);

    return (
        <div>Home, but it should navigate away to /entry</div>
    );
}
