import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
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

const OrderScreen = ({ match }) => {
	const { userInfo } = useSelector((state) => state.user)
	const { order, loading, getOrderError } = useSelector(
		(state) => state.order
	)
	const orderId = match.params.orderId
	const dispatch = useDispatch()

	// USE EFFECT
	useEffect(() => {
		if (!order) dispatch(getOrder(orderId))
	}, [])

	function capitalize(s) {
		return s[0].toUpperCase() + s.slice(1)
	}

	// HANDLERS
	const paymentHandler = (e) => {
		e.preventDefault()
		console.log('payment')
	}
	if (loading) return <Loader />
	if (getOrderError) return <Message children={getOrderError} />
	if (!order) return <Loader />

	return (
		<div>
			<h1>ORDER {orderId.toUpperCase()}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h3>SHIPPING</h3>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>
									{order.user.email}
								</a>
							</p>
							<p>
								<strong>
									Mobile No: {order.shippingAddress.mobile}{' '}
								</strong>
							</p>
							<p>
								<strong>Address: </strong>
								{capitalize(
									userInfo.shippingAddress.street
								)}, {capitalize(userInfo.shippingAddress.sitio)}
								,{' '}
								{capitalize(userInfo.shippingAddress.barangay)},{' '}
								{capitalize(userInfo.shippingAddress.city)},
							</p>
							<p>
								<strong>Delivery status: </strong>
								{order.isDelivered ? (
									<Message variant="succes">
										Delivered on: {order.deliveredAt}
									</Message>
								) : (
									<Message
										children="For Delivery"
										variant="danger"
									/>
								)}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h3>PAYMENT METHOD</h3>
							<p>
								<strong>Pay through: </strong>
								{order.paymentMethod}
							</p>
							<p>
								<strong>Payment status: </strong>
								{order.isPaid ? (
									<Message variant="succes">
										Paid on: {order.paidAt}
									</Message>
								) : (
									<Message
										children="For Payment"
										variant="danger"
									/>
								)}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h3>ORDER ITEMS</h3>
							<ListGroup variant="flush">
								{order.orderItems.map((item, i) => (
									<ListGroup.Item key={i}>
										<Row>
											<Col md={2}>
												<Image
													src={item.image}
													alt={item.name}
													fluid
													rounded
												/>
											</Col>
											<Col>
												<Link
													to={`/products/${item.product}`}
												>
													{item.name}
												</Link>
											</Col>
											<Col md={4}>
												{item.qty} x ₱{item.price} = ₱
												{item.qty * item.price}
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
									<Col>₱{order.itemsPrice}</Col>
								</Row>
								<Row>
									<Col>Shipping</Col>
									<Col>₱{order.shippingPrice}</Col>
								</Row>
								<Row>
									<Col>Tax</Col>
									<Col>₱{order.taxPrice}</Col>
								</Row>
								<Row>
									<Col>Total</Col>
									<Col>₱{order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default OrderScreen