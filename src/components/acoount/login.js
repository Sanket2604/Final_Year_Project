import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { url } from '../../url'
import './login.css'

export default function Login(props) {

    const [formData, setFormData] = useState({
        'email': "",
        'password': "",
    })

    const [errors, setErrors] = useState({ email: '', password: '', submit: '' })
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        document.title = `CDFYP | Login`
        props.setHideNav(true)
    }, [])

    function validateForm(){

        const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(!emailPattern.test(formData.email)){
            setErrors({...errors, email: 'Invalid Email' })
            document.getElementById('error_email').classList.add('active')
            return false
        }
        if(formData.password===''){
            setErrors({...errors, password: 'Enter Password' })
            document.getElementById('error_password').classList.add('active')
            return false
        }
        return true;
    }

    function handleSubmit() {
        try{
            let valid = validateForm()
            if(valid){
                axios
                .post(url+'/account/login', formData)
                .then((res)=>{
                    localStorage.setItem('profile', JSON.stringify(res.data))
                    window.location.replace('/dashboard')
                })
                .catch(()=>{
                    setErrors({...errors, submit: 'Invalid Credentials' })
                    document.getElementById('error_submit').classList.add('active')
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }
    
    return (
        <div className="login_cont">
            <div className="login">
                <div className="heading">Cool Dudes Final Year Project (CDFYP)</div>
                <div className="email">
                    <div className="form">
                        <input style={{color:'black'}} id="email" type="text" name="email" autoComplete="off" onChange={handleChange} required />
                        <label htmlFor="username" className="label-name">
                            <span className="content-name">Email</span>
                        </label>                           
                    </div>
                    <div id="error_email" className='form_error'>{errors.email}</div>
                </div>
                <div className="password">
                    <div className="form">
                        <input style={{color:'black'}} id="pass" type="password" name="password" autoComplete="off" onChange={handleChange} required />
                        <label htmlFor="password" className="label-name">
                            <span className="content-name">Password</span>
                        </label>                           
                    </div>
                    <div id="error_password" className='form_error'>{errors.password}</div>
                </div>
                <div className="btn_cont"><div className="btn_" onClick={handleSubmit}>Login</div></div>
                <div id="error_submit" className='form_error'>{errors.submit}</div>
                <Link to="/signup"><div className="msg">Don't have an account? Create A New Account</div></Link>
            </div>
        </div>
    )
}
