import React, { useState, useEffect } from 'react'
import HTMLReactParser from 'html-react-parser'
import axios from 'axios'
import { url } from '../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentsDollar, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './chat_bot.css'

export default function ChatBot() {

    const [data, setData] = useState([])
    const [chatOptions, setChatOptions] = useState([
        {
            link: 'lender',
            name: 'Lender Details',
            message: 'I want to know about Lender Details'
        }, {
            link: 'borrower',
            name: 'Borrower Details',
            message: 'I want to know about Borrower Details'
        }, {
            link: 'stock',
            name: 'Stock Details',
            message: 'I want to know about Stock Details'
        }, {
            link: 'crypto',
            name: 'Crypto Details',
            message: 'I want to know about Crypto Details'
        }
    ])
    const [messages, setMessages] = useState([{
        type: 'bot',
        message: 'Hi there! My name is <b>Jarvis</b>, your financial assistant. <br/><br/>I can help you navigate through the website via chat. <br/><br/>Select the below options for assistance'
    }])
    const token = JSON.parse(localStorage.getItem("profile"))?.token

    useEffect(() => {
        if (token) {
            try {
                axios
                    .get(url + '/account/getMainDashboard', {
                        headers: { 'authorization': `Bearer ${token}` }
                    })
                    .then((res) => {
                        setData(res.data)
                        console.log(res.data)
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

    function openChatbot(){
        document.querySelector('.chat_cont').classList.add('active')
    }

    function closeChatbot(){
        document.querySelector('.chat_cont').classList.remove('active')
    }

    function userMessage(option) {
        if (option.link === 'lender') {
            setChatOptions([
                {
                    link: 'allLender',
                    name: 'Show All The Lenders',
                    message: 'Show all the lenders on my list.'
                }, {
                    link: 'lenderLoan',
                    name: 'Details of Money Taken',
                    message: 'Show all my loans.'
                }, {
                    link: 'lenderDetails',
                    name: 'Details of All Lender ',
                    message: 'Give me a complete view of all my loans.'
                }, {
                    link: 'back',
                    name: 'Back To Main Menu',
                    message: 'Show me the main menu.'
                }
            ])
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: 'What would you like to know about your lender loans.'
            }])
            return
        }
        if (option.link === 'allLender') {
            let tempMessage='I have found the list of all the active lenders <br/><br/>'
            data.loan.list.map((loan,i)=>{
                if(data.loan.list.length-1===i) return tempMessage+=`and ${loan.name}.`
                if(data.loan.list.length-2===i) return tempMessage+=`${loan.name} `
                tempMessage+=`${loan.name}, `
            })
            
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'lenderLoan') {
            let tempMessage='I have found the list of all the active lenders with the amounts to be paid. <br/><br/>'
            data.loan.list.map((loan,i)=>{
                tempMessage+=`<b>${loan.name}</b>: ₹ ${customUnits(loan.total)} <br/>`
            })
            tempMessage+=`<br/>Total: ₹ ${customUnits(data.loan.total)}`
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'lenderDetails') {
            let tempMessage='I would recommend you to view the below web page to get detail insights for your lender loans. <br/><br/> <a href="/lender_details">Click Here To View Lender Loan Details</a>'
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'borrower') {
            setChatOptions([
                {
                    link: 'allBorrower',
                    name: 'Show All The Borrower',
                    message: 'Show all the people on my borrower list.'
                }, {
                    link: 'borrowLoan',
                    name: 'Details of Money Given',
                    message: 'Show all the people who have taken money.'
                }, {
                    link: 'borrowerDetails',
                    name: 'Details of All Lender ',
                    message: 'Give me a complete view of all my loans.'
                }, {
                    link: 'back',
                    name: 'Back To Main Menu',
                    message: 'Show me the main menu.'
                }
            ])
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: 'What would you like to know about your borrower loans.'
            }])
            return
        }
        if (option.link === 'allBorrower') {
            let tempMessage='I have found the list of all the active borrower <br/><br/>'
            data.borrow.list.map((loan,i)=>{
                if(data.borrow.list.length-1===i) return tempMessage+=`and ${loan.name}.`
                if(data.borrow.list.length-2===i) return tempMessage+=`${loan.name} `
                tempMessage+=`${loan.name}, `
            })
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'borrowLoan') {
            let tempMessage='I have found the list of all the active borrowers with the amounts to be paid. <br/><br/>'
            data.borrow.list.map(loan=>{
                tempMessage+=`<b>${loan.name}</b>: ₹ ${customUnits(loan.total)} <br/>`
            })
            tempMessage+=`<br/>Total: ₹ ${customUnits(data.borrow.total)}`
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'borrowerDetails') {
            let tempMessage='I would recommend you to view the below web page to get detail insights for your borrower loans. <br/><br/> <a href="/borrower_details">Click Here To View Borrower Loan Details</a>'
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'stock') {
            setChatOptions([
                {
                    link: 'allStock',
                    name: 'Stock Invested List',
                    message: 'Show all the invested stocks.'
                }, {
                    link: 'stockTotal',
                    name: 'Amount Invested In Stock',
                    message: 'Show total amount invested in each stock.'
                }, {
                    link: 'stockDetails',
                    name: 'Stock Details',
                    message: 'Show me detail analysis of my stock investment.'
                }, {
                    link: 'back',
                    name: 'Back To Main Menu',
                    message: 'Show me the main menu.'
                }
            ])
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: 'What would you like to know about your stock investment.'
            }])
            return
        }
        if (option.link === 'allStock') {
            let tempMessage='I have found the list of all the company names of active Stock Investments.<br/><br/>'
            data.stock.list.map((invst,i)=>{
                if(data.stock.list.length-1===i) return tempMessage+=`and ${invst.name}.`
                if(data.stock.list.length-2===i) return tempMessage+=`${invst.name} `
                tempMessage+=`${invst.name}, `
            })
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'stockTotal') {
            let tempMessage='I have found the list of all the active stock investments with the quantity and total investment. <br/><br/>'
            data.stock.list.map((invst)=>{
                tempMessage+=`<b>${invst.name}</b> x${customUnits(invst.quantity)} - ₹ ${customUnits(invst.investment)} <br/>`
            })
            tempMessage+=`<br/>Total: ₹ ${customUnits(data.stock.total)}`
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'stockDetails') {
            let tempMessage='I would recommend you to view the below web page to get detail insights for your stock investment. <br/><br/> <a href="/user_stock_investments">Click Here To View Stock Investment Details</a>'
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'crypto') {
            setChatOptions([
                {
                    link: 'allCrypto',
                    name: 'Crypto Invested List',
                    message: 'Show all the invested crypto.'
                }, {
                    link: 'cryptoTotal',
                    name: 'Amount Invested In Crypto',
                    message: 'Show total amount invested in each crypto.'
                }, {
                    link: 'cryptoDetails',
                    name: 'Crypto Details',
                    message: 'Show me detail analysis of my crypto investment.'
                }, {
                    link: 'back',
                    name: 'Back To Main Menu',
                    message: 'Show me the main menu.'
                }
            ])
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: 'What would you like to know about your crypto investments.'
            }])
            return
        }
        if (option.link === 'allCrypto') {
            let tempMessage='I have found the list of all the coin names of active Crypto Investments.<br/><br/>'
            data.crypto.list.map((invst,i)=>{
                if(data.crypto.list.length-1===i) return tempMessage+=`and ${invst.name}.`
                if(data.crypto.list.length-2===i) return tempMessage+=`${invst.name} `
                tempMessage+=`${invst.name}, `
            })
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'cryptoTotal') {
            let tempMessage='I have found the list of all the active crypto investments with the quantity and total investment. <br/><br/>'
            data.crypto.list.map((invst)=>{
                tempMessage+=`<b>${invst.name}</b> x${customUnits(invst.quantity)} - ₹ ${customUnits(invst.investment)} <br/>`
            })
            tempMessage+=`<br/>Total: ₹ ${customUnits(data.crypto.total)}`
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'cryptoDetails') {
            let tempMessage='I would recommend you to view the below web page to get detail insights for your crypto investment. <br/><br/> <a href="/user_crypto_investments">Click Here To View Crypto Investment Details</a>'
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: tempMessage
            }])
            return
        }
        if (option.link === 'back') {
            setChatOptions([
                {
                    link: 'lender',
                    name: 'Lender Details',
                    message: 'I want to know about Lender Details'
                }, {
                    link: 'borrower',
                    name: 'Borrower Details',
                    message: 'I want to know about Borrower Details'
                }, {
                    link: 'stock',
                    name: 'Stock Details',
                    message: 'I want to know about Stock Details'
                }, {
                    link: 'crypto',
                    name: 'Crypto Details',
                    message: 'I want to know about Crypto Details'
                }
            ])
            setMessages([...messages, {
                type: 'user',
                message: option.message
            },{
                type: 'bot',
                message: 'Here is the main menu.'
            }])
            return
        }
    }

    return (
        <>
            <div className='chatbot_btn' onClick={openChatbot}>
                <FontAwesomeIcon icon={faCommentsDollar} />
                <div className="text">Ask Jarvis</div>
            </div>
            <div className="chat_cont">
                <div className="header">
                    <div className='d-flex align-items-center'>
                        <div className="name me-2">Jarvis</div>
                        <div className="status">(<div className={"dot"+(data?.stock?' online':'')}></div>{data?.stock?'Online':'Offline'})</div>
                    </div>
                    <div className="close" onClick={closeChatbot} style={{ fontSize: '24px', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} /></div>
                </div>
                <div className="chat_section" id="message_section">
                    <div className='conversation_sec'>
                        {messages?.map((message,i) =>
                            <div key={i} className={'message' + (message.type === 'user' ? ' active' : '')}>
                                {HTMLReactParser(message.message)}
                            </div>
                        )}
                    </div>
                    <div className="input_cont container-fluid mt-2">
                        <div className="row">
                            {chatOptions?.map((opt, i) =>
                                <div className="col-6 p-1" key={i}>
                                    <div className="chat_input" onClick={() => userMessage(opt)}>{opt.name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}