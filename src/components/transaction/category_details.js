import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import './category_details.css'

export default function CategoryDetails() {

    useEffect(()=>{
        document.title = `CDFYP | Category Details`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
    },[])

    return (
        <div className="container cat_details py-5">
            <div className="row">
                <div className="heading col-12">General Categories</div>
            </div>
            <div className="row">
                {[...Array(6)].map((j,i)=>
                    <Link to='/category_details/Bills' className="col-4 pt-3" key={i}>
                        <div className="category_card">
                            <div className="name">Bills</div>
                            <div className="percentage">50%</div>
                            <div className="status_bar">
                                <div className="progress_bar" style={{width: '50%'}}></div>
                            </div>
                            <div className="amount">1000/2000</div>
                        </div>
                    </Link>
                )}
            </div>
            <div className="row mt-5">
                <div className="heading col-12">User Specific Categories</div>
            </div>
            <div className="row">
                {[...Array(6)].map((j,i)=>
                    <div className="col-4 pt-3" key={i}>
                        <div className="category_card">
                            <div className="name">Bills</div>
                            <div className="percentage">50%</div>
                            <div className="status_bar">
                                <div className="progress_bar" style={{width: '50%'}}></div>
                            </div>
                            <div className="amount">1000/2000</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
