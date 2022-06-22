import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { url } from '../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";

export function TransactionModal(props) {

    const [transactionData, setTransactionData]=useState({
        id: '',
        categoryName: '',
        categoryDetail: '',
        amount: '',
        analysis: 'In-Budget'
    })
    const [categoryData, setCategoryData]=useState({
        name: '',
        total: '',
        type: 'user'
    })
    const [editModal, setEditModal] = useState(false)
    const [nameForm, setNameForm] = useState(false)
    const [categoryList, setCategoryList] = useState()
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        try {
            axios
                .get(url + '/category/getCategoryList', {
                    headers: { 'authorization': `Bearer ${token}` }
                })
                .then((res) => {
                    setCategoryList(res.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(()=>{
        setTransactionData({
            id: props?.editTransaction?._id ? props?.editTransaction?._id:'',
            categoryName: props?.editTransaction?.categoryName ? props?.editTransaction?.categoryName:'',
            categoryDetail: props?.editTransaction?.categoryDetail ? props?.editTransaction?.categoryDetail:'',
            amount: props?.editTransaction?.amount ? props?.editTransaction?.amount:'',
            analysis: 'In-Budget'
        })
    },[props.editTransaction])

    useEffect(() => {
        if (props.modalOpen) {
            setEditModal(true)
        }
    }, [props.modalOpen])

    
    function handleTransactionChange(e) {
        setTransactionData({ ...transactionData, [e.target.name]: e.target.value })
    }
    
    function handleCategoryChange(e) {
        setCategoryData({ ...categoryData, [e.target.name]: e.target.value })
    }

    function AddCat() {
        axios
            .post(url + '/category/addNewCategory', categoryData,{
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Category Successfully Added')
                setCategoryList([...categoryList, categoryData.name])
                setCategoryData({
                    name: '',
                    total: '',
                    type: 'user'
                })
                toggleNameForm()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function selectName(name) {
        setTransactionData({ ...transactionData, categoryName: name, })
    }

    function closeEditModal() {
        setEditModal(false)
        props.setModalOpen(false)
    }

    function toggleNameForm() {
        setNameForm(!nameForm)
    }

    
    function addTransaction() {
        axios
            .post(url + '/transactions/addNewTransaction', transactionData,{
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Transaction Successfully Added')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    function editTransaction() {
        axios
            .put(url + '/transactions/editTransaction', transactionData,{
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Transaction Successfully Edited')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Modal size="xl" isOpen={editModal} toggle={closeEditModal}>
            <ModalHeader toggle={closeEditModal}>{transactionData.id==='' ? 'Add A New' : 'Edit An Existing'} Transaction</ModalHeader>
            <ModalBody>
                <Form>
                    <Row>
                        <Col md={12} className='mb-3'>
                            <Label htmlFor="name">{editModal}Category Names</Label>
                            <div className="container_fluid">
                                <div className="row">
                                    {categoryList?.map((cat,i) =>
                                        <div className="col-2 mb-3" key={i}>
                                            <div className={"name_box"+(transactionData.categoryName===cat?' highlight':'')} onClick={()=>selectName(cat)}>{cat}</div>
                                        </div>
                                    )}
                                    <div className="col-2 mb-3">
                                        <div className="name_box add_name" onClick={toggleNameForm}>{!nameForm ? <><FontAwesomeIcon icon={faPlus} /> Add Category</> : <><FontAwesomeIcon icon={faXmark} /> Close</>}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {nameForm ?
                            <>
                                <Col md={6}>
                                    <Label htmlFor="categoryName">Enter A New Category Name</Label>
                                    <Input type="text" id="categoryName" name="name" placeholder="New Category Name" value={categoryData.name} onChange={handleCategoryChange}/>
                                    <div id="error_catName" className='form_error'></div>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor="catAmount">Enter Category Expenditure Limit</Label>
                                    <Input type="number" id="catAmount" name="total" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} placeholder="New Category Name" value={categoryData.total} onChange={handleCategoryChange}/>
                                    <div id="error_catAmount" className='form_error'></div>
                                </Col>
                                <div className="btn_cont my-3" onClick={AddCat}><div className="btn_ btn_small">Add</div></div>
                            </> : <></>
                        }
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="categoryDetail">Category Description</Label>
                            <Input type="text" id="categoryDetail" name="categoryDetail" placeholder="Category Description" value={transactionData.categoryDetail} onChange={handleTransactionChange} />
                            <div id="error_amount" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="amount">Amount Spent <span style={{ fontSize: '14px' }}>(In Rupees)</span></Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="amount" name="amount" placeholder="Amount Spent" value={transactionData.amount} onChange={handleTransactionChange} />
                            <div id="error_intrest" className='form_error'></div>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success" onClick={transactionData.id==='' ? addTransaction:editTransaction}>{transactionData.id==='' ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export function TransactionDeleteModal(props) {

    const [deleteModal, setDeleteModal] = useState(false)

    useEffect(() => {
        if (props.modalOpen) {
            setDeleteModal(true)
        }
    }, [props.modalOpen])

    const token = JSON.parse(localStorage.getItem("profile"))?.token

    function closeDeleteModal() {
        setDeleteModal(false)
        props.setModalOpen(false)
    }

    function deleteTransaction() {
        axios
            .delete(url + '/transactions/deleteTransaction/' + props.transDelete, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Transaction Successfully Deleted')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
            <ModalHeader toggle={closeDeleteModal}>Delete Transaction?</ModalHeader>
            <ModalBody>Are you sure you want to delete this transaction?</ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-danger" onClick={deleteTransaction}>Delete</button>
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}
