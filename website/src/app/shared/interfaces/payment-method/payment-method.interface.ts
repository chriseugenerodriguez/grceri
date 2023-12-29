export interface PaymentMethod {
	addressLine1: string;
	addressLine2: string;
	cardBrand: string;
	cardType: string;
	firstName: string;
	lastName: string;
	cardholderName: string;
	city: string;
	country: string;
	createdAt: string;
	expiryMonth: number;
	expiryYear: number;
	isPrimary: boolean;
	lastFourDigits: number;
	paymentId: number;
	state: string;
	updatedAt: string;
	userId: number;
	zip: string;
}
