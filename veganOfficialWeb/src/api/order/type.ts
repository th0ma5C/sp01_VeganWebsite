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

interface PurchaseOrder {
    orderList: Order[],
    total: number,
    freightFee: number,
    discountAmount: number,
    status: string,
    userID: string,
    _id: string
}
interface UserOrder {
    _id: string,
    purchaseOrder: PurchaseOrder,
    createdAt: string,
    updatedAt: string,
}

interface OrderResData {
    message: string,
    state?: string,
    username?: string,
    token?: string,
    shippingInfo?: ShippingInfo,
    order?: UserOrder[],
}

export type {
    Order,
    ShippingInfo,
    UserOrder,
    OrderResData
}