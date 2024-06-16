// Create.js
import React, { useState } from 'react';
import axios from 'axios';

function Create({ onClose }) {
    const [values, setValues] = useState({
        name: '',
        status: 'Incomplete'
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/tasks', values)
            .then(res => {
                console.log(res);
                onClose();
                location.reload();
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h4 className='d-flex justify-content-center'>NEW NOTE</h4>
            <form onSubmit={handleSubmit}>
                <div className='mb-2'>
                
                    <input type="text" name='name' className='form-control'placeholder='Input your note...'
                        onChange={e => setValues({ ...values, name: e.target.value })} />
                </div>
                
                <div className='d-flex justify-content-between mt-5'>
                    <button type="button" className="btn cancle-button" onClick={onClose}>CANCLE</button>
                    <button className='btn apply-button'>APPLY</button>
                </div>

            </form>
        </div>
    );
}

export default Create;
