import React, { useEffect } from 'react'
import './home.css'

export default function Home() {


    useEffect(()=>{
        document.title = `CDFYP | Home`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('1').classList.add('active')
    },[])

    
    return (
        <div className="homepage">
            
        </div>  
    )
}
