import React from 'react'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
interface CustomCardProps {
    title: string;
    description: string;
    onClickPath: string;
}
export default function CustomCard(props: CustomCardProps) {
    return (
        <Card className='text-start ' style={{ width: '15rem' }}>
            <Card.Title style={{ background: "#EDF4FA" }} className='p-3'>{props.title}</Card.Title>
            <div className='p-3 pt-0'>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Card.Link></Card.Link>
                <Link to={props.onClickPath} className='stretched-link'></Link>
            </div>

        </Card>
    )
}
