/**
 * Payment Service & Fee Abstraction Layer
 * Handles dynamic platform fee calculation and Indian payment gateways (UPI, Cards, NetBanking)
 */

import { PlatformSettings } from '@/types/marketplace';

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  buyerFeePercentage: 0.05, // 5%
  buyerFeeFixed: 2,         // ₹2 fixed platform fee
  sellerFeePercentage: 0.10,// 10%
  minFee: 2,               // ₹2 minimum
  maxFee: 50,              // ₹50 max fee cap
  allowRegistration: true,
  requireVerificationToSell: true,
  currencySymbol: '₹',
  defaultCity: 'Chennai',
};

export interface PriceBreakdown {
  basePrice: number;
  buyerFee: number;
  sellerFee: number;
  totalBuyerPayment: number;
  sellerNetAmount: number;
  platformRevenue: number;
}

export function calculatePriceBreakdown(
  basePrice: number,
  settings: PlatformSettings = DEFAULT_PLATFORM_SETTINGS
): PriceBreakdown {
  // 1. Calculate Buyer Convenience Fee
  let calculatedBuyerFee = Math.round(basePrice * settings.buyerFeePercentage + settings.buyerFeeFixed);
  calculatedBuyerFee = Math.max(settings.minFee, Math.min(settings.maxFee, calculatedBuyerFee));

  // 2. Calculate Seller Platform Deduction Fee
  let calculatedSellerFee = Math.round(basePrice * settings.sellerFeePercentage);
  calculatedSellerFee = Math.max(settings.minFee, Math.min(settings.maxFee, calculatedSellerFee));

  // Total Buyer Payment = Base Price + Buyer Fee
  const totalBuyerPayment = basePrice + calculatedBuyerFee;

  // Seller Net Amount = Base Price - Seller Fee
  const sellerNetAmount = Math.max(0, basePrice - calculatedSellerFee);

  // Platform Total Revenue = Buyer Fee + Seller Fee
  const platformRevenue = calculatedBuyerFee + calculatedSellerFee;

  return {
    basePrice,
    buyerFee: calculatedBuyerFee,
    sellerFee: calculatedSellerFee,
    totalBuyerPayment,
    sellerNetAmount,
    platformRevenue,
  };
}

export interface PaymentIntentPayload {
  orderId: string;
  resourceId?: string;
  studyGroupId?: string;
  itemType: 'listing' | 'study_group';
  buyerId: string;
  amount: number;
  currency: 'INR';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  upiVpa?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId: string;
  status: 'successful' | 'failed';
  providerRef: string;
  timestamp: string;
  error?: string;
}

export class PaymentGatewayService {
  /**
   * Generates a unique transaction identifier
   */
  static generateTransactionId(prefix = 'TXN'): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${randomHex}`;
  }

  /**
   * Server-side payment processor simulation
   * In a real deployment with Razorpay/Cashfree/Stripe, this verifies the HMAC-SHA256 signature
   */
  static async verifyPayment(payload: {
    transactionId: string;
    amount: number;
    paymentMethod: string;
    mockFailure?: boolean;
  }): Promise<PaymentVerificationResult> {
    // Artificial latency to mirror real gateway callback
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (payload.mockFailure) {
      return {
        success: false,
        transactionId: payload.transactionId,
        status: 'failed',
        providerRef: `GATEWAY_ERR_${Date.now()}`,
        timestamp: new Date().toISOString(),
        error: 'Bank server declined transaction or insufficient balance.',
      };
    }

    return {
      success: true,
      transactionId: payload.transactionId,
      status: 'successful',
      providerRef: `UPI_REF_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      timestamp: new Date().toISOString(),
    };
  }
}
