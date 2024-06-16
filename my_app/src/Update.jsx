// Update.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Update({ id, onClose }) {
    const [values, setValues] = useState({
        name: '',
        status: ''
    });

    useEffect(() => {
        axios.get('http://localhost:3000/tasks/' + id)
            .then(res => {
                setValues(res.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put('http://localhost:3000/tasks/' + id, values)
            .then(res => {
                console.log(res);
                onClose();
                location.reload();
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h4 className='d-flex justify-content-center'>UPDATE the NOTE</h4>
            <form onSubmit={handleUpdate}>
                <div className='mb-2'>
                    <input type="text" name='name' className='form-control'
                        placeholder='Enter name...' value={values.name}
                        onChange={e => setValues({ ...values, name: e.target.value })}
                    />
                </div>
                <div className='d-flex justify-content-between mt-5'>
                    <button type="button" className="btn ms-3 cancle-button" onClick={onClose}>Back</button>
                    <button className='btn btn-success apply-button'>UPDATE</button>
                </div>
            </form>
        </div>
    );
}

export default Update;
