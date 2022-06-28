import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import amazon from './amazon.png'
import flipkart from './flipkart.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Form, Row, Label, Input, Col } from "reactstrap";
import './compare_price.css'

export default function ComparePrice() {

    const [productList, setProductList]=useState([])
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
    })
    const [errors, setErrors] = useState(formData)

    useEffect(()=>{
        document.title = `CDFYP | Compare Price`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('7').classList.add('active')
    },[])
    function getComparision(){
        if(formData.productName===''){
            setErrors({ productName: 'Enter A Product Name' })
            document.getElementById('error_productName').classList.add('error')
            return
        }
        if(formData.price===''||formData.price<0||formData.price>10000000){
            setErrors({ price: 'Enter A Valid Price' })
            document.getElementById('error_price').classList.add('error')
            return
        }
        const nodeList = document.querySelectorAll('.form_error')
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].classList.remove('error')
        }
        setErrors({
            productName: '',
            price: '',
        })
        axios
            .get(`https://saving-suggestion.herokuapp.com/saving_suggestions/${formData.productName}/${formData.price}`)
            .then((res) => {
                setProductList(Object.entries(res.data))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="container compare_cont pt-5 pb-5">
            <div className="row heading_cont">
                <div className="col-12 heading">Compare Price</div>
            </div>
            <div className="row my-4">
                <Form>
                    <Row>
                        <Col md={6}>
                            <Label htmlFor="productName">Enter Product Name</Label>
                            <Input type="text" id="productName" name="productName" placeholder="Enter The Product Name" value={formData.productName} onChange={handleChange} />
                            <div id="error_productName" className='form_error'>{errors.productName}</div>
                        </Col>
                        <Col md={6}>
                            <Label htmlFor="price">Enter Price</Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="price" name="price" placeholder="Enter The Product Price" value={formData.price} onChange={handleChange} />
                            <div id="error_price" className='form_error'>{errors.price}</div>
                        </Col>
                        <div className="btn_cont mt-4">
                            <div className="btn_" onClick={getComparision}>Search</div>
                        </div>
                    </Row>
                </Form>
            </div>
            <div className="row">
                {productList?.map((prod,i)=>
                    <div className="col-3 p-1" key={i}>
                        <a href={prod[1][3]} target='_blank'>
                            <div className="compare_card">
                                <div className="source">
                                    <img src={prod[1][0]==='Flipkart' ? flipkart:amazon} />{prod[1][0]}
                                </div>
                                <div className="image" style={{backgroundImage: `url(${prod[1][2]})`}}></div>
                                <div className="content">
                                    <div className="name">{prod[0]}</div>
                                    <div className='price_rating'>
                                        <div className="price">₹ {prod[1][1]}</div>
                                        <div className="rating"><FontAwesomeIcon icon={faStar} /> {prod[1][4]}/5</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
