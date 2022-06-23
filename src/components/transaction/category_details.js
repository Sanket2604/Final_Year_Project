import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { url } from '../../url'
import { Link } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";
import './category_details.css'
import HorizontalBarGraph from './horizontal_bar'


function EditModal({ setEditModal, token, editModal}) {

    const [formData, setFormData]=useState({
        id: '',
        name: '',
        total: '',
        type: ''
    })
    const [error, setErrors]=useState(formData)
    
    useEffect(()=>{
        setFormData({
            id: editModal.category?.id ? editModal.category.id:'',
            name: editModal.category?.name ? editModal.category.name:'',
            total: editModal.category?.total ? editModal.category.total:'',
            type: editModal.category?.type ? editModal.category.type:'user',
        })
    },[editModal])

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    function AddCat() {
        axios
            .post(url + '/category/addNewCategory', formData,{
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Category Successfully Added')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    function EditCat() {
        axios
            .put(url + '/category/editCategory', formData,{
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Category Successfully Edited')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    function closeEditModal() {
        setEditModal({ ...editModal, open: false })
    }

    return (
        <Modal size="xl" isOpen={editModal?.open} toggle={closeEditModal}>
            <ModalHeader toggle={closeEditModal}>{editModal?.add ? 'Add A New' : 'Edit An Existing'} Category</ModalHeader>
            <ModalBody>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Label htmlFor="name">Category Name</Label>
                            <Input type="text" id="name" name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} />
                            <div id="error_name" className='form_error'></div>
                        </Col>
                        <Col md={6}>
                            <Label htmlFor="name">Category Expenditure Limit</Label>
                            <Input type="number" id="total" name="total" placeholder="Category Expense Limit" value={formData.total} onChange={handleChange} />
                            <div id="error_total" className='form_error'></div>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success" onClick={editModal?.add ? AddCat : EditCat}>{editModal?.add ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default function CategoryDetails() {

    const [categoryData, setCategoryData] = useState()
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState({
        open: false,
        add: false,
        category: {
            id: '',
            name: '',
            total: '',
            type: 'user',
        }
    })
    const [catDeleteId, setCatDeleteId]=useState()
    const [barGraphData, setBarGraphData] = useState()
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        document.title = `CDFYP | Category Details`
        window.scrollTo(0, 0)
        document.querySelectorAll('.nav_ele').forEach((ele) => {
            if (!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('2').classList.add('active')
        if (token) {
            try {
                axios
                    .get(url + '/transactions/getTransactionsDashboard', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setCategoryData(res.data.categoryData)
                        setBarGraphData({
                            expenditure: res.data.expenditure,
                            catTotal: res.data.catTotal,
                            label: res.data.label
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            window.location.replace("/login")
        }
    }, [])

    function customUnits(num) {
        let unitNum = parseFloat(num)
        if (unitNum > 10000000) {
            let tempnum = num / 10000000
            unitNum = tempnum.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            unitNum += " Cr"
        }
        if (unitNum > 1000) {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 2 });
        }
        else if (unitNum > 100) {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 5 });
        }
        else {
            unitNum = unitNum.toLocaleString('en-IN', { maximumFractionDigits: 10 });
        }

        return (unitNum)
    }

    function closeDeleteModal() {
        setDeleteModal(false)
    }
    function triggerDeleteModal(id) {
        setDeleteModal(!deleteModal)
        setCatDeleteId(id)
    }
    function deleteCat() {
        axios
            .delete(url + '/category/deleteCategory/' + catDeleteId, {
                headers: { 'authorization': `Bearer ${token}` }
            })
            .then((res) => {
                alert('Category Successfully Deleted')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function triggerEditModal(add, category) {
        if (category) {
            setEditModal({
                open: true,
                add: add,
                category: {
                    id: category._id,
                    name: category.name,
                    total: category.total,
                    type: category.type,
                }
            })
        }
        else {
            setEditModal({ open: true, add: add })
        }
    }

    function DeleteModal() {
        return (
            <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
                <ModalHeader toggle={closeDeleteModal}>Delete Category?</ModalHeader>
                <ModalBody>Are You Sure You Want To Delete This Category? All Transactions of this Category will also be Deleted.</ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-danger" onClick={deleteCat}>Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

    return (
        <div className="container cat_details py-5">
            <div className="row mb-3">
                <div className="heading col-12">All Categories</div>
            </div>
            {categoryData?.length>0 ? <HorizontalBarGraph barGraphData={barGraphData} aspect={true} />:<></>}
            <DeleteModal />
            <EditModal setEditModal={setEditModal} token={token} editModal={editModal} />
            <div className="add_transaction_btn" onClick={() => triggerEditModal(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <div className="text">Add A New Category</div>
            </div>
            <div className="row mt-4">
                {categoryData?.map(cat =>
                    <div className="col-4 pt-3 category_card_cont" key={cat.category._id}>
                        <Link to={'/category_details/' + cat.category.name}>
                            <div className="category_card">
                                <div className="name mb-2">{cat.category.name}</div>
                                <div className="status_bar">
                                    <div className="progress_bar" style={{ width: cat.total * 100 / cat.category.total > 100 ? '100%':`${cat.total * 100 / cat.category.total}%` }}>
                                        <div className={"percentage" + (cat.total * 100 / cat.category.total < 20 ? ' outside' : '')}>{customUnits((cat.total * 100 / cat.category.total).toFixed(2))}%</div>
                                    </div>
                                </div>
                                <div className="amount">₹{customUnits(cat.total)} / ₹{customUnits(cat.category.total)}</div>
                            </div>
                        </Link>
                        <div className="edit"><FontAwesomeIcon icon={faPenToSquare} onClick={() => triggerEditModal(false, cat.category)} /></div>
                        <div className="delete" onClick={() => triggerDeleteModal(cat.category._id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                    </div>
                )}
            </div>
        </div>
    )
}
