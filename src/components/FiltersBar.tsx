import React from 'react'
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { RiEqualizerLine } from "react-icons/ri";

interface Option {
    name: string;
    apiId: string;
}
interface Element {
    label: string;
    filterApiName: string;
    options: Option[];
}

interface FilterProps {
    elements: Element[];
    onSubmitFilters?: (selectedFilters: Record<string, string>) => void;
}
export default function FiltersBar({ elements, onSubmitFilters }: FilterProps) {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [show, setShow] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setFilters((prev) => {
            if (prev[name] === String(value)) {
                const updatedFilters = { ...prev };
                delete updatedFilters[name];
                return updatedFilters;
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted Filters:", filters);
        if (onSubmitFilters) {
            onSubmitFilters(filters);
        }
        handleClose();
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>

            <button
                className="btn"
                style={{
                    backgroundColor: "#78b6ea",
                    borderColor: "#4dabf7",
                    color: "white",
                }}
                onClick={handleShow}
            >
                <RiEqualizerLine className='me-2' />

                {/* <i className="bi bi-plus-lg me-2"></i> */}
                Filter
            </button>
            <Offcanvas show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form id="myForm" onSubmit={handleSubmit}>
                        {elements.map((element) => (
                            <Form.Group >
                                <Form.Label className="fw-medium">{element.label}</Form.Label>
                                {element.options.map((opt) => (
                                    <Form.Check // prettier-ignore
                                        type='radio'
                                        id={`${element.filterApiName}-${opt.apiId}`}
                                        //id={opt.apiId}
                                        value={opt.apiId}
                                        name={element.filterApiName}
                                        label={opt.name}
                                        checked={String(filters[element.filterApiName]) === String(opt.apiId)}
                                        onClick={(e: any) => handleChange(e)}
                                    />
                                ))}

                            </Form.Group>
                        ))}


                    </Form>
                </Offcanvas.Body>
                <div className="offcanvas-footer p-3 border-top">
                    <button type="submit" form="myForm" className="btn btn-primary w-100">Submit Form</button>
                </div>
            </Offcanvas>
        </>
    )
}
