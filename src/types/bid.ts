export interface BidStats {
  totalCount: number;
  totalPrice: number;
  totalQuantity: number;
}

export interface BidSet {
  _id: string;
  businessNumber: number;
  email: string;
  now: string;
  price: number;
  quantity: number;
  region: string;
}
