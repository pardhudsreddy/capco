import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import _get from 'lodash/get';

const PaymentDetails = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9001/api/payments')
      .then(response => {
        setPaymentDetails([...paymentDetails, response]);
      })
      .catch(err => console.error(err));
  }, []);

  const loadNextResults = () => {
    if (paymentDetails[activePageIndex + 1]) {
      setActivePageIndex(item => item + 1);
    } else {
      const nextPageIndex = _get(paymentDetails[activePageIndex], 'data.metaDatal.nextPageIndex', '');
      if (nextPageIndex) {
        axios.get(`http://localhost:9001/api/payments?pagelndex=${nextPageIndex}`)
          .then(response => {
            setPaymentDetails([...paymentDetails, response]);
            setActivePageIndex(item => item + 1);
            setFilteredResults([]);
          })
          .catch(err => console.error(err));
      }
    }
  };

  const loadPreviousResults = () => {
    setActivePageIndex(item => item - 1);
  };

  const showPendingResults = () => {
    const filteredResults = paymentDetails[activePageIndex].data.results.filter(item => item.paymentStatus === "P");
    setFilteredResults(filteredResults);
  }

  const showAllResults = () => {
    setFilteredResults([]);
  }

  const resultsToDisplay = filteredResults.length ? filteredResults : _get(paymentDetails[activePageIndex], 'data.results', []);

  return (
    <>
      <Container className="p-3">
        <Row className="justify-content-md-center">
          <Col align='center'>
            <h1 className="header">Payment Details</h1>
            <p>Current Page Index - {activePageIndex + 1}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            {activePageIndex > 0 &&
              <Button variant="dark" onClick={loadPreviousResults}>Previous</Button>
            }
          </Col>
          <Col>
            <Button variant="dark" onClick={showPendingResults}>Pending For Approval</Button>
            <Button variant="dark" onClick={showAllResults}>All Payments</Button>
          </Col>
          <Col>
            {
              _get(paymentDetails[activePageIndex], 'data.metaDatal.hasMoreElements', false) &&
              <Button className="float-right" variant="dark" onClick={loadNextResults}>Next</Button>
            }
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped bordered hover variant="dark" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>To Account Name</th>
                  <th>To Account Sortcode</th>
                  <th>To Account Number</th>
                  <th>From Account Name</th>
                  <th>From Account Sortcode</th>
                  <th>From Account Number</th>
                </tr>
              </thead>
              <tbody>
                {
                  resultsToDisplay.map((item, index) => (
                    <tr key={item.paymentAmount}>
                      <td>{index + 1}</td>
                      <td>{item.paymentAmount}</td>
                      <td>{item.paymentCurrency}</td>
                      <td>{item.paymentType}</td>
                      <td>{item.paymentDate}</td>
                      <td>{item.paymentStatus}</td>
                      <td>{item.toAccaunt.accountName}</td>
                      <td>{item.toAccaunt.sortCode}</td>
                      <td>{item.toAccaunt.accountNumber}</td>
                      <td>{item.fromAccount.accountName}</td>
                      <td>{item.fromAccount.sortCode}</td>
                      <td>{item.fromAccount.accountNumber}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

    </>
  )
};

export default PaymentDetails;