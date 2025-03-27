interface Order {
    name: string,
    amount: number,
    subtotal: number
}

interface ShippingInfo {
    email: string,
    consigneeName: string,
    city: string,
    address: string,
    postal: string,
    contactNo: string,
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
    shippingInfo: ShippingInfo,
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
    orderId?: string
}

export type {
    Order,
    ShippingInfo,
    UserOrder,
    OrderResData
}