import React, { useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader/Loader'
import { Link } from 'react-router-dom'
import Message from '../components/Message/Message'
import getOrder from '../actions/order/getOrder'
//import payOrder from '../actions/order/payOrder'
//import Paypal from '../components/Paypal'
import Axios from 'axios'
import { getConfig } from '../utils/utils'
import { ORDER_GET_FAIL, ORDER_GET_SUCCESS } from '../constants/orderConstants'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet'

const OrderScreen = ({ match }) => {
	const { userInfo } = useSelector((state) => state.user)
	const { order, loading, payLoading, getOrderError } = useSelector(
		(state) => state.order
	)
	const orderId = match.params.orderId
	const dispatch = useDispatch()

	// USE EFFECT
	useEffect(() => {
		if (!order || order._id !== orderId) dispatch(getOrder(orderId))
	}, [order, orderId, dispatch])

	function capitalize(s) {
		return s[0].toUpperCase() + s.slice(1)
	}

	// HANDLERS

	const updateDeliveryHandler = () => {
		Axios.put(`/api/orders/${orderId}/deliver`, {}, getConfig())
			.then((res) => {
				dispatch(dispatch({ type: ORDER_GET_SUCCESS, payload: res.data }))
			})
			.catch((error) => {
				dispatch({
					type: ORDER_GET_FAIL,
					payload: error.response?.data?.message
						? error.response.data.message
						: error.message,
				})
			})
	}

	const updatePaymentHandler = (e) => {
		e.preventDefault()
		Axios.put(`/api/orders/${orderId}/pay`)
			.then((res) => {
				dispatch(getOrder(orderId))
			})
			.catch((error) => {
				console.log(error)
			})
	}

	/* const paymentSuccess = async (payment) => {
		console.log(payment)
		const paymentResult = {
			id: payment.paymentID,
			status: payment.paid ? 'Paid' : 'Not Paid',
			email_address: payment.email,
			update_time: Date.now().toString(),
		}
		dispatch(payOrder(orderId, paymentResult))
	}
	const paymentCancelled = (data) => {}
	const paymentError = (error) => {} */

	if (loading) return <Loader />
	if (getOrderError) return <Message children={getOrderError} />
	if (!order) return <Loader />
	if (!userInfo)
		return <Message>Please Log in as Admin, Or go back to home page</Message>

	return (
		<div className="py-3">
			<Helmet>
				<title>Pro Store | Order Status</title>
				<meta name="description" content="We sell the best milk tea in town" />
			</Helmet>
			<h1>ORDER {orderId.toUpperCase()}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h3>DELIVERY DETAILS</h3>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Mobile No: {order.shippingAddress.mobile} </strong>
							</p>
							<p>
								<strong>Address: </strong>
								{capitalize(userInfo.shippingAddress.street)},{' '}
								{capitalize(userInfo.shippingAddress.sitio)},{' '}
								{capitalize(userInfo.shippingAddress.barangay)},{' '}
								{capitalize(userInfo.shippingAddress.city)},
							</p>

							<strong>Delivery status: </strong>
							{order.isDelivered ? (
								<Message variant="success">
									Delivered on: {order.deliveredAt}
								</Message>
							) : (
								<Message children="For Delivery" variant="danger" />
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h3>PAYMENT METHOD</h3>
							<p>
								<strong>Pay through: </strong>
								{order.paymentMethod}
							</p>

							<strong>Payment status: </strong>
							{order.isPaid ? (
								<Message variant="success">Paid on: {order.paidAt}</Message>
							) : (
								<Message children="For Payment" variant="danger" />
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h3>ORDER ITEMS</h3>
							<ListGroup variant="flush">
								{order.orderItems.map((item, i) => (
									<ListGroup.Item key={i}>
										<Row>
											<Col md={2}>
												<Image src={item.image} alt={item.name} fluid rounded />
											</Col>
											<Col>
												<Link to={`/products/${item.product}`}>
													{item.name}
												</Link>
											</Col>
											<Col md={4}>
												{item.qty} x ???{item.price} = ???{item.qty * item.price}
											</Col>
										</Row>
									</ListGroup.Item>
								))}
							</ListGroup>
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>???{order.itemsPrice}</Col>
								</Row>
								<Row>
									<Col>Delivery Charge</Col>
									<Col>???{order.shippingPrice}</Col>
								</Row>
								{/* <Row>
									<Col>Tax</Col>
									<Col>???{order.taxPrice}</Col>
								</Row> */}
								<Row>
									<Col>Total</Col>
									<Col>???{order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{payLoading && <Loader />}
									{/* <Paypal
										paymentSuccess={paymentSuccess}
										paymentCancelled={paymentCancelled}
										paymentError={paymentError}
										total={order.totalPrice}
									/> */}
									<Button
										type="button"
										className="btn btn-block"
										variant="secondary"
										onClick={updatePaymentHandler}
									>
										Mark Paid
									</Button>
								</ListGroup.Item>
							)}
							{userInfo?.isAdmin && order.isPaid && !order.isDelivered ? (
								<ListGroup.Item>
									<Button
										type="button"
										className="btn btn-block"
										variant="secondary"
										onClick={updateDeliveryHandler}
									>
										Mark Delivered
									</Button>
								</ListGroup.Item>
							) : null}
						</ListGroup>
					</Card>
					<Card className="mt-5">
						<ListGroup variant="flush">
							<ListGroup.Item variant="danger">
								<h5>NOTE FOR DELIVERY CHARGE</h5>
							</ListGroup.Item>

							<ListGroup.Item variant="danger">
								<p>
									Orders outside Liloan, may have an additional delivery charge.
									We will call you to let you know about it and for you to
									confirm. Please keep your line open. Thanks!{' '}
									<span>????????????</span>
								</p>
							</ListGroup.Item>
						</ListGroup>
					</Card>
					<Card className="mt-5">
						<ListGroup variant="flush">
							<ListGroup.Item variant="danger">
								<h4>NOTICE FOR CASH ON DELIVERY</h4>
							</ListGroup.Item>

							<ListGroup.Item variant="danger">
								<p>
									<span>
										{`Once order is placed, Please keep your line open
								(MOBILE NO. ${order.shippingAddress.mobile}) for the verification of your delivery 
								address and order. Thank you ???????????? `}
									</span>
								</p>
							</ListGroup.Item>

							{/* <ListGroup.Item variant="info">
								<strong>Status: Not yet verified</strong>
							</ListGroup.Item> */}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default OrderScreen
