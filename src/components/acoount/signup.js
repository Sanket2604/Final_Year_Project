import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {url} from '../../url'
import './signup.css'

const initialState = {
    fullname: '',
    email: '',
    password: '',
    rePassword: '',
}
export default function SignUp(props) {

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors]= useState(initialState)

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(()=>{
        document.title = `CDFYP | Signup`
        props.setHideNav(true)
        
    },[])

    function validateForm(){
        const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        const signup = document.querySelector('.signup').classList
        signup.remove('error')
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(formData.fullname.length < 3){
            setErrors({...errors, fullname: 'Name Should Be Greater Than or Equal To 3 Charecters'})
            document.getElementById('error_fullname').classList.add('active')
            signup.add('error')
            return false
        }
        if(!emailPattern.test(formData.email)){
            setErrors({...errors, email: 'Enter A Valid Email Address' })
            document.getElementById('error_email').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.password===''){
            setErrors({...errors, password: 'Enter Password' })
            document.getElementById('error_password').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.password.length<6){
            setErrors({...errors, password: 'Password Should Be Greater Than 5 Charecters' })
            document.getElementById('error_password').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.rePassword===''){
            setErrors({...errors, rePassword: 'Re Enter The New Password'})
            document.getElementById('error_rePassword').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.rePassword!==formData.password){
            setErrors({...errors, rePassword: 'Password Does Not Match'})
            document.getElementById('error_rePassword').classList.add('active')
            signup.add('error')
            return false
        }

        return true;
    }

    const handleSubmit = () => {
        try{
            let valid = validateForm()
            if(valid){
                axios
                .post(url+'/account/signup', formData)
                .then((res)=>{
                    localStorage.setItem('profile', JSON.stringify(res.data))
                    window.location.href='/dashboard'
                })
                .catch((error)=>{
                    console.log(error.response.data)
                    // setErrors({...errors, submit: error.response.data.message })
                    document.getElementById('error_submit').classList.add('active')
                    document.querySelector('.signup').classList.add('error')
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }
    
    return (
        <div className="signup_cont">
            <div className="signup container-fluid">
                <div className="heading">Welcome To Cool Dudes Final Year Project (CDFYP)</div>
                <div className="subheading">Create An Account</div>
                <div className="row">
                    <div className="col-12 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" className="fullname" name="fullname" onChange={handleChange} required />
                            <label htmlFor="fullname" className="label-name L_firstname">
                                <span className="content-name">Full Name</span>
                            </label>                           
                        </div>
                        <div id="error_fullname" className='form_error'>{errors.fullname}</div>
                    </div>
                    <div className="col-12 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" className="email" name="email" onChange={handleChange} required />
                            <label htmlFor="email" className="label-name L_email">
                                <span className="content-name"> Email Address</span>
                            </label>                           
                        </div>
                        <div id="error_email" className='form_error'>{errors.email}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="password" className="pass" name="password" onChange={handleChange} required />
                            <label htmlFor="password" className="label-name password">
                                <span className="content-name">Password</span>
                            </label>                           
                        </div>
                        <div id="error_password" className='form_error'>{errors.password}</div>
                    </div>
                    <div className="col-12 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="password" className="rePassword" name="rePassword" onChange={handleChange} required />
                            <label htmlFor="rePassword" className="label-name rePassword">
                                <span className="content-name">Re-Enter Password</span>
                            </label>                           
                        </div>
                        <div id="error_rePassword" className='form_error'>{errors.rePassword}</div>
                    </div>
                </div>
                <div className='d-flex flex-column align-items-center mt-5'>
                    <div onClick={handleSubmit} className="submit">Signup</div>
                    <div id="error_submit" className='form_error'>{errors.submit}</div>
                    <Link to="/login"><div className="msg">Already have an account? Login</div></Link>
                </div>
            </div>
        </div>
    )
}
