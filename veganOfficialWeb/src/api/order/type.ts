interface Order {
    name: string,
    amount: number,
    subtotal: number
}

interface ShippingInfo {
    email: string,
    consigneeName: string,
    city: string,
    postal: string,
    deliveryType: string,
    storeBranch: null,
    storeAddr: null,
    paymentType: string,
    [key: string]: string | null
}

interface OrderResData {
    message: string,
    state?: string,
    username?: string,
    token?: string,
    shippingInfo?: ShippingInfo,
    order?: {
        shippingInfo: ShippingInfo,
        purchaseOrder: {
            orderList: Order[]
        },
        total: number,
        freightFee: number,
        discountAmount: number,
        status: string
    }
}

export type {
    Order,
    ShippingInfo,
    OrderResData
}