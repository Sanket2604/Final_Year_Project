import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentsDollar, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './chat_bot.css'

export default function ChatBot() {
    return (
        <>
            <div className='chatbot_btn'>
                <FontAwesomeIcon icon={faCommentsDollar} />
                <div className="text">Ask Shakshi</div>
            </div>
            <div className="chat_cont">
                <div className="header">
                    <div className='d-flex align-items-center'>
                        <div className="name me-2">Shakshi</div>
                        <div className="status">(<div className="dot"></div>Online)</div>
                    </div>
                    <div className="close" style={{ fontSize: '24px' }}><FontAwesomeIcon icon={faTimes} /></div>
                </div>
                <div className="chat_section" id="message_section">
                    <div className='conversation_sec'>
                        <div className="message">
                            lorem
                        </div>
                        <div className="message active">
                            lorem
                        </div>
                    </div>
                </div>
                <div className="input_cont container-fluid">
                    <div className="row">
                        <div className="col-6 p-1"><div className="chat_input">Question 1</div></div>
                        <div className="col-6 p-1"><div className="chat_input">Question 1</div></div>
                        <div className="col-6 p-1"><div className="chat_input">Question 1</div></div>
                        <div className="col-6 p-1"><div className="chat_input">Question 1</div></div>
                    </div>
                </div>
            </div>
        </>
    )
}
