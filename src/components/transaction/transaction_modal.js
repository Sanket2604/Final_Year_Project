import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Row, Label, Input, Col } from "reactstrap";

export function TransactionModal(props) {

    const [editModal, setEditModal] = useState(false)
    const [nameForm, setNameForm] = useState(false)

    let add = false

    useEffect(()=>{
        if (props.modalOpen) {
            setEditModal(true)
        }
    },[props.modalOpen])

    if (props.newTransaction) {
        add = true
    }

    function closeEditModal() {
        setEditModal(false)
        props.setModalOpen(false)
    }

    function toggleNameForm() {
        setNameForm(!nameForm)
    }

    return (
        <Modal size="xl" isOpen={editModal} toggle={closeEditModal}>
            <ModalHeader toggle={closeEditModal}>{add ? 'Add' : 'Edit'} Debt</ModalHeader>
            <ModalBody>
                <Form>
                    <Row form>
                        <Col md={12} className='mb-3'>
                            <Label htmlFor="name">{editModal}Category Name</Label>
                            <div className="container_fluid">
                                <div className="row">
                                    <div className="col-2">
                                        <div className="name_box">HDFC</div>
                                    </div>
                                    <div className="col-2">
                                        <div className="name_box">HDFC</div>
                                    </div>
                                    <div className="col-2">
                                        <div className="name_box add_name" onClick={toggleNameForm}>{!nameForm ? <><FontAwesomeIcon icon={faPlus} /> Add Category</> : <><FontAwesomeIcon icon={faXmark} /> Close</>}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {nameForm ?
                            <Col md={12} className='mb-3'>
                                <Label htmlFor="name">Enter A New Category Name</Label>
                                <Input type="text" id="name" name="loanAmount" placeholder="New Category Name" />
                                <div id="error_amount" className='form_error'></div>
                                <div className="btn_cont mt-3"><div className="btn_ btn_small">Add</div></div>
                            </Col> : <></>
                        }
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Category Description</Label>
                            <Input type="text" id="name" name="loanAmount" placeholder="Category Description" />
                            <div id="error_amount" className='form_error'></div>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Label htmlFor="name">Amount Spent <span style={{ fontSize: '14px' }}>(In Rupees)</span></Label>
                            <Input type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()} id="name" name="intrest" placeholder="Amount Spent" />
                            <div id="error_intrest" className='form_error'></div>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-success">{add ? 'Add' : 'Edit'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export function TransactionDeleteModal(props) {

    const [deleteModal, setDeleteModal]=useState(false)

    useEffect(()=>{
        if (props.modalOpen) {
            setDeleteModal(true)
        }
    },[props.modalOpen])

    function closeDeleteModal() {
        setDeleteModal(false)
        props.setModalOpen(false)
    }

    return (
        <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
            <ModalHeader toggle={closeDeleteModal}>Delete Transaction?</ModalHeader>
            <ModalBody>Delete Modal</ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-danger" >Delete</button>
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
            </ModalFooter>
        </Modal>
    )
}
