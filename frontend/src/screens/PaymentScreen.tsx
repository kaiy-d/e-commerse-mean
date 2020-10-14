import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps.tsx/CheckoutSteps'
import savePaymentMethod from '../actions/cart/savePaymentMethod'

const PaymentScreen = ({ history }) => {
	const [paymentMethod, setPaymentMethod] = useState('')

	const dispatch = useDispatch()
	const { userInfo, authError, loading } = useSelector((state) => state.user)

	// USE EFFECT
	useEffect(() => {}, [userInfo])

	// HANDLERS
	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(savePaymentMethod(paymentMethod))
		history.push('/placeorder')
	}

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h1 style={{ marginBottom: '30px' }}>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group>
					<Form.Label as="legend">Select Method</Form.Label>

					<Form.Check
						type="radio"
						id="Paypal"
						value="Paypal"
						name="paymentMethod"
						label="Paypal or Credit Card"
						onChange={(e) => {
							setPaymentMethod(e.target.value)
						}}
					></Form.Check>

					<Form.Check
						type="radio"
						id="Cash on Delivery"
						value="Cash on Delivery"
						name="paymentMethod"
						label="Cash on Delivery"
						onChange={(e) => {
							setPaymentMethod(e.target.value)
						}}
					></Form.Check>
				</Form.Group>

				<Button type="submit" variant="secondary">
					Proceed
				</Button>
			</Form>
		</FormContainer>
	)
}

export default PaymentScreen