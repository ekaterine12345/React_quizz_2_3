import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Create from './Create';
import Update from './Update';
import { FaSearch } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import './App.modules.scss'
// import ReactLogo from './assets/react.svg'
import emptyList from './assets/empty.png'

function Home() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentUpdateId, setCurrentUpdateId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/tasks')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        const confirm = window.confirm("Would you like to delete?");
        if (confirm) {
            axios.delete('http://localhost:3000/tasks/' + id)
                .then(res => {
                    location.reload();
                }).catch(err => console.log(err));
        }
    };

    const handleCheckboxChange = (id) => {
        const updatedData = data.map(d => {
            if (d.id === id) {
                const updatedStatus = d.status === "Complete" ? "Incomplete" : "Complete";
                axios.patch(`http://localhost:3000/tasks/${id}`, { status: updatedStatus })
                    .catch(err => console.log(err));
                return { ...d, status: updatedStatus };
            }
            return d;
        });
        setData(updatedData);
    };

    const filteredData = data.filter(d => {
        const matchesSearchQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatusFilter = filterStatus === 'All' || d.status === filterStatus;
        return matchesSearchQuery && matchesStatusFilter;
    });

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-white vh-1000">
            <h1>TODO LIST </h1>
            <div className={`overlay ${showCreateModal || showUpdateModal ? 'show' : ''}`}></div>
            <div className="w-75 rounded bg-white   p-4">
                <div className="d-flex justify-content-between mb-4">
                    <div className="input-group custom-search">
                        <input type="text" className="form-control search-input"
                            placeholder="Search note..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="input-group-text search-icon"><FaSearch /></span>
                    </div>
                    <select className="form-select custom-select" value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option className="custom-option" value="All">ALL</option>
                        <option className="custom-option" value="Complete">Complete</option>
                        <option className="custom-option" value="Incomplete">Incomplete</option>
                    </select>
                </div>

                {data.length === 0 && <img className='w-100' src={emptyList} alt="empty list"/>}
                <table className="table border-buttom">
                    <tbody>
                        {filteredData.map((d, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="checkbox" className="todo-checkbox"
                                        checked={d.status === "Complete"}
                                        onChange={() => handleCheckboxChange(d.id)}
                                    />
                                </td>
                                <td style={{
                                    textDecoration: d.status === "Complete" ? 'line-through' : 'none',
                                    color: d.status === "Complete" ? 'grey' : 'black',
                                    fontWeight: d.status === "Incomplete" ? '600' : 'normal'
                                }}>
                                    {d.name}
                                </td>
                                <td>
                                    <button className="btn btn-sm me-1" onClick={() => { setCurrentUpdateId(d.id); setShowUpdateModal(true); }}>
                                        <GoPencil className='pen-icon'/>
                                    </button>
                                    <button onClick={() => handleDelete(d.id)} className="btn btn-sm">
                                        <RiDeleteBinLine className='delete-icon'/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='d-flex justify-content-end'>
                    <button className="btn btn-lg add-button" onClick={() => setShowCreateModal(true)}>+</button>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <Create onClose={() => setShowCreateModal(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <Update id={currentUpdateId} onClose={() => setShowUpdateModal(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
