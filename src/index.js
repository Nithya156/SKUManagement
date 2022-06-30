import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import { EditText } from 'react-edit-text';
import { Col, Row, Table, Button, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
    const [file, setFile] = useState();
    const [array, setArray] = useState([]);
    const [filterArray, setFlterArray] = useState([]);
    const [searchInput, setSearch] = useState('');
    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

        const array = csvRows.map(i => {
            const values = i.split(",");
            const obj = csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
            return obj;
        });
        array.splice(array.length-1 ,1);
        setArray(array);
        setFlterArray(array)
    };

    
    useEffect(() => {
        const filteredData = array.filter(item => {
            return item.stock_id.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.product_name.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.price.toLowerCase().includes(searchInput.toLowerCase())
        }
        )
        setFlterArray(filteredData);
    }, [searchInput]);

    const handleDeleteRow = (id) => {
        setFlterArray(array => array.filter((item) => item.stock_id !== id))
        setArray(array);
    }

    const handleSearch = (event) => {
        setSearch(event.target.value)
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
            };
            fileReader.readAsText(file);
        }
    };

    const modifyHeader = (str) => {
        const headerArry = str.split('_')
        const actualHeader = headerArry.length === 1 ? headerArry[0] :  headerArry[0] + " " + headerArry[1]
        return actualHeader.charAt(0).toUpperCase() + actualHeader.slice(1);
    }

    const headerKeys = Object.keys(Object.assign({}, ...array));
    const deleteIcon = require('./delete_icon.png')
    return (
        <div >
            <h1 style={{ textAlign: "center", margin: 30 }}>SKU Management System</h1>

            <Row className="mx-0">

                <Col>
                    <form >
                        <Row className="mx-0">
                            <Col>
                                <Form.Group controlId="formFile" className="mb-3" as={Col}>
                                    <Form.Control type="file" onChange={handleOnChange} id={"csvFileInput"} accept={".csv"} />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Button
                                    as={Col}
                                    variant="primary"
                                    onClick={(e) => {
                                        handleOnSubmit(e);
                                    }}
                                >
                                    IMPORT CSV
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </Col>
                <Col>
                    {<Form.Control name="searchInput" value={searchInput || ""} placeholder="Search" onChange={(e) => {
                        handleSearch(e);
                    }} />}

                </Col>
            </Row>

            <br />

            <Table stripped bordered hover size="sm">
                <thead>
                    <tr key={"header"}>
                        {headerKeys.map((key) => (
                            <th>{modifyHeader(key)}</th>
                        ))}

                    </tr>

                </thead>

                <tbody>
                    {filterArray.map((item, index) => (
                        <tr key={item.id}>

                            {Object.values(item).map((val) => (
                                <td>
                                    <EditText
                                        name="textbox1"
                                        defaultValue={val}
                                    />
                                </td>
                            ))}

                                <td><img  src={deleteIcon} style={{width:30,height:30}} onClick={key => handleDeleteRow(item.stock_id)}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
ReactDOM.render(<App />, document.getElementById('app'));